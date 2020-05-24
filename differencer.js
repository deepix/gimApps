var style = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/diffStyle.js");
var croplands = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/croplands.js");
var croplands = croplands.getCropLandImage("2001").or(croplands.getCropLandImage("2018"));

style.initMap();

var diffLegend = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/diffLegend.js");
Map.add(diffLegend.legend);

var thres = 0.2455;

var baseImage1 = ee.Image("users/deepakna/w210_irrigated_croplands/post_mids_v2a_results_2000");
var baseImage2 = ee.Image("users/deepakna/w210_irrigated_croplands/post_mids_v2a_results_2018");
var image1 = baseImage1.expression('b("classification") > ' + thres + ' ? b("classification") - ' + thres + ' : 0');
var image2 = baseImage2.expression('b("classification") > ' + thres + ' ? b("classification") - ' + thres + ' : 0');

var imgMask0 = baseImage1.expression('b("classification") > ' + thres).or(baseImage2.expression('b("classification") > ' + thres));
var imgMask = imgMask0.mask(croplands);

// Map.addLayer(croplands.mask(croplands), {min:0, max:1, palette:["grey"], opacity:0.25}, "Known croplands");
// new - old: +ve means increase in probability, -ve means decrease in probability
var diff = image2.subtract(image1).expression("change = (b(0) < -0.1 || b(0) > 0.1) ? b(0) : 0");
Map.addLayer(diff.updateMask(imgMask), {min: -1.0, max: 1.0, palette: ["green", "#FFFFE0", "red"], opacity:0.9}, "Change in irrigation within known croplands");

var imgMask2 = imgMask0.mask(croplands.not());
var thres2 = 0.25;
var diff2 = image2.subtract(image1).expression("change = (b(0) < -" + thres2 + " || b(0) > " + thres2 + ") ? b(0) : 0");
Map.addLayer(diff2.updateMask(imgMask2), {min: -1.0, max: 1.0, palette: ["green", "#FFFFE0", "red"], opacity:0.9}, "Substantial change in irrigation in unreported lands");
// Map.addLayer(diff.mask(imgMask2));
