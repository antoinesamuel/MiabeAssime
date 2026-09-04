import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../../context/LangContext';

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom animated drop-off delivery pin
const deliveryPinIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center w-11 h-11">
    <div class="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-base">
      <svg class="w-4 h-4 fill-white" viewBox="0 0 384 512">
        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
      </svg>
    </div>
    <div class="absolute -bottom-1 w-3.5 h-1.5 rounded-full bg-emerald-700/40"></div>
  </div>`,
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 40],
  popupAnchor: [0, -40],
});

// Famous markets and drop-off hubs in Togo
const POPULAR_HUBS = [
  { name: 'Marché de Bè, Lomé', lat: 6.1315, lng: 1.2389, region: 'Maritime' },
  { name: 'Grand Marché d’Adawlato, Lomé', lat: 6.1264, lng: 1.2185, region: 'Maritime' },
  { name: 'Marché d’Agoè-Nyivé, Lomé', lat: 6.2087, lng: 1.1894, region: 'Maritime' },
  { name: 'Marché Central de Kpalimé', lat: 6.9042, lng: 0.6312, region: 'Plateaux' },
  { name: 'Grand Marché d’Atakpamé', lat: 7.5284, lng: 1.1302, region: 'Plateaux' },
  { name: 'Marché Central de Sokodé', lat: 8.9833, lng: 1.1333, region: 'Centrale' },
  { name: 'Marché Central de Kara', lat: 9.5511, lng: 1.1906, region: 'Kara' },
  { name: 'Grand Marché de Dapaong', lat: 10.8631, lng: 0.2078, region: 'Savanes' },
];

function findNearestHub(lat, lng) {
  let nearest = POPULAR_HUBS[0];
  let minDistance = Infinity;
  for (const hub of POPULAR_HUBS) {
    const d = Math.hypot(hub.lat - lat, hub.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = hub;
    }
  }
  if (minDistance < 0.08) {
    return nearest.name;
  }
  return `Point personnalisé (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

// Controller to handle click events on the map
function MapEventsHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const detectedName = findNearestHub(lat, lng);
      onLocationSelect(lat, lng, detectedName);
    },
  });
  return null;
}

// Component to recenter map and invalidate size on modal display
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(center, map.getZoom() || 13);
  }, [center, map]);
  return null;
}

export default function LocationPickerMap({ value, onChange, label }) {
  const { t } = useLang();
  const displayLabel = label || t('map_destination_label');

  // Default to Marché de Bè, Lomé
  const [position, setPosition] = useState({ lat: 6.1315, lng: 1.2389 });
  const [locationText, setLocationText] = useState(value || 'Marché de Bè, Lomé');
  const markerRef = useRef(null);

  // Sync if value prop changes
  useEffect(() => {
    if (value && value !== locationText) {
      setLocationText(value);
      const matched = POPULAR_HUBS.find((h) => h.name.toLowerCase() === value.toLowerCase());
      if (matched) {
        setPosition({ lat: matched.lat, lng: matched.lng });
      }
    }
  }, [value]);

  const handleSelectLocation = (lat, lng, name) => {
    setPosition({ lat, lng });
    const finalName = name || findNearestHub(lat, lng);
    setLocationText(finalName);
    onChange?.(finalName, { lat, lng });
  };

  const handleHubClick = (hub) => {
    handleSelectLocation(hub.lat, hub.lng, hub.name);
  };

  const handleManualTextChange = (e) => {
    const text = e.target.value;
    setLocationText(text);
    onChange?.(text, position);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          const detected = findNearestHub(lat, lng);
          handleSelectLocation(lat, lng, detected);
        }
      },
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faMapLocationDot} className="text-emerald-600" />
          <span>{displayLabel}</span>
        </label>
        <span className="text-[11px] text-gray-500 font-medium">{t('map_destination_helper')}</span>
      </div>

      {/* QUICK PRESET CHIPS */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-gray-600">{t('map_popular_hubs')}</span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
          {POPULAR_HUBS.map((hub) => {
            const isCurrent = locationText.includes(hub.name.split(',')[0]);
            return (
              <button
                key={hub.name}
                type="button"
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                }`}
                onClick={() => handleHubClick(hub)}
              >
                <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
                <span>{hub.name.split(',')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LEAFLET MAP */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gray-200">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          className="w-full h-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapRecenter center={[position.lat, position.lng]} />
          <MapEventsHandler onLocationSelect={handleSelectLocation} />

          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={[position.lat, position.lng]}
            ref={markerRef}
            icon={deliveryPinIcon}
          >
            <Popup>
              <div className="font-sans text-xs">
                <strong className="block font-bold text-gray-800">
                  {t('map_selected_pin_title')}
                </strong>
                <p className="text-gray-600 my-1">{locationText}</p>
                <span className="text-[10px] text-gray-400">
                  {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-semibold text-gray-600 shadow-xs border border-gray-100">
          {t('map_click_hint')}
        </div>
      </div>

      {/* SELECTED DESTINATION TEXT / MANUAL REFINEMENT */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-gray-50/70">
        <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600 text-sm ml-1" />
        <div className="flex-1 flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
            {t('map_selected_label')}
          </span>
          <input
            type="text"
            className="w-full bg-transparent border-none text-xs font-semibold text-gray-900 focus:outline-none"
            value={locationText}
            onChange={handleManualTextChange}
            placeholder={t('map_selected_placeholder')}
            required
            id="order-destination-input"
          />
        </div>
      </div>
    </div>
  );
}

