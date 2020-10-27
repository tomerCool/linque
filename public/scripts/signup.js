function displayError(element, msg) {
	// Get error container DOM element
	const errContainer = element.parentNode.querySelector('.inputErrorsContainer');
	
	// Create error element
	const errElement = document.createElement('p');
	errElement.classList.add('inputError');
	errElement.innerText = msg;

	// Append error
	errContainer.appendChild(errElement);
}

function removeAllErrors(fields) {
	for (let fieldName in fields) {
		const parent = fields[fieldName].parentNode.querySelector('.inputErrorsContainer');
		while (parent.lastChild) {
			parent.removeChild(parent.lastChild);
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Getting DOM elements
	const dom = {
		signupButton: document.querySelector('#signupButton'),
		fields: {
			username: document.querySelector('#username'),
			displayName: document.querySelector('#displayName'),
			email: document.querySelector('#email'),
			password: document.querySelector('#password')
		}
	};

	// Onclick signup button
	dom.signupButton.onclick = async () => {
		const res = await Util.post('/signup', {
			username: dom.fields.username.value,
			displayName: dom.fields.displayName.value,
			email: dom.fields.email.value,
			password: dom.fields.password.value
		});
		const json = await res.json();

		removeAllErrors(dom.fields);

		if (res.ok) {
			JWTUtil.set(json.token);
			window.location.replace('/');
		} else {
			const errors = json.inputErrors;
			errors.forEach(err => {
				displayError(document.querySelector(`#${err.param}`), err.msg);
			});
		}
	}
});