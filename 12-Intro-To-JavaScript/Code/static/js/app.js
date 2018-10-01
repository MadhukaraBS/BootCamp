// from data.js
var tableData = data;

// YOUR CODE HERE!
d3.select("#filter-btn").on("click", function()
{
	d3.event.preventDefault();

	var date_time_filter = d3.select('#datetime').property('value');
	var city_filter = d3.select('#city').property('value');
	var state_filter = d3.select('#state').property('value');
	var country_filter = d3.select('#country').property('value');
	var shape_filter = d3.select('#shape').property('value');

/*
	console.log(date_time_filter);
	console.log(city_filter);
	console.log(state_filter);
	console.log(country_filter);
	console.log(shape_filter);
	console.log(duration_filter);
*/

  ui_dt = date_time_filter.toLowerCase();
  ui_city = city_filter.toLowerCase();
  ui_state = state_filter.toLowerCase();
  ui_country = country_filter.toLowerCase();
  ui_shape = shape_filter.toLowerCase();

	var fdt = tableData.filter(dt => {
/*
    console.log("- " + dt.datetime);
    console.log("e " + date_time_filter);
*/
    comp = ((dt.datetime == ui_dt) || ui_dt == ''); 
//    console.log("1. ", dt.datetime, ui_dt);
    comp = comp && ((dt.city == ui_city) || ui_city == '') ;
//    console.log("2. ", dt.city, ui_city);
    comp = comp && ((dt.state == ui_state) || ui_state == '') ;
//    console.log("3. ", dt.state, ui_state);
    comp = comp && ((dt.country == ui_country) || ui_country == '') ;
//    console.log("4. ", dt.country, ui_country);
    comp = comp && ((dt.shape == ui_shape) || ui_shape == '') ;
//    console.log("5. ", dt.shape, ui_shape);
//    console.log(comp);
    return comp});

//  console.log(fdt.length);

	var tbody = d3.select('tbody');
	tbody.html('');

	fdt.forEach(data_row => {
		var row = tbody.append('tr');
//		row.append('td').text(tableData['datetime']).style('width', '200px');
		row.append('td').text(data_row['datetime']);
		row.append('td').text(data_row['city']);
		row.append('td').text(data_row['state']);
		row.append('td').text(data_row['country']);
		row.append('td').text(data_row['shape']);
		row.append('td').text(data_row['durationMinutes']);
		row.append('td').text(data_row['comments']);
	});
});

d3.select("#clear-btn").on("click", function()
  {
    d3.event.preventDefault();

    d3.select('#datetime').property('value', '');
    d3.select('#city').property('value', '');
    d3.select('#state').property('value', '');
    d3.select('#country').property('value', '');
    d3.select('#shape').property('value', '');
    d3.select('#duration').property('value', '');
    var tbody = d3.select('tbody');
    tbody.html('');
  }
);


