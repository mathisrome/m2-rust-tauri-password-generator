const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});

// Sélection des éléments du DOM
const passwordForm = document.getElementById("password-form");
const passwordOutput = document.getElementById("password-output");
const copyButton = document.getElementById("copy-btn");

// Écouteur d'événement pour la soumission du formulaire
passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Récupération des valeurs du formulaire
  const length = parseInt(document.getElementById("password-length").value);
  const includeCaps = document.getElementById("include-uppercase").checked;
  const includeNumbers = document.getElementById("include-numbers").checked;
  const includeSymbols = document.getElementById("include-symbols").checked;

  try {
    // Appel de la fonction Rust via Tauri
    const generatedPassword = await invoke("generate_password", {
      length,
      includeNumbers,
      includeCaps,
      includeSymbols,
    });

    // Affichage du mot de passe généré
    passwordOutput.value = generatedPassword;
  } catch (error) {
    console.error("Erreur lors de la génération du mot de passe:", error);
    passwordOutput.value = "Une erreur est survenue";
  }
});

// Fonction de copie du mot de passe
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(passwordOutput.value);
    copyButton.textContent = "Copié !";
    setTimeout(() => {
      copyButton.textContent = "Copier";
    }, 2000);
  } catch (error) {
    console.error("Erreur lors de la copie:", error);
  }
});

