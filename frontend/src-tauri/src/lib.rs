use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_log::{Target, TargetKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_user_input::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_audio_recorder::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        // 2. Register the log plugin to forward console.log to the terminal
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(Target::new(TargetKind::Stdout))
                .level(log::LevelFilter::Debug)
                .build(),
        )

        .setup(|app| {
            // 3. Spawn the sidecar and capture its receiver stream (mut rx)
            let sidecar_command = app.shell().sidecar("api").unwrap();
            let (mut rx, _child) = sidecar_command.spawn().expect("Failed to spawn sidecar");

            // 4. Asynchronously forward Python's stdout/stderr to the terminal
            tauri::async_runtime::spawn(async move {
                while let Some(event) = rx.recv().await {
                    match event {
                        tauri_plugin_shell::process::CommandEvent::Stdout(line) => {
                            println!("[Backend Output]: {}", String::from_utf8_lossy(&line));
                        }
                        tauri_plugin_shell::process::CommandEvent::Stderr(line) => {
                            eprintln!("[Backend Error]: {}", String::from_utf8_lossy(&line));
                        }
                        _ => {}
                    }
                }
            });

            let salt_path = app
                .path()
                .app_local_data_dir()
                .expect("could not resolve app local data path")
                .join("salt.txt");
            
            app.handle().plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
            
            Ok(())
        })

        .invoke_handler(tauri::generate_handler![greet])
        
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}