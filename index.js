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

    let nextEvents = data.;

    while (nextEvents.length >= 1){
        let prevEvents = nextEvents;
        let currTeam = prevEvents[0].team;
        let currEvents = [];
        nextEvents = [];

        for (let d of prevEvents){
            if (d.team == currTeam || d.oldteam == currTeam || d.newteam == currTeam){
                currEvents.push(d);
            } else{
                nextEvents.push(d);
            }
        }

        let currTeamClass = currTeam.replace(/ /g,"_");

        svg.selectAll(`.event-team-${currTeamClass}`)
            .data(currEvents)
            .enter()
            .append("circle")
            .attr("class",d => `event-point event-player-${d.player}`)
            .attr("cx", d => x(parseDate(d.date)))
            .attr("cy",20)
            .attr("r",5)
            .attr("fill","black")
    }


    // zooming

    svg.call(zoom)

    function zoomed(){
        const newx = d3.event.transform.rescaleX(x)
        gx.call(xAxis, newx)

        svg.selectAll(".event-point")
            .attr("cx", d => newx(parseDate(d.date)))
    }
});