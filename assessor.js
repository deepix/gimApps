var confusionMatrix = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/confusionMatrix.js");
var croplands = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/croplands.js");
var croplands = croplands.getCropLandImage("2001");

var resultsImage = ee.Image("users/deepakna/w210_irrigated_croplands/post_mids_v2a_results_2000");
var thres = 0.2455;

function getGFSADIrrigationImage() {
  var dataset = ee.Image('USGS/GFSAD1000_V0');
  var cropDominance = dataset.select('landcover');
  var image = cropDominance.expression('irr = (b(0) > 0 && b(0) < 4) ? 1 : 0');
  return image;
}

var style = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/diffStyle.js");
style.initMap();

var maskedResults = resultsImage.updateMask(croplands);
Map.addLayer(maskedResults.select("classification"), {min:0, max:1, palette: ['yellow', 'lightgreen', 'green']}, "Irrigation");
print("--- Results with cropland mask ---");
confusionMatrix.assessModel(maskedResults, thres);

var irrCropLandMask = getGFSADIrrigationImage();
var irrMaskedResults = resultsImage.updateMask(irrCropLandMask);
print("--- Results with GFSAD irrigated cropland mask ---");
confusionMatrix.assessModel(irrMaskedResults, thres);

print("--- Results WITHOUT cropland mask ---");
confusionMatrix.assessModel(resultsImage, thres);
