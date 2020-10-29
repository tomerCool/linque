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
	
	dom.urlInput.oninput = async () => {
		const res = await Util.post('/util/linkpreview', {
			inputUrl: dom.urlInput.value
		});
		const data = await res.json();

		if (res.ok) {
			dom.linkPreview.setAttribute('href', data.url);
			dom.linkPreview.querySelector('.linkImg').style.backgroundImage = `url('${data.img}')`;
			dom.linkPreview.querySelector('.linkFavicon').setAttribute('src', data.favicon);
			dom.linkPreview.querySelector('.linkTitle').textContent = data.title;
			dom.linkPreview.querySelector('.linkDescription').textContent = data.description;
			dom.linkPreview.querySelector('.linkUrl span').textContent = data.domain;
		} else {
			console.log('NONONO');
		}
	}

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