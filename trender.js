var confusionMatrix = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/confusionMatrix.js");
var cl = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/croplands.js");

function countIrrigated(year) {
  var thres = 0.0;
  var baseImage = ee.Image("users/deepakna/w210_irrigated_croplands/post_mids_v2a_results_" + year);
  var irrigatedImage = baseImage.expression('b(0) > ' + thres + ' ? b(0) - ' + thres + ' : 0');
  var irrigatedCount = confusionMatrix.sumImage(irrigatedImage).getInfo().constant;
  return irrigatedCount;
}

var years = [2000, 2003, 2006, 2009, 2012, 2015, 2018];
var resultList = [];
for (var i=0; i<years.length; i++) {
  resultList[i] = countIrrigated(years[i]);
}

print(resultList);

// years.map(function(year) { return countIrrigated(year, resultDict); });

var chart = ui.Chart.array.values({
    array: resultList,
    axis: 0,
    xLabels: years
  })
  .setSeriesNames(["Model prediction"])
  .setOptions({
    title: 'Irrigated croplands over time',
    legend: 'none',
    hAxis: {'title': 'Year'},
    vAxis: {'title': 'No. points "irrigated"'},
    trendlines: {
        0: {
          type: 'linear',
          color: 'orange',
          lineWidth: 3,
          opacity: 0.7,
          showR2: true,
          visibleInLegend: false
        }
    }
  });
print(chart);
