var confusionMatrix = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/confusionMatrix.js");
var mmLegend = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/mmLegend.js");
var origLabelsImage = confusionMatrix.getLabels();
var labelsImage = confusionMatrix.getBinaryLabels();
var invLabelsImage = labelsImage.not();

// origLabelsImage = origLabelsImage.mask();
// Map.addLayer(origLabelsImage, {}, "Max area irrigated (Ha)");

var resultsImage = ee.Image("users/deepakna/w210_irrigated_croplands/post_mids_v2a_results_2000");
var thres = 0.2455;

var style = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/diffStyle.js");
style.initMap();
Map.add(mmLegend.legend);

var diffImage = resultsImage.expression("b(0) > " + thres + " ? b(0) : 0").subtract(labelsImage);
diffImage = diffImage.mask(diffImage);

// False positive intensity
var diffImage2 = resultsImage.expression("b(0) > " + thres + " ? b(0) : 0").mask(invLabelsImage);
diffImage2 = diffImage2.mask(diffImage2);
Map.addLayer(diffImage2, {min:thres, max:1, palette: ['green']}, "False positive intensity");

// True positive intensity
var diffImage3 = resultsImage.expression("b(0) > " + thres + " ? b(0) : 0").mask(labelsImage);
diffImage3 = diffImage3.mask(diffImage3);
Map.addLayer(diffImage3, {min:thres, max:1, palette: ['blue']}, "True positive intensity");

// False negative intensity: prediction -ve, label +ve
var diffImage4 = resultsImage.expression("b(0) <= " + thres + " ? b(0) : 0").mask(labelsImage);
diffImage4 = diffImage4.mask(diffImage4);
Map.addLayer(diffImage4, {min:-1, max:thres, palette: ['red']}, "False negative intensity");
