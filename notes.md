5/1/20

**8:31pm**: basic cycling through teams implemented! Next improvement is to figure out orgchange events. Idea for how to go about this:

cycling through team events: if run into orgchange event, set currteam to the new team, push remaining events of currteam back to nextEvents.

**7:38pm**: okay, got better data. task now becomes much more complex + closer to real world.

Here's the thought. Go through everything *kinda* chronologically. So, first, sort all events by date.

Now take the very first event. It'll have a team and players. Take the team and find all successive events with that team listed. If an orgchange is encountered, then we follow the new team. We draw out all of the events, put players on rails and take them off, etc. For the first event of each player, if a previous event exists with them on it, then draw a path from it connecting to the current event. For the last event of each player, look for an event after it with the same name, and draw a path connecting the current event to it. While going through the team, keep an array of what players are currently on the team. After the last event of a team has been reached, go back to the beginning of all data. Start at the next event, wtih the next team and set of players, and repeat.

**~6pm**: connect adjacent nodes with the same player name