let gameData = null;

function formatNumber(num) {
	return new Intl.NumberFormat('de-DE').format(num);
}

function getAchievementClass(level) {
	switch (level) {
		case "0":
			return "not-started";
		case "1":
			return "bronze";
		case "2":
			return "silver";
		case "3":
			return "gold";
		default:
			return "not-started";
	}
}

function getProgressClass(level) {
	switch (level) {
		case "1":
			return "bronze";
		case "2":
			return "silver";
		case "3":
			return "gold";
		default:
			return "";
	}
}

function updateStats() {
	if (gameData && gameData.stats && gameData.stats.length > 0) {
		const stats = gameData.stats[0];

		const completedTasksElement = document.getElementById('completed-tasks');
		if (completedTasksElement) {
			completedTasksElement.textContent = `${stats['completed-tasks']}/${stats['total-tasks']}`;
		}

		const farmScoreElement = document.getElementById('farm-score');
		if (farmScoreElement) {
			farmScoreElement.textContent = formatNumber(stats['farm-score']);
		}
	}
}

function createAchievementBadges(achievement, maxAchievement) {
	let badges = '';
	for (let i = 1; i <= parseInt(maxAchievement); i++) {
		let badgeClass = 'locked';
		let badgeText = i;

		if (i <= parseInt(achievement)) {
			if (i === 1) badgeClass = 'bronze';
			else if (i === 2) badgeClass = 'silver';
			else if (i === 3) badgeClass = 'gold';
		}

		badges += `
        <div class="badge ${badgeClass}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
                <path d="M480-160q75 0 127.5-52.5T660-340q0-75-52.5-127.5T480-520q-75 0-127.5 52.5T300-340q0 75 52.5 127.5T480-160ZM363-572q20-11 42.5-17.5T451-598L350-800H250l113 228Zm234 0 114-228H610l-85 170 19 38q14 4 27 8.5t26 11.5ZM256-208q-17-29-26.5-62.5T220-340q0-36 9.5-69.5T256-472q-42 14-69 49.5T160-340q0 47 27 82.5t69 49.5Zm448 0q42-14 69-49.5t27-82.5q0-47-27-82.5T704-472q17 29 26.5 62.5T740-340q0 36-9.5 69.5T704-208ZM480-80q-40 0-76.5-11.5T336-123q-9 2-18 2.5t-19 .5q-91 0-155-64T80-339q0-87 58-149t143-69L120-880h280l80 160 80-160h280L680-559q85 8 142.5 70T880-340q0 92-64 156t-156 64q-9 0-18.5-.5T623-123q-31 20-67 31.5T480-80Zm0-260ZM363-572 250-800l113 228Zm234 0 114-228-114 228ZM406-230l28-91-74-53h91l29-96 29 96h91l-74 53 28 91-74-56-74 56Z"/>
            </svg>
        </div>`;
	}
	return badges;
}

function createProgressBar(progress, maxProgress, achievementLevel) {
	if (progress === "0" && maxProgress === "0") {
		return '';
	}

	const progressPercent = Math.min((parseInt(progress) / parseInt(maxProgress)) * 100, 100);
	const progressClass = getProgressClass(achievementLevel);

	return `
        <div class="achievement-progress">
            <div class="progress-bar">
                <div class="progress-fill ${progressClass}" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-text">${formatNumber(progress)}/${formatNumber(maxProgress)}</div>
        </div>
    `;
}

function loadAchievements() {
	if (!gameData || !gameData.achievements) {
		console.error('Keine Achievement-Daten verfügbar');
		return;
	}

	const container = document.getElementById('achievements-container');
	container.innerHTML = '';

	gameData.achievements.forEach(achievement => {
		const achievementClass = getAchievementClass(achievement.achievement);
		const progressBar = createProgressBar(achievement.progress, achievement.max_progress, achievement.achievement);
		const badges = createAchievementBadges(achievement.achievement, achievement.max_achievement);

		const achievementElement = document.createElement('div');
		achievementElement.className = `achievement ${achievementClass}`;
		achievementElement.innerHTML = `
                    <div class="achievement-header">
                        <div class="achievement-icon">
                            <i class="${achievement.icon}"></i>
                        </div>
                        <div class="achievement-content">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                        </div>
                    </div>
                    ${progressBar}
                    <div class="achievement-badges">
                        ${badges}
                    </div>
                `;

		container.appendChild(achievementElement);
	});
}

async function loadGameDataFromFile(filePath = 'achievements.json') {
	try {
		const response = await fetch(filePath);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Could not load the achievement- file:', error);
		showErrorMessage('Error while loading the achievements. Check if the file is avaible and is in a valid format.');
		return null;
	}
}

function showErrorMessage(message) {
	const container = document.getElementById('achievements-container');
	container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e53e3e;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 10px;">Could not load achievements/data</h3>
                    <p>${message}</p>
                </div>
            `;
}

document.addEventListener('DOMContentLoaded', async function() {
	gameData = await loadGameDataFromFile();

	if (gameData) {
		updateStats();
		loadAchievements();
	}
});

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.detail-card, .achievement');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 * index);
    });
});

document.getElementById("copyText--type-text--content-#L08QQU2JG").addEventListener("click", function () {
	const element = document.getElementById("copyText--type-text--content-#L08QQU2JG");
	const infoText = document.getElementById("copyText--type-text--content-#L08QQU2JG-info-text");
	const infoSVG = document.getElementById("copyText--type-text--content-#L08QQU2JG-svg");
	navigator.clipboard.writeText('#L08QQU2JG')
	.then(() => {
		element.title = `Text copied to clipboard`;
		infoText.innerText = `Text copied to clipboard`;
		infoSVG.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="25.6" viewBox="0 -960 960 960" width="25.6" fill="#fff"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>`;
		setTimeout(() => {
			element.title = `Copy to clipboard`;
			infoText.innerText = `#L08QQU2JG`;
			infoSVG.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="25.6" viewBox="0 -960 960 960" width="25.6" fill="#fff"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Z"/></svg>`;
		}, 3000);
	})
	.catch(err => {
		console.error('Failed to copy text: ', err);
	});
});