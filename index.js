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
        .scaleExtent([1,5])
        .translateExtent([[0,-Infinity],[width,Infinity]])
        .on("zoom", zoomed);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => parseDate(d.date)))
        .range([0,width])

    // main loop

    let firstEvents = data.sort(function(a, b) {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    let teamRow = 0;

    function drawTeam(eventList, orgChange = false){
        if (eventList.length == 0) return;
        let currTeam;
        let teamPlayers;
        let newDate = false;
        if (orgChange === false){
            currTeam = eventList[0].team;
            teamPlayers = eventList[0].players.map(d => {return {"name": d, "events": []};});
        }
        else{
            currTeam = orgChange.newteam;
            teamPlayers = orgChange.players.map(d => {return {"name": d, "events": []};});
            newDate = parseDate(orgChange.date);
        }
        let currEvents = [];
        let nextEvents = [];
        orgChange = false; // prepare to reset this and send it along to next function call
        let nextDate = false;
        let newteam = false;

        console.log(teamPlayers);

        let iterations = 0;

        console.log("%c TEAM: " + currTeam,"color: red");
        console.groupCollapsed();
        for (let i in eventList){
            console.log(`considering ${JSON.stringify(eventList[i])}, item ${+i + 1} of ${eventList.length}`)
            if (iterations > 20) throw new Error("stuck in loop")
            if (orgChange !== false){
                console.log("pushed to next " + JSON.stringify(eventList[i]))
                let event = eventList[i];
                nextEvents.push(event)
                iterations++;
            }
            else if ((eventList[i].oldteam === currTeam || eventList[i].newteam === currTeam) && eventList[i].type === "orgchange"){
                console.log(`orgchange to ${eventList[i].newteam}`)
                let currEvent = eventList[i];
                for (let currPlayer of currEvent.players){
                    let currPlayerObj = teamPlayers.find(player => player.name == currPlayer);
                    currPlayerObj.events.push(currEvent);
                }
                orgChange = currEvent;
                currEvents.push(currEvent);
            }
            else if (eventList[i].team === currTeam){
                let currEvent = eventList[i];
                if (currEvent.type == "newteam"){
                    for (let currPlayer of currEvent.players){
                        let currPlayerObj = teamPlayers.find(player => player.name == currPlayer);
                        currPlayerObj.events.push(currEvent);
                    }
                }
                else{
                    let currPlayerObj = teamPlayers.find(player => player.name == currEvent.player); // returns teamPlayers array object with same name as player attached to current event; otherwise returns undefined
                    if (currPlayerObj == undefined){ // if player attached to current event is not in teamPlayers array, add them and current event
                        teamPlayers.push({
                            "name": currEvent.player,
                            "events": [currEvent]
                        })
                    }
                    else{ // otherwise, just push current event
                        currPlayerObj.events.push(currEvent);
                    }
                }

                console.log("current " + JSON.stringify(currEvent))
                currEvents.push(eventList[i])

            }
            else{
                console.log("pushed to next " + JSON.stringify(eventList[i]))
                nextEvents.push(eventList[i])
            }
        }

        console.log(currEvents, teamPlayers);
        console.groupEnd();

        let currTeamClass = currTeam.replace(/ /g,"_");

        const group = svg.append("g")
            .attr("class",`group-team group-team-${currTeamClass}`)

        let groupTop  = teamRow * teamHeight

        const y = d3.scaleBand()
            .domain(d3.map(teamPlayers, d => d.name).keys())
            .range([0, teamHeight]);

        // currently broken, as it doesn't use groupTop, but this is gonna change completely anyways

        const playerGroups = group
            .selectAll(".group-player")
            .data(teamPlayers)
            .enter()
            .append("g")
            .attr("transform", d => "translate(0 " + (groupTop + y(d.name)) + ")")
            .attr("class", d => {
                let playerClass = `group-player-${d.name.replace(/ /g,"_")}`;
                return `group-player ${playerClass}`;
            })

        playerGroups.selectAll(".point-player")
            .data(d => d.events)
            .enter()
            .append("circle")
            .attr("class", "point-player")
            .attr("cx", d => x(parseDate(d.date)))
            .attr("cy", 0)
            .attr("r", 5)
            .attr("fill", "black")

        let groupBounds = group.node().getBBox();

        group.selectAll(".group-back")
            .data([[newDate,groupTop]])
            .enter()
            .append("rect")
            .attr("class","group-back")
            .lower()
            .attr("x",d => (d[0] == false) ? groupBounds.x : x(d[0]))
            .attr("y",d => d[1])
            .attr("width",d => (d[0] == false) ? groupBounds.width : groupBounds.x - x(d[0]) + groupBounds.width)
            .attr("height",teamHeight)

        group.selectAll(".group-text")
            .data([[newDate,groupTop]])
            .enter()
            .append("text")
            .attr("class","group-text")
            .attr("alignment-baseline","hanging")
            .text(currTeam.team)
            .attr("x",d => (d[0] == false) ? groupBounds.x : x(d[0]))
            .attr("y",d => d[1])

        if (orgChange == false) teamRow++;
        drawTeam(nextEvents,orgChange);
    }

    drawTeam(firstEvents);

    // zooming

    const height = teamRow * teamHeight;

    const xAxis = (g, x) => g.call(d3.axisBottom(x)
        .ticks(d3.timeMonth)
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
        const newx = d3.event.transform.rescaleX(x)
        gx.call(xAxis, newx)

        svg.selectAll(".point-player")
            .attr("cx", d => newx(parseDate(d.date)))

        svg.selectAll(".group-team")
            .each(function(){
                let group = d3.select(this);

                // hide everything before getting group bounds

                group.selectAll(".group-back")
                    .style("display","none")

                group.selectAll(".group-text")
                    .style("display","none")

                let groupBounds = this.getBBox();

                // gotten group bounds, now update position of everything

                group.selectAll(".group-back")
                    .style("display","unset")
                    .attr("x",d => (d[0] == false) ? groupBounds.x : newx(d[0]))
                    .attr("width",d => (d[0] == false) ? groupBounds.width : groupBounds.x - newx(d[0]) + groupBounds.width)
                    .attr("height",teamHeight)

                group.selectAll(".group-text")
                    .style("display","unset")
                    .attr("x",d => (d[0] == false) ? groupBounds.x : newx(d[0]))
            })
    }
});