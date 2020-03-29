var margin = { top: 32, left: 32, bottom: 32, right: 32 };
var width = 1800 - margin.left - margin.right;
var height = 400 - margin.bottom - margin.top;

var svg = d3.select("body").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("/data/events.json").then(data => {
    
});