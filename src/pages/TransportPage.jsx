import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faMagnifyingGlass,
  faMapLocationDot,
  faListCheck,
  faLocationDot,
  faStar,
  faCommentDots,
  faCheck,
  faCircleCheck,
  faCalendarDay,
  faBox,
  faWeightHanging,
  faCoins,
  faIdCard,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { transporters, REGIONS } from '../data/mockData';
import Navbar from '../components/layout/Navbar';
import TransporterMap from '../components/map/TransporterMap';
import LocationPickerMap from '../components/map/LocationPickerMap';
import Modal from '../components/ui/Modal';

const TRUCK_TYPES = ['Tous', 'Camion 5T', 'Camion 10T', 'Camionnette 2T', 'Pick-up Réfrigéré'];

export default function TransportPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'map', 'grid'

  // Booking modal
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    pickup: 'Kpalimé',
    destination: 'Marché de Bè, Lomé',
    cargo: '1500 kg de maïs blanc',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredTransporters = useMemo(() => {
    return transporters.filter((tr) => {
      const matchSearch =
        tr.name.toLowerCase().includes(search.toLowerCase()) ||
        tr.truckType.toLowerCase().includes(search.toLowerCase()) ||
        tr.routes.some((r) => r.toLowerCase().includes(search.toLowerCase()));

      const matchRegion = !selectedRegion || tr.region === selectedRegion;
      const matchType =
        selectedType === 'Tous' || tr.truckType.includes(selectedType.replace('Tous', ''));
      const matchAvailable = !onlyAvailable || tr.available;

      return matchSearch && matchRegion && matchType && matchAvailable;
    });
  }, [search, selectedRegion, selectedType, onlyAvailable]);

  const handleSelectTransporter = (transporter) => {
    setSelectedTransporter(transporter);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedTransporter(null);
      setBookingSuccess(false);
    }, 2200);
  };

  const handleChat = (transporterId) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/chat?with=${transporterId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fdf9]">
      <Navbar />

      {/* HEADER */}
      <section className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-emerald-200 border border-white/20 mb-3">
              <FontAwesomeIcon icon={faTruck} />
              <span>{t('transport_hero_badge')}</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t('transport_hero_title')}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base mt-2 leading-relaxed">
              {t('transport_hero_sub')}
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <strong className="text-base text-emerald-300 font-extrabold mr-1">
                {transporters.filter((t) => t.available).length}
              </strong>{' '}
              {t('transport_trucks_avail')}
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <strong className="text-base text-emerald-300 font-extrabold mr-1">5</strong>{' '}
              {t('transport_regions_cov')}
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
              <strong className="text-base text-emerald-300 font-extrabold mr-1">200 à 500</strong>{' '}
              FCFA / km
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16 flex flex-col gap-8">
        {/* TOOLBAR & FILTERS */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder={t('transport_search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="transporter-search"
              />
            </div>

            <div className="flex items-center bg-gray-100/90 rounded-full p-1 border border-gray-200 shrink-0">
              <button
                type="button"
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  viewMode === 'both'
                    ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
                onClick={() => setViewMode('both')}
              >
                {t('transport_view_both')}
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
                onClick={() => setViewMode('map')}
              >
                <FontAwesomeIcon icon={faMapLocationDot} />
                <span>{t('transport_view_map')}</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <FontAwesomeIcon icon={faListCheck} />
                <span>{t('transport_view_grid')}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <label>{t('filter_region')} :</label>
              <select
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-emerald-600"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">{t('all_regions')}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label>{t('transport_truck_type')} :</label>
              <select
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-emerald-600"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {TRUCK_TYPES.map((tType) => (
                  <option key={tType} value={tType}>
                    {tType === 'Tous' ? t('all_truck_types') : tType}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <input
                type="checkbox"
                className="accent-emerald-600 rounded"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              <span>{t('transport_only_avail')}</span>
            </label>
          </div>
        </div>

        {/* MAP SECTION */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <section className="bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t('transport_interactive_map')}</h2>
                <p className="text-xs text-gray-500">{t('transport_interactive_sub')}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{t('transport_legend_available')}</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span>{t('transport_legend_busy')}</span>
                </span>
              </div>
            </div>
            <TransporterMap onSelect={handleSelectTransporter} />
          </section>
        )}

        {/* TRANSPORTERS GRID */}
        {(viewMode === 'both' || viewMode === 'grid') && (
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('transport_fleet_title')} ({filteredTransporters.length})
              </h2>
              <p className="text-xs text-gray-500">{t('transport_fleet_sub')}</p>
            </div>

            {filteredTransporters.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-emerald-100 shadow-xs flex flex-col items-center justify-center p-8">
                <span className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-4">
                  <FontAwesomeIcon icon={faTruck} />
                </span>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{t('transport_no_found')}</h3>
                <p className="text-xs text-gray-500 max-w-sm">{t('transport_no_found_sub')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTransporters.map((tr) => (
                  <div
                    key={tr.id}
                    className="bg-white rounded-3xl border border-emerald-100/80 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        <img
                          src={tr.avatar}
                          alt={tr.name}
                          className="w-12 h-12 rounded-full object-cover border border-emerald-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-gray-900 text-sm truncate">{tr.name}</h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                tr.available
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              {tr.available ? t('status_available') : t('transport_status_busy')}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600 text-[10px]" />
                            <span>{tr.region}</span>
                            <span>·</span>
                            <span>{tr.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                            <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                            <span className="font-bold text-gray-800">{tr.rating}</span>
                            <span className="text-gray-400 text-[10px]">
                              ({tr.reviews} {t('product_reviews')})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 bg-gray-50/70 p-3 rounded-2xl text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 block">{t('truck_vehicle')}</span>
                          <strong className="font-bold text-gray-800">{tr.truckType}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block">{t('truck_capacity')}</span>
                          <strong className="font-bold text-gray-800">{tr.capacity}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block">{t('truck_rate')}</span>
                          <strong className="font-extrabold text-emerald-700">
                            {tr.pricePerKm} FCFA/km
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block">{t('truck_plate')}</span>
                          <strong className="font-bold text-gray-600">{tr.plateNumber}</strong>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-gray-500 block mb-1.5 uppercase">
                          {t('usual_routes')}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tr.routes.map((route, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100"
                            >
                              {route}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        className="py-2 px-3 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all flex items-center gap-1.5"
                        onClick={() => handleChat(tr.id)}
                      >
                        <FontAwesomeIcon icon={faCommentDots} />
                        <span>{t('btn_chat')}</span>
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                        disabled={!tr.available}
                        onClick={() => handleSelectTransporter(tr)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                        <span>{t('transport_book_btn')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* BOOKING MODAL */}
      <Modal
        isOpen={!!selectedTransporter}
        onClose={() => setSelectedTransporter(null)}
        title={
          selectedTransporter
            ? `${t('transport_modal_title')} · ${selectedTransporter.name}`
            : ''
        }
        size="md"
        footer={
          !bookingSuccess && (
            <>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedTransporter(null)}
              >
                {t('btn_cancel')}
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                onClick={handleBookingSubmit}
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>{t('transport_confirm_btn')}</span>
              </button>
            </>
          )
        }
      >
        {selectedTransporter && (
          <div>
            {bookingSuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t('transport_booking_sent_title')}
                </h3>
                <p className="text-xs text-gray-600 max-w-sm">
                  <strong>{selectedTransporter.name}</strong> {t('transport_booking_sent_desc')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <img
                    src={selectedTransporter.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border border-emerald-200"
                  />
                  <div>
                    <div className="font-bold text-sm text-gray-900">
                      {selectedTransporter.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedTransporter.truckType} · {t('truck_capacity')}{' '}
                      {selectedTransporter.capacity}
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                      {t('truck_rate')} :{' '}
                      <strong>{selectedTransporter.pricePerKm} FCFA / km</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">{t('transport_pickup')}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 text-xs font-medium"
                    value={bookingForm.pickup}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, pickup: e.target.value })
                    }
                    required
                  />
                </div>

                <LocationPickerMap
                  value={bookingForm.destination}
                  onChange={(loc) =>
                    setBookingForm({ ...bookingForm, destination: loc })
                  }
                  label={t('transport_destination')}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">{t('transport_cargo')}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 text-xs font-medium"
                    value={bookingForm.cargo}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, cargo: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">{t('transport_date')}</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 text-xs font-medium bg-white"
                    value={bookingForm.date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{t('transport_est_distance')} (Kpalimé → Lomé) :</span>
                    <strong>120 km</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                    <span className="font-semibold text-gray-700">{t('transport_est_cost')}</span>
                    <strong className="text-base font-extrabold text-emerald-700">
                      {(120 * selectedTransporter.pricePerKm).toLocaleString()} FCFA
                    </strong>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

