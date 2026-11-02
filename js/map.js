/* ==========================================================================
   Interactive Leaflet map with OpenStreetMap tiles.
   Update CENTRE with the exact coordinates of the community centre.
   ========================================================================== */

const CENTRE = {
  name: "Dobsonville Community Foundation",
  address: "Dobsonville, Soweto, Johannesburg, 1863",
  lat: -26.2167,
  lng: 27.8667
};

document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  if (typeof L === "undefined") {
    mapEl.innerHTML = `<p class="map-fallback">The map could not load. Find us at ${CENTRE.address}.</p>`;
    return;
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${CENTRE.lat},${CENTRE.lng}`;

  const map = L.map(mapEl, {
    center: [CENTRE.lat, CENTRE.lng],
    zoom: 15,
    scrollWheelZoom: false // avoid hijacking page scroll; enabled on click below
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.scale({ metric: true, imperial: false }).addTo(map);

  // Brand-coloured marker instead of the default blue pin
  const icon = L.divIcon({
    className: "",
    html: '<svg width="36" height="48" viewBox="0 0 36 48" aria-hidden="true"><path d="M18 0C8 0 0 8 0 18c0 13 18 30 18 30s18-17 18-30C36 8 28 0 18 0z" fill="#b5532a"/><circle cx="18" cy="18" r="7" fill="#faf5ec"/></svg>',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -44]
  });

  const marker = L.marker([CENTRE.lat, CENTRE.lng], { icon, title: CENTRE.name, alt: CENTRE.name }).addTo(map);
  marker
    .bindPopup(
      `<div class="map-popup">
        <strong>${CENTRE.name}</strong><br>
        ${CENTRE.address}<br>
        <a class="map-directions" href="${directionsUrl}" target="_blank" rel="noopener">Get directions</a>
      </div>`
    )
    .openPopup();

  map.on("click focus", () => map.scrollWheelZoom.enable());
  map.on("mouseout blur", () => map.scrollWheelZoom.disable());

  // Recentre button below the map
  const recentre = document.getElementById("map-recentre");
  if (recentre) {
    recentre.addEventListener("click", () => {
      map.flyTo([CENTRE.lat, CENTRE.lng], 15);
      marker.openPopup();
    });
  }

  const directions = document.getElementById("map-directions");
  if (directions) directions.href = directionsUrl;
});
