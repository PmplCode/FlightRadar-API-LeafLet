let map = L.map("map").setView([40.4167047, -3.7035825], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © OpenStreetMap contributors",
}).addTo(map);

var newGreenIcon = new L.Icon({
  iconUrl: "./airport.png",

  iconSize: [32, 37], // size of the icon
  iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -25], // point from which the popup should open relative to the iconAnchor
});

const flightjson_url =
  "https://airlabs.co/api/v9/flights?api_key=5d5b4894-fa52-4a7f-bd66-1819e9b02949";

fetch(flightjson_url)
  .then((response) => response.json())
  .then((data) => {
    let flagFlights = data.response.filter((flight) => flight.flag === "ES");

    let dataGeoJson = {
      type: "FeatureCollection",
      features: [],
    };
    flagFlights.forEach((flight, k) => {
      dataGeoJson.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [flight.lng, flight.lat],
        },
        properties: {
          ...flight,
        },
      });
    });

    console.log(dataGeoJson);

    L.geoJson(dataGeoJson
       ,{
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`
        <p>Status: ${feature.properties.status}</p>
        <p>Departure: ${
          feature.properties.dep_iata ? feature.properties.dep_iata : "No data"
        }</p>
        <p>Arribal: ${
          feature.properties.arr_iata ? feature.properties.arr_iata : "No data"
        }</p>
        `);
        layer.setIcon(newGreenIcon);
      },
    }).addTo(map);
  });
