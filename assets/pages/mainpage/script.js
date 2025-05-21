const inputDiv = document.querySelector(".input-line");
const input = document.getElementById("commandInput");
inputDiv.style.display = "none";

const userOutputEl = document.getElementById("user-output");
const preloadedTextDiv = document.getElementById("preloaded-text");

// Geschwindigkeitseinstellungen
const INITIAL_SPEED = 10;   // Starttext
const TYPING_SPEED = 20;    // Normale Geschwindigkeit
const ERROR_SPEED = 30;     // Fehlermeldungen

let history = [];
let historyIndex = -1;
let projectInfos = {};
let commands = {};
let preloadedText = "";

function splitTextWithUrls(text) {
    const urlRegex = /(\b(https?|ftp):\/\/[-\w+&@#\/%?=~|!:,.;]*[-\w+&@#\/%=~|]|www\.[^\s]+)/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex, match.index)
            });
        }

        const url = match[0];
        parts.push({
            type: 'link',
            href: url.startsWith("www.") ? `https://${url}` : url,
            display: url
        });

        lastIndex = urlRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({
            type: 'text',
            content: text.substring(lastIndex)
        });
    }

    return parts;
}

function printAnimatedLine(line, container, callback, speed = TYPING_SPEED) {
    speed = Math.max(2, Math.min(100, speed));
    const parts = splitTextWithUrls(line);
    const lineContainer = document.createElement("div");
    container.appendChild(lineContainer);
    
    let currentPart = 0;
    let currentIndex = 0;
    const blink = document.createElement("span");
    blink.className = "blink";
    blink.textContent = "█";
    lineContainer.appendChild(blink);

    function process() {
        if (currentPart >= parts.length) {
            blink.remove();
            if (callback) callback();
            return;
        }

        const part = parts[currentPart];
        
        if (part.type === 'link') {
            const link = document.createElement('a');
            link.href = part.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'output-link';
            link.textContent = part.display;
            lineContainer.insertBefore(link, blink);
            currentPart++;
            requestAnimationFrame(process);
        } else {
            if (currentIndex < part.content.length) {
                const textNode = document.createTextNode(
                    part.content[currentIndex]
                );
                lineContainer.insertBefore(textNode, blink);
                currentIndex++;
                setTimeout(process, speed);
            } else {
                currentPart++;
                currentIndex = 0;
                requestAnimationFrame(process);
            }
        }
        
        container.scrollTop = container.scrollHeight;
    }

    process();
}

function printAnimatedOutput(text, container, isError = false, callback = null, speed = TYPING_SPEED) {
    if (text === 'CLEAR_SCREEN') {
        location.reload();
        return;
    }

    const lines = text.split('\n').filter(l => l.trim());
    let i = 0;

    function next() {
        if (i < lines.length) {
            printAnimatedLine(lines[i], container, () => {
                i++;
                next();
            }, isError ? ERROR_SPEED : speed);
        } else if (callback) {
            callback();
        }
    }
    next();
}

async function loadData() {
    try {
        const response = await fetch('/assets/pages/mainpage/data.json');
        const data = await response.json();
        
        projectInfos = data.projectInfos;
        commands = data.commands;
        preloadedText = data.preloadedText;

        commands["/projects"] = `My projects (use /project [id] for more detail):\n${
            Object.entries(projectInfos)
                .map(([id, p]) => `  ${id}: ${p.title}`)
                .join("\n")
        }`;

        initApplication();
    } catch (error) {
        console.error('Loading error:', error);
        projectInfos = { 1: { title: "Error", desc: "Data load failed", link: "#" } };
        commands = { 
            "/help": "Available commands:\n/help\n/error",
            "/error": "Data loading error" 
        };
        preloadedText = "> System error - basic commands available";
        initApplication();
    }
}

function validateCommand(cmd) {
    if (commands[cmd]) return true;
    if (cmd.startsWith("/project ")) {
        const id = cmd.split(" ")[1];
        return !!projectInfos[id];
    }
    return false;
}

function initApplication() {
    input.addEventListener('input', () => {
        input.classList.remove('valid', 'invalid');
        if (!input.value.trim()) return;
        validateCommand(input.value.trim()) 
            ? input.classList.add('valid')
            : input.classList.add('invalid');
    });

    input.addEventListener("keydown", (e) => {
        if (input.disabled) return;
        
        if (e.key === "Enter") {
            const cmd = input.value.trim();
            if (!cmd) return;

            input.disabled = true;

            history.push(cmd);
            historyIndex = history.length;

            const outputDiv = document.createElement("div");
            outputDiv.className = "output";
            outputDiv.textContent = `> GH C:\\Users\\Marian> ${cmd}`;
            userOutputEl.appendChild(outputDiv);

            const onComplete = () => {
                input.disabled = false;
                input.focus();
            };

            if (cmd.startsWith("/project ")) {
                const id = cmd.split(" ")[1];
                const project = projectInfos[id];
                if (project) {
                    const output = [
                        `» ${project.title}`,
                        project.desc,
                        `Link: ${project.link}`
                    ].join("\n");
                    printAnimatedOutput(output, userOutputEl, false, onComplete);
                } else {
                    printAnimatedOutput(
                        `Project ${id} not found. Use /projects.`,
                        userOutputEl,
                        true,
                        onComplete,
                        ERROR_SPEED
                    );
                }
            } else if (commands[cmd]) {
                printAnimatedOutput(commands[cmd], userOutputEl, false, onComplete);
            } else {
                printAnimatedOutput(
                    `Unknown command: '${cmd}'. Try /help.`,
                    userOutputEl,
                    true,
                    onComplete,
                    ERROR_SPEED
                );
            }

            input.value = "";
            input.classList.remove("valid", "invalid");
        } else if (e.key === "ArrowUp") {
            if (historyIndex > 0) input.value = history[--historyIndex];
        } else if (e.key === "ArrowDown") {
            input.value = historyIndex < history.length - 1 
                ? history[++historyIndex] 
                : "";
        }
    });

    printAnimatedOutput(preloadedText, preloadedTextDiv, false, () => {
        inputDiv.style.display = 'flex';
        input.focus();
    }, INITIAL_SPEED);
}

loadData();