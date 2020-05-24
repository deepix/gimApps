// from: https://mygeoblog.com/2016/12/09/add-a-legend-to-to-your-gee-map/

// set position of panel
var legend = ui.Panel({
  style: {
    position: 'top-right',
    padding: '8px 15px'
  }
});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'Change in irrigated croplands: 2018 vs. 2000',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 4px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 
//  Palette with the colors
var palette =['Red', 'Green'];
 
// name of the legend
var names = ['Increase in irrigated croplands', 'Decrease in irrigated croplands'];
 
// Add color and and names
for (var i = 0; i < palette.length; i++) {
  legend.add(makeRow(palette[i], names[i]));
}  

exports.legend = legend;

// add legend to map (alternatively you can also print the legend to the console)
// Map.add(legend);
