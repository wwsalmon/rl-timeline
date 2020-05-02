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

    function drawTeam(eventList, team = false, newdate = false){
        if (eventList.length == 0) return;
        if (team === false) team = eventList[0].team;
        let currEvents = [];
        let nextEvents = [];
        let nextDate = false;
        let newteam = false;

        let iterations = 0;

        console.log("%c TEAM: " + team,"color: red");
        for (let i in eventList){
            console.log(`considering ${JSON.stringify(eventList[i])}, item ${+i + 1} of ${eventList.length}`)
            if (iterations > 20) throw new Error("stuck in loop")
            if (newteam != false){
                console.log("pushed to next " + JSON.stringify(eventList[i]))
                let event = eventList[i];
                nextEvents.push(event)
                iterations++;
            }
            else if ((eventList[i].oldteam == team || eventList[i].newteam == team) && eventList[i].type == "orgchange"){
                console.log(`orgchange to ${eventList[i].newteam}`)
                let event = eventList[i];
                nextDate = parseDate(event.date);
                currEvents.push(event)
                newteam = eventList[i].newteam;
            }
            else if (eventList[i].team == team){
                console.log("current " + JSON.stringify(eventList[i]))
                currEvents.push(eventList[i])
            }
            else{
                console.log("pushed to next " + JSON.stringify(eventList[i]))
                nextEvents.push(eventList[i])
            }
        }

        let currTeamClass = team.replace(/ /g,"_");

        const group = svg.append("g")
            .attr("class",`group-team group-team-${currTeamClass}`)

        let groupTop  = teamRow * teamHeight

        let groupBounds = group.node().getBBox();

        // currently broken, as it doesn't use groupTop, but this is gonna change completely anyways

        group.selectAll(".event-point")
            .data(currEvents)
            .enter()
            .append("circle")
            .attr("class", d => `event-point event-player-${d.player}`)
            .attr("cx", d => x(parseDate(d.date)))
            .attr("cy", 20)
            .attr("r", 5)
            .attr("fill", "black")

        group.selectAll(".group-back")
            .data([[newdate,groupTop]])
            .enter()
            .append("rect")
            .attr("class","group-back")
            .lower()
            .attr("x",d => (d[0] == false) ? groupBounds.x : x(d[0]))
            .attr("y",d => d[1])
            .attr("width",d => (d[0] == false) ? groupBounds.width : groupBounds.x - x(d[0]) + groupBounds.width)
            .attr("height",teamHeight)

        group.selectAll(".group-text")
            .data([[newdate,groupTop]])
            .enter()
            .append("text")
            .attr("class","group-text")
            .attr("alignment-baseline","hanging")
            .text(team)
            .attr("x",d => (d[0] == false) ? groupBounds.x : x(d[0]))
            .attr("y",d => d[1])

        if (nextDate == false) {teamRow++; drawTeam(nextEvents);} else drawTeam(nextEvents,newteam,nextDate);
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

        svg.selectAll(".event-point")
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