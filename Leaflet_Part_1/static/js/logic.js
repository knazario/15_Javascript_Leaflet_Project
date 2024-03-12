// Perform an API call

// 4.5 and larger in the last 30 days 
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';

d3.json(url).then(createMarkers);
 
function createMarkers(data){
    console.log(data);
    console.log(data.features[0]);

    let earthquakes = L.geoJSON(data.features, {
        //onEachFeature: onEachFeature
      });
    console.log(earthquakes);
    createMap(earthquakes);
}
function createMap(earthquakes){
    // Create the tile layer (background) for map
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })


    // Create a baseMaps object to hold the lightmap layer.
    let baseMaps = {
    "Gray Scale": base
    };


    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
    "Earthquakes": earthquakes
    };

    // Create the map object with options.
    let myMap = L.map("map", {
    center: [11.75, 18.05],
    zoom: 2,
    layers: [base, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}