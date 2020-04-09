# Rocket League (RL) Timeline

"A new way to see Rocket League History" - a concept interface to show Rocket League Esports player and team histories by putting transfers and results in relative chronological order on a timeline. Designed and developed by u/wwsalmon.

## Purpose

The best part of Esports is the storylines. In Rocket League: Kronovi the Mountain, the very first world champion; Paschy90, the team-building legend, always just a hair away from lifting the trophy; Turbopolsa, leading his team to break through the champion's curse and become the three-time. These are the legends of the scene, and it's players like them that get people excited to watch the highest tier of Rocket League competition.

But Esports is hectic. It seems like every day a team disbands, or a player leaves, or suddenly is acquired by a new org and has a totally different name and branding. Major matches and upsets happen all the time and are then talked about for weeks; it's hard to piece everything together unless you've just been there from the very beginning. Resources like Liquipedia and r/RocketLeagueEsports have done a great deal to provide a place to get the latest and most comprehensive information. However, there's still a great deal of piecing-together to be done.

RL Timeline aims to tell the history of Rocket League Esports in a whole new way, with the same level of storytelling of dedicated spotlight videos and articles, but the same level of rigor and thoroughness of a wiki page. RL Timeline lays out all the relevant events - team transfers, competition results - in chronological order relative to each other on a timeline, complete with the first-hand context of Tweets and from-then reactions and commentary.

## Technical Stuff

Previous versions used JQuery to generate a timeline using CSS Grid. Honestly a pretty impressive use of CSS Grid, and you can find this vesrion in the 0-1 folder, but the version I'm working on now uses D3.js and SVG, which should be much more robust, especially for more dynamic functionality. I tried to build a scraper/data processor in JS with a few nice NPM packages, but couldn't find a suitable NLP package, so I've since switched to Python where I can use NLTK and life is good.