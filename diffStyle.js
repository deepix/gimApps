var geeMapStyle = [
  // {featureType: 'all', stylers: [{invert_lightness: true}]},
  {featureType: 'road', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'landscape', elementType: 'all', stylers: [{color: '#FFFFE0', visibility: 'off'}]},
  {elementType: 'labels', stylers: [{visibility: 'off'}]},
  {featureType: 'water', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
  // steel blue
  {featureType: 'water', elementType: 'geometry.fill', stylers: [{color: '#6495ED' /*'#6495ED'*/}]},
  {featureType: 'administrative', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{visibility: 'on'}]}
];

function initMap() {
  Map.setOptions('Irrigation', {'Irrigation': geeMapStyle});
  Map.drawingTools().setShown(false);
  Map.setCenter(0, 30, 3);  // lon, lat, scale
}

exports.initMap = initMap;

function initOneMap(map) {
  map.setOptions('Irrigation', {'Irrigation': geeMapStyle});
  map.drawingTools().setShown(false);
  map.setCenter(0, 30, 3);  // lon, lat, scale
}
exports.initOneMap = initOneMap;
