const height = 400; //temp
const dateWidth = 3;
const parseDate = d3.timeParse("%Y-%m-%d");

d3.json("/data/events2.json").then(data => {
    const minDate = d3.min(data, d=>parseDate(d.date));
    const maxDate = d3.max(data, d=>parseDate(d.date));
    const elapsedDays = d3.timeDay.count(minDate,maxDate);

    let width = document.querySelector("body").offsetWidth;

    const svg = d3.select("body").append("svg")
        .attr("height",height)
        .attr("width",width)
        .attr("id","main-container")

    const zoom = d3.zoom()
        .scaleExtent([1,5])
        .translateExtent([[0,-Infinity],[width,Infinity]])
        .on("zoom", zoomed);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => parseDate(d.date)))
        .range([0,width])

    const xAxis = (g, x) => g.call(d3.axisBottom(x)
        .ticks(d3.timeMonth)
        .tickFormat(d3.timeFormat("%B %Y"))
        .tickSize(height))
        .selectAll("text")
        .attr("transform", `translate(0 ${-height})`)
        .attr("text-anchor","start")

    const gx = svg.append("g")
        .call(xAxis, x)

    // main loop

    let firstEvents = data.sort(function(a, b) {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    function drawTeam(eventList, team = false){
        if (eventList.length == 0) return;
        if (team === false) team = eventList[0].team;
        let currEvents = [];
        let nextEvents = [];
        let newteam = "none";

        let iterations = 0;

        console.log("%c TEAM: " + team,"color: red");
        for (let i in eventList){
            console.log(`considering ${JSON.stringify(eventList[i])}, item ${+i + 1} of ${eventList.length}`)
            if (iterations > 20) throw new Error("stuck in loop")
            if (newteam != "none"){
                console.log("pushed to next " + JSON.stringify(eventList[i]))
                let event = eventList[i];
                nextEvents.push(event)
                iterations++;
            }
            else if ((eventList[i].oldteam == team || eventList[i].newteam == team) && eventList[i].type == "orgchange"){
                console.log(`orgchange to ${eventList[i].newteam}`)
                let event = eventList[i];
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

        svg.selectAll(`.event-team-${currTeamClass}`)
            .data(currEvents)
            .enter()
            .append("circle")
            .attr("class", d => `event-point event-player-${d.player}`)
            .attr("cx", d => x(parseDate(d.date)))
            .attr("cy", 20)
            .attr("r", 5)
            .attr("fill", "black")

        if (newteam != "none") drawTeam(nextEvents, newteam); else drawTeam(nextEvents);
    }

    drawTeam(firstEvents);

    // while (nextEvents.length >= 1){
    //     let prevEvents = nextEvents;
    //     if (newteam === false){
    //         currTeam = prevEvents[0].team;
    //     }
    //     let currEvents = [];
    //     nextEvents = [];
    //
    //     console.log("currTeam: " + currTeam);
    //
    //     for (let i in prevEvents){
    //         console.log("considering " + JSON.stringify(prevEvents[i]))
    //         if (prevEvents[i].team == currTeam || prevEvents[i].oldteam == currTeam || prevEvents[i].newteam == currTeam){
    //             if (prevEvents[i].type == "orgchange"){
    //                 continuous = true;
    //                 newteam = prevEvents[i].newteam;
    //                 currEvents.push(prevEvents[i]);
    //                 console.log("orgchange. New team is " + newteam)
    //                 for (let j = i+1; j < prevEvents.length; j++){
    //                     console.log("moved over " + JSON.stringify(prevEvents[i]))
    //                     nextEvents.push(prevEvents[i])
    //                 }
    //                 break;
    //             }
    //             console.log("added to currEvents");
    //             currEvents.push(prevEvents[i]);
    //         } else{
    //             console.log("moved over");
    //             nextEvents.push(prevEvents[i]);
    //         }
    //     }
    //
    //     if (continuous && nextEvents.length >= 1) {
    //         breakcount++;
    //         if (breakcount >2){
    //             throw new Error("many" + JSON.stringify(nextEvents))
    //         }
    //     }
    //     else{
    //         break;
    //     }
    //
    //     let currTeamClass = currTeam.replace(/ /g,"_");
    //
    //     svg.selectAll(`.event-team-${currTeamClass}`)
    //         .data(currEvents)
    //         .enter()
    //         .append("circle")
    //         .attr("class",d => `event-point event-player-${d.player}`)
    //         .attr("cx", d => x(parseDate(d.date)))
    //         .attr("cy",20)
    //         .attr("r",5)
    //         .attr("fill","black")
    // }


    // zooming

    svg.call(zoom)

    function zoomed(){
        const newx = d3.event.transform.rescaleX(x)
        gx.call(xAxis, newx)

        svg.selectAll(".event-point")
            .attr("cx", d => newx(parseDate(d.date)))
    }
});