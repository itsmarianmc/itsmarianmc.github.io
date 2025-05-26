const inputDiv = document.querySelector(".input-line");
const input = document.getElementById("commandInput");
inputDiv.style.display = "none";

const userOutputEl = document.getElementById("user-output");
const preloadedTextDiv = document.getElementById("preloaded-text");

const INITIAL_SPEED = 10;
const TYPING_SPEED = 20;
const ERROR_SPEED = 30;

let history = [];
let historyIndex = -1;

let commandsConfig = {};
let preloadedConfig = {};

function splitTextWithUrls(text) {
	const urlRegex = /(\b(https?|ftp):\/\/[\-\w+&@#\/\%?=~|!:,.;]*[-\w+&@#\/%=~|]|www\.[^\s]+)/gi;
	const parts = [];
	let lastIndex = 0,
		match;
	while ((match = urlRegex.exec(text)) !== null) {
		if (match.index > lastIndex) parts.push({
			type: 'text',
			content: text.slice(lastIndex, match.index)
		});
		const url = match[0];
		parts.push({
			type: 'link',
			href: url.startsWith('www.') ? `https://${url}` : url,
			display: url
		});
		lastIndex = urlRegex.lastIndex;
	}
	if (lastIndex < text.length) parts.push({
		type: 'text',
		content: text.slice(lastIndex)
	});
	return parts;
}

function printAnimatedLine(line, container, callback, speed = TYPING_SPEED) {
	speed = Math.max(2, Math.min(100, speed));
	const parts = splitTextWithUrls(line);
	const lineContainer = document.createElement("div");
	container.appendChild(lineContainer);
	let partIndex = 0,
		charIndex = 0;
	const blink = document.createElement("span");
	blink.className = "blink";
	blink.textContent = "█";
	lineContainer.appendChild(blink);

	function step() {
		if (partIndex >= parts.length) {
			blink.remove();
			if (callback) callback();
			return;
		}
		const part = parts[partIndex];
		if (part.type === 'link') {
			const a = document.createElement("a");
			a.href = part.href;
			a.target = "_blank";
			a.rel = "noopener noreferrer";
			a.className = "output-link";
			a.textContent = part.display;
			lineContainer.insertBefore(a, blink);
			partIndex++;
			requestAnimationFrame(step);
		} else {
			if (charIndex < part.content.length) {
				const txt = document.createTextNode(part.content[charIndex++]);
				lineContainer.insertBefore(txt, blink);
				setTimeout(step, speed);
			} else {
				partIndex++;
				charIndex = 0;
				requestAnimationFrame(step);
			}
		}
		container.scrollTop = container.scrollHeight;
	}
	step();
}

function printAnimatedOutput(text, container, isError = false, callback = null, speed = TYPING_SPEED) {
	if (text === 'CLEAR_SCREEN') {
		document.getElementById("user-output").innerHTML = '<div class="output"><a>Console LOG cleared!</a></div>';
		setTimeout(() => {
			document.getElementById("user-output").innerHTML = '';
			inputDiv.style.display = "flex";
			input.disabled = false;
			input.focus();
		}, 2000);
		return;
	}
	const lines = text.split('\n');
	let i = 0;

	function next() {
		if (i < lines.length) {
			const line = lines[i++];
			if (line.trim() === '') return next();
			printAnimatedLine(line, container, next, isError ? ERROR_SPEED : speed);
		} else if (callback) callback();
	}
	next();
}

function normalizeCommand(cmd) {
	let c = cmd.trim();
	if (!c.startsWith('/')) c = '/' + c;
	return c.toLowerCase();
}

function handleCommand(rawCmd, done) {
	const cmd = normalizeCommand(rawCmd);
	const cfg = commandsConfig[cmd];

	if (!cfg && cmd.startsWith("/project ")) {
		const id = cmd.split(" ")[1];
		const projCmd = commandsConfig["/projects"];
		if (projCmd && projCmd["list-data"] && projCmd["list-data"][id]) {
			const p = projCmd["list-data"][id];
			printAnimatedOutput(
				`» ${p.title}\n${p.desc}\nProject link: ${p.link}`,
				userOutputEl,
				false,
				done
			);
			return;
		}
	}

	if (!cfg) {
		printAnimatedOutput(`Unknown command: '${rawCmd}'. Try /help.`, userOutputEl, true, done);
	}

	switch (cfg["js-action"]) {
		case "CLEAR_SCREEN":
			printAnimatedOutput("CLEAR_SCREEN");
			break;

		case "CreateList":
			printAnimatedOutput(cfg["print-text"] || "", userOutputEl, false, () => {
				const list = cfg["list-data"];
				const ids = Object.keys(list);
				(function loop(i) {
					if (i >= ids.length) return done();
					const item = list[ids[i]];
					printAnimatedOutput(`${ids[i]}. ${item.title}`, userOutputEl, false, () => loop(i + 1));
				})(0);
			});
			break;

		case "CreateLink":
			printAnimatedOutput(cfg["print-text"] || "", userOutputEl, false, () => {
				printAnimatedLine(cfg["link"], userOutputEl, done);
			});
			break;

		default:
			printAnimatedOutput(cfg["print-text"] || "", userOutputEl, false, done);
	}
}
async function loadData() {
	try {
		const resp = await fetch('/assets/pages/mainpage/data.json');
		const data = await resp.json();
		commandsConfig = {};
		for (const key in data.commands) {
			commandsConfig[key.toLowerCase()] = data.commands[key];
		}
		preloadedConfig = data.preloadedText;
	} catch (err) {}
	initApplication();
}

function initApplication() {
	printAnimatedOutput(preloadedConfig.text, preloadedTextDiv, false, () => {
		inputDiv.style.display = "flex";
		input.focus();
	}, INITIAL_SPEED);

	input.addEventListener("keydown", e => {
		if (e.key !== "Enter") return;
		const raw = input.value.trim();
		if (!raw) return;
		input.disabled = true;
		history.push(raw);
		historyIndex = history.length;
		const echo = document.createElement("div");
		echo.className = "output";
		echo.textContent = `> GH C:\\Users\\itsmarian> ${raw}`;
		userOutputEl.appendChild(echo);
		handleCommand(raw, () => {
			input.disabled = false;
			input.focus();
		});
		input.value = "";
	});

	input.addEventListener("keydown", e => {
		if (e.key === "ArrowUp" && historyIndex > 0) input.value = history[--historyIndex];
		if (e.key === "ArrowDown" && historyIndex < history.length - 1) input.value = history[++historyIndex];
	});

	input.addEventListener("input", () => {
		const raw = input.value.trim();
		const cmd = normalizeCommand(raw);
		let isValid = false;
		if (commandsConfig[cmd]) isValid = true;
		else if (cmd.startsWith("/project ")) {
			const id = cmd.split(" ")[1];
			const projCfg = commandsConfig["/projects"];
			if (projCfg && projCfg["list-data"] && projCfg["list-data"][id]) isValid = true;
		}
		input.classList.toggle("valid", isValid);
		input.classList.toggle("invalid", !isValid);
	});
}

loadData();