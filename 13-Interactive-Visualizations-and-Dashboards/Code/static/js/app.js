function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use d3 to select the panel with id of `#sample-metadata`
  var selector = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  selector.html("");

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sampleMetaData) => {
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    selector
      .append("panel-body")
      .html(`<P>Age: ${sampleMetaData.AGE}</P>`);
    selector
      .append("panel-body")
      .html(`<P>BBTYPE: ${sampleMetaData.BBTYPE}</P>`);
    selector
      .append("panel-body")
      .html(`<P>ETHNICITY: ${sampleMetaData.ETHNICITY}</P>`);
    selector
      .append("panel-body")
      .html(`<P>GENDER: ${sampleMetaData.GENDER}</P>`);
    selector
      .append("panel-body")
      .html(`<P>LOCATION: ${sampleMetaData.LOCATION}</P>`);
    selector
      .append("panel-body")
      .html(`<P>SAMPLEID: ${sampleMetaData.sample}</P>`);
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {
    const dataValues = sampleData.sample_values.slice(0,10);
    const dataLabels = sampleData.otu_ids.slice(0,10);
    const dataHoverText = sampleData.otu_labels.slice(0,10);

    console.log(dataHoverText);

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  var data = [{
    values: dataValues,
    labels: dataLabels,
    text = ["aaaa", "BBB"],
    hoverinfo: 'text',
    type: "pie"
  }];

  var layout = {
    height: 300,
    width: 400
  };

  Plotly.plot("pie", data, layout);
  });

}

function init() {
  // sampleNames = ['A', 'B', 'C', 'D'];
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
