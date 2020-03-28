const axios = require('axios');
const cheerio = require('cheerio');
const wtf = require('wtf_wikipedia')

const url = "https://liquipedia.net/rocketleague/index.php?title=NRG_Esports&action=edit"; // for prototyping purposes. Replace with Liquipedia API eventually

axios.get(url).then(res => {
    const html = res.data;
    const $ = cheerio.load(html);
    const markup = $('textarea#wpTextbox1').text();
    const doc = wtf(markup);

    const timeline = doc.section('Timeline').json();

    const tabs = timeline.templates[0];
    const refs = timeline.references;

    const events = [];

    for (key in tabs){
        if (key.substring(0,7) == "content"){
            content = tabs[key];
            content = content.replace(/\s\n+/gm, "");

            descripts = content.split("*");
            descripts.shift();
            
            descripts.forEach(item => {
                events.push({
                    descript: item
                })
            });
        }
    }

    refs.forEach((item, index) => {
        if (index > 0 && item.date == refs[index-1].date){
            refs[index-1]["url2"] = item.url; // NOTE: if there are more than two references for an event, this code will correctly discard unnecessary references and merging later on will work, but instead of preserving all of the reference URLs, it will repeatedly overwrite "url2" and ultimately only the first and last reference URLs will be preserved.
            refs.splice(index,1);
        }
    })

    refs.forEach((item, index) => {
        currEvent = events[index];
        currEvent["url"] = item["url"];
        currEvent["date"] = item["date"];
        if ("url2" in item) currEvent["url2"] = item["url2"];
    })

    console.log(events);
})
.catch(error => console.log(error));

