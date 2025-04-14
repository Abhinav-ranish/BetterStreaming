use std::{net::SocketAddr, process::Command};
use warp::Filter;

#[tokio::main]
async fn main() {
    println!("🔧 Starting local streaming server...");

    // Optional: Auto-start a test torrent
    let magnet = "magnet:?xt=urn:btih:991bdd55479dda39a49a50a1eb52a03759db4e18";
    tokio::spawn(async move {
        let _ = Command::new("webtorrent")
            .arg(magnet)
            .arg("--out")
            .arg("./tmp")
            .arg("--quiet")
            .output()
            .expect("❌ Failed to run WebTorrent");
    });

    // Serve the stream from ./tmp/stream.mp4
    let route = warp::path("stream").and(warp::fs::file("./tmp/stream.mp4"));

    let addr: SocketAddr = "127.0.0.1:4000".parse().unwrap();
    println!("🚀 Server running at http://localhost:4000/stream");

    // BLOCK HERE
    warp::serve(route).run(addr).await;
}
