require('babel-register');

const router = require('../routes').default;
const Sitemap = require('../').default;

(
    new Sitemap(router)
        .build('http://coinmarketpedia.com')
        .save('./sitemap.xml')
);
