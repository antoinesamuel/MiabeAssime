import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSeedling,
  faFlagCheckered,
  faTruckFast,
  faCheck,
  faTowerBroadcast,
  faPhone,
  faCommentDots,
  faTruck,
  faGaugeHigh,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../../context/LangContext';

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createOriginIcon = () =>
  L.divIcon({
    html: `<div class="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 shadow-md flex items-center justify-center text-emerald-700">
      <svg class="w-4 h-4 fill-emerald-600" viewBox="0 0 512 512">
        <path d="M512 64c0 114.9-93.1 208-208 208c-1.9 0-3.7-.1-5.6-.2c2.9 14.9 4.6 30.3 4.6 46.2c0 82.5-53.9 152.4-128 177.1L175 496c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16l.1-34.9C35.9 437 0 382.7 0 320c0-114.9 93.1-208 208-208c1.9 0 3.7 .1 5.6 .2C210.7 97.3 209 81.9 209 66c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16l-.1 34.9C356.1 125 392 179.3 392 242c0 23.9-4.2 46.8-12 68.1C444.6 287.4 490.7 230 507.2 160H432c-8.8 0-16-7.2-16-16s7.2-16 16-16h80z"/>
      </svg>
    </div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

const createDestIcon = () =>
  L.divIcon({
    html: `<div class="w-9 h-9 rounded-full bg-white border-2 border-amber-500 shadow-md flex items-center justify-center text-amber-600">
      <svg class="w-4 h-4 fill-amber-500" viewBox="0 0 448 512">
        <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32L0 64 0 368 0 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 196.3 0c20.4 0 39.9-9.7 52.1-26.1l30.6-40.8c5.7-7.6 14.7-12.1 24.3-12.1l76.7 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32l-108.7 0c-20.4 0-39.9 9.7-52.1 26.1l-30.6 40.8c-5.7 7.6-14.7 12.1-24.3 12.1L64 96l0-64z"/>
      </svg>
    </div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

const createMovingTruckIcon = () =>
  L.divIcon({
    html: `<div class="relative flex items-center justify-center w-11 h-11">
      <div class="absolute w-11 h-11 rounded-full bg-emerald-500/30 animate-ping"></div>
      <div class="w-9 h-9 rounded-full bg-white border-2 border-emerald-600 shadow-lg flex items-center justify-center relative z-10">
        <svg class="w-4 h-4 fill-emerald-600" viewBox="0 0 640 512">
          <path d="M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L512 205.3 512 256l-96 0 0-96zM160 384a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm368 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"/>
        </svg>
      </div>
    </div>`,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });

// City coordinates dictionary
const CITY_COORDS = {
  Kpalimé: [6.9042, 0.6312],
  Atakpamé: [7.5284, 1.1302],
  Sokodé: [8.9833, 1.1333],
  Kara: [9.5511, 1.1906],
  Dapaong: [10.8631, 0.2078],
  Lomé: [6.1315, 1.2389],
  'Marché de Bè, Lomé': [6.1315, 1.2389],
  'Dépôt Central, Lomé': [6.1721, 1.2213],
  Tsévié: [6.4258, 1.2133],
};

function MapAutoFitter({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
      map.invalidateSize();
    }
  }, [points, map]);
  return null;
}

export default function OrderRouteTracker({ order, product, transporter }) {
  const navigate = useNavigate();
  const { t, getProductName } = useLang();
  const [progressPercent, setProgressPercent] = useState(68);

  // Calculate coordinates
  const originCoord = CITY_COORDS[product?.region] || [7.5284, 1.1302];
  const destCoord = CITY_COORDS[order?.address] || [6.1315, 1.2389];

  const routeWaypoints = [
    originCoord,
    [originCoord[0] * 0.7 + destCoord[0] * 0.3, originCoord[1] * 0.7 + destCoord[1] * 0.3 + 0.05],
    [originCoord[0] * 0.3 + destCoord[0] * 0.7, originCoord[1] * 0.3 + destCoord[1] * 0.7],
    destCoord,
  ];

  const currentTruckPos = [
    originCoord[0] + (destCoord[0] - originCoord[0]) * (progressPercent / 100),
    originCoord[1] + (destCoord[1] - originCoord[1]) * (progressPercent / 100),
  ];

  useEffect(() => {
    if (order.status !== 'transit') return;
    const interval = setInterval(() => {
      setProgressPercent((prev) => (prev < 95 ? prev + 0.3 : 65));
    }, 2500);
    return () => clearInterval(interval);
  }, [order.status]);

  const isDelivered = order.status === 'delivered';
  const isTransit = order.status === 'transit';
  const productName = getProductName(product) || 'Produit';

  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-sm">
      {/* TOP SUMMARY BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
        <div>
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
            {t('tracker_order_num')}{order.id} · {productName}
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mt-0.5">
            <span>{product?.region || 'Ferme'}</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-emerald-600 text-sm" />
            <span>{order.address}</span>
          </h3>
          <div className="text-xs text-gray-600 mt-1">
            {t('tracker_weight')} <strong className="text-gray-900">{order.quantity} kg</strong> ·{' '}
            {t('tracker_total')}{' '}
            <strong className="text-emerald-700">{order.totalPrice?.toLocaleString()} FCFA</strong>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 font-medium">{t('tracker_eta_label')}</span>
          <div className="text-base font-extrabold text-emerald-700">
            {isDelivered
              ? t('tracker_delivered_status')
              : isTransit
              ? t('tracker_in_transit_time')
              : t('tracker_waiting_status')}
          </div>
          <span className="text-xs text-gray-500 flex items-center justify-end gap-1 mt-0.5">
            <FontAwesomeIcon icon={faGaugeHigh} className="text-emerald-600 text-[10px]" />
            <span>
              {isTransit
                ? `${t('tracker_speed')} : 62 km/h`
                : `${t('table_status')} : ${
                    t('order_status_' + order.status) || order.status
                  }`}
            </span>
          </span>
        </div>
      </div>

      {/* PROGRESS STEPPER */}
      <div className="relative pt-4 pb-2 px-2">
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: isDelivered ? '100%' : `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs mb-1">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <span className="text-xs font-bold text-gray-800">{t('tracker_step1')}</span>
            <span className="text-[11px] text-gray-500">{t('tracker_step1_desc')}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs mb-1">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <span className="text-xs font-bold text-gray-800">{t('tracker_step2')}</span>
            <span className="text-[11px] text-gray-500">{product?.region}</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs mb-1 ${
                isDelivered
                  ? 'bg-emerald-600 text-white'
                  : isTransit
                  ? 'bg-emerald-500 text-white animate-bounce'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <FontAwesomeIcon icon={isDelivered ? faCheck : faTruckFast} />
            </div>
            <span className="text-xs font-bold text-gray-800">{t('tracker_step3')}</span>
            <span className="text-[11px] text-gray-500">
              {isDelivered
                ? t('tracker_completed_trip')
                : `${Math.round(progressPercent)}% ${t('tracker_traveled')}`}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs mb-1 ${
                isDelivered ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <FontAwesomeIcon icon={isDelivered ? faCheck : faFlagCheckered} />
            </div>
            <span className="text-xs font-bold text-gray-800">{t('tracker_step4')}</span>
            <span className="text-[11px] text-gray-500 truncate max-w-[120px]">{order.address}</span>
          </div>
        </div>
      </div>

      {/* MAP VIEW */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200">
        <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-2 text-xs font-bold text-gray-700">
          <FontAwesomeIcon icon={faTowerBroadcast} className="text-emerald-600 animate-pulse" />
          <span>{t('tracker_live_gps')}</span>
        </div>

        <div className="w-full h-80">
          <MapContainer
            center={currentTruckPos}
            zoom={8}
            className="w-full h-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />

            <MapAutoFitter points={[originCoord, destCoord, currentTruckPos]} />

            {/* Route line */}
            <Polyline
              positions={routeWaypoints}
              color="#16a34a"
              weight={5}
              opacity={0.8}
              dashArray="8, 8"
            />

            {/* Origin Marker */}
            <Marker position={originCoord} icon={createOriginIcon()}>
              <Popup>
                <div className="font-sans text-xs">
                  <div className="font-bold flex items-center gap-1 text-emerald-700">
                    <FontAwesomeIcon icon={faSeedling} />
                    <span>{t('tracker_farm_origin')}</span>
                  </div>
                  <p>{t('filter_region')} : {product?.region}</p>
                </div>
              </Popup>
            </Marker>

            {/* Destination Marker */}
            <Marker position={destCoord} icon={createDestIcon()}>
              <Popup>
                <div className="font-sans text-xs">
                  <div className="font-bold flex items-center gap-1 text-amber-600">
                    <FontAwesomeIcon icon={faFlagCheckered} />
                    <span>{t('tracker_market_dest')}</span>
                  </div>
                  <p>{order.address}</p>
                </div>
              </Popup>
            </Marker>

            {/* Moving Truck Marker */}
            <Marker position={currentTruckPos} icon={createMovingTruckIcon()}>
              <Popup>
                <div className="font-sans text-xs flex flex-col gap-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-700">
                    <FontAwesomeIcon icon={faTruck} />
                    <span>{transporter?.name || t('transporters_fleet_sub')}</span>
                  </div>
                  <p>{t('tracker_vehicle_label')} {transporter?.truckType} ({transporter?.plateNumber})</p>
                  <p>{t('tracker_cargo_label')} {order.quantity} kg ({productName})</p>
                  <p>{t('tracker_progress_label')} {Math.round(progressPercent)}%</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* DRIVER CONTACT & TELEMATICS FOOTER */}
      {transporter && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={transporter.avatar}
              alt={transporter.name}
              className="w-11 h-11 rounded-full object-cover border border-emerald-200"
            />
            <div>
              <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span>{transporter.name}</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {t('tracker_driver_assigned')}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} className="text-emerald-600 text-[10px]" />
                <span>{transporter.truckType}</span>
                <span>·</span>
                <span>{t('truck_plate')} : <strong>{transporter.plateNumber}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all flex items-center gap-1.5"
              onClick={() => navigate(`/chat?with=${transporter.id}`)}
            >
              <FontAwesomeIcon icon={faCommentDots} className="text-xs" />
              <span>{t('tracker_btn_chat')}</span>
            </button>
            <a
              href={`tel:${transporter.phone}`}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              <span>{t('tracker_btn_call')}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

