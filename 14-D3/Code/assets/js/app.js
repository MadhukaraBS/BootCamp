// SVG wrapper dimensions are determined by the current width
// and height of the browser window.
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('..\\data\\Data.csv').then(function(hData) {

    // Step 1: Parse Data/Cast as numbers
  // ==============================
  hData.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    console.log(d.poverty, "  ", d.healthcare);
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
//    .domain(d3.extent(hData, d => d.poverty))
    .domain([d3.min(hData, d => d.poverty) - 1,
             d3.max(hData, d => d.poverty) + 1])
    .range([0, width])
    .nice();

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(hData, d => d.healthcare) - 2,
             d3.max(hData, d => d.healthcare) + 2])
    .nice()
    .range([height, 0]);

  /*
  hData.forEach(function(d) {
    console.log(xLinearScale(d.poverty), "  ", yLinearScale(d.healthcare));
  });
  */

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append('g')
    .call(leftAxis);


  // Step 5: Create Circles
  // ==============================
/*
  var circlesGroup = chartGroup.selectAll('circle')
  .data(hData)
  .enter()
  .append('circle')
  .attr('cx', d => xLinearScale(d.poverty))
  .attr('cy', d => yLinearScale(d.healthcare))
  .attr('r', '15')
  .attr('fill', 'blue')
  .text("AB")
  .attr('opacity', '.7');

  chartGroup.append("text")
	.attr("class", "nodetext")
	.attr("dx", 12)
	.attr("dy", ".35em")
	.text(function(d) { return d.abbr });
*/

  var circlesGroup = chartGroup.selectAll('circle')
  .data(hData);

    /*Create and place the "blocks" containing the circle and the text */  
    var elemEnter = circlesGroup.enter()
	    .append("g")
	    .attr("transform", function(d){
        return "translate("+xLinearScale(d.poverty)+","+yLinearScale(d.healthcare)+")"});

    /*Create the circle for each block */
    elemEnter.append("circle")
	    .attr("r", '16')
	    .attr("stroke", 'lightblue')
      .attr('opacity', '.99')
	    .attr("fill", 'lightblue');
    /*
    elemEnter.append("rect")
	    .attr("width", 10)
      .attr('height', 25);
    */

    /* Create the text for each block */
    elemEnter.append("text")
	    .text(function(d){return d.abbr})
      .attr("dx", '0')
      .attr("dy", '5')
      .attr("font-size", '13')
      .attr("text-anchor", "middle")
      .style('fill', 'white')
      .style("font-weight", "bold");


  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(d) {
      return (`Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

});
