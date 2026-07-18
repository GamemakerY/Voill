# Voill

[![Platform - Windows](https://img.shields.io/badge/platform-Windows-blue.svg)](#) 
[![Platform - Linux](https://img.shields.io/badge/platform-Linux-orange.svg)](#)

Ditch the keyboard and type with your voice! Voill brings instant, perfectly formatted text from your voice wherever you need it. Just hold Alt+R, speak, and release!

---

## Demo

<!-- Tip: You can drag and drop an MP4 video or a GIF directly into this section on GitHub to upload and display it! -->
<p align="center">
  <img src="./assets/demo.gif" alt="Application Demo" width="100%" max-width="800px" />
</p>

---

## Features

* **Lightweight & Fast:** Powered by Tauri's native webview rendering.
* **Robust Local Backend:** High-performance local API processing using Python FastAPI.
* **Cross-Platform:** Out-of-the-box support for Windows and Linux.

---

## Development & Building from Source

Because this project uses a Python backend alongside a Rust/JS frontend, setting it up requires configuring both environments.

### 1. Prerequisites

Before starting, ensure you have the following installed on your machine:

* **Node.js** (v18+) & **npm** / **pnpm** / **yarn**
* **Rust** (via [rustup](https://rustup.rs/))
* **Python** (v3.10+)
* **System Dependencies:**
  * **Windows:** [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 10/11) and C++ Build Tools.
  * **Linux (Debian/Ubuntu):** Run the following to install required system packages:
    ```bash
    sudo apt update
    sudo apt install -y libsoup-3.0-dev libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
    ```

---

### 2. Local Setup (Development Run)

To run the application locally with hot-reloading:

#### Step A: Spin up the Python Backend
1. Navigate to your backend directory:
   ```bash
   cd src-python # Adjust this to your backend folder name