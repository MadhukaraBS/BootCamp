function draw_candlestick_plot(width, height, svg) {
/* --------------------------------- */
/* Candle stick plot                 */
/* --------------------------------- */

let x = techan.scale.financetime()
			.range([0, width]);

let y = d3.scaleLinear()
			.range([(height/3) -30, 0]);

let candlestick = techan.plot.candlestick()
			.xScale(x)
			.yScale(y);
let ar = candlestick.accessor();

let xAxis = d3.axisBottom()
			.scale(x);

let yAxis = d3.axisLeft()
			.scale(y);

svg.append("g")
			.attr("class", "candlestick");

svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + ((height/3) - 30) + ")");

svg.append("g")
			.attr("class", "y axis")
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", 0)
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Price ($)");

let parseDate = d3.timeParse("%m/%d/%Y");

d3.json('/line').then(function(data) {
	let csdata = data.map(function(d) {
			return {
					date: parseDate(d.Date),
					open: +d.Open,
					high: +d.High,
					low: +d.Low,
					close: +d.Close,
					volume: +d.Volume
			};
	}).sort(function(a, b) { return d3.ascending(ar.d(a), ar.d(b)); });
	x.domain(csdata.map(candlestick.accessor().d));
	y.domain(techan.scale.plot.ohlc(csdata, candlestick.accessor()).domain());

	svg.selectAll("g.candlestick").datum(csdata).call(candlestick);
	svg.selectAll("g.x.axis").call(xAxis);
	svg.selectAll("g.y.axis").call(yAxis);
});
}

function draw_volume_plot(width, height, svg) {
/* --------------------------------- */
/* Volume plot                       */
/* --------------------------------- */

let x = techan.scale.financetime()
			.range([0, width]);

let y = d3.scaleLinear()
			.range([(height * 2) / 3 - 30, (height * 1 ) /3]);

let volume = techan.plot.volume()
			.accessor(techan.accessor.ohlc())   // For volume bar highlighting
			.xScale(x)
			.yScale(y);

let xAxis = d3.axisBottom(x);

let yAxis = d3.axisLeft(y)
			.tickFormat(d3.format(",.3s"));

svg.append("g")
			.attr("class", "volume");

svg.append("g")
			.attr("class", "x volaxis")
			.attr("transform", "translate(0," + ((height * 2) / 3 - 30) + ")");

svg.append("g")
			.attr("class", "y volaxis")
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -1 * ((height * 1) / 3))
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Volume");

let parseDate = d3.timeParse("%m/%d/%Y");

d3.json('/line').then(function(data) {
	let ar = volume.accessor();

	let voldata = data.map(function(d) {
			return {
					date: parseDate(d.Date),
					volume: +d.Volume,
					open: +d.Open,
					high: +d.High,
					low: +d.Low,
					close: +d.Close,
			};
	}).sort(function(a, b) { return d3.ascending(ar.d(a), ar.d(b)); });

	x.domain(voldata.map(volume.accessor().d));
	y.domain(techan.scale.plot.volume(voldata, volume.accessor().v).domain());

	svg.selectAll("g.volume").datum(voldata).call(volume);
	svg.selectAll("g.x.volaxis").call(xAxis);
	svg.selectAll("g.y.volaxis").call(yAxis);
});
}

function draw_stochastic_plot(width, height, svg) {
/* --------------------------------- */
/* Stochastic plot                   */
/* --------------------------------- */

let x = techan.scale.financetime()
			.range([0, width]);

let y = d3.scaleLinear()
			.range([height - 30, (height * 2 ) / 3]);

let stochastic = techan.plot.stochastic()
			.xScale(x)
			.yScale(y);

let xAxis = d3.axisBottom(x);

let yAxis = d3.axisLeft(y)
			.tickFormat(d3.format(",.3s"));

svg.append("g")
			.attr("class", "stochastic");

svg.append("g")
			.attr("class", "x stochaxis")
			.attr("transform", "translate(0," + (height - 30) + ")");

svg.append("g")
			.attr("class", "y stochaxis")
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -1 * ((height * 2) / 3))
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Stochastic");

let parseDate = d3.timeParse("%m/%d/%Y");

d3.json('/line').then(function(data) {
	let ar = stochastic.accessor();

	let stk_data = data.map(function(d) {
			return {
					date: parseDate(d.Date),
					volume: +d.Volume,
					open: +d.Open,
					high: +d.High,
					low: +d.Low,
					close: +d.Close,
			};
	}).sort(function(a, b) { return d3.ascending(ar.d(a), ar.d(b)); });

	var stochasticData = techan.indicator.stochastic()(stk_data);
	x.domain(stochasticData.map(stochastic.accessor().d));
	y.domain(techan.scale.plot.stochastic().domain());

	svg.selectAll("g.stochastic").datum(stochasticData).call(stochastic);
	svg.selectAll("g.x.stochaxis").call(xAxis);
	svg.selectAll("g.y.stochaxis").call(yAxis);
});
}

function makeResponsiveChart() {
// clear old chart if already rendered
d3.select('body').select('svg').remove();

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
let svgWidth = window.innerWidth - 30;
let svgHeight = window.innerHeight - 30;

let margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = svgWidth - margin.left - margin.right,
	height = svgHeight - margin.top - margin.bottom;

/* --------------------------------- */
/* SVG plot                          */
/* --------------------------------- */

var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

draw_candlestick_plot(width, height, svg);
draw_volume_plot(width, height, svg);
draw_stochastic_plot(width, height, svg);
}

makeResponsiveChart();

// When the browser window is resized, makeResponsiveChart() is called.
d3.select(window).on('resize', makeResponsiveChart);

