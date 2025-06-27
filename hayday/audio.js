const overlay = document.getElementById('audioActivationOverlay');
const audio = document.getElementById('pageAudio');
const playPauseButton = document.getElementById('playPauseButton');

audio.volume = 0.1;

const interactionEvents = [
	'mousedown', 'mouseup', 'mousemove', 'wheel',
	'touchstart', 'touchend', 'touchmove',
	'keydown', 'keyup',
	'scroll'
];

let isAudioPlaying = false;
let eventListenersAttached = false;

const pauseIcon = '<svg height="100%" viewBox="0 0 36 36" width="100%"><path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" fill="#fff"></path></svg>';
const playIcon = '<svg height="100%" viewBox="0 0 36 36" width="100%"><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" fill="#fff"></path></svg>';

audio.addEventListener('play', () => updateButtonState(true));
audio.addEventListener('pause', () => updateButtonState(false));

updateButtonState(!audio.paused);

function updateButtonState(playing) {
	isAudioPlaying = playing;
	playPauseButton.innerHTML = playing ? pauseIcon : playIcon;
}

function attachInteractionListeners() {
	if (eventListenersAttached) return;

	interactionEvents.forEach(event => {
		overlay.addEventListener(event, handleInteraction);
	});

	eventListenersAttached = true;
}

function handleInteraction() {
	startAudio()
		.then(() => {
			overlay.remove();
			playPauseButton.style.display = 'block';
			removeInteractionListeners();
		})
		.catch(error => {
			console.log("Audio konnte nicht gestartet werden:", error.message);
		});
}

function startAudio() {
	return new Promise((resolve, reject) => {
		const playPromise = audio.play();

		if (playPromise !== undefined) {
			playPromise
				.then(() => resolve())
				.catch(error => reject(error));
		} else {
			setTimeout(() => {
				if (!audio.paused) {
					resolve();
				} else {
					reject(new Error("Autoplay blockiert"));
				}
			}, 100);
		}
	});
}

function removeInteractionListeners() {
	interactionEvents.forEach(event => {
		overlay.removeEventListener(event, handleInteraction);
	});
	eventListenersAttached = false;
}

playPauseButton.addEventListener('click', () => {
	if (audio.paused) {
		audio.play().catch(console.error);
	} else {
		audio.pause();
	}
});

attachInteractionListeners();

window.addEventListener('DOMContentLoaded', () => {
	startAudio()
		.then(() => {
			overlay.remove();
			playPauseButton.style.display = 'block';
			removeInteractionListeners();
		})
		.catch(() => {
			console.log("Waiting for user interaction...");
		});
});
