const storage = localStorage;
const setupScreen = document.getElementById('setup-screen');
const cardScreen = document.getElementById('card-screen');
const timerScreen = document.getElementById('timer-screen');

const namesInput = document.getElementById('names-input');
const impostorCount = document.getElementById('impostor-count');
const timerMinutes = document.getElementById('timer-minutes');
const categorySelect = document.getElementById('category-select');
const startBtn = document.getElementById('start-btn');

const card = document.getElementById('card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const nextBtn = document.getElementById('next-btn');

const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const revealImpostorBtn = document.getElementById("reveal-impostors");
const newGameBtn = document.getElementById("new-game");

document.addEventListener("DOMContentLoaded", function() {
    function generateStyles() {
        const elements = document.querySelectorAll('*');
        const styles = new Set();

        elements.forEach(element => {
            const classList = element.classList;

            classList.forEach(cls => {
                if (cls.startsWith('w') || cls.startsWith('h')) {
                    const parts = cls.substring(1).split('-');
                    const value = parts[0];
                    const decimal = parts[1] ? '.' + parts[1] : ''; 
                    const finalValue = value + decimal;
                    const property = cls.charAt(0) === 'w' ? 'width' : 'height';

                    if (!isNaN(finalValue)) {
                        styles.add(`.${cls} { ${property}: ${finalValue}px; }`);
                    }
                }
            });
        });

        return Array.from(styles).join('\n');
    }

    const styles = generateStyles();
    const styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    styleTag.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleTag);
    
    // Initialise
    document.querySelector(".initialision").style.display = "block";
    document.getElementById("setup-screen").classList.add("hidden");
    setTimeout(() => {
        setTimeout(() => {
            document.querySelector(".initialision").style.display = "none";
            document.getElementById("setup-screen").classList.remove("hidden");
        document.getElementById("footer-placeholder").classList.remove("h555");
            document.getElementById("footer-placeholder").classList.add("h400");
        }, 750);
        document.getElementById("initialision-text").style.display = "block";
    }, 6000);

    const words = [
            "Verbinde zu Server",
            "Verbinde zu GitHub",
            "Überprüfe auf Updates",
            "Rufe Database ab...",
            "Rufe Database ab...",
            "Initialisiere Spielesystem",
            "Initialisiere Grafikschnittstelle",
            "Lade Texturen",
            "Erzeuge Spielfiguren",
            "Berechne Spielwelt",
            "Initialisiere Audio-System",
            "Lade dynamische Objekte",
            "Authentifiziere Benutzer...",
            "Hole Benutzerprofil...",
            "Starte Serversynchronisation",
            "Überprüfe Serverstatus",
            "Analysiere Datenbankstruktur...",
            "Synchronisiere Cloud-Daten",
            "Leere temporäre Caches",
            "Baue Index neu auf",
            "Validiere lokale Daten",
            "Optimierung läuft...",
            "Konfiguriere Module...",
            "Sammle Debug-Informationen...",
            "Kalibriere Netzwerkeinstellungen",
            "Überprüfe Kompatibilität",
            "Letzte Optimierungen...",
            "Bereite Spielstart vor...",
            "Verifiziere Sicherheitseinstellungen",
            "Starte Benutzeroberfläche",
            "Schließe ab",
            "Starte Spiel",
        ];
    const wordDisplay = document.getElementById('startprogress');
    let index = 0;
    const intervall = setInterval(() => {
        if (index < words.length) {
            wordDisplay.textContent = words[index];
            index++;
        } else {
            clearInterval(intervall);
            wordDisplay.textContent = "Fertig, das Spiel startet gleich.";
        }
    }, 150);

    impostorCount.addEventListener('input', checkImpostorInput);
});

function checkImpostorInput() {
    const value = parseInt(impostorCount.value, 10);
    console.log("Current Impostor Count:", value);
    if (value === 1) {
        document.getElementById("impostor-sp").innerText = `Der Impostor ist: `;
    } else if (value >= 2) {
        document.getElementById("impostor-sp").innerText = `Die Impostoren sind: `;
    }
}

let isPaused = false;

let startY;
const threshold = 80;

let players = [],
    impostors = [],
    word = '',
    current = 0,
    timer;

function loadSettings() {
    if (storage.names) namesInput.value = storage.names;
    if (storage.impostors) impostorCount.value = storage.impostors;
    if (storage.timer) timerMinutes.value = storage.timer;
    if (storage.category) categorySelect.value = storage.category;
}
loadSettings();

startBtn.addEventListener('click', async () => {
    players = namesInput.value.split('\n').map(n => n.trim()).filter(n => n);
    const impCount = parseInt(impostorCount.value, 10);
    const tmin = parseInt(timerMinutes.value, 10);
    const cat = categorySelect.value;
    if (players.length < 2) return alert('Mindestens 2 Spieler!');
    if (impCount >= players.length) return alert('Zu viele Impostoren!');

    storage.names = namesInput.value;
    storage.impostors = impCount;
    storage.timer = tmin;
    storage.category = cat;

    impostors = shuffle([...Array(players.length).keys()]).slice(0, impCount);
    word = await loadWord(cat);

    setupScreen.classList.add('hidden');
    cardScreen.classList.remove('hidden');
    current = 0;
    checkImpostorInput();
    showCard();
});

card.addEventListener('pointerdown', e => startY = e.clientY);
card.addEventListener('pointerup', e => {
    const dy = startY - e.clientY;
    if (dy > threshold) revealCard();
    else if (dy < -threshold) hideCard();
});

nextBtn.addEventListener('click', () => {
    current++;
    if (current < players.length) showCard();
    else startTimerPhase();
});

function showCard() {
    card.classList.remove('revealed');
    cardBack.textContent = '';
    cardFront.innerHTML = `<div style="top: 0; position: relative;"><a>${players[current]}</a></div><div style="height: calc(100% - 52.5px - 52.5px - 52.5px)"></div><div style="bottom: 0;position: relative;"><a>↑</a><br><a>Karte aufdecken</a></div>`;
    nextBtn.disabled = true;
}

function revealCard() {
    const isImp = impostors.includes(current);
    cardBack.innerHTML = isImp
                         ? '<div style="top: 0; position: relative;"><a style="color: #ff0000">Impostor</a></div><div style="height: calc(100% - 52.5px - 52.5px - 52.5px)"></div><div style="bottom: 0;position: relative;"><a>↓</a><br><a>Karte umdrehen</a></div>'
                         : `<div style="top: 0; position: relative;"><a>${word}</a></div><div style="height: calc(100% - 52.5px - 52.5px - 52.5px)"></div><div style="bottom: 0;position: relative;"><a>↓</a><br><a>Karte umdrehen</a></div>`;
    card.classList.add('revealed');
    nextBtn.disabled = false;
}

function hideCard() {
    card.classList.remove('revealed');
    nextBtn.disabled = false;
}

function startTimerPhase() {
    cardScreen.classList.add('hidden');
    timerScreen.classList.remove('hidden');
    startTimer(parseInt(timerMinutes.value, 10));
}

function startTimer(mins) {
    let sec = mins * 60;
    const display = document.getElementById('timer-display');
    const finish = document.getElementById('finished-text');
    remainingTime = sec;
    update();
    timer = setInterval(() => {
        if (isPaused) return;
        remainingTime--;
        if (remainingTime < 0) {
            clearInterval(timer);
            display.textContent = '00:00';
            finish.classList.remove('hidden');
            revealImpostors();
        } else update();        
    }, 1000);

    function update() {
        display.textContent = `${String(Math.floor(remainingTime / 60)).padStart(2, '0')}:${String(remainingTime % 60).padStart(2, '0')}`;
    }
}

function pauseTimer() {
    isPaused = true;
    pauseBtn.classList.add('hidden');
    resumeBtn.classList.remove('hidden');
    revealImpostorBtn.classList.remove('hidden');
}

function resumeTimer() {
    isPaused = false;
    pauseBtn.classList.remove('hidden');
    resumeBtn.classList.add('hidden');
    revealImpostorBtn.classList.add('hidden');
}

revealImpostorBtn.addEventListener("click", function() {
    revealImpostors()
});

function revealImpostors() {
    const impostorWordReveal = document.getElementById('impostor-word-reveal');
    const impostorList = document.getElementById('impostor-list');
    const finalWord = document.getElementById('final-word');
    const display = document.getElementById('timer-display');

    impostorList.innerHTML = '';

    display.classList.add('hidden');
    pauseBtn.classList.add('hidden');
    resumeBtn.classList.add('hidden');
    revealImpostorBtn.classList.add('hidden');
    newGameBtn.classList.remove('hidden');

    impostors.forEach(index => {
        const li = document.createElement('a');
        const value = parseInt(impostorCount.value, 10);
        console.log("Current Impostor Count:", value);
        if (value === 1) {
            li.textContent = players[index];
            impostorList.appendChild(li);
        } else if (value >= 2) {
            li.textContent = players[index] + "; ";
            impostorList.appendChild(li);
        }
    });

    finalWord.textContent = word;

    impostorWordReveal.classList.remove('hidden');
}

pauseBtn.addEventListener('click', pauseTimer);
resumeBtn.addEventListener('click', resumeTimer);

async function loadWord(cat) {
    const options = Array.from(categorySelect.options).map(o => o.value).filter(v => v !== 'all');
    const c = cat === 'all' ? options[Math.floor(Math.random() * options.length)] : cat;
    return randomFrom(await fetchWords(c));
}

async function fetchWords(c) {
    const res = await fetch(`words/${c}.json`);
    if (!res.ok) throw new Error('Wörter nicht gefunden');
    return res.json();
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Information
document.querySelector(".information").addEventListener("click", function(){
    document.documentElement.style.overflowY = "hidden";
    document.documentElement.style.overflowX = "hidden";
    document.getElementById("overlay-background").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    
    setTimeout(function() {
        document.getElementById("overlay").style.top = "calc(50% + 10px)";
        document.getElementById("overlay").style.height = "calc(100% - 10px)";
        document.getElementById("overlay").style.transform = "translate(-50%, -50%)";
    }, 10);
});

document.getElementById("done-btn").addEventListener("click", function(){
    document.getElementById("overlay").style.top = "100%";
    document.getElementById("overlay").style.height = "100%";
    document.getElementById("overlay").style.transform = "translate(-50%, 0%)";
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";

    setTimeout(function() {
        document.getElementById("overlay-background").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }, 150);
});

document.getElementById("startnewgame").addEventListener("click", function() {
    location.reload();
});