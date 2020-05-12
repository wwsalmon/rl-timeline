const dateWidth = 3;
const parseDate = d3.timeParse("%Y-%m-%d");

d3.json("/data/events2.json").then(data => {
    const minDate = d3.min(data, d=>parseDate(d.date));
    const maxDate = d3.max(data, d=>parseDate(d.date));
    const elapsedDays = d3.timeDay.count(minDate,maxDate);
    const teamHeight = 200;

    let width = document.querySelector("body").offsetWidth;

    const svg = d3.select("body").append("svg")
        .attr("id","main-container")

    const zoom = d3.zoom()
        .scaleExtent([0.5,5])
        .translateExtent([[-200,-Infinity],[width+200,Infinity]])
        .on("zoom", zoomed);

    const x = d3.scaleTime()
        .domain([d3.min(data, d => parseDate(d.date)), new Date()])
        .range([0,width])

    let allPlayers = [];
    let allTeams = [];

    for (let event of data){
        if (event.team !== undefined) allTeams.push(event.team);
        else if (event.newteam !== undefined) allTeams.push(event.newteam); // should never need oldteam as it will have been included elsewhere

        if (event.player !== undefined) allPlayers.push(event.player);
        else if (event.players !== undefined){
            for (let player of event.players) allPlayers.push(player);
        }
    }

    allPlayers = [...new Set(allPlayers)];
    allTeams = [...new Set(allTeams)];

    // main loop

    let firstEvents = data.sort(function(a, b) {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    let teamRow = 0;

    function getLinkData(playerEscaped){

        let nodes = [];

        d3.selectAll(`.player-${playerEscaped} circle`)
            .each(function(){
                nodes.push([this.getAttribute("cx"), this.getAttribute("cy")])
            })

        nodes.sort((a,b) => a[0] - b[0]);

        let links = [];

        for (let i = 0; i < nodes.length - 1; i++){
            links.push({
                "source": nodes[i],
                "target": nodes[i+1]
            });
        }

        return links;
    }

    // function that calls itself over and over until all events passed in are rendered
    function drawTeam(eventList, orgChange = false){
        // base case: no more events, get out of there
        if (eventList.length == 0) return;

        // initialize some variables about the team currently being processed
        let currTeam; // name of current team
        let teamPlayers; // array of player objects containing name and an array of events
        let activePlayers = []; // array of active players
        let newDate = false; // a date where the team block starts that isn't the first event

        // if orgChange is passed in, set above variables based on this; otherwise, set them according to events left in eventList
        if (orgChange === false){
            currTeam = eventList[0].team;
            teamPlayers = eventList[0].players.map(d => {return {"name": d, "events": []};});
        }
        else{
            currTeam = orgChange.newteam;
            teamPlayers = orgChange.players.map(d => {activePlayers.push(d); return {"name": d, "events": []};});
            newDate = parseDate(orgChange.date);
        }
        // prepare to reset this and send it along to next function call
        orgChange = false;

        // arrays to sort events into
        let currEvents = [];
        let nextEvents = [];

        // cycle through all events, sorting them into currEvents and nextEvents as well as processing other variables
        for (let i in eventList){

            // if a previous orgChange event has been processed, kick all remaining events to nextEvents
            if (orgChange !== false){
                let event = eventList[i];
                nextEvents.push(event)
            }

            // if current event is orgChange
            // eventually there will need to be a case for disbanding as well
            else if ((eventList[i].oldteam === currTeam || eventList[i].newteam === currTeam) && eventList[i].type === "orgchange"){
                let currEvent = eventList[i];
                for (let currPlayer of currEvent.players){
                    let currPlayerObj = teamPlayers.find(player => player.name == currPlayer);
                    currPlayerObj.events.push(currEvent);
                }
                orgChange = currEvent;
                currEvents.push(currEvent);
            }

            // if current event belongs to this team and is not orgChange
            else if (eventList[i].team === currTeam){
                let currEvent = eventList[i];

                if (currEvent.type == "newteam"){
                    for (let currPlayer of currEvent.players){
                        activePlayers.push(currPlayer);
                        let currPlayerObj = teamPlayers.find(player => player.name == currPlayer);
                        currPlayerObj.events.push(currEvent);
                    }
                }

                // eventually add a case for disbanding as well

                else{
                    if (currEvent.type == "leave"){
                        let playerInd = activePlayers.indexOf(currEvent.player);
                        activePlayers.splice(playerInd, 1);
                    }
                    let currPlayerObj = teamPlayers.find(player => player.name == currEvent.player); // returns teamPlayers array object with same name as player attached to current event; otherwise returns undefined
                    if (currPlayerObj == undefined){ // if player attached to current event is not in teamPlayers array, add them and current event
                        teamPlayers.push({
                            "name": currEvent.player,
                            "events": [currEvent]
                        })
                        activePlayers.push(currEvent.player)
                    }
                    else{ // otherwise, just push current event
                        currPlayerObj.events.push(currEvent);
                    }
                }

                currEvents.push(eventList[i])

            }

            // if current event does not belong to this team
            else{
                nextEvents.push(eventList[i])
            }
        }

        if (orgChange === false){
            for (let currPlayer of activePlayers){
                let currPlayerObj = teamPlayers.find(player => player.name == currPlayer);
                currPlayerObj.events.push({
                    "date": d3.timeFormat("%Y-%m-%d")(Date.now()),
                    "type": "current",
                    "player": currPlayer,
                    "team": currTeam
                })
            }
        }

        console.log(currEvents);

        let teamEscaped = currTeam.replace(/ /g,"_");
        let groupTop  = teamRow * teamHeight
        const y = d3.scaleBand()
            .domain(d3.map(teamPlayers, d => d.name).keys())
            .range([0, teamHeight]);

        const playerGroups = svg.selectAll(`.player-group.team-${teamEscaped}`)
            .data(teamPlayers)
            .enter()
            .append("g")
            .attr("class", d => {
                let playerClass = `player-${d.name.replace(/ /g,"_")} team-${teamEscaped}`;
                return `player-group ${playerClass}`;
            })

        let pointXCoords = [];

        playerGroups.selectAll(".point-player")
            .data(d => d.events.map(x => [x, d.name]))
            .enter()
            .append("circle")
            .attr("class", `point-player team-${teamEscaped}`)
            .attr("cx", d => {
                let xCoord = x(parseDate(d[0].date));
                pointXCoords.push(xCoord);
                return xCoord;
            })
            .attr("cy", d => groupTop + y(d[1]) + y.bandwidth() / 2)
            .attr("r", 5)
            .attr("fill", "black")

        let minPointX = d3.min(pointXCoords)
        let pointsWidth = d3.max(pointXCoords) - d3.min(pointXCoords);

        svg.selectAll(`.group-back.team-${teamEscaped}`)
            .data([[newDate,groupTop]])
            .enter()
            .append("rect")
            .attr("class",`group-back team-${teamEscaped}`)
            .lower()
            .attr("x",d => (d[0] == false) ? minPointX : x(d[0]))
            .attr("y",d => d[1])
            .attr("width",d => (d[0] == false) ? pointsWidth : minPointX - x(d[0]) + pointsWidth)
            .attr("height",teamHeight)

        svg.selectAll(`.group-text.team-${teamEscaped}`)
            .data([[newDate,groupTop]])
            .enter()
            .append("text")
            .attr("class",`group-text team-${teamEscaped}`)
            .attr("alignment-baseline","hanging")
            .text(currTeam)
            .attr("x",d => (d[0] == false) ? minPointX : x(d[0]))
            .attr("y",d => d[1])

        // only move to the next line if the team does not continue on via org change
        if (orgChange == false) teamRow++;
        drawTeam(nextEvents,orgChange);
    }

    drawTeam(firstEvents);

    const linkGen = d3.linkHorizontal();

    for (let player of allPlayers){
        const playerEscaped = player.replace(/ /g,"_");
        const links = getLinkData(playerEscaped);

        svg.selectAll(`.link-player-${playerEscaped}`)
            .data(links)
            .enter()
            .append("path")
            .attr("class", `link-player-${playerEscaped}`)
            .attr("d", linkGen)
            .attr("fill", "none")
            .attr("stroke", "black");
    }

    // zooming
    const height = teamRow * teamHeight;

    const xAxis = (g, x, monthsPerTick) => g.attr("class","rl-axis")
        .call(d3.axisBottom(x)
        .ticks(d3.timeMonth, monthsPerTick)
        .tickFormat(d3.timeFormat("%B %Y"))
        .tickSize(height))
        .selectAll("text")
        .attr("transform", `translate(0 ${-height})`)
        .attr("text-anchor","start")

    const gx = svg.append("g")
        .call(xAxis, x)

    svg.attr("height",height)
        .attr("width",width)
        .call(zoom)

    function zoomed(){
        // make new x axis
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

        // move around player points
        svg.selectAll(".point-player")
            .attr("cx", d => newx(parseDate(d[0].date)))

        // recalculate and draw links
        for (let player of allPlayers){
            const playerEscaped = player.replace(/ /g,"_");
            const links = getLinkData(playerEscaped);

            const playerLinks = svg.selectAll(`.link-player-${playerEscaped}`)
                .data(links)
                .join("path")
                .attr("d", linkGen)

            playerLinks.exit().remove();
        }

        //redraw team backgrounds, text
        for (let team of allTeams){
            const teamEscaped = team.replace(/ /g,"_");

            let pointXCoords = [];

            svg.selectAll(`.point-player.team-${teamEscaped}`)
                .each(function(){
                    pointXCoords.push(+this.getAttribute("cx"));
                })

            let minPointX = d3.min(pointXCoords)
            let pointsWidth = d3.max(pointXCoords) - d3.min(pointXCoords);

            svg.selectAll(`.group-back.team-${teamEscaped}`)
                .attr("x",d => (d[0] == false) ? minPointX : newx(d[0]))
                .attr("width",d => (d[0] == false) ? pointsWidth : minPointX - newx(d[0]) + pointsWidth)

            svg.selectAll(`.group-text.team-${teamEscaped}`)
                .attr("x",d => (d[0] == false) ? minPointX : newx(d[0]))
        }
    }
});