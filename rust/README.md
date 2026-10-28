# Sovereign Engine — Startup Orchestrator

Fail-closed boot sequence implemented in Rust under [`rust/`](rust/).

## Boot order (strict)

1. **Hardware Flag Checks** (`HardwareValidator`) — gate runs *before* any async runtime workers or network buses:
   - `TCXO_ENCLAVE_READY` — Local Monotonic Crystal Enclave heartbeat
   - `FRAM_STORAGE_DETECTED` — Physical SEAL Persistence Unit (FRAM/WORM) register/header integrity
   - `PCM_THERMAL_STABLE` — Phase-Change Material thermal dump sink staging thresholds
2. **SQLite Quarantine DB** — WAL ingress + `quarantine_queue` schema bootstrap
3. **TelemetryRuntimeBuilder** — Tokio multi-thread runtime, worker threads pinned to cores `[2, 3]`, elevated to `SCHED_FIFO` (priority 50)
4. **SealDaemon spawning** — cryptographic audit loop online on the pinned runtime

## Layout

- `rust/src/orchestrator.rs` — hardware gate, pinned RT runtime builder, boot orchestration
- `rust/src/seal_daemon.rs` — WAL quarantine drain + audit loop + graceful shutdown/checkpoint
- `rust/src/main.rs` — `sovereign-boot` entry point (exits 1 on fail-closed halt)

## Build & run

```bash
cd rust
cargo build --release
cargo test
./target/release/sovereign-boot
```

Note: core pinning and `SCHED_FIFO` elevation require a Linux host exposing the target cores and `CAP_SYS_NICE`/root; degradations are logged as warnings without breaking the fail-closed contract.
