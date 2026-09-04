import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faTruck,
  faWeightHanging,
  faCoins,
  faStar,
  faRoute,
  faClock,
  faIdCard,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../../context/LangContext';
import { transporters } from '../../data/mockData';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createTruckIcon = () =>
  L.divIcon({
    html: `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-emerald-600 shadow-lg text-emerald-700 transition-transform duration-200 hover:scale-115 cursor-pointer">
      <svg class="w-5 h-5 fill-emerald-600" viewBox="0 0 640 512">
        <path d="M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L512 205.3 512 256l-96 0 0-96zM160 384a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm368 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"/>
      </svg>
    </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 7);
  }, [center, map]);
  return null;
}

export default function TransporterMap({ onSelect, selectedId, transportersList }) {
  const { t } = useLang();
  const center = [8.0, 1.1]; // Centre Togo

  // Enlève les transporteurs occupés de la carte
  const availableTransporters = (transportersList || transporters).filter((t) => t.available);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-emerald-100/80 shadow-md">
      <MapContainer
        center={center}
        zoom={7}
        className="w-full h-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {availableTransporters.map((transporter) => (
          <Marker
            key={transporter.id}
            position={[transporter.lat, transporter.lng]}
            icon={createTruckIcon()}
          >
            <Popup maxWidth={280}>
              <div className="p-3 flex flex-col gap-2.5 font-sans">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                  <img
                    src={transporter.avatar}
                    alt={transporter.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                  />
                  <div>
                    <div className="font-bold text-sm text-gray-900">{transporter.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600 text-[10px]" />
                      <span>{transporter.region}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600 bg-gray-50 p-2 rounded-xl">
                  <div className="flex items-center gap-1.5 font-medium">
                    <FontAwesomeIcon icon={faTruck} className="text-emerald-600 text-xs" />
                    <span>{transporter.truckType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <FontAwesomeIcon icon={faWeightHanging} className="text-emerald-600 text-xs" />
                    <span>{transporter.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <FontAwesomeIcon icon={faCoins} className="text-amber-500 text-xs" />
                    <span>{transporter.pricePerKm} F/km</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xs" />
                    <span>{transporter.rating}/5</span>
                  </div>
                </div>

                <div className="text-xs">
                  <div className="font-bold text-gray-700 mb-1">{t('usual_routes')}</div>
                  <div className="flex flex-col gap-1">
                    {transporter.routes.map((r, i) => (
                      <div key={i} className="flex items-center gap-1 text-gray-600 text-[11px]">
                        <FontAwesomeIcon icon={faRoute} className="text-emerald-600 text-[10px]" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-1.5">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-emerald-600" />
                    <span>{transporter.schedule}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faIdCard} className="text-gray-400" />
                    <span>{transporter.plateNumber}</span>
                  </span>
                </div>

                <button
                  className="mt-1 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  onClick={() => onSelect?.(transporter)}
                  id={`select-transporter-${transporter.id}`}
                >
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                  <span>{t('transporter_selected_btn')}</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* LEGEND - Uniquement les camions disponibles */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-md flex items-center gap-2 text-xs font-semibold text-gray-700">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>
          <strong className="text-emerald-700">{availableTransporters.length}</strong>{' '}
          {t('live_available_trucks')}
        </span>
      </div>
    </div>
  );
}

