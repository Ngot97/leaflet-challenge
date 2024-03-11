// Earthquake URL from GeoJson.
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(earthquakeUrl).then(function (data) {
  // Console log the data retrieved 
  console.log(data);
  // createFeatures function to save through earthquake data 
  createFeatures(data.features);
});

// Function to determine marker size
function markerSize(magnitude) {
  return magnitude * 2000;
}

// Function to determine marker color
function chooseColor(depth) {
  if (depth < 10) return "Light Blue";
  else if (depth < 30) return "Teal";
  else if (depth < 50) return "Mint Green";
  else if (depth < 70) return "Light Yellow";
  else if (depth < 90) return "Yellow";
  else return "Orange";
}

// Add a popup that describes the place and time of the earthquake. 
function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }
  
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    onEachFeature: function (feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
      },

    // Point to layer used to alter markers
    pointToLayer: function (feature, latlng) {
      // Determine the style of markers based on properties
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.5
      };
      return L.circle(latlng, markers);
    }
  });

  // Send our earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create tile layer with OpenStreetMap
  let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© OpenStreetMap contributors"
  });

  // Create our map, giving it the OpenStreetMap layer and earthquakes layer to display on load.
  let myMap = L.map("map", {
    center: [-25, 135],
    zoom: 4,
    layers: [tileLayer, earthquakes]
  });

  // Add legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
}
