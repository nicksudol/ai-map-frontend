import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  useEffect(() => {
    const map = L.map('map').setView([39.5, -98.35], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    fetch('/dealers.json')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Loaded dealer data:', data);
        let count = 0;
        data.forEach(dealer => {
          const lat = parseFloat(dealer.latitude);
          const lng = parseFloat(dealer.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(`
                <strong>${dealer.name}</strong><br>
                ${dealer.address}<br>
                ${dealer.city}, ${dealer.state} ${dealer.zip}<br>
                ${dealer.phone}<br>
                ${dealer.email || ''}
              `);
            count++;
          }
        });
        console.log(`📍 Plotted ${count} dealers`);
      })
      .catch(err => console.error('❌ Failed to load dealer data', err));
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <header style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <img src="/logo.png" alt="Photo Tex Logo" height={50} />
      </header>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
}
