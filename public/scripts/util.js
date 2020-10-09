const jwtUtil = {
	name: 'jwt',
	get: () => {
		let jwt = localStorage.getItem(jwtUtil.name);
		return jwt ? jwt : '';
	},
	set: (token) => {
		localStorage.setItem(jwtUtil.name, token);
	}
}

const util = {
	post: async (url, data) => {
		return await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${jwtUtil.get()}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	},
	get: async (url) => {
		return await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${jwtUtil.get()}`
			}
		});
	}
}