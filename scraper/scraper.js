const axios = require('axios');
const cheerio = require('cheerio');
const wtf = require('wtf_wikipedia');
const nlp = require('compromise');

const url = "https://liquipedia.net/rocketleague/index.php?title=NRG_Esports&action=edit"; // for prototyping purposes. Replace with Liquipedia API eventually

axios.get(url).then(res => {
    const html = res.data;
    const $ = cheerio.load(html);
    const markup = $('textarea#wpTextbox1').text();
    const doc = wtf(markup);

    // This code looks at the "Timeline" section of Liquipedia team pages and scrapes the event descriptions, dates, and reference URLs into nice JSON. Two things complicate this process. First, wtf-wikipedia separates references from other content when parsing the section, so they must be re-paired. Second, event descriptions are stored in separate "content" strings by year, with individual events separated by "*" characters and newlines, which are rendered as a list on Liquipedia. My code right now separately cleans references and makes an array out of the bullet point strings, then processes the two arrays into a final "events" array.

    // A better way to do this would be to first separate the timeline into chunks including both the description and reference. This is easy to do with regex/direct string processing, but I'm not sure how to do it with wtf-wikipedia yet, and I want to use wtf-wikipedia because it makes parsing references into JSON super easy. Definitely something to aim for though, processing events fully and pushing them one at a time rather than in multiple separate loops. Would simplify things like multiple URLs drastically.

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

