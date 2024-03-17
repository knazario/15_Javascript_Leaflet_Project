// Perform an API call
// Pulling all 1.0 and larger earthquakes in the last 7 days 
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

    let earthquakes = [];

    for (i = 0; i < data.features.length; i++){
        earthquake = data.features[i];
        let depth2 = earthquake.geometry.coordinates[2];
        let latlng = [earthquake.geometry.coordinates[1], 
                    earthquake.geometry.coordinates[0]];

        earthquakes.push(
            L.circle(latlng, {
                radius: earthquake.properties.mag * 15000,
                fillColor: getColor(depth2),
                color: "#000", 
                weight: .5,
                fillOpacity: 1
            }).bindPopup(`<h3>${earthquake.properties.title}</h3><hr>`+
                `<p> Date: ${new Date(earthquake.properties.time)}</p>`+
                `<p> Significance Level (0-1000): ${earthquake.properties.sig}</p>`+
                `<p> Depth: ${depth2} km</p>`)
         ) ;
    }
    let earthquake_layer = L.layerGroup(earthquakes);

    createMap(earthquake_layer);
}
function createMap(earthquakes){
    // Create the tile layer (background) for map
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    // Create an overlayMaps object to hold the Earthquake marker layer.
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
    L.control.layers(null, overlayMaps).addTo(myMap);

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

