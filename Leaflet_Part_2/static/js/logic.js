// Perform an API call
// Pulling all 1.0 and larger earthquakes in the last 7 days 
const URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

const URL_PLATES ='http://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';


d3.json(URL).then(function (data){
    d3.json(URL_PLATES).then(function(plates_data){
        createMarkers(data,plates_data);
    })
})
 
function getColor(d) {
    return d >= 90 ? '#d73027' :
           d >= 70  ? '#fc8d59' :
           d >= 50  ? '#fee08b' :
           d >= 30  ? '#d9ef8b' :
           d >= 10   ? '#91cf60':
                        '#1a9850';
}

function createMarkers(data, plates_data){
    console.log(data);
    console.log(plates_data);
    console.log(plates_data.features[0].geometry)

    plate_lines = [];

    for( i = 0; i< plates_data.features.length; i++){
        plate_lines.push(plates_data.features[i].geometry);
    }

    var plate_style = {
        "color": "#542788",
        "weight": 2,
        "opacity": 1
    };
    
    let plate_layer = L.geoJSON(plate_lines, {
        style: plate_style
    })

    let earthquakes = [];

    for (i = 0; i < data.features.length; i++){
        earthquake = data.features[i];
        let depth2 = earthquake.geometry.coordinates[2];
        let latlng = [earthquake.geometry.coordinates[1], 
                    earthquake.geometry.coordinates[0]];

        earthquakes.push(
            L.circle(latlng, {
                radius: earthquake.properties.mag * 40000,
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

    createMap(earthquake_layer, plate_layer);
}
function createMap(earthquake_layer, plate_layer){
    // Create the tile layer (background) for map
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object to hold the lightmap layer.
    let baseMaps = {
    "Street Layer": base, 
    "Topographc Layer": topo
    };

    // Create an overlayMaps object to hold the Earthquake marker layer.
    let overlayMaps = {
    "Earthquakes": earthquake_layer, 
    "Tectonic Plates": plate_layer
    };

    // Create the map object with options.
    let myMap = L.map("map", {
    center: [38.5, -96.5],     // Center of World [11.75, 18.05]
    zoom: 4,
    layers: [base, plate_layer, earthquake_layer]
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

