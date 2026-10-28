//! sovereign-boot — entry point for the Sovereign Engine fail-closed boot sequence.

use sovereign_engine::SovereignEngineOrchestrator;

fn main() {
    if let Err(e) = SovereignEngineOrchestrator::boot() {
        eprintln!("[BOOT] FAIL-CLOSED HALT: {e}");
        std::process::exit(1);
    }
}
