const inputDiv = document.querySelector(".input-line");
const input = document.getElementById("commandInput");
inputDiv.style.display = "none";

const userOutputEl = document.getElementById("user-output");
const preloadedTextDiv = document.getElementById("preloaded-text");
let history = [];
let historyIndex = -1;

const projectInfos = {
	1: {
		title: "Projekt City",
		desc: "Projekt City is a unique and expansive Minecraft project that operates without funding and is entirely free to play for everyone. Our mission is to develop an easily navigable Minecraft world for everyone, while paying a lot of attention to details and flawless work. Within Projekt City, we are constructing a large map that features a city, an airport, a hotel, and much more, with meticulous attention to detail and precision. We enhance the gameplay through intricate redstone creations and commands.",
		link: "https://www.curseforge.com/minecraft/worlds/projekt-city"
	},
	2: {
		title: "N'Track",
		desc: "A powerful web app to track school grades with weighted averages, export/import support, and analytics.",
		link: "#"
	},
	3: {
		title: "HydroTrack",
		desc: "A progressive web app to track your water intake with push reminders and clean UI. iOS/Web support included.",
		link: "#"
	}
};

const commands = {
	"/help": `
        Available commands:
    	- /help
        - /about
        - /projects
        - /project [1-3]
        - /clear
        `.trim(),
	"/about": `I am itsmarian. I'm a student and I am interested in web development, web design, front-end and back-end connections.`,
	"/projects": Object.entries(projectInfos)
		.map(([id, p]) => `${id}: ${p.title}`)
		.join("\n"),
	"/clear": 'CLEAR_SCREEN'
};

const preloadedText = `
> Hey there, I am itsmarian. I'm a student and I am interested in web development, web design, front-end and back-end connections.
Use the console to navigate around this page. Here are a few helpful commands:
ㅤ
  - /help > shows a list of all available commands on this page
  - /about > shows all information about me and my projects
  - /projects > shows all projects I made/make
  - /clear > clears the console
`.trim();

function printAnimatedLine(line, container, callback, speed = 40) {
	let idx = 0;
	const blink = document.createElement("span");
	blink.textContent = "█";
	blink.className = "blink";
	const textNode = document.createTextNode("");
	container.appendChild(textNode);
	container.appendChild(blink);

	function type() {
		if (idx <= line.length) {
			textNode.textContent = line.slice(0, idx);
			idx++;
			setTimeout(type, speed);
		} else {
			blink.remove();
			if (callback) callback();
		}
		container.scrollTop = container.scrollHeight;
	}
	type();
}

function printAnimatedOutput(text, container, isError = false, callback = null, speed = 40) {
	if (text === 'CLEAR_SCREEN') {
		location.reload();
		return;
	}
	const lines = text.split('\n').filter(l => l.trim());
	let i = 0;

	function next() {
		if (i < lines.length) {
			printAnimatedLine(lines[i], container, () => {
				container.appendChild(document.createElement("br"));
				i++;
				next();
			}, speed);
		} else if (callback) {
			callback();
		}
	}
	next();
}

function printHtmlOutput(htmlString) {
	const wrap = document.createElement("div");
	wrap.className = "output";
	wrap.innerHTML = htmlString;
	userOutputEl.appendChild(wrap);
	userOutputEl.scrollTop = userOutputEl.scrollHeight;
}

function validateCommand(cmd) {
	if (commands[cmd]) return true;
	if (cmd.startsWith("/project ")) {
		const id = cmd.split(" ")[1];
		return !!projectInfos[id];
	}
	return false;
}

input.addEventListener('input', () => {
	const val = input.value.trim();
	input.classList.remove('valid', 'invalid');
	if (!val) return;
	if (validateCommand(val)) input.classList.add('valid');
	else input.classList.add('invalid');
});

input.addEventListener("keydown", function(e) {
	if (e.key === "Enter") {
		const command = input.value.trim();
		if (!command) return;

		const userDiv = document.createElement("div");
		userDiv.textContent = `> GH C:\\Users\\Marian> ${command}`;
		userDiv.className = "output";
		userOutputEl.appendChild(userDiv);

		history.push(command);
		historyIndex = history.length;

		if (command.startsWith("/project ")) {
			const id = command.split(" ")[1];
			const proj = projectInfos[id];
			if (proj) {
				const text = [
					`» ${proj.title}`,
					proj.desc,
					`More info: ${proj.link}`
				].join("\n");
				printAnimatedOutput(text, userOutputEl, false, null, 30);
			} else {
				printAnimatedOutput(
					`Project ${id} not found. Use '/projects' to list available ones.`,
					userOutputEl,
					true
				);
			}
		} else if (commands[command] !== undefined) {
			printAnimatedOutput(commands[command], userOutputEl, false, null, 30);
		} else {
			printAnimatedOutput(
				`'${command}' is an unknown command. Try '/help' for a list of commands.`,
				userOutputEl,
				true
			);
		}

		input.value = "";
		input.classList.remove("valid", "invalid");
		setTimeout(() => {
			userOutputEl.scrollTop = userOutputEl.scrollHeight;
		}, 0);
	} else if (e.key === "ArrowUp") {
		if (historyIndex > 0) {
			historyIndex--;
			input.value = history[historyIndex];
		}
	} else if (e.key === "ArrowDown") {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			input.value = history[historyIndex];
		} else {
			input.value = "";
		}
	}
});

window.addEventListener('load', () => {
	printAnimatedOutput(preloadedText, preloadedTextDiv, false, () => {
		inputDiv.style.display = 'flex';
		input.focus();
	}, 10);
});