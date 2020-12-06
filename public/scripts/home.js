document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.friendContainer').forEach(container => {
		container.onclick = () => {
			container.classList.toggle('selected');
		}
	});

	const dom = {
		halfs: {
			left: document.querySelector('#leftContainer'),
			right: document.querySelector('#rightContainer'),
		},
		urlInput: document.querySelector('#url'),
		linkPreview: document.querySelector('#linkPreview')
	};

	// Link preview
	
	let prevUrl = '';
	// dom.urlInput.oninput = async () => {
	let updateLinkPreview = async () => {
		let inputUrl = dom.urlInput.value;
		if (inputUrl == prevUrl) return;

		console.log('Fetching URL metadata');
		prevUrl = inputUrl;

		const res = await Util.post('/util/linkpreview', {
			inputUrl
		});
		const data = await res.json();

		if (res.ok) {
			dom.linkPreview.setAttribute('href', data.url);

			if (data.img != undefined && data.img.length > 0) {
				dom.linkPreview.querySelector('.linkImg').style.backgroundImage = `url('${data.img}')`;
				dom.linkPreview.querySelector('.linkImg').classList.remove('hide');
			} else dom.linkPreview.querySelector('.linkImg').classList.add('hide');

			if (data.favicon != undefined) {
				dom.linkPreview.querySelector('.linkFavicon').setAttribute('src', data.favicon);
				dom.linkPreview.querySelector('.linkImg').classList.remove('hide');
			} else dom.linkPreview.querySelector('.linkImg').classList.add('hide');

			dom.linkPreview.querySelector('.linkTitle').textContent = data.title;
			dom.linkPreview.querySelector('.linkDescription').textContent = data.description;
			dom.linkPreview.querySelector('.linkUrl span').textContent = data.domain;
		} else {
			console.log('Invalid URL');
		}
	}

	setInterval(updateLinkPreview, 700);

	// Halfs resize effect

	dom.halfs.left.onmouseenter = () => {
		dom.halfs.left.classList.add('expendedContainer');
		dom.halfs.right.classList.remove('expendedContainer');
	}

	dom.halfs.right.onmouseenter = () => {
		dom.halfs.left.classList.remove('expendedContainer');
		dom.halfs.right.classList.add('expendedContainer');
	}
});