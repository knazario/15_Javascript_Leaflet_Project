// Perform an API call

// 4.5 and larger in the last 30 days 
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

d3.json(url).then(createMarkers);
 
function getColor(d) {
    return d >= 90 ? '#d73027' :
           d >= 70  ? '#fc8d59' :
           d >= 50  ? '#fee08b' :
           d >= 30  ? '#d9ef8b' :
           d >= 10   ? '#91cf60':
                        '#1a9850';
}

function createMarkers(data){
    console.log(data);
    console.log(data.features[0]);

    let earthquakes = L.geoJSON(data.features, {
        pointToLayer: createCircleMarker,
        onEachFeature: onEachFeature
      });

    // Create a circle marker
    function createCircleMarker(feature, latlng) {
        // let depth_color = "";
        let depth = feature.geometry.coordinates[2];
        // if (depth <= 10){
        //     depth_color = 
        // else if (depth <= 30){
        //     depth_color = 
        // }
        // else if (depth <= 30){
        //         depth_color = 
        // }
        // else if (depth <= 30){
        //     depth_color = 
        // }
        //  else if (depth <= 30){
        //      depth_color = 
        // }
        // else if (depth <= 30){
        //  depth_color =   
        // }   
          
    return L.circle(latlng, {
        radius: feature.properties.mag * 15000,
        fillColor: getColor(depth),
        color: "#000", 
        weight: .5,
        fillOpacity: 1
        });
    }
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.title}</h3><hr>`+
        `<p> Date: ${new Date(feature.properties.time)}`+
        `<p> Significance Level (0-1000): ${feature.properties.sig}`+
        `<p> Depth: ${feature.geometry.coordinates[2]} km`);
      } 
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
    center: [38.5, -96.5],     // Center of World [11.75, 18.05]
    zoom: 5,
    layers: [base, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];

        div.innerHTML = '<h4> Earthquake<br>Depth (km)</h4>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

legend.addTo(myMap);

}

