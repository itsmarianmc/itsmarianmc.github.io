document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contactForm');
	const statusEl = document.getElementById('formStatus');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = {
			name: form.name.value,
			email: form.email.value,
			message: form.message.value
		};

		const submitBtn = form.querySelector('button[type="submit"]');
		submitBtn.disabled = true;
		statusEl.textContent = 'Sending...';
		statusEl.style.color = 'gray';

		try {
			const response = await fetch('https://itsmarianmc-github.vercel.app/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `Server error: ${response.status}`);
			}

			statusEl.textContent = 'Message sent successfully!';
			statusEl.style.color = 'green';
			form.reset();
		} catch (error) {
			console.error('Error:', error);
			statusEl.textContent = `Error: ${error.message}`;
			statusEl.style.color = 'red';
		} finally {
			submitBtn.disabled = false;
		}
	});
});