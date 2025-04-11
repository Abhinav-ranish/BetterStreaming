#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::process::Command;
use std::thread;
use warp::Filter;

#[tauri::command]
fn start_stream_server(magnet: String) {
    println!("▶️ Launching WebTorrent for magnet: {}", magnet);

    // Spawn WebTorrent to download the magnet to ./tmp
    thread::spawn(move || {
        let _ = Command::new("webtorrent")
            .arg(&magnet)
            .arg("--out")
            .arg("./tmp")
            .arg("--quiet")
            .output()
            .expect("❌ Failed to start WebTorrent");
    });

    // Serve ./tmp/stream.mp4 via warp at http://localhost:4000/stream
    thread::spawn(|| {
        let route = warp::path("stream").and(warp::fs::file("./tmp/stream.mp4"));
        println!("🚀 Serving stream on http://localhost:4000/stream");
        warp::serve(route).run(([127, 0, 0, 1], 4000));
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_stream_server])
        .run(tauri::generate_context!())
        .expect("❌ Tauri app failed to run");
}
