var style = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/style.js");
var predLegend = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/predictionsLegend.js");
var confusionMatrix = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/confusionMatrix.js");
var cl = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/croplands.js");

var irrThreshold = 0.2455;
var nirrThreshold = 0.75;
function makeFinalMap(irrImage, year) {
	var cropLandYear = year;

	if (parseInt(year) < 2001) {
		cropLandYear = 2001;
	} else if (parseInt(year) > 2017) {
		cropLandYear = 2017;
	}
	var croplands = cl.getCropLandImage(cropLandYear);

	var irr = irrImage.expression('irrigated = (b(0) > ' + irrThreshold + ') ? b(0) : 0');
	var irrc = irr.addBands(croplands).expression('irrc = ((b(1) == 1) && (b(0) > ' + irrThreshold + ')) ? b(0) : 0');
	irrc = irrc.mask(irrc);

	var irrnc = irr.addBands(croplands).expression('irrnc = ((b(1) == 0) && (b(0) > ' + nirrThreshold + ')) ? b(0) : 0');
	irrnc = irrnc.mask(irrnc)

	var finalMap = ee.Image.cat(irrc, irrnc);
	return finalMap;
}

function exportMap(image, folderName, year) {
	var folder = folderName + year;
	Export.image.toDrive({
  	image: image,
		region: ee.Geometry.Rectangle({coords:[-180, -60, 180, 60], geodesic:false}),
		description: folder,
		folder: folder,
		scale: 8000
	});
}

var year = "2000";
var irrigation = ee.Image("users/deepakna/w210_irrigated_croplands/post_mids_v2a_results_" + year);
var map = makeFinalMap(irrigation, year);

style.initMap();
Map.add(predLegend.legend);
Map.addLayer(map.select("irrc"), {min:irrThreshold, max:1, palette:["yellow", "greenyellow", "lawngreen", "lightgreen", "darkgreen"], opacity:0.9}, "Irrigation probability in croplands");
Map.addLayer(map.select("irrnc"), {min:nirrThreshold, max:1, palette:["lightsalmon", "salmon", "darksalmon"], opacity:0.9}, "Newly detected irrigation");

// var years = ["2000", "2003", "2006", "2009", "2012", "2015", "2018"];
// for (var i=0; i<years.length; i++) {
//   var y = years[i];
//   var irrigation = ee.Image("users/deepakna/w210_irrigated_croplands/post_mids_v2a_results_" + y);
//   var map = makeFinalMap(irrigation, year);
//   exportMap(map, "irrigation", y);
// }
