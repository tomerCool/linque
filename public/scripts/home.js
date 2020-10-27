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
		}
	};
	
	dom.halfs.left.onmouseenter = () => {
		dom.halfs.left.classList.add('expendedContainer');
		dom.halfs.right.classList.remove('expendedContainer');
	}

	dom.halfs.right.onmouseenter = () => {
		dom.halfs.left.classList.remove('expendedContainer');
		dom.halfs.right.classList.add('expendedContainer');
	}
});