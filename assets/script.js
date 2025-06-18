document.addEventListener("DOMContentLoaded", function() {
	console.log("[BUILD INFO] Release Channel: stable, Build Number: #282, Update date: 06/18/2025");

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

	function getDeviceType() {
		const userAgent = navigator.userAgent.toLowerCase();
		if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)) {
			return "mobile";
		} else {
			return "desktop";
		}
	}

	function getBrowser() {
		const userAgent = navigator.userAgent;
		if (userAgent.indexOf("Firefox") > -1) {
			return "mf_mozilla-firefox";
		} else if (userAgent.indexOf("SamsungBrowser") > -1) {
			return "si_samsung-internet";
		} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
			return "op_opera";
		} else if (userAgent.indexOf("Trident") > -1) {
			return "ie_internet-Explorer";
		} else if (userAgent.indexOf("Edge") > -1) {
			return "me_microsoft-edge";
		} else if (userAgent.indexOf("Chrome") > -1) {
			return "gc_google-chrome";
		} else if (userAgent.indexOf("Safari") > -1) {
			return "as_apple-safari";
		} else {
			return "uk_unknown";
		}
	}

	const deviceType = getDeviceType();
	const browser = getBrowser();

	setTimeout(() => {
		console.log(`get-userdevice=${deviceType}`);
		console.log(`get-userbrowser=${browser}`);
		console.log(`placeholder-stylesheet-count=${styles.split('\n').length}`);
	}, 10);
});