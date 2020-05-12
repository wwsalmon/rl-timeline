5/11/20

**11:42pm**

![](.pastes\2020-05-11-23-42-40.png)

See those dates? January 2017, March 2017. That's right. The tick increment will now change based on zoom level based on a specified allowable ratio:

```
const newx = d3.event.transform.rescaleX(x)
        const extent = newx.domain()[1] - newx.domain()[0]
        const range = newx.range()[1] - newx.range()[0]
        const msInMonth = 2.628e9;
        const pixelPerMonth = range/ (extent / msInMonth);
        const minPixelPerMonth = 84;
        let monthsPerTick = 1;
        while (pixelPerMonth * monthsPerTick < minPixelPerMonth){
            monthsPerTick++;
        }
        gx.call(xAxis, newx, monthsPerTick);
```

**11:19pm**

![](.pastes\2020-05-11-23-19-33.png)

It's a little jank, but...we've got extensions to the present! A reminder that Rocket League history really isn't long at all.

**10:39pm**

![](.pastes\2020-05-11-22-39-15.png)

Look at that! See any changes?

Well, yeah, the color is gone, but that's collateral damage. The rectangles don't cover up the points anymore! This is because I refactored a bunch of my code to generate elements in the SVG directly rather than groups for each team as I had before. The DOM now looks like this:

![](.pastes\2020-05-11-22-40-17.png)

Before, I relied on team groups for selections, and I thought this might be hard to replicate, but turns out it's pretty easy with class names. Lots of my selectors now look like `.player-group.team-${teamEscaped}` and work exactly the same as before.

**9:55pm**

![](.pastes\2020-05-11-21-55-23.png)

That is a beauty.

**9:48pm**

![](.pastes\2020-05-11-21-48-58.png)

Just realized something. Take a close look at that one path in the middle that goes from bottom team to red team. See how it seems to split from the first point? Clearly that's not how time works, it should go from first to second to third. This is happening because the third point is getting rendered before the first two, and links are drawn in order of nodes by DOM appearance. I thought for a moment that this would be terrible to fix, before realizing a simple solution: just sort the nodes array by x coordinate before turning them into links! Will work on that now.

**9:44pm** made links respond to Zoom

**9:24pm**

![](.pastes\2020-05-11-21-24-28.png)

Basic links implementation! Some things to point out:
- as a general problem, there is no recognition of continuation to the present barring explicit termination -- i.e. G2 just stops short in November 2016 because that's the latest event; NRG, too, is still an active team. With regards to link, look at the three players in the red block (iBP I believe): their paths just stop completely rather than continuing.
- Look at the bottom row, second to last mini-row. The first part of it, the two dots connected by a line from November 2015 to April 2016, is Moses. That dot you see in January 2017 is GarretG. It's on the same row. Why? I have no idea. It's literally how I wanted this to work, but I don't know why it does it. Hm.

**8:31pm**

![](.pastes\2020-05-11-20-32-14.png)

lots of progress! Now rendering points by player

**7:35pm** completed a little refactor to pass in orgChange event instead of just date and newTeam; this way, players can be passed through

**7:15pm** a little lull in my life -- time to revisit this project. Fixed a bug and just discovered console.group!

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