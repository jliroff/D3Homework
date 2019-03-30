var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(row) {
      row.poverty = +row.poverty;
      row.healthcare = +row.healthcare; // alternatively parseInt(healthcareLow)
    });

    // Step 2: Create scale functions
    // ==============================
    var xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.poverty)])
      .range([0, width])

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)])
      .range([height, 0])

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xScale); // this is where you format axis ticks
    var yAxis = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .call(yAxis);

    chartGroup.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    // Step 5: Create Circles
    // ==============================
    var circleGroup = chartGroup.selectAll("circle")
      .data(data) // bind Data
      .enter() // enter
      .append("circle") // append
      .attr("fill", "blue") // change fill
      .attr("opacity", "0.5")// change opacity (transparency)
      .attr("cx", d => xScale(d.poverty)) // center x
      .attr("cy", d => yScale(d.healthcare)) // center y
      .attr("r", "16"); // radius

	chartGroup.selectAll("text")
       .data(data)
       .enter()
       .append("text")
       .attr("x", d => xScale(d.poverty -.38 ))
       .attr("y", d => (yScale(d.healthcare -.38)))
       // .classed("stateText", true)
       .text(d => d.abbr)
    //    .on("mouseover", function(d) {
    //     toolTip.show(d);
    // })
    //    .on("mouseout", function(d,i) {
    //      toolTip.hide(d);
    // });


    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([-10, 30])
      .html(function(d) {
        return (`${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>Poverty: ${d.poverty}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circleGroup.on("mouseover", function(d) {
      toolTip.show(d, this); // THIS IS NEW
      })
      .on("mouseout", function(d) {
        toolTip.hide(d); // THIS IS NEW
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });
