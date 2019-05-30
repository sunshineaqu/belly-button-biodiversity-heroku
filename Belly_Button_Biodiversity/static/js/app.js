function buildMetadata(sample) {
  
  // clear any existing metadata using .html("")
  d3.select("#sample-metadata")
    .html("")

  // Use `d3.json` to fetch the metadata for a sample
  var metaURL = `/metadata/${sample}`;

  d3.json(metaURL).then(function(sample){
    console.log(sample);
    
    for (var i = 0; i < Object.keys(sample).length; i++){
      var key = Object.keys(sample)[i];
      var value = Object.values(sample)[i];
      d3.select("#sample-metadata")
        .append("h6")
        // .text(Object.entries(sample)[i])
        .text(`${key}: ${value}`)
      }
  })

// ?? how to adjuvst content to fit
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  d3.select("#pie")
    .html("")

  var chartURL = `/samples/${sample}`;

  d3.json(chartURL).then(function(data) {
    console.log(data);

    var values = data.sample_values;
    var labels = data.otu_ids;
    var text = data.otu_labels;
    
    // make pie chart
    var data = [{
      values: values.slice(0,10),
      labels: labels.slice(0,10),
      type: "pie",
      hovertext: text.slice(0,10)          
      // use hovertext to add otu_labels to hover (default is label+value+percent)
      // hoverinfo: `label+value+percent`
    }];

    // ???layout auto adjust
    var layout = {
      // autosize: true
      height: 460,
      width: 450
    };

    // set plotly config responsive: true to let it responsive to different screens ????does not work
    // https://plot.ly/javascript/responsive-fluid-layout/#responsive-plots
    Plotly.newPlot("pie", data, layout, {responsive: true});


    // var layout = { margin: { t: 30, b: 100 } };
    
    // make bubble chart
    var bubble_trace = {
      x: labels,
      y: values,
      text: text,
      mode: 'markers',
      marker: {
        color: labels,
        size: values
      }
    };
    
    var bubble_data = [bubble_trace];
    
    var bubble_layout = {
      // title: 'Bubble Chart Hover Text',
      showlegend: false,
      xaxis: {title: "OTU ID"},
      // autosize: true,
      height: 600,
      width: 1500
    };
    
    // Plotly.plot('bubble', bubble_data, bubble_layout,{responsive: true});
    Plotly.newPlot('bubble', bubble_data, bubble_layout, {responsive: true});
    
    // ? how to adjust the position and size of the figure???
  });
}

function init() {
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
  // Plotly.deleteTraces("pie", 0)
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
