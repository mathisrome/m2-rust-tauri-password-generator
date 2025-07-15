use rand::seq::IndexedRandom;

#[tauri::command]
fn generate_password(
    length: u16,
    include_numbers: bool,
    include_caps: bool,
    include_symbols: bool
) -> String {
    let mut charset: Vec<char> = ('a'..='z')
        .collect();

    if include_symbols {
        charset.extend("!@#$%^&*()_+-=[]{}|;:',.<>?/`~".chars());
    }

    if include_caps {
        charset.extend('A'..='Z')
    }

    if include_numbers {
        charset.extend('0'..='9');
    }

    let mut rng = rand::rng();
    let password: String = (0..length)
        .map(|_| *charset.choose(&mut rng).unwrap())
        .collect();

    format!("Mot de passe généré : {}", password)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![generate_password])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
