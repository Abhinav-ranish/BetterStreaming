#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, generate_context};

fn main() {
    Builder::default()
        .run(generate_context!())
        .expect("❌ Failed to run Tauri app");
}