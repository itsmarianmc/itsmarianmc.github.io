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
}

function resumeTimer() {
    isPaused = false;
    pauseBtn.classList.remove('hidden');
    resumeBtn.classList.add('hidden');
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

    setTimeout(function() {
        document.getElementById("overlay-background").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }, 150);
});

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
    
    document.querySelector(".initialision").style.display = "block";
    document.getElementById("setup-screen").classList.add("hidden");
    setTimeout(() => {
        setTimeout(() => {
            document.querySelector(".initialision").style.display = "none";
            document.getElementById("setup-screen").classList.remove("hidden");
        document.getElementById("footer-placeholder").classList.remove("h555");
            document.getElementById("footer-placeholder").classList.add("h200");
        }, 1000);
        document.getElementById("initialision-text").style.display = "block";
    }, 6000);
});