document.getElementById("usaction-close").addEventListener("click", function() {
	document.getElementById("usaction-console").style.display = "none";
	document.getElementById("closed-action").style.display = "block";
});

document.getElementById("closed-action").addEventListener("click", function() {
	document.getElementById("usaction-console").style.display = "block";
	document.getElementById("closed-action").style.display = "none";
});

const box1 = document.getElementById('name');
const box2 = document.getElementById('url');
const DURATION = 5000;

function toggleBoxes() {
	const activeBox = box1.style.opacity !== '0' ? box1 : box2;
	const inactiveBox = activeBox === box1 ? box2 : box1;

	activeBox.style.opacity = '0';

	activeBox.addEventListener('transitionend', () => {
		inactiveBox.style.opacity = '1';

		setTimeout(toggleBoxes, DURATION);
	}, {
		once: true
	});
}

setTimeout(toggleBoxes, DURATION);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, speed = 100) {
	element.textContent = '';
	const chars = [...text];
	for (const char of chars) {
		element.textContent += char;
		await sleep(speed);
	}
}

async function deleteText(element, speed = 50) {
	let chars = [...element.textContent];
	while (chars.length > 0) {
		chars.pop();
		element.textContent = chars.join('');
		await sleep(speed);
	}
}

async function showWelcomeLoop(messages) {
	const container = document.getElementById('welcome-text');
	if (!container) {
		console.error('Element with ID "welcome-text" not found.');
		return;
	}

	await typeText(container, 'Welcome 👋', 100);
	await sleep(3000);
	await deleteText(container, 50);

	const keys = Object.keys(messages).filter(k => k !== 'en');

	while (true) {
		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		const text = messages[randomKey] + ' 👋';

		await typeText(container, text, 100);
		await sleep(3000);
		await deleteText(container, 50);
	}
}

window.addEventListener('DOMContentLoaded', async () => {
	try {
		const response = await fetch('/assets/pages/mainpage/lang.json');
		if (!response.ok) throw new Error('Failed to load language data');
		const messages = await response.json();
		showWelcomeLoop(messages);
	} catch (err) {
		console.error(err);
	}
});