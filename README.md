# 15_Javascript_Leaflet_Project

### Project Overview
This project deliverable involved an interactive map displaying real-time earthquake data and displaying a variety of infomration on about the earthquakes. 

The project was broken up into 2 parts/maps. Part 1 included a base layer map with an overlay of the earthquake markers. Each earthquake marker is a circle where the size is based on the earthquake magnitude and the color is based on the earthquake depth (km). A legend is included for the depth colors and the location, magnitude, significance level, date and depth also are displayed on a pop-up when an earthquake marker is selected. 

Part 2 was completed by adding a tectonic plate layer and an additional base layer (topographic). 

#### Additional Notes
Part 2 was completed using a local JSON file until another solution can be determined. 

### Data
For this project, data was accessed/loaded using a D3 JSON promise request from USGS (see Data Reference below).
The dataset for this map contains all earthquakes from the last 7 days that have a magnitude or 1.0 or larger. 

For part 2, a local JSON file was downlaoded as a workaround for tectonic boundaries from https://github.com/fraxen/tectonicplates

### Data Reference
Dataset created by the [United States Geological SurveyLinks (USGS)](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).

### Code Source
Additional resources referenced and utilzied for my project code are listed below: 

- Building custom legend</br>
https://leafletjs.com/examples/choropleth/#custom-legend-control

- Adjusting color for circles based on a function (Adding some Color section)<br/>
https://leafletjs.com/examples/choropleth/

Leaflet Part 2: (Bonus)
- Reading in local JSON file <br/> 
https://api.jquery.com/jQuery.getJSON/

