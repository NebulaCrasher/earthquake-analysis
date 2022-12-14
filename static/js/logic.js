const earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Leaflet map
let myMap = L.map("map", {
    center: [41.8781, -87.6298],
    zoom: 12
  });
  
// Copyright layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', noWrap:true
}).addTo(myMap);

// Data Arrays
let earthquakeLocations = []
let earthquakeDepth = []
let earthquakeMagnitudes = []

// Get request to populate data arrays
d3.json(earthquakeData).then(data=>{
  for(let i = 0; i < data.features.length; i++){
    coords = data.features[i].geometry.coordinates.slice(0,2);
    earthquakeLocations.push(coords);
    depth = data.features[i].geometry.coordinates.slice(2,3);
    earthquakeDepth.push(depth[0]);
    magnitude = data.features[i].properties.mag;
    earthquakeMagnitudes.push(magnitude);
  }
function colorGenerator(n) {return d3.interpolateReds(n/100)};

//Circle marker and pop-up definition
for(let location in earthquakeLocations){
  let color = colorGenerator(earthquakeDepth[location])
  L.circleMarker(earthquakeLocations[location].reverse(), {
    color:color,
    fillOpacity: .8,
    radius: earthquakeMagnitudes[location]*3
  }).bindPopup(`<h3>Magnitude: ${earthquakeMagnitudes[location]}</h3> <hr> <h3>Depth: ${earthquakeDepth[location]}</h3> <hr> <h2>Coordinates: ${earthquakeLocations[location]}</h2>`)
  .addTo(myMap)
};

//Legend definition & population
for (let number in earthquakeDepth){earthquakeDepth[number] = Math.round(earthquakeDepth[number])};

earthquakeDepth = earthquakeDepth.sort((a,b)=>(a-b));

uniqueDepths = [...new Set(earthquakeDepth)];
console.log(uniqueDepths);

let legend = L.control({position: "bottomright"});
legend.onAdd = (map) => {
  let div = L.DomUtil.create('div', 'info legend'), depths = uniqueDepths;
  for(let i = 0; i < depths.length; i++){
    div.innerHTML += 
    '<i style="background:' + colorGenerator(depths[i]) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return div;
}
legend.addTo(myMap);
})
