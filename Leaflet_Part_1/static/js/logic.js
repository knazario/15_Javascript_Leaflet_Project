
// Setting URL to all 1.0 and larger earthquakes in the last 7 days 
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';
// Perform an API call and load in data using d3. Send data to createMarkers function
d3.json(url).then(createMarkers);

//function to create overlay of earthquake data
function createMarkers(data){
    //create empty array for populating earthquake markers
    let earthquakes = [];

    for (i = 0; i < data.features.length; i++){
        // loop through all data features (earthquakes), assign depth and lat/long to variables
        earthquake = data.features[i];
        let depth = earthquake.geometry.coordinates[2];
        let latlng = [earthquake.geometry.coordinates[1], 
                    earthquake.geometry.coordinates[0]];
        //add circle polygon for each earthquake with options below
        earthquakes.push(
            L.circle(latlng, {
                radius: earthquake.properties.mag * 25000,  // set radius of circle to magnitude (scaled in meters)
                fillColor: getColor(depth),     // set fill color based on depth (call getColor function to assign color)
                color: "#000",                  // set outline to black 
                weight: .5,                     // set circle outline stroke weight
                fillOpacity: 1                  // set fill opacity
            //set pop-up to inclue title (includes mag and location), date, sig level, and depth.
            }).bindPopup(`<h3>${earthquake.properties.title}</h3><hr>`+         
                `<p> <b>Date:</b> ${new Date(earthquake.properties.time)}</p>`+
                `<p> <b>Significance Level (0-1000):</b> ${earthquake.properties.sig}</p>`+
                `<p> <b>Depth:</b> ${depth} km</p>`)
         ) ;
    }
    let earthquake_layer = L.layerGroup(earthquakes);   // create overlay layer group 

    createMap(earthquake_layer);    // pass layer group to createMap function
}

//when called, getColor will take the depth provided and return a hex color based on the depth
function getColor(d) {
    return d >= 90 ? '#d73027' :
           d >= 70  ? '#fc8d59' :
           d >= 50  ? '#fee08b' :
           d >= 30  ? '#d9ef8b' :
           d >= 10   ? '#91cf60':
                        '#1a9850';
}
// function to create map, overlays, layer controls and legend 
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
    center: [38.5, -96.5],     // can also use center of world approximation [11.75, 18.05]
    zoom: 5,
    layers: [base, earthquakes] //base layers to display
    });

    // Create a layer control, and pass overlayMaps (don't include base layers as only one). Add the layer control to the map.
    L.control.layers(null, overlayMaps).addTo(myMap);

    // create a legend control object
    var legend = L.control({position: 'bottomright'});
    // create div for legend and provide values when added to map
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];
        // add legend title
        div.innerHTML = '<h4> Earthquake<br>Depth (km)</h4>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div; //returning div to be placed on map
    };

    legend.addTo(myMap);    // add legend to map
}