(function () {
	const navbar = document.getElementById('navbar');
	const toggle = document.getElementById('navbarToggle');
	const navLinks = document.querySelectorAll('.nav-link');
	const sections = document.querySelectorAll('section, header');
	const ANIMATION_DURATION = 300;

	function closeNavbar() {
		if (!navbar.classList.contains('navbar--open')) return;
		navbar.classList.remove('navbar--open');
		navbar.classList.add('navbar--closing');
		setTimeout(() => {
			navbar.classList.remove('navbar--closing');
		}, ANIMATION_DURATION);
	}

	toggle.addEventListener('click', function () {
		if (navbar.classList.contains('navbar--open')) {
			closeNavbar();
		} else {
			navbar.classList.add('navbar--open');
		}
	});

	navLinks.forEach(link => {
		link.addEventListener('click', function () {
			closeNavbar();
		});
	});

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			if (targetId === '#') return;
			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop - 80,
					behavior: 'smooth'
				});
			}
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
		threshold: 0.5
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

	window.addEventListener('scroll', handleNavbarScroll);
	handleNavbarScroll();
})();

document.addEventListener("DOMContentLoaded", function () {
	const el = document.getElementById("heroWelcome");
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
});

window.addEventListener('DOMContentLoaded', () => {
	const hash = window.location.hash;
	if (hash && document.querySelector(hash)) {
		setTimeout(() => {
			const target = document.querySelector(hash);
			if (target) {
				window.scrollTo({
					top: target.offsetTop - 80,
					behavior: 'smooth'
				});
			}
		}, 100);
	}
});