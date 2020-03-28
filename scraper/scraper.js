const axios = require('axios');
const cheerio = require('cheerio');
const wtf = require('wtf_wikipedia')

const url = "https://liquipedia.net/rocketleague/index.php?title=NRG_Esports&action=edit"; // for prototyping purposes

axios.get(url).then(res => {
    const html = res.data;
    const $ = cheerio.load(html);
    const markup = $('textarea#wpTextbox1').text();

    const events = [];

})

