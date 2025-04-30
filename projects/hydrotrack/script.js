let currentAmount = 0;
let goal = 3000;
let history = [];

document.getElementById("setGoal").addEventListener("click", updateGoal);
document.getElementById("addCustomValue").addEventListener("click", addDrink);

const getColor = (percentage) => `hsl(${(120 * (percentage / 100))}, 70%, 45%)`;

function addPreset(amount) {
    addAmount(amount);
}

function updateGoal() {
    const newGoal = parseInt(document.getElementById('goalInput').value) || 3000;
    goal = Math.max(newGoal, 500);
    saveData();
    updateDisplay();
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
        z-index: 1000;`;
    document.body.appendChild(anim);
    setTimeout(() => anim.remove(), 1000);
};

const saveData = () => {
    localStorage.setItem('hydroData', JSON.stringify({
        current: currentAmount,
        goal: goal,
        date: new Date().toISOString().slice(0, 10),
        history: history
    }));
};

const updateDisplay = () => {
    document.getElementById('currentProgress').textContent = currentAmount;
    document.getElementById('currentGoal').textContent = goal;
    const progress = Math.min((currentAmount / goal) * 100, 100);
    document.getElementById('progressText').textContent = `${progress.toFixed(1)}%`;
    
    const circle = document.getElementById('progressCircle');
    if (circle) {
        circle.style.background = `conic-gradient(
            ${getColor(progress)} ${progress}%, 
            #e9ecef ${progress}% 100%
        )`;
    }
};

document.querySelectorAll('[data-add-value]').forEach(button => {
    button.addEventListener('click', () => {
        const value = parseInt(button.getAttribute('data-add-value')) || 0;
        if (value > 0) addAmount(value);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const loadData = () => {
        const today = new Date().toISOString().slice(0, 10);
        const saved = JSON.parse(localStorage.getItem('hydroData')) || {
            current: 0,
            goal: 3000,
            date: today,
            history: []
        };

        if (saved.date !== today) {
            if (saved.current > 0) {
                history.push({
                    date: saved.date,
                    amount: saved.current,
                    goal: saved.goal
                });
            }
            currentAmount = 0;
            saved.date = today;
            saved.current = 0;
            localStorage.setItem('hydroData', JSON.stringify(saved));
        } else {
            currentAmount = saved.current;
        }

        goal = saved.goal || 3000;
        history = saved.history || [];
        document.getElementById('goalInput').value = goal;
        updateDisplay();
        updateHistory();
    };

    const updateHistory = () => {
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = history
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(entry => `
                    <div class="history-item">
                        <div>${entry.date}</div>
                        <div>${entry.amount}ml / ${entry.goal}ml</div>
                    </div>
                `).join('');
        }
    };

    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            loadData();
        }
    }, 60000);

    setInterval(updateHistory, 5000);
    loadData();
});