const height = 400; //temp
const dateWidth = 3;
const parseDate = d3.timeParse("%Y-%m-%d");

const svg = d3.select("body")
    .append("svg")
    .attr("height",height);

d3.json("/data/events.json").then(data => {
    const minDate = d3.min(data, d=>parseDate(d.date));
    const maxDate = d3.max(data, d=>parseDate(d.date));
    const elapsedDays = d3.timeDay.count(minDate,maxDate);
    const width = elapsedDays * dateWidth;

    const x = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0,width])

    svg.append("g")
        .call(d3.axisBottom(x)
            .ticks(d3.timeMonth)
            .tickFormat(d3.timeFormat("%B %Y"))
            .tickSize(height))
        .selectAll("text")
        .attr("transform", `translate(0 ${-height})`)
        .attr("text-anchor","start")

    svg.selectAll(".event-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(parseDate(d.date)))
        .attr("cy",20)
        .attr("r",5)
        .attr("fill","black")

    svg.attr("width",width)
});