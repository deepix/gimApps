// Croplands, take both LC_Type_1 and LC_Type_2
var lc = ee.ImageCollection("MODIS/006/MCD12Q1").select("LC_Type1", "LC_Type2");
var evi = ee.Image("users/deepakna/evi_max_2001_500m").select("EVI");
// var evi = ee.ImageCollection("MODIS/006/MCD12Q2").select("EVI_Amplitude_1");
// get the range of EVI_Amplitude_1
// for each of the 16x16 EVI-pixels in 1 MIRCA2K pixel, if they fall within this range, use them

// Step 1: calculate EVI range
// take cropland mask for 2001
var croplands = ee.ImageCollection("MODIS/006/MCD12Q1").filterDate("2001-01-01", "2001-12-31").select("LC_Type1", "LC_Type2").mean().expression('croplands = (b(0) == 12 || b(1) == 12) ? 1 : 0');
croplands = croplands.mask(croplands);

// evi = evi.mask(croplands);

// mask EVI map for croplands
// Map.addLayer(evi);

// var globalGeometry = ee.Geometry.Rectangle({
//   coords: [-180, -60, 180, 60],
//   geodesic: false,
//   proj: "EPSG:4326"
// });

// var eviHist = evi.reduceRegion({reducer: ee.Reducer.autoHistogram(), geometry: globalGeometry, maxPixels: 1e10, scale: 500});
// print(eviHist.getInfo());

var minEVI = 3008;
var maxEVI = 7552;

// medium, still takes quite a bit of Indiana
// var minEVI = 3648;
// var maxEVI = 6912;

// most conservative, takes out large areas of midwest
// var minEVI = 4288;
// var maxEVI = 6272;

var cropEVI = evi.expression('crops = (b("EVI") >= ' + minEVI + ' && b("EVI") <= ' + maxEVI + ') ? b("EVI") : 0');
Map.addLayer(cropEVI.mask(cropEVI));

