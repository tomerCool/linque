const fetch = require('node-fetch');
const cheerio = require('cheerio');
const validator = require('express-validator');

const LinkPreview = {
	getData: async (url) => {
		try {
			const res = await fetch(url);
			const html = await res.text();
			const $ = cheerio.load(html);

			// fs = require('fs');
			// fs.writeFile('helloworld.txt', html, function (err) {
			// 	if (err) return console.log(err);
			// 	console.log('Hello World > helloworld.txt');
			// });
			// console.log($(`link[rel="icon"]`).attr('href'));

			let fetchFavicon = async () => {
				const baseUrl = url.split('/').splice(0, 3).join('/');

				let favicon = $('link[rel="icon"]').attr('href') || $(`link[rel="shortcut icon"]`).attr('href');
				if (favicon && favicon.substr(0, 4) != 'http') return baseUrl + favicon;

				let res = await fetch(`${baseUrl}/favicon.ico`);
				return res.ok ? res.url : undefined;
			}

			return {
				inputUrl: url,
				url: LinkPreview.getMetatag($, 'url'),
				domain: url.split('/')[2].replace(/^ww(w|\d)\./i, ''),
				title: LinkPreview.getMetatag($, 'title') || $('title').first().text(),
				description: LinkPreview.getMetatag($, 'description'),
				img: LinkPreview.getMetatag($, 'image'),
				favicon: await fetchFavicon()
			}
		} catch {
			return false
		}
	},
	getMetatag: ($, name) => {
		return $(`meta[property="og:${name}"]`).attr('content')
			|| $(`meta[property="twitter:${name}"]`).attr('content')
			|| $(`meta[name="${name}"]`).attr('content');
	},
	validateLink: validator.check('inputUrl').isURL().withMessage('Invalid URL')
}

module.exports = LinkPreview;