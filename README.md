<p align="center">
  <img width="128" alt="Voill icon" src="https://github.com/user-attachments/assets/99778d35-6d9e-40b9-9cff-ce33bba86aa5" />
</p>

<h1 align="center">Voill</h1>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/platform-Windows-blue.svg" alt="Platform - Windows" /></a>
  <a href="#"><img src="https://img.shields.io/badge/platform-Linux-orange.svg" alt="Platform - Linux" /></a>
</p>

<p align="center">
  Ditch the keyboard and type with your voice! <br>
  Voill brings instant, perfectly formatted text from your voice wherever you need it. Just hold <strong>Alt+R</strong>, speak, and release!
</p>

---

## Demo

https://github.com/user-attachments/assets/7c3e5f61-9735-4725-ba09-1f24f1a2e7fe

<img width="600" height="482" alt="image" src="https://github.com/user-attachments/assets/30f2c8c6-ab5f-4518-a5cf-ad2c93251e54" />


## How to Use

Since Voill processes everything lighting-fast through Groq's API, you'll need to use your own API key when you use the application for the first time:

1. **Get an API Key:** Head over to the [Groq Console](https://console.groq.com/keys) and generate a free API key.
2. **Configure Voill:** Launch the app, click on the **Settings** icon, and paste your API key into the input field.
3. **Start Typing:** 
   * Click into any input field or text area on your computer.
   * Hold down `Alt + R` and speak your thoughts naturally.
   * Release the keys.
   * Voill will instantly drop beautifully formatted text right where your cursor is!

---

## Installation & Download

Want to use Voill without compiling it yourself? Download the latest pre-compiled package for your platform:

1. Go to the [Voill Releases Page](https://github.com/GamemakerY/voill/releases).
2. Download the installer matching your operating system:
   * **Windows:** `.msi` or `.exe` standalone installer.
   * **Linux:** `.deb` package (Debian/Ubuntu) or portable `.AppImage`.
   * **MacOS** Not available yet
3. Install and launch the application!

---

## Features

* **Works everywhere:** Write anywhere you can type. Currently tested for Linux and Windows. MacOS testers are welcome.
* **Perfect formatting:** Convert your unfiltered thoughts to publishable text, powered by Groq's LLM (Whisper Large V3 Turbo).
* **Fast:** Provides text almost instantly. Takes less than 1.5 sec after you release alt + R in most cases. 

---

## Development & Building from Source

In this version, there is a Python backend (fastAPI) utilising Groq (Llama 3.3 70B, got discontinued, planning a new release with the change) for voice transcription and (Whisper Large V3 Turbo) for text formatting.

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
cd backend

uv run --with pyinstaller pyinstaller --onefile --clean --name api --add-data "prompts:prompts" main.py

TARGET_TRIPLE=$(rustc -Vv | grep host | cut -d ' ' -f 2)

cp dist/api "../frontend/src-tauri/binaries/api-$TARGET_TRIPLE"

cd ../frontend

fuser -k 8000/tcp # optional: clears the backend port if it was hung up

pnpm run tauri dev
```

#### For Windows
Please use PowerShell, not Command Prompt, for these:

```bash
cd backend

uv run --with pyinstaller pyinstaller --onefile --clean --name api --add-data "prompts:prompts" main.py

$TARGET_TRIPLE = (rustc -Vv | Select-String "host:").Line.Split(" ")[1]

copy dist\api.exe "..\frontend\src-tauri\binaries\api-$TARGET_TRIPLE.exe"

cd ..\frontend
pnpm run tauri dev
```

Finally, run the build (Make sure you are still in the frontend folder):

```bash
pnpm run tauri build
```

## Roadmap & Known Issues

### Known Bugs (Alpha)
- [ ] Sometimes lags and misses a letter or two

### Upcoming Features
- [ ] Set tone as needed
- [ ] Minimize to system tray with a small pill-shaped window summoning when needed
- [ ] Full on-device transcription
- [ ] Full on-device formatting by LLM

---

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
