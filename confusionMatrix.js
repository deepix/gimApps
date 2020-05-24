function getBinaryLabels() {
  // Use log1p(), then set values < 1 to be zero.
  // Derived from histogram in Rmd.
  var labelImg1 = ee.Image("users/deepakna/mc4MaxIrrigatedHa"); // ee.Image("users/deepakna/max_cropped_area_irc_ha");
  
  var sampleLabelImg = labelImg1
    .select(['b1'], ['IRRIGATED'])
    .expression('BLABEL = log(b("IRRIGATED") + 1.0) < 1.0 ? 0 : 1');
  
  return sampleLabelImg;
}

// Map.addLayer(ee.Image("users/deepakna/mc4MaxIrrigatedHa").select("b1"), {min:0, max:7000}, "Irrigation");

function getLabels() {
  var labelImg1 = ee.Image("users/deepakna/mc4MaxIrrigatedHa"); // ee.Image("users/deepakna/max_cropped_area_irc_ha");
  
  var sampleLabelImg = labelImg1
    .select(['b0'], ['IRRIGATED'])
    .expression('LABEL = b("IRRIGATED")');
  
  return sampleLabelImg;
}

// xmin, ymin, xmax, ymax
var globalGeometry = ee.Geometry.Rectangle({
  coords: [-180, -90, 180, 90],
  geodesic: false,
  proj: "EPSG:4326"
});

function sumImage(image) {
  return image.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: globalGeometry,
    scale: 8000,
    crs: "EPSG:4326",
    maxPixels: 1e10
  });  
}

function assessModel(resultsImage, thres) {
  var image = resultsImage;
  var labelsImage = getBinaryLabels();
  var both = ee.Image.cat(image, labelsImage);

  // goes from 0 to thres
  var fnExpr = 'FN = ((b("classification") <= ' + thres + ') && (b("BLABEL") == 1)) ? 1 : 0';
  // goes from 0 to 1-thres
  var fpExpr = 'FP = ((b("classification") > ' + thres + ') && (b("BLABEL") == 0)) ? 1 : 0';
  // goes from 0 to 1-thres
  var tpExpr = 'TP = ((b("classification") > ' + thres + ') && (b("BLABEL") == 1)) ? 1 : 0';
  var tnExpr = 'TN = ((b("classification") <= ' + thres + ') && (b("BLABEL") == 0)) ? 1 : 0';

  var fnImage = both.expression(fnExpr);
  var fpImage = both.expression(fpExpr);
  var tpImage = both.expression(tpExpr);
  var tnImage = both.expression(tnExpr);

  var tpCount = sumImage(tpImage).getInfo().TP;
  var fpCount = sumImage(fpImage).getInfo().FP;
  var tnCount = sumImage(tnImage).getInfo().TN;
  var fnCount = sumImage(fnImage).getInfo().FN;
  var total = tpCount + fnCount + tnCount + fpCount;
  var posFraction = (tpCount + fnCount) / total;
  print("True positives: " + tpCount);
  print("False positives: " + fpCount);
  print("True negatives: " + tnCount);
  print("False negatives: " + fnCount);
  print("Total: " + total);
  print("Positives fraction (positive/total): " + posFraction);

  // of all the points identified as irrigated, what fraction was correct?
  var precision = tpCount / (tpCount + fpCount);
  print("Precision: " + precision);
  // of all the points identified correctly, what fraction was marked irrigated?
  var recall = tpCount / (tpCount + fnCount);
  print("Recall: " + recall);
  var accuracy = (tpCount + tnCount) / (tpCount + fpCount + tnCount + fnCount);
  // can be misleading with imbalanced classes like ours
  print("Accuracy: " + accuracy);

  var F1 = 2 * (precision * recall) / (precision + recall);
  print("F1 score: " + F1);
}

exports.assessModel = assessModel;
exports.sumImage = sumImage;
exports.getBinaryLabels = getBinaryLabels;
exports.getLabels = getLabels;

// assessModel(ee.Image("users/deepakna/w210_results/w210_results_2000"), 0.15);

