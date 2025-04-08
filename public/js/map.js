mapboxgl.accessToken = mapToken;
   
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // choose from Mapbox's core style, or make ypur own style with Mapbox studio
    style: "mapbox://styles/mapbox/streets-v12", // style url
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 5, // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(listing.geometry.coordinates) //listing.geometry.coordinaates
.setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML(
     `<h3>${listing.location}</h3><p>Exact Location will be provided after booking</p>`
   )
 )
.addTo(map);

