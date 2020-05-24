var regionizer = require("users/deepakna/mids_w210_irrigated_cropland:post_mids/regionizer.js");

function getCropLandImage(year) {
  var assetId = 'users/deepakna/w210_cropland_mask';
  if (parseInt(year) < 2001) {
    print("Using year 2001");
    year = "2001";
  } else if (parseInt(year) >= 2017) {
    print("Using year 2017");
    year = "2017";
  }
  // return ee.Image('users/deepakna/w210_cropland_mask');
  // If not available, run code below
  var image = ee.ImageCollection('MODIS/006/MCD12Q1')
    // it is only available 2001 onwards
    .filterDate(year + "-01-01", year + "-12-31")
    .select(["LC_Type1", "LC_Type2"], ["b1", "b2"])
    .max()
    .reproject({crs:"EPSG:4326", scale:8000})
    
  var crops1 = image
    /* Cropland classes:
     * Land_Cover_Type_1: 12, 14(?)
     * Land_Cover_Type_2: 12
     * Land_Cover_Type_3: 1, 3
     * Land_Cover_Type_5: 7, 8
     * See: https://developers.google.com/earth-engine/datasets/catalog/MODIS_051_MCD12Q1
     */
    .expression('croplands = (b(0) == 12 || b(1) == 12) ? 1 : 0');

  // // include "grasslands", woody savannas and savannas within North America
  // var crops2 = image
  //   .expression('croplands = (b(0) == 10 || b(1) == 10 || b(0) == 8 || b(0) == 9) ? 1 : 0')
  //   // xmin, ymin, xmax, ymax
  //   .clip(ee.Geometry.Rectangle({coords:[-135.0, 10.0, -45.0, 55.0], geodesic:false})
  //     //   // {coords:[-135, 10, -45, 55]}
  //     // )
  //   )
  //   .unmask({sameFootprint: false});

  // return crops1.or(crops2);
  return crops1;
}

function getGFSADIrrigationImage() {
  var dataset = ee.Image('USGS/GFSAD1000_V0');
  var cropDominance = dataset.select('landcover');
  var image = cropDominance.expression('irr = (b(0) > 0 && b(0) < 4) ? 1 : 0');
  return image;
}

exports.getCropLandImage = getCropLandImage;

// var croplands = getCropLandImage("2001");
// Map.addLayer(croplands, {}, "Croplands");

// var year = "2001";
// var image = ee.ImageCollection('MODIS/006/MCD12Q1')
//   // it is only available 2001 onwards
//   .filterDate(year + "-01-01", year + "-12-31")
//   .select("LC_Type4")
//   .max()
//   .clipToCollection(region)
//   // .expression('croplands = ((b(0) == 10) ? 1 : 0)');

// image = image.mask(image);

// Map.addLayer(image, {min:0, max:20}, "LC");

// var croplands = getCropLandImage("2000");
// var croplands = getGFSADIrrigationImage();
// Map.addLayer(croplands.mask(croplands), {opacity:0.9}, "Land cover");
// Map.addLayer(croplands.mask(croplands), {min:0, max:1, palette:["blue"], opacity:0.9}, "Croplands");

// var year = "2001";
// var region = regionizer.regionBoundaries("US");
// var image = ee.ImageCollection('MODIS/006/MCD12Q1')
//     // it is only available 2001 onwards
//     .filterDate(year + "-01-01", year + "-12-31")
//     .select(["LC_Type1", "LC_Type2"], ["b1", "b2"])
//     // maximum cropland extent within time period
//     .max()
//     // .clipToCollection(region)
//     .select("b1");
// print(image);
// Map.addLayer(image.mask(image), {min:0, max:20, palette:["white", "blue", "green", "yellow", "orange", "red"]}, "Land cover");

