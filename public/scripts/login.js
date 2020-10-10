document.addEventListener('DOMContentLoaded', () => {
	// Getting DOM elements
	const dom = {
		loginButton: document.querySelector('#emailLoginButton'),
		emailLoginContainer: document.querySelector('#emailLoginContainer'),
		fields: {
			username: document.querySelector('#username'),
			password: document.querySelector('#password')
		}
	};

	let isOpen = false;

	dom.loginButton.onclick = async () => {
		if (!isOpen) {
			dom.loginButton.classList.add('emailContainerOpen');
			dom.emailLoginContainer.classList.add('emailContainerOpen');
			isOpen = true;
		} else {
			dom.loginButton.innerHTML = '<div class="loadingDots">·</div><div class="loadingDots">·</div><div class="loadingDots">·</div>';

			const res = await Util.post('/login', {
				username: dom.fields.username.value,
				password: dom.fields.password.value
			});
			const json = await res.json();

			setTimeout(() => {
				dom.loginButton.innerHTML = 'Login with Email';
			}, 200);

			if (res.ok) {
				JWTUtil.set(json.token);
				window.location.replace('/');
			} else {
				dom.loginButton.classList.remove('shakeX');
				dom.emailLoginContainer.classList.remove('shakeX');
				
				setTimeout(() => {
					dom.loginButton.classList.add('shakeX');
					dom.emailLoginContainer.classList.add('shakeX');
				}, 100);
			}
		}
	}
});