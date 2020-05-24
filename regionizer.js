/* given a region or country FIPS code or "world",
 * return a feature collection for the corresponding geometries
 */

var worldRegions = [
  "North America",
  "Central America",
  "South America",
  "EuropeSansRussia",
  "EuropeanRussia",
  "Africa",
  "SW Asia",
  "Central Asia",
  "N Asia",
  "E Asia",
  "SE Asia",
  "S Asia",
  "Australia",
  // Oceania causes geometry explosion
  // "Oceania"
];

var world1 = [
  "Europe",
  "SW Asia",
  "Central Asia",
  "N Asia",
  "E Asia",
  "SE Asia",
  "S Asia"
];
var world2 = [
  "Africa",
  "North America",
  "Central America",
  "South America",
  "Australia"
];

/* PRIVATE */
function createRegionFilter(region) {
  var fil;
  // we assume 2-characters = country FIPS code
  if (region.length == 2) {
    fil = ee.Filter.eq("country_co", region);
  }
  else if (region === "EuropeSansRussia") {
    fil = ee.Filter.and(
      ee.Filter.neq("country_co", "RS"),
      ee.Filter.eq("wld_rgn", "Europe")
    );
  }
  else if (region === "EuropeanRussia") {
    fil = ee.Filter.and(
      ee.Filter.eq("country_co", "RS"),
      ee.Filter.eq("wld_rgn", "Europe")
    );
  }
  else {
    fil = ee.Filter.eq("wld_rgn", region);
  }
  return fil;
}

// /* PRIVATE */
// Use to recalculate total area if region changes
function getTotalArea() {
  var regions = worldRegions;
  var allRegions = ee.FeatureCollection(regions.map(regionBoundaries)).flatten();
  var totalArea = allRegions.aggregate_sum('areaHa');
  return totalArea;
}

// print(getTotalArea());

function regionBoundaries(region) {
  var fil, fils;
  // Obtained by running getTotalArea() above
  var totalArea = 133102516670833.22;

  if (region === "world") {
    // recursively get boundaries and do a union
    fils = worldRegions.map(createRegionFilter);
    // horrible hack because .apply() failed and GEE JS doesn't support ...
    fil = ee.Filter.or(fils[0], fils[1], fils[2], fils[3],
      fils[4], fils[5], fils[6], fils[7],
      fils[8], fils[9], fils[10], fils[11], fils[12]
    );
  } else if (region === "world1") {
    // recursively get boundaries and do a union
    fils = world1.map(createRegionFilter);
    // horrible hack because .apply() failed and GEE JS doesn't support ...
    fil = ee.Filter.or(fils[0], fils[1], fils[2], fils[3],
      fils[4], fils[5], fils[6]
    );
  } else if (region === "world2") {
    // recursively get boundaries and do a union
    fils = world2.map(createRegionFilter);
    // horrible hack because .apply() failed and GEE JS doesn't support ...
    fil = ee.Filter.or(fils[0], fils[1], fils[2], fils[3], fils[4]);
  }
  else {
    fil = createRegionFilter(region);
  }
  var fcWithArea = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017")
    .filter(fil)
    .map(function(feature) {
      var featureArea = feature.geometry().area();
      return feature.set({
        areaHa: featureArea,
        areaHaFraction: ee.Number(featureArea).divide(totalArea)
      });
    });
  return fcWithArea;
}

exports.regionBoundaries = regionBoundaries;
exports.worldRegions = worldRegions;