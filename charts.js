function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");


    PANEL.html("");
    PANEL.append("h6").text("ID : " + result.id);
    PANEL.append("h6").text("ETHINICITY : " + result.ethnicity);
    PANEL.append("h6").text("GENDER : " + result.gender);
    PANEL.append("h6").text("AGE : " + result.age);
    PANEL.append("h6").text("LOCATION : "  + result.location);
    PANEL.append("h6").text("BBTYPE : " + result.bbtype);
    PANEL.append("h6").text("WFREQ : " + result.wfreq);
    
    buildgauge(result.wfreq);
  });
}

function buildCharts(sample){
  d3.json("samples.json").then((data) => {
    var metadata = data.samples;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    buildbarchart(result);
    buildbubblechart(result);
 


  });
}


function buildbarchart(data){
  var bardata = [{
   type:"bar" ,
   x: data.sample_values.slice(0,10).reverse(),
   y: data.otu_ids.map(OTU => "OTU " + OTU).reverse(),
   text: data.otu_labels.slice(0,10),
   orientation:"h"
  }  ];

  Plotly.newPlot("bar" , bardata);
}

function getColor(val, min, max) {
	let range = max - min,
        value = val - min,
        percent = value / range,
        hue = percent * 360;
  	return `hsl(${hue}%, 100%, 50%)`;
}
function getSize(val, min, max) {
	let minimumSize = 20,
        maximumSize = 150,
        sizeRange = maximumSize - minimumSize,
    	  range = max - min,
        value = val - min,
        percent = value / range,
        size = percent * sizeRange + minimumSize;
  	return size;
}


function buildbubblechart(data){
  var minId = Math.min(...data.otu_ids);
  var maxId = Math.max(...data.otu_ids);
  var minValue = Math.min(...data.sample_values);
  var maxValue = Math.max(...data.sample_values);

  var bubbledata = [{
    mode: "markers",
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    marker: {
     color: data.otu_ids.map(id => getColor(id, minId, maxId)), 
     size: data.sample_values.map(val => getSize(val, minValue, maxValue))
    }
  }];
  Plotly.newPlot("bubble" , bubbledata);
}
  
function buildgauge(data){
  var gaugedata = [{
      type: "indicator",
      mode: "gauge+number",
      value: data,
      title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
      delta: { reference: 2, increasing: { color: "maroon" } },
      gauge: {
        axis: { range: [0, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "cyan" },
          { range: [1, 2], color: "royalblue" },
          { range: [2, 3], color: "lemonchiffon" },
          { range: [3, 4], color: "coral" },
          { range: [4, 5], color: "darkturquoise" },
          { range: [5, 6], color: "silver" },
          { range: [6, 7], color: "fuschia" },
          { range: [7, 8], color: "crimson" },
          { range: [8, 9], color: "honeydew" },
          { range: [9, 10], color: "limegreen" }
        ],
        threshold: {
          line: { color: "black", width: 8 },
          thickness: 1.75,
          value: 10
        }
      }
    }
  ]

  var layout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "lavender",
    font: { color: "darkblue", family: "Arial" }
  };
  
  Plotly.newPlot("gauge", gaugedata, layout);
}
  


init();