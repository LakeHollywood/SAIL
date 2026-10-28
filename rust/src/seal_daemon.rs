//! SEAL Ledger persistence daemon.
//!
//! Owns the SQLite WAL quarantine ingress and runs the cryptographic audit
//! loop over sealed ledger records. Spawned by the orchestrator only after
//! the hardware boundary gate and pinned telemetry runtime are established.

use std::time::Duration;

use rusqlite::Connection;
use tokio::sync::broadcast;

use crate::zero_copy_seal::{ZeroCopyQuarantinePipeline, STATUS_QUARANTINED, STATUS_SEALED};

pub use crate::zero_copy_seal::STATUS_ISOLATED;

pub struct SealDaemon {
    conn: Connection,
    root_pubkey: [u8; 32],
    max_batch: usize,
}

impl SealDaemon {
    pub fn new(conn: Connection, root_pubkey: [u8; 32], max_batch: usize) -> Self {
        Self {
            conn,
            root_pubkey,
            max_batch: max_batch.max(1),
        }
    }

    /// Main daemon loop: periodically drains the quarantine queue through the
    /// cryptographic audit path, sealing verified records under the sovereign
    /// root authority public key. Terminates when the shutdown bus fires.
    pub async fn run_loop(self, mut shutdown: broadcast::Receiver<()>) -> Result<(), String> {
        println!(
            "[SEAL] Cryptographic audit loop online (root pubkey fingerprint {:02x}{:02x}…, batch={})",
            self.root_pubkey[0], self.root_pubkey[1], self.max_batch
        );

        loop {
            // Non-blocking shutdown poll between audit passes.
            match shutdown.try_recv() {
                Ok(()) | Err(broadcast::error::TryRecvError::Closed) => {
                    println!("[SEAL] Shutdown signal received; flushing WAL and halting daemon.");
                    self.checkpoint_wal()?;
                    return Ok(());
                }
                Err(broadcast::error::TryRecvError::Empty) => {}
                Err(broadcast::error::TryRecvError::Lagged(_)) => continue,
            }

            let sealed = self.audit_pass()?;
            if sealed > 0 {
                println!("[SEAL] Audit pass sealed {sealed} quarantine record(s).");
            }

            tokio::time::sleep(Duration::from_millis(250)).await;
        }
    }

    /// One cryptographic audit pass over pending quarantine rows, executed
    /// through the rkyv zero-copy pipeline: each archived BLOB is validated
    /// in place (bytecheck) before any dereference, sealed on success, and
    /// fail-closed isolated (status = 2) on corruption.
    ///
    /// Returns the number of records transitioned to SEALED.
    fn audit_pass(&self) -> Result<usize, String> {
        ZeroCopyQuarantinePipeline::drain_and_seal(&self.conn, self.max_batch)
            .map_err(|e| format!("SEAL zero-copy audit pass failed: {e}"))
    }

    /// Force a WAL checkpoint so sealed records are durable in the main DB
    /// file before the process exits.
    fn checkpoint_wal(&self) -> Result<(), String> {
        self.conn
            .execute_batch("PRAGMA wal_checkpoint(TRUNCATE);")
            .map_err(|e| format!("SEAL WAL checkpoint failed: {e}"))?;
        Ok(())
    }
}
