(function() {

'use strict';

var working = 0,
    partial = 0,
    not_working = 0,
    latitude = 29.98259,
    longitude = -90.01678,
    minzoom = 10,
    maxzoom = 16;

var map,
    colorLayer,
    satelliteLayer,
    baseMaps;

function defineMap() {
  map = new L.Map("map", {
    minZoom: minzoom,
    maxZoom: maxzoom,
    scrollWheelZoom: false,
    fadeAnimation: false,
    zoomControl: false,
    center: [latitude, longitude],
    zoom: 12
  });
}

function tallyCategories(data) {
  for (var i = 0; i < data.features.length; i++) {
    var status = data.features[i].properties.light_is_working;

    if (status === 'y') { working += 1; }  // Working
    if (status === 'n') { not_working += 1; }  // Not working
    if (status === 'p') { partial += 1; }  // Partially working
  }
}

function getResultsFromS3() {
  var url = "https://s3-us-west-2.amazonaws.com/projects.thelensnola.org/school-zones/PROJECT_SLUG/markers.json";
  d3.json(url, handleResultsFromS3);
}

function handleResultsFromS3(error, data) {
  if (error) {
    console.error("Couldn't find results on S3.");
  } else {
    tallyCategories(data);
    addCircleMarkers(data);
    addLegend();
  }
}

function highlightFeature(e) { e.target.openPopup(); }
function resetHighlight(e) { e.target.closePopup(); }

function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.short_address) {
    layer.bindPopup(feature.properties.short_address, { closeButton: false });
  }

  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
}

function addCircleMarkers(data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      var rating = feature.properties.light_is_working;
      var fill_color = rating === 'y' ? 'green' : (rating === 'p' ? 'yellow' : 'red');

      return L.circleMarker(latlng, {
        radius: 6,
        weight: 1.3,
        opacity: 0.8,
        color: 'black',
        fillColor: fill_color,
        fillOpacity: 0.7
      });
    },
    onEachFeature: onEachFeature
  }).addTo(map);
}

function setZoomControl() { L.control.zoom({position: 'topleft'}).addTo(map); }

function setColorLayer() {
  var access_token = 'pk.eyJ1IjoidHRob3JlbiIsImEiOiJEbnRCdmlrIn0.hX5nW5GQ-J4ayOS-3UQl5w';
  var tile_url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=' + access_token;
  var attribution_markup = "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Feedback</a>";

  colorLayer = L.tileLayer(tile_url, {
    attribution: attribution_markup,
    scrollWheelZoom: false,
    detectRetina: true,
    minZoom: minzoom,
    maxZoom: maxzoom
  });
}

function setSatelliteLayer() {
  var access_token = 'pk.eyJ1IjoidHRob3JlbiIsImEiOiJEbnRCdmlrIn0.hX5nW5GQ-J4ayOS-3UQl5w';
  var tile_url = 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + access_token;
  var attribution_markup = "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Feedback</a>";

  satelliteLayer = L.tileLayer(tile_url, {
    attribution: attribution_markup,
    scrollWheelZoom: false,
    detectRetina: true,
    minZoom: minzoom,
    maxZoom: maxzoom
  });
}

function setBaseMaps() { baseMaps = {"Color": colorLayer, "Satellite": satelliteLayer}; }

function addColorLayer() { map.addLayer(colorLayer); }

function addBaseMaps() { L.control.layers(baseMaps).addTo(map); }

function addLegend() {
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<div class="legend-title">School zone lights</div>' +
      '<i style="background: green;"></i> Worked (' + working + ')<br>' +
      '<i style="background: yellow;"></i> Low battery/bulb out (' + partial + ')<br>' +
      "<i style='background: red;'></i> Didn't work at all (" + not_working + ')' +
      "<div id='source' class='source'>Source: The Lens survey, Sept. 9-10</div>";

    return div;
  };

  legend.addTo(map);
}

window.onload = function main() {
  defineMap();
  getResultsFromS3();

  setZoomControl();

  setColorLayer();
  setSatelliteLayer();
  setBaseMaps();

  addColorLayer();
  addBaseMaps();
}

})()