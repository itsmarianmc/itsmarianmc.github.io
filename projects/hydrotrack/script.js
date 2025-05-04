let currentAmount = 0;
let goal = 3000;
let history = [];
let lastDate = localStorage.getItem('lastDate') || new Date().toISOString().slice(0,10);
let firstTimeSettingGoal = localStorage.getItem('firstTimeSettingGoal') !== 'false';
let animatedProgress = 0;

document.getElementById("setFirstGoal").addEventListener("click", firstUpdateGoal);
document.getElementById("addCustomValue").addEventListener("click", addDrink);
document.querySelectorAll('[data-add-value]').forEach(button => {
    button.addEventListener('click', () => {
        const value = parseInt(button.getAttribute('data-add-value')) || 0;
        if (value > 0) addAmount(value);
    });
});

const getColor = (percentage) => `hsl(${120 * (percentage / 100)}, 70%, 45%)`;

function loadData() {
    const today = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem('hydroData')) || {
        current: 0,
        goal: 3000,
        date: today,
        history: []
    };

    if (saved.date !== today) {
        if (saved.current > 0) {
            history = saved.history;
            history.push({
                date: saved.date,
                amount: saved.current,
                goal: saved.goal
            });
        }
        currentAmount = 0;
        saved.date = today;
    } else {
        currentAmount = saved.current;
        history = saved.history || [];
    }

    goal = saved.goal || 3000;

    if (firstTimeSettingGoal) {
        document.getElementById('setup-overlay').style.display = 'block';
        document.getElementById('firstGoalInput').style.display = 'block';
    } else {
        document.querySelector('.setup-background').style.display = 'none';
        setTimeout(() => {
            document.getElementById('setup-overlay').remove();
        }, 2000);
    }

    saveData();
    updateDisplay();
    updateHistory();
}

function saveData() {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('hydroData', JSON.stringify({
        current: currentAmount,
        goal: goal,
        date: today,
        history: history
    }));

    localStorage.setItem('lastDate', lastDate);
}

function updateGoal() {
    const newGoal = parseInt(document.getElementById('goalInput').value) || 3000;
    const element = document.getElementById("event-action-tooltip");
    
    goal = Math.max(newGoal, 500);
    saveData();
    updateDisplay();

    element.innerText = `Updated successfully`;
    element.style.color = '#28a745';
    setTimeout(() => {
        element.innerText = ``;
        element.style = '';
    }, 3000);
}

function firstUpdateGoal(event) {
    event.preventDefault();
    const newGoal = parseInt(document.getElementById('firstGoalInput').value) || 3000;
    const amountInput = document.getElementById('firstGoalInput');
    const value = parseFloat(amountInput.value);
    if (!isNaN(value) && value > 0) {
        console.log(`Added ${value}ml`);
        goal = Math.max(newGoal, 500);
        saveData();
        updateDisplay();
        
        localStorage.setItem('firstTimeSettingGoal', 'false');
        setTimeout(() => {
            location.reload();
        }, 200);
    } else {
        alert('Please enter a positive/valid number.');
        return;
    } 
}

function addDrink() {
    const amount = parseInt(document.getElementById('amount').value) || 0;
    if (amount > 0) addAmount(amount);
}

const addAmount = (amount) => {
    currentAmount += amount;
    saveData();
    updateDisplay();
    animateAdd(amount);
};

const animateAdd = (amount) => {
    const anim = document.createElement('div');
    anim.textContent = `+${amount}ml`;
    anim.style.cssText = `
        position: absolute;
        color: ${getColor((currentAmount / goal) * 100)};
        animation: floatUp 1s ease-out;
        font-weight: bold;
        pointer-events: none;
        left: 50%;
        transform: translateY(-50%);
        z-index: 10000;
    `;
    document.body.appendChild(anim);
    setTimeout(() => anim.remove(), 1000);
};

function updateDisplay() {
    const targetProgress = Math.min((currentAmount / goal) * 100, 100);

    document.getElementById('currentProgress').textContent = currentAmount;
    document.getElementById('currentGoal').textContent = goal;
    document.getElementById('progressText').textContent = `${targetProgress.toFixed(1)}%`;
    animateProgress(animatedProgress, targetProgress);
}

function animateProgress(start, end) {
    const duration = 500;
    const startTime = performance.now();

    function step(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        const circle = document.getElementById('progressCircle');

        if (circle) {
            const color = getColor(current);
            const knob = document.getElementById('progressKnob');

            circle.style.background = `conic-gradient(${color} ${current}%, #e9ecef ${current}% 100%)`;
            if (knob) {
                knob.style.transform = `translate(-50%, -100%) rotate(${(current / 100) * 360}deg) translateY(-100px)`;
            }
        }
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            animatedProgress = end;
        }
    }

    requestAnimationFrame(step);
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    const uniqueHistory = new Map();
    history.forEach(entry => {
        if (!uniqueHistory.has(entry.date)) {
            uniqueHistory.set(entry.date, entry);
        }
    });

    historyList.innerHTML = Array.from(uniqueHistory.values())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(entry => `
            <div class="history-item" data-date="${entry.date}">
                <div>${entry.date}</div>
                <div>${entry.amount}ml / ${entry.goal}ml</div>
            </div>
        `).join('');
}

setInterval(() => {
    const todayStr = new Date().toISOString().slice(0,10);
    if (todayStr !== lastDate) {
        if (currentAmount > 0) {
            history.push({
                date: lastDate,
                amount: currentAmount,
                goal: goal
            });
        }
        currentAmount = 0;
        lastDate = todayStr;
        saveData();
        updateDisplay();
        updateHistory();
    }
}, 60 * 1000);

setInterval(updateHistory, 5000);

document.addEventListener('DOMContentLoaded', loadData);

// Aktuelle URL abrufen
const currentUrl = window.location.href;

// Prüfen, ob die URL mit nur einem "?" oder "/?" endet
if (currentUrl.endsWith("?") || currentUrl.endsWith("/?")) {
  // Entferne das Fragezeichen am Ende
  const cleanedUrl = currentUrl.replace(/\?$/, "");

  // Zur bereinigten URL weiterleiten
  window.location.replace(cleanedUrl);
}
