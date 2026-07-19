# Voill

[![Platform - Windows](https://img.shields.io/badge/platform-Windows-blue.svg)](#) 
[![Platform - Linux](https://img.shields.io/badge/platform-Linux-orange.svg)](#)

Ditch the keyboard and type with your voice! 
Voill brings instant, perfectly formatted text from your voice wherever you need it. Just hold Alt+R, speak, and release!

---

## Demo

---

## Features

* **Works everywhere:** Write anywhere you can type. Currently tested for Linux and Windows. MacOS testers are welcome.
* **Perfect formatting:** Convert your unfiltered thoughts to publishable text, powered by Groq's LLM (Whisper Large V3 Turbo).
* **Fast:** Provides text almost instantly. Takes less than 1.5 sec after you release alt + R in most cases. 

---

## Development & Building from Source

In this version, there is a Python backend (fastAPI) utilising Groq (Llama 3.3 70B) for voice trancsription and (Whisper Large V3 Turbo) for text formatting.

The frontend is made in tauri, using shadCN components.

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

#### For Linux
    ```bash
    # 1. Navigate to the backend directory
    cd backend

    # 2. Compile the python backend using uv and pyinstaller
    uv run --with pyinstaller pyinstaller --onefile --clean --name api --add-data "prompts:prompts" main.py

    # 3. Detect your Rust target triple architecture
    TARGET_TRIPLE=$(rustc -Vv | grep host | cut -d ' ' -f 2)

    # 4. Copy the compiled binary as a Tauri sidecar
    cp dist/api "../frontend/src-tauri/binaries/api-$TARGET_TRIPLE"

    # 5. Navigate to the frontend, clear any used ports, and run dev
    cd ../frontend
    fuser -k 8000/tcp # optional: clears the backend port if it was hung up
    pnpm run tauri dev
    ```

#### For Windows
    ```bash
      # 1. Navigate to the backend directory
      cd backend

      # 2. Compile the python backend using uv and pyinstaller
      uv run --with pyinstaller pyinstaller --onefile --clean --name api --add-data "prompts:prompts" main.py

      # 3. Detect your Rust target triple architecture
      $TARGET_TRIPLE = (rustc -Vv | Select-String "host:").Line.Split(" ")[1]

      # 4. Copy the compiled executable as a Windows Tauri sidecar
      copy dist\api.exe "..\frontend\src-tauri\binaries\api-$TARGET_TRIPLE.exe"

      # 5. Navigate to the frontend and launch development environment
      cd ..\frontend
      pnpm run tauri dev
    ```

Finally, run the build:

    ```bash
    pnpm run tauri build
    ```

## Roadmap & Known Issues

### Known Bugs (Alpha)
- [ ] Sometimes lags and misses a letter or two

### Upcoming Features
- [ ] Minimize to system tray with a small pill-shaped window summoning when needed.
- [ ] Full on-device transcription
- [ ] Full on-device formatting by LLM