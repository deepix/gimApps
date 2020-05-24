var geeMapStyle = [
  // {stylers: [{gamma: -50}]},
  // {featureType: 'all', stylers: [{invert_lightness: true}]},
  {featureType: 'road', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'landscape', elementType: 'all', stylers: [{color: '#FFFFE0', visibility: 'off'}]},
  {elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
  {featureType: 'water', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
  {featureType: 'water', elementType: 'geometry.fill', stylers: [{color: '#6495ED'}]},
  {featureType: 'administrative', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{visibility: 'on'}]}
];

function initMap() {
  Map.setOptions('Irrigation', {'Irrigation': geeMapStyle});
  Map.drawingTools().setShown(false);
  Map.setCenter(0, 30, 3);  // lon, lat, scale
}

exports.initMap = initMap;

// initMap();
