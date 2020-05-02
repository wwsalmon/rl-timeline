5/1/20

**1:54** replaced group transforms with directly setting y position on text and rectangles (not points yet cuz that's getting completely re-written anyways). This is in preparation for drawing links

**1:40** recorded a quick video dev diary: https://youtu.be/y4WJf0ZPq00. Found a thing to implement in the future: respond to window size changes. Shouldn't be too hard, similar implementation to zoom.

**1:15** okay, got rectangle scaling to work. Some nice `.each` work; a neat trick was setting `display: none` temporarily to calculate new group width before re-processing. Before I realized I could do this, I was playing around with width 0 and font size 0 and getting the left bound by points...not fun. But this makes it v nice.

The next step is to figure out how to draw player paths in, I guess. This will be somewhat more complicated

**12:40** got team rectangles/positioning to work. Styling is terrible, obviously, but that's okay for now. Eventually I'll have to deal with making z-index work, as rectangles are covering previous event points; this can be fixed by reversing the order that the groups appear in the SVG, which sould be doable by steps outlined in this StackOverflow post: https://stackoverflow.com/questions/17786618/how-to-use-z-index-in-svg-elements

The rectangles also don't currently scale. This is the next thing to implement.

**11:39pm** finally got orgchange working lol, moved from loop to function. Leaving loop in as comment for now

**8:31pm**: basic cycling through teams implemented! Next improvement is to figure out orgchange events. Idea for how to go about this:

cycling through team events: if run into orgchange event, set currteam to the new team, push remaining events of currteam back to nextEvents.

**7:38pm**: okay, got better data. task now becomes much more complex + closer to real world.

Here's the thought. Go through everything *kinda* chronologically. So, first, sort all events by date.

Now take the very first event. It'll have a team and players. Take the team and find all successive events with that team listed. If an orgchange is encountered, then we follow the new team. We draw out all of the events, put players on rails and take them off, etc. For the first event of each player, if a previous event exists with them on it, then draw a path from it connecting to the current event. For the last event of each player, look for an event after it with the same name, and draw a path connecting the current event to it. While going through the team, keep an array of what players are currently on the team. After the last event of a team has been reached, go back to the beginning of all data. Start at the next event, wtih the next team and set of players, and repeat.

**~6pm**: connect adjacent nodes with the same player name