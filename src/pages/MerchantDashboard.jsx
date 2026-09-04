import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';
import { farmers, transporters } from '../data/mockData';
import Sidebar from '../components/layout/Sidebar';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import TransporterMap from '../components/map/TransporterMap';
import OrderRouteTracker from '../components/map/OrderRouteTracker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCartShopping,
  faComments,
  faBoxesStacked,
  faClock,
  faTruck,
  faCoins,
  faHouse,
  faSeedling,
  faMapLocationDot,
  faChartLine,
  faLocationDot,
  faCalendarDays,
  faTowerBroadcast,
  faStar,
  faCheck,
  faInbox,
} from '@fortawesome/free-solid-svg-icons';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const { getMerchantOrders, products, getProductById, assignTransporter } = useApp();
  const { t, getProductName } = useLang();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [mapModal, setMapModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!user || user.role !== 'merchant') {
    return (
      <div className="p-16 text-center text-red-600 font-semibold">
        {t('dash_access_denied_merchant')}
      </div>
    );
  }

  const myOrders   = getMerchantOrders(user.id);
  const totalSpent = myOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalPrice, 0);
  const pending    = myOrders.filter(o => o.status === 'pending').length;
  const transit    = myOrders.filter(o => o.status === 'transit').length;
  const delivered  = myOrders.filter(o => o.status === 'delivered').length;

  // Active tracked orders
  const trackedOrders = myOrders.filter(o => o.transporterId);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState(() => {
    const inTransit = myOrders.find(o => o.transporterId && o.status === 'transit');
    return inTransit ? inTransit.id : (trackedOrders[0]?.id || null);
  });

  const handleTrackOrder = (orderId) => {
    setSelectedTrackingOrderId(orderId);
    setActiveTab('transport');
  };

  const handleSelectTransporter = (transporter) => {
    if (selectedOrder) {
      assignTransporter(selectedOrder.id, transporter.id);
      setSelectedTrackingOrderId(selectedOrder.id);
      setSelectedOrder(null);
      setActiveTab('transport');
    }
    setMapModal(false);
  };

  const openTransporterMap = (order) => {
    setSelectedOrder(order);
    setMapModal(true);
  };

  const STAT_CARDS = [
    { icon: faBoxesStacked, label: t('stat_total_orders'), value: myOrders.length, borderTop: 'border-t-blue-500', iconColor: 'text-blue-500' },
    { icon: faClock, label: t('order_status_pending'), value: pending, borderTop: 'border-t-amber-500', iconColor: 'text-amber-500' },
    { icon: faTruck, label: t('order_status_transit'), value: transit, borderTop: 'border-t-purple-500', iconColor: 'text-purple-500' },
    { icon: faCoins, label: t('stat_total_spent'), value: totalSpent.toLocaleString(), borderTop: 'border-t-emerald-600', iconColor: 'text-emerald-600' },
  ];

  const availableFarmers = farmers.slice(0, 4);

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
          <span>{t('merchant_space')}</span>
        </div>

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {t('dash_greeting')}, {user.name.split(' ')[0]} ! 👋
            </h1>
            <p className="text-neutral-500 text-sm mt-1">{t('merchant_subtitle')}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition"
            >
              <FontAwesomeIcon icon={faCartShopping} />
              <span>{t('action_go_market')}</span>
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
            >
              <FontAwesomeIcon icon={faComments} />
              <span>{t('action_my_messages')}</span>
            </Link>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(s => (
            <div
              key={s.label}
              className={`bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-md transition relative overflow-hidden border-t-4 ${s.borderTop}`}
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

        {/* TABS */}
        <div className="flex bg-white rounded-full p-1 border border-neutral-200/90 shadow-xs w-fit flex-wrap gap-1">
          {[
            { key: 'overview',   icon: faHouse, label: t('tab_overview') },
            { key: 'orders',     icon: faBoxesStacked, label: t('merchant_orders') },
            { key: 'farmers',    icon: faSeedling, label: t('tab_suppliers') },
            { key: 'transport',  icon: faTruck, label: t('nav_transport') },
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
                onClick={() => setActiveTab(tab.key)}
                id={`merchant-tab-${tab.key}`}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ---- OVERVIEW TAB ---- */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent orders mini */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-800">{t('merchant_orders')}</h3>
                <button
                  type="button"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  onClick={() => setActiveTab('orders')}
                >
                  {t('action_see_all')}
                </button>
              </div>
              <div className="divide-y divide-neutral-100">
                {myOrders.slice(0, 3).map(order => {
                  const product = getProductById(order.productId);
                  return (
                    <div key={order.id} className="flex items-center gap-3 py-3">
                      {product && (
                        <img
                          src={product.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-neutral-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-neutral-800 truncate">
                          {getProductName(product) || 'Produit'}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {order.quantity} kg · {order.totalPrice.toLocaleString()} FCFA
                        </div>
                      </div>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-800">{t('table_actions')}</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: faCartShopping, label: t('action_browse_market'), to: '/marketplace' },
                  { icon: faComments, label: t('action_chat_farmer'), to: '/chat' },
                  { icon: faMapLocationDot, label: t('action_find_transporter'), to: '/transport' },
                  { icon: faChartLine, label: t('action_view_trends'), to: '/tendances' },
                ].map(a => (
                  <Link
                    key={a.label}
                    to={a.to}
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-emerald-50/50 hover:border-emerald-300 text-neutral-700 hover:text-emerald-700 text-sm font-medium transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                      <FontAwesomeIcon icon={a.icon} />
                    </div>
                    <span className="font-semibold">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- ORDERS TAB ---- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
            {myOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-2xl text-neutral-400">
                  <FontAwesomeIcon icon={faInbox} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">{t('empty_orders')}</h3>
                <Link to="/marketplace" className="btn btn-primary mt-2">
                  <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
                  {t('action_go_market')}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {myOrders.map(order => {
                  const product = getProductById(order.productId);
                  return (
                    <div
                      key={order.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 md:p-5 hover:bg-emerald-50/30 transition"
                    >
                      <div className="flex items-center gap-3">
                        {product && (
                          <img
                            src={product.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-neutral-200"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-neutral-900 truncate">
                            {getProductName(product) || 'Produit'}
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                            <FontAwesomeIcon icon={faLocationDot} className="text-neutral-400 text-3xs" />
                            <span className="truncate">{order.address}</span>
                          </div>
                          <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-3xs" />
                            <span>{order.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col text-sm">
                        <div className="text-neutral-600 font-medium">{order.quantity.toLocaleString()} kg</div>
                        <div className="font-bold text-emerald-600 text-sm">
                          {order.totalPrice.toLocaleString()} FCFA
                        </div>
                      </div>

                      <div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="flex gap-2 flex-wrap items-center md:justify-end">
                        {order.status === 'pending' && !order.transporterId && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs font-bold transition cursor-pointer"
                            onClick={() => openTransporterMap(order)}
                          >
                            <FontAwesomeIcon icon={faTruck} />
                            <span>{t('action_assign_transporter')}</span>
                          </button>
                        )}
                        {order.transporterId && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-xs transition cursor-pointer"
                            onClick={() => handleTrackOrder(order.id)}
                            id={`track-order-${order.id}`}
                          >
                            <FontAwesomeIcon icon={faTowerBroadcast} />
                            <span>{t('action_track_shipment')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---- FARMERS TAB ---- */}
        {activeTab === 'farmers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {availableFarmers.map(farmer => (
              <div
                key={farmer.id}
                className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col gap-3 items-center text-center hover:shadow-md hover:border-emerald-300 transition"
              >
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30 p-0.5 shadow-2xs"
                />
                <div className="flex flex-col gap-1 w-full">
                  <div className="font-bold text-base text-neutral-900">{farmer.name}</div>
                  <div className="text-xs text-neutral-500 flex items-center justify-center gap-1">
                    <FontAwesomeIcon icon={faLocationDot} className="text-neutral-400" />
                    <span>{farmer.region}</span>
                  </div>
                  <div className="text-xs text-amber-500 font-semibold flex items-center justify-center gap-1">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{farmer.rating} ({farmer.reviews} {t('product_reviews')})</span>
                  </div>
                  {farmer.verified && (
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-3xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <FontAwesomeIcon icon={faCheck} />
                        <span>{t('verified_badge')}</span>
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
                    {farmer.bio}
                  </p>
                </div>
                <div className="flex gap-2 w-full mt-2">
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                    onClick={() => navigate(`/chat?with=${farmer.id}`)}
                  >
                    <FontAwesomeIcon icon={faComments} />
                    <span>{t('btn_chat')}</span>
                  </button>
                  <Link
                    to={`/marketplace?farmer=${farmer.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>{t('action_view_products')}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- TRANSPORT TAB (SUIVI DES TRAJETS & ÉVOLUTION DU TRANSPORTEUR) ---- */}
        {activeTab === 'transport' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 flex justify-between items-center flex-wrap gap-4 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} className="text-emerald-600" />
                  <span>{t('tracker_title')}</span>
                </h2>
                <p className="text-sm text-neutral-500 mt-0.5">{t('tracker_subtitle')}</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs md:text-sm font-bold transition cursor-pointer"
                onClick={() => setMapModal(true)}
              >
                <FontAwesomeIcon icon={faMapLocationDot} />
                <span>{t('action_assign_another')}</span>
              </button>
            </div>

            {/* EXPEDITIONS SELECTOR */}
            {trackedOrders.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {t('active_deliveries')}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {trackedOrders.map(o => {
                    const prod = getProductById(o.productId);
                    const isSelected = String(selectedTrackingOrderId) === String(o.id);
                    const isTransit = o.status === 'transit';
                    return (
                      <button
                        key={o.id}
                        type="button"
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-emerald-50/50 hover:border-emerald-300'
                        }`}
                        onClick={() => setSelectedTrackingOrderId(o.id)}
                      >
                        <span className={`w-2 h-2 rounded-full ${isTransit ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                        <span>{t('tracker_order_num')}{o.id}</span>
                        <strong className="text-neutral-900">{getProductName(prod) || 'Produit'}</strong>
                        <span
                          className={`text-3xs font-extrabold px-1.5 py-0.5 rounded-full ${
                            isTransit ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isTransit ? t('order_status_transit') : t('order_status_delivered')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LIVE ROUTE TRACKER COMPONENT */}
            {(() => {
              const currentOrder = myOrders.find(o => String(o.id) === String(selectedTrackingOrderId)) || trackedOrders[0];
              if (currentOrder && currentOrder.transporterId) {
                const prod = getProductById(currentOrder.productId);
                const tr = transporters.find(t => String(t.id) === String(currentOrder.transporterId));
                return (
                  <OrderRouteTracker
                    order={currentOrder}
                    product={prod}
                    transporter={tr}
                  />
                );
              }
              return (
                <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center flex flex-col items-center gap-3 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-2xl text-emerald-600">
                    <FontAwesomeIcon icon={faTruck} />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-800">{t('no_active_trips')}</h3>
                  <p className="max-w-md text-sm text-neutral-500">{t('no_active_trips_sub')}</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm transition text-sm cursor-pointer mt-2"
                    onClick={() => setMapModal(true)}
                  >
                    <FontAwesomeIcon icon={faMapLocationDot} />
                    <span>{t('choose_driver_on_map')}</span>
                  </button>
                </div>
              );
            })()}

            {/* FLOTTE DISPONIBLE EN DIRECT */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 md:p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} className="text-emerald-600" />
                  <span>{t('transporters_available_fleet')}</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{t('transporters_fleet_sub')}</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-inner">
                <TransporterMap onSelect={handleSelectTransporter} />
              </div>
            </div>
          </div>
        )}

        {/* TRANSPORTER MAP MODAL */}
        <Modal
          isOpen={mapModal}
          onClose={() => { setMapModal(false); setSelectedOrder(null); }}
          title={t('select_transporter_modal')}
          size="xl"
        >
          <TransporterMap onSelect={handleSelectTransporter} />
        </Modal>
      </main>
    </div>
  );
}
