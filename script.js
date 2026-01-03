// ----- VARIABLES GLOBALES -----

let langueActuelle = "fr";
let scenarioActuel = null;

// Ancien système de sons par case (tu peux ne plus l'utiliser, mais on le garde)
const sons = new Map();

// Sons individuels
let desertAudio = null;
let tenteAudio = null;
const texteAudios = {};
let transitionAudio = null;
let introSolaraAudio = null;
let musiqueIntroAudio = null;   // <--- nouvelle variable


// ----- GESTION DES PAGES -----

function jouerSonTransition() {
  if (!transitionAudio) {
    transitionAudio = new Audio("sons/transition_page.mp3");
    transitionAudio.loop = false;
    transitionAudio.volume = 1.0;
  }
  transitionAudio.currentTime = 0;
  transitionAudio.play();
}

function montrerPage(idPage) {
  // Son de transition à chaque changement de page
  jouerSonTransition();

  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));

  const page = document.getElementById(idPage);
  if (page) {
    page.classList.add("active");
  }

  // Si on arrive sur la page du scénario Solara, on affiche les instructions
  if (idPage === "page-scenario") {
    const overlayInstr = document.getElementById("overlay-instructions");
    if (overlayInstr) {
      overlayInstr.classList.add("visible");
    }
  }
}


function allerALangues() {
  montrerPage("page-langues");
}

function retourAccueil() {
  montrerPage("page-accueil");
}

function choisirLangue(code) {
  langueActuelle = code; // pour plus tard
  montrerPage("page-scenarios");
}

function retourScenarios() {
  arreterTousLesSons();
  montrerPage("page-scenarios");
}

function ouvrirScenario(idScenario) {
  scenarioActuel = idScenario;
  const titre = document.getElementById("titre-scenario");

  if (titre) {
    if (idScenario === "scenario1") {
      titre.textContent =
        langueActuelle === "en" ? "Scenario 1" : "Scénario 1";
    } else if (idScenario === "scenario2") {
      titre.textContent =
        langueActuelle === "en" ? "Scenario 2" : "Scénario 2";
    }
  }

  montrerPage("page-scenario");
}

// ----- GESTION DES SONS -----

function arreterTousLesSons() {
  // Ancien système
  sons.forEach((audio, bouton) => {
    audio.pause();
    audio.currentTime = 0;
    bouton.classList.remove("active");
  });

  if (desertAudio) {
    desertAudio.pause();
    desertAudio.currentTime = 0;
  }

  if (tenteAudio) {
    tenteAudio.pause();
    tenteAudio.currentTime = 0;
  }

  if (introSolaraAudio) {
    introSolaraAudio.pause();
    introSolaraAudio.currentTime = 0;
    introSolaraAudio.onended = null;
  }

  if (musiqueIntroAudio) {
    musiqueIntroAudio.pause();
    musiqueIntroAudio.currentTime = 0;
  }

  // Tous les sons de texte
  Object.values(texteAudios).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.onended = null;
  });
}


// Ancien système de cases (tu peux le laisser, il ne fait rien si tu n'as plus .case-son)
function initialiserCasesSon() {
  const boutons = document.querySelectorAll(".case-son");

  boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const cheminSon = bouton.getAttribute("data-son");

      if (!sons.has(bouton)) {
        const audio = new Audio(cheminSon);
        audio.loop = true;
        sons.set(bouton, audio);
      }

      const audio = sons.get(bouton);

      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        bouton.classList.remove("active");
      } else {
        arreterTousLesSons();
        audio.play();
        bouton.classList.add("active");
      }
    });
  });
}

// ----- INITIALISATION -----

window.addEventListener("DOMContentLoaded", () => {
  montrerPage("page-accueil");
  initialiserCasesSon();
});

// ----- SONS SPÉCIFIQUES -----

function jouerSonDesert01() {
  if (!desertAudio) {
    desertAudio = new Audio("sons/desert01.mp3");
    desertAudio.loop = true;
  }

  if (!desertAudio.paused) {
    desertAudio.pause();
    desertAudio.currentTime = 0;
  } else {
    arreterTousLesSons();
    desertAudio.currentTime = 0;
    desertAudio.play();
  }
}

function jouerSonTente01() {
  if (!tenteAudio) {
    tenteAudio = new Audio("sons/tente01.mp3");
    tenteAudio.loop = true;
  }

  if (!tenteAudio.paused) {
    tenteAudio.pause();
    tenteAudio.currentTime = 0;
  } else {
    arreterTousLesSons();
    tenteAudio.currentTime = 0;
    tenteAudio.play();
  }
}

function jouerTexteSequence(id, fichier) {
  // On coupe tout le reste
  arreterTousLesSons();

  // On prépare le son de texte demandé (id = "t1", "t2", etc.)
  if (!texteAudios[id]) {
    const audio = new Audio("sons/" + fichier);
    audio.loop = false; // on ne boucle pas le texte
    texteAudios[id] = audio;
  }

  // On prépare le désert en boucle
  if (!desertAudio) {
    desertAudio = new Audio("sons/desert01.mp3");
    desertAudio.loop = true;
  }

  const audioTexte = texteAudios[id];

  audioTexte.currentTime = 0;
  desertAudio.currentTime = 0;

  // Quand le texte est fini, on lance le désert en boucle
  audioTexte.onended = function () {
    if (desertAudio) {
      desertAudio.currentTime = 0;
      desertAudio.play();
    }
  };

  audioTexte.play();
}

function jouerIntroSolara() {
  // On coupe tout le reste
  arreterTousLesSons();

  if (!introSolaraAudio) {
    introSolaraAudio = new Audio("sons/introduction_solara.mp3");
    introSolaraAudio.loop = false;
  }

  // Quand l'intro est terminée, on affiche le cadre "Prendre"
  introSolaraAudio.onended = function () {
    const overlay = document.getElementById("overlay-prendre");
    if (overlay) {
      overlay.classList.add("visible");
    }
  };

  introSolaraAudio.currentTime = 0;
  introSolaraAudio.play();
}

function fermerInstructions() {
  const overlayInstr = document.getElementById("overlay-instructions");
  if (overlayInstr) {
    overlayInstr.classList.remove("visible");
  }
}

function validerPrendre() {
  // On cache le cadre
  const overlay = document.getElementById("overlay-prendre");
  if (overlay) {
    overlay.classList.remove("visible");
  }

  // On coupe tout le reste
  arreterTousLesSons();

  // On lance la musique d'intro en boucle
  if (!musiqueIntroAudio) {
    musiqueIntroAudio = new Audio("sons/musique_intro.mp3"); // nom du fichier dans /sons
    musiqueIntroAudio.loop = true;
  }

  musiqueIntroAudio.currentTime = 0;
  musiqueIntroAudio.play();
}
