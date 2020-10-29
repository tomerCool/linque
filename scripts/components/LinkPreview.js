const fetch = require('node-fetch');
const cheerio = require('cheerio');
const validator = require('express-validator');

const LinkPreview = {
	getData: async (url) => {
		try {
			const res = await fetch(url);
			const html = await res.text();
			const $ = cheerio.load(html);

			return {
				inputUrl: url,
				url: LinkPreview.getMetatag($, 'url'),
				domain: url.split('/')[2].replace(/^ww(w|\d)\./i, ''),
				title: LinkPreview.getMetatag($, 'title') || $('title').first().text(),
				description: LinkPreview.getMetatag($, 'description'),
				img: LinkPreview.getMetatag($, 'image'),
				favicon: $(`link[rel="icon"]`).attr('href') || $(`link[rel="shortcut icon"]`).attr('href')
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