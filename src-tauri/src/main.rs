// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::process::Command;

#[tauri::command]
fn start_stream(magnet: String) -> Result<(), String> {
    Command::new("webtorrent")
        .arg(magnet)
        .arg("--vlc") // or "--mpv" or "--stdout"
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_stream])
        .run(tauri::generate_context!())
        .expect("❌ Error running Tauri app");
}
