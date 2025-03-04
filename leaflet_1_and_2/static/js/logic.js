let myMap = L.map("map").setview([115.6903333, -33.2403333], 1.83);



//Create the 'base map' tile layer as a second background of the map
let basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  zoom: 6
});

basemap.addTo(myMap);

const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson';


function getColor(depth) { if (depth <4)  {return "purple";}
  else if (depth <6) { return 'green';}
  else { return 'black';}
}


function getRadius(magnitude) { return magnitude * 4; 

}


// Add a GeoJSON layer to the map once the file is loaded.
L.geoJson(data, {
  // Turn each feature into a circleMarker on the map.
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng);

  },
  // Set the style for each circleMarker using our styleInfo function.
  style: styleInfo,
  // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
  onEachFeature: function (feature, layer) {
       layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);


   // Create a legend control object.
   let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depthIn = [0, 4, 6, 10];
    let colors = ["purple", "green", "black"];


    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthIn.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        depthIn[i] + (depthIn[i + 1] ? '&ndash;' + depthIn[i + 1] + '<br>' : '+');
    }


    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);


  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.
    L.geoJson(plate_data, {
      color: "orange",
      weight: 2
    

    // Then add the tectonic_plates layer to the map.
  }).addTo(myMap);
});