const JWTUtil = {
	name: 'jwt',
	get: () => {
		let jwt = localStorage.getItem(JWTUtil.name);
		return jwt ? jwt : '';
	},
	set: (token) => {
		localStorage.setItem(JWTUtil.name, token);
	}
}

const Util = {
	post: async (url, data) => {
		return await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${JWTUtil.get()}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	},
	get: async (url) => {
		return await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${JWTUtil.get()}`
			}
		});
	}
}