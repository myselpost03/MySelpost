import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Styles/Maps.css";
import locationIcon from "../Assets/location.png";

const Maps = () => {
  const mapContainer = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  useEffect(() => {
    if (!data) return;

    const map = L.map(mapContainer.current, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false, // disables zoom on scroll
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
    }).setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    data.locations.forEach((loc) => {
      // Main marker
      const icon = L.icon({
        iconUrl: locationIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker(loc.coordinates, { icon }).addTo(map);

      // Mini circular image marker
      const images = data.imagesByCountry[loc.name];
      if (images && images.length > 0) {
        const miniIcon = L.divIcon({
          className: "mini-image-icon",
          html: `<img src="${images[0]}" style="width:24px; height:24px; border-radius:50%; border:2px solid white;" />`,
        });

        // Slightly offset from main marker
        L.marker(
          [loc.coordinates[0] + 0.5, loc.coordinates[1] + 0.5],
          { icon: miniIcon }
        ).addTo(map);
      }
    });

    return () => map.remove();
  }, [data]);

  return (
    <div className="maps-cont">
      <div ref={mapContainer} className="map-screen" />

      {/* Transparent Overlay */}
      <div className="maps-overlay">
        <button className="coming-soon-btn" disabled>
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Maps;
