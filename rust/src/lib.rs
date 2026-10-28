//! Sovereign Engine — fail-closed startup orchestration.
//!
//! Boot order (strict):
//!   1. Hardware flag checks against the physical enclosure boundaries
//!      (TCXO crystal enclave, FRAM/WORM SEAL persistence unit, PCM thermal sinks).
//!   2. SQLite quarantine DB initialization (WAL ingress).
//!   3. Pinned real-time telemetry runtime (core affinity + SCHED_FIFO).
//!   4. SealDaemon worker spawning (crypto audit loop online).

pub mod orchestrator;
pub mod seal_daemon;
pub mod zero_copy_seal;

pub use orchestrator::{
    HardwareFlags, HardwareValidator, SovereignEngineOrchestrator, TelemetryRuntimeBuilder,
};
pub use seal_daemon::SealDaemon;
pub use zero_copy_seal::{
    ArchivedSealEventRecord, SealEventRecord, SealPayload, ZeroCopyQuarantinePipeline,
};
