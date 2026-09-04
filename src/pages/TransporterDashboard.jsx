import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';
import Sidebar from '../components/layout/Sidebar';
import StatusBadge from '../components/ui/StatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTruck,
  faMapLocationDot,
  faCoins,
  faCircleCheck,
  faCircleXmark,
  faLocationDot,
  faFlagCheckered,
  faBoxesStacked,
  faRoute,
  faCheck,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

export default function TransporterDashboard() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, getProductById } = useApp();
  const { t, getProductName } = useLang();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [available, setAvailable] = useState(true);

  if (!user || user.role !== 'transporter') {
    return (
      <div className="p-16 text-center text-red-600 font-semibold">
        {t('dash_access_denied_transporter')}
      </div>
    );
  }

  const myMissions = orders.filter(o => o.transporterId === user.id);
  const currentMissions = myMissions.filter(o => o.status === 'transit');
  const completedMissions = myMissions.filter(o => o.status === 'delivered');

  const totalEarnings = completedMissions.reduce((s, o) => s + (o.totalPrice * 0.15), 0); // 15% cut

  const STAT_CARDS = [
    { icon: faTruck, label: t('stat_completed_missions'), value: completedMissions.length, borderTop: 'border-t-blue-500', iconColor: 'text-blue-500' },
    { icon: faMapLocationDot, label: t('stat_in_progress'), value: currentMissions.length, borderTop: 'border-t-amber-500', iconColor: 'text-amber-500' },
    { icon: faCoins, label: t('stat_total_earnings'), value: totalEarnings.toLocaleString() + ' FCFA', borderTop: 'border-t-emerald-600', iconColor: 'text-emerald-600' },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50/70">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 p-4 md:p-7 pt-20 md:pt-24 flex flex-col gap-6 min-w-0">
        {/* MOBILE HEADER */}
        <div className="flex md:hidden items-center gap-3 pb-3 border-b border-neutral-200 font-bold text-base text-neutral-800">
          <button
            type="button"
            className="text-xl p-1 text-neutral-700 hover:text-emerald-600"
            onClick={() => setSidebarOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <span>{t('transporter_space')}</span>
        </div>

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 flex-wrap bg-white p-5 md:p-6 rounded-2xl border border-neutral-200 shadow-xs">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {t('dash_greeting')}, {user.name.split(' ')[0]} ! 👋
            </h1>
            <p className="text-neutral-500 text-sm mt-1">{t('transporter_subtitle')}</p>
          </div>
          <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-700">{t('service_availability')}</span>
            <button
              type="button"
              className={`w-12 h-6 rounded-full border-none cursor-pointer relative transition-colors ${
                available ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
              onClick={() => setAvailable(!available)}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-xs ${
                  available ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs font-bold flex items-center gap-1.5 min-w-[85px]">
              <FontAwesomeIcon
                icon={available ? faCircleCheck : faCircleXmark}
                className={available ? 'text-emerald-600' : 'text-neutral-400'}
              />
              <span className={available ? 'text-emerald-700' : 'text-neutral-500'}>
                {available ? t('in_service') : t('out_of_service')}
              </span>
            </span>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STAT_CARDS.map(s => (
            <div
              key={s.label}
              className={`bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-md transition border-t-4 ${s.borderTop}`}
            >
              <div className={`text-xl ${s.iconColor}`}>
                <FontAwesomeIcon icon={s.icon} />
              </div>
              <div className="text-2xl lg:text-3xl font-black text-neutral-900 leading-tight">
                {s.value}
              </div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CURRENT MISSIONS */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faRoute} className="text-emerald-600" />
              <span>{t('tab_missions_current')}</span>
            </h3>
            <span className="text-xs font-semibold text-neutral-400">
              {currentMissions.length} {t('order_status_transit')}
            </span>
          </div>

          {currentMissions.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm bg-neutral-50 rounded-xl border border-neutral-100">
              <FontAwesomeIcon icon={faTruck} className="text-2xl text-neutral-300 mb-2 block" />
              {t('empty_missions')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMissions.map(mission => {
                const product = getProductById(mission.productId);
                return (
                  <div
                    key={mission.id}
                    className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-200/70 flex flex-col gap-3 shadow-xs hover:border-emerald-300 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-neutral-700">
                        {t('tracker_order_num')}{mission.id}
                      </span>
                      <StatusBadge status={mission.status} size="sm" />
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-emerald-100">
                      <div className="text-xs font-semibold text-neutral-800 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600 w-3.5" />
                        <span>{t('table_pickup')} : <strong className="text-neutral-900">{product?.region || 'Inconnu'}</strong></span>
                      </div>
                      <div className="ml-1.5 border-l-2 border-dashed border-neutral-200 h-3" />
                      <div className="text-xs font-semibold text-neutral-800 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFlagCheckered} className="text-blue-600 w-3.5" />
                        <span>{t('table_delivery')} : <strong className="text-neutral-900">{mission.address}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-emerald-800 px-1">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faBoxesStacked} className="text-emerald-600" />
                        {mission.quantity} kg ({getProductName(product)})
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <FontAwesomeIcon icon={faCoins} className="text-amber-500" />
                        {(mission.totalPrice * 0.15).toLocaleString()} FCFA
                      </span>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm transition cursor-pointer"
                      onClick={() => updateOrderStatus(mission.id, 'delivered')}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      <span>{t('action_mark_delivered')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PENDING MISSIONS (ASSIGNED) */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-amber-500" />
              <span>{t('tab_missions_assigned')}</span>
            </h3>
          </div>

          {myMissions.filter(o => o.status === 'pending').length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm bg-neutral-50 rounded-xl border border-neutral-100">
              <FontAwesomeIcon icon={faClock} className="text-2xl text-neutral-300 mb-2 block" />
              {t('empty_missions')}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {myMissions.filter(o => o.status === 'pending').map(mission => {
                const product = getProductById(mission.productId);
                return (
                  <div
                    key={mission.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-3.5 hover:bg-emerald-50/30 px-2 rounded-xl transition"
                  >
                    <div>
                      <div className="font-bold text-sm text-neutral-800">#{mission.id}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{mission.createdAt}</div>
                    </div>
                    <div className="text-xs text-neutral-600 flex flex-col gap-1">
                      <div><strong className="text-neutral-700">{t('table_pickup')}:</strong> {product?.region}</div>
                      <div><strong className="text-neutral-700">{t('table_delivery')}:</strong> {mission.address}</div>
                    </div>
                    <div className="text-xs font-semibold text-neutral-700">
                      <div>{mission.quantity} kg</div>
                      <div className="text-neutral-500">{getProductName(product)}</div>
                    </div>
                    <div className="flex md:justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs font-bold transition cursor-pointer"
                        onClick={() => updateOrderStatus(mission.id, 'transit')}
                      >
                        <FontAwesomeIcon icon={faTruck} />
                        <span>{t('action_start_trip')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
