function buildGauge(wfreqData) {

  const levelVal = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5];
  const mulNum = 20;

    // Enter a speed between 0 and 180
  var level = wfreqData;
  if (level >= 9)
  {
    level = levelVal[8] * mulNum;
  }
  else
  {
    level = levelVal[level] * mulNum;
  }

  // Trig to calc meter point
  var degrees = 180 - level,
     radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'BB',
    text: level,
    hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
    direction: "clockwise",
    textinfo: 'text',
    textposition:'inside',	  
    marker: {colors:['rgba(204, 255, 230, .5)',
                     'rgba(179, 255, 218, .5)',
                     'rgba(153, 255, 206, .5)',
                     'rgba(128, 255, 193, .5)',
                     'rgba(77, 255, 169, .5)',
                     'rgba(51, 226, 156, .5)',
                     'rgba(26, 226, 144, .5)',
                     'rgba(0, 226, 132, .5)',
                     'rgba(0, 230, 119, .5)',
                     "white"]},
    labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false,
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    height: 650,
    width: 700,
    xaxis: {zeroline:false, showticklabels:false,
         showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
         showgrid: false, range: [-1, 1]},
    font: {
      size: 18,
    }
  };

  Plotly.newPlot('gauge', data, layout);
}

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

    // BONUS: Build the Gauge Chart
    buildGauge(sampleMetaData.WFREQ);
  });
}


function buildCharts(sample) {
  var d3colors = Plotly.d3.scale.category10();

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {
    const dataValues = sampleData.sample_values.slice(0,10);
    const dataLabels = sampleData.otu_ids.slice(0,10);
    const dataHoverText = sampleData.otu_labels.slice(0,10);
    
    var bColor = [];
    for(var i = 0; i < 10; i++)
    {
      bColor[i] = d3colors(dataLabels[i] % 10);
      dataValues[i] = dataValues[i] * 1;
    }
 
  /*
    console.log(dataValues.length);
    console.log(dataLabels.length);
    console.log(dataHoverText.length);
*/
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleData = [{
      x: dataLabels,
      y: dataValues,
      text: dataHoverText,
      mode: 'markers',
      marker: {
        size: dataValues,
        color: bColor
      }
    }];

    var layout = {
      title: '<b>Belly button Bubble Chart</b>',
      showlegend: false,
      height: 600,
      width: 1000,
      margin: 20,
      xaxis: {
        title: 'OTU ID',
        titlefont: {
          family: 'Arial, Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
      yaxis: {
      title: 'BB Data samples',
        titlefont: {
          family: 'Arial, Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
      },
      font: {
        size: 18,
      }
    };

    Plotly.newPlot('bubble', bubbleData, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [{
      values: dataValues,
      labels: dataLabels,
      hovertext: dataHoverText,
      type: "pie"
    }];

    var layout = {
      title: '<b>Belly Button Pie Chart</b>',
      showlegend: true,
      height: 500,
      width: 500,
      font: {
        size: 18,
      }
    };

    Plotly.newPlot("pie", pieData, layout);
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
