document.addEventListener("DOMContentLoaded", function() {
	const navbar = document.getElementById('navbar');
	const toggle = document.getElementById('navbarToggle');
	const navLinks = document.querySelectorAll('.nav-link');
	const sections = document.querySelectorAll('section, header');
	const ANIMATION_DURATION = 400;

	function closeNavbar() {
		if (!navbar.classList.contains('navbar--open')) return;
			toggle.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"></path></svg>`;
			navbar.classList.remove('navbar--open');
			navbar.classList.add('navbar--closing');
		setTimeout(() => {
			navbar.classList.remove('navbar--closing');
		}, ANIMATION_DURATION);
	}

	function scrollToSection(targetId) {
		if (!targetId || targetId === '#') return;

		const targetElement = document.querySelector(targetId);
		if (targetElement) {
			const navbarHeight = navbar.offsetHeight;
			window.scrollTo({
				top: targetElement.offsetTop - navbarHeight,
				behavior: 'smooth'
			});
		}
	}

	toggle.addEventListener('click', function() {
		if (navbar.classList.contains('navbar--open')) {
			closeNavbar();
		} else {
			navbar.classList.add('navbar--open');
			toggle.innerHTML = `<svg viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
		}
	});

	navLinks.forEach(link => {
		link.addEventListener('click', function() {
			closeNavbar();
		});
	});

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			history.pushState(null, null, targetId);
			scrollToSection(targetId);
		});
	});

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const id = entry.target.id;
				navLinks.forEach(link => {
					link.classList.toggle('active', link.dataset.section === id);
				});
			}
		});
	}, {
		threshold: 0.1,
		rootMargin: '-80px 0px -20% 0px'
	});

	sections.forEach(section => {
		if (section.id) {
			observer.observe(section);
		}
	});

	function handleNavbarScroll() {
		if (window.scrollY > 100) {
			navbar.classList.add('scrolled');
		} else {
			navbar.classList.remove('scrolled');
		}
	}

	window.addEventListener('hashchange', function() {
		scrollToSection(window.location.hash);
	});

	window.addEventListener('scroll', handleNavbarScroll);
	handleNavbarScroll();
});

document.addEventListener("DOMContentLoaded", function() {
	const navbar = document.getElementById('navbar');

	const el = document.getElementById("heroWelcome");
	if (el) {
		const text = el.textContent;
		el.textContent = "";
		let index = 0;

		function typeNext() {
			if (index < text.length) {
				el.textContent += text.charAt(index);
				index++;
				setTimeout(typeNext, 100);
			}
		}
		typeNext();
	}

	function handleInitialHash() {
		const hash = window.location.hash;
		if (hash) {
			setTimeout(() => scrollToSection(hash), 300);
		}
	}

	window.scrollToSection = function(targetId) {
		if (!targetId || targetId === '#') return;

		const targetElement = document.querySelector(targetId);
		if (targetElement) {
			const navbarHeight = navbar.offsetHeight;
			window.scrollTo({
				top: targetElement.offsetTop - navbarHeight,
				behavior: 'smooth'
			});
		}
	};

	handleInitialHash();
});

document.querySelectorAll('.ripple-btn').forEach(el => {
	el.addEventListener('click', function(e) {
		const oldRipple = el.querySelector('.ripple');
		if (oldRipple) oldRipple.remove();

		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const circle = document.createElement('span');
		const diameter = Math.max(el.clientWidth, el.clientHeight);
		const radius = diameter / 2;
		circle.style.width = circle.style.height = diameter + 'px';
		circle.style.left = (x - radius) + 'px';
		circle.style.top = (y - radius) + 'px';
		circle.classList.add('ripple');

		el.appendChild(circle);
		circle.addEventListener('animationend', () => circle.remove());
	});
});