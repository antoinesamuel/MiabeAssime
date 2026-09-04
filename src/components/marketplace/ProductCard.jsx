import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faCartShopping,
  faCommentDots,
  faStar,
  faCircleCheck,
  faCoins,
  faCircleXmark,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLang } from '../../context/LangContext';
import { farmers } from '../../data/mockData';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import LocationPickerMap from '../map/LocationPickerMap';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { placeOrder, updateProductStatus } = useApp();
  const { t, getProductName, getCategoryName } = useLang();
  const navigate = useNavigate();
  const [orderModal, setOrderModal] = useState(false);
  const [qty, setQty] = useState(50);
  const [address, setAddress] = useState('Marché de Bè, Lomé');

  const farmer = farmers.find((f) => f.id === product.farmerId);
  const displayName = getProductName(product);

  const isOutOfStock = product.status === 'out' || Number(product.quantity) <= 0;

  const handleOrder = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    if (isOutOfStock) return;
    placeOrder({
      merchantId: user.id,
      productId: product.id,
      farmerId: product.farmerId,
      quantity: Math.min(qty, product.quantity),
      totalPrice: Math.min(qty, product.quantity) * product.price,
      address,
    });
    setOrderModal(false);
    setQty(50);
    setAddress('');
  };

  const handleChat = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/chat?with=${product.farmerId}`);
  };

  return (
    <>
      <article
        className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
        id={`product-${product.id}`}
      >
        {/* IMAGE */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={displayName}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? 'grayscale-40 opacity-90' : ''
            }`}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80&fit=crop';
            }}
          />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <StatusBadge status={isOutOfStock ? 'out' : product.status} size="sm" />
            {product.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/95 backdrop-blur-xs text-emerald-800 px-2 py-0.5 rounded-full shadow-xs">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 text-[10px]" />
                <span>{t('auth_verified')}</span>
              </span>
            )}
          </div>
          <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-xs text-white">
            {getCategoryName(product.category)}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                {displayName}
              </h3>
              <div className="text-right whitespace-nowrap">
                <span className="text-base font-extrabold text-emerald-700">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 font-medium"> {t('product_per_kg')}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2.5 flex-wrap">
              <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600 text-xs shrink-0" />
              <span>{product.region}</span>
              <span className="text-gray-400">·</span>
              {isOutOfStock ? (
                <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {t('product_out_of_stock')}
                </span>
              ) : (
                <span className="font-semibold text-emerald-700">
                  {product.quantity.toLocaleString()} {t('product_qty_remaining')}
                </span>
              )}
            </div>

            {/* FARMER */}
            {farmer && (
              <div className="flex items-center gap-2.5 py-2 border-t border-gray-100">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-800 truncate">{farmer.name}</div>
                  <div className="flex items-center gap-1 text-amber-500 text-[11px]" title={`${product.rating}/5`}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={i < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}
                      />
                    ))}
                    <span className="text-gray-400 text-[10px] ml-1">
                      ({product.reviews} {t('product_reviews')})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
          </div>

          {/* ACTIONS */}
          <div className="pt-2 border-t border-gray-100">
            {user?.role === 'farmer' && user.id === product.farmerId ? (
              <div className="flex items-center gap-2">
                {[
                  { status: 'available', icon: faCircleCheck, label: 'Dispo', color: 'text-emerald-600' },
                  { status: 'paid', icon: faCoins, label: 'Payé', color: 'text-amber-600' },
                  { status: 'out', icon: faCircleXmark, label: 'Épuisé', color: 'text-rose-600' },
                ].map((s) => (
                  <button
                    key={s.status}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      (isOutOfStock && s.status === 'out') || (!isOutOfStock && product.status === s.status)
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => updateProductStatus(product.id, s.status)}
                  >
                    <FontAwesomeIcon icon={s.icon} className={s.color} />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <button
                    className="flex-1 py-2 px-3 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-not-allowed border border-gray-200 opacity-80"
                    disabled
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="text-xs text-rose-500" />
                    <span className="text-rose-600">{t('status_out')}</span>
                  </button>
                ) : (
                  <button
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    onClick={() => {
                      if (!user) {
                        navigate('/auth');
                      } else {
                        setQty(Math.min(50, Math.max(1, product.quantity)));
                        setOrderModal(true);
                      }
                    }}
                    id={`order-btn-${product.id}`}
                  >
                    <FontAwesomeIcon icon={faCartShopping} className="text-xs" />
                    <span>{t('btn_order')}</span>
                  </button>
                )}
                <button
                  className="py-2 px-3 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={handleChat}
                  id={`chat-btn-${product.id}`}
                  title={t('btn_chat')}
                >
                  <FontAwesomeIcon icon={faCommentDots} className="text-xs" />
                  <span>{t('btn_chat')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* ORDER MODAL */}
      <Modal
        isOpen={orderModal}
        onClose={() => setOrderModal(false)}
        title={`${t('btn_order')} · ${displayName}`}
        footer={
          <>
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setOrderModal(false)}
            >
              {t('btn_cancel')}
            </button>
            <button
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              onClick={handleOrder}
              id={`confirm-order-${product.id}`}
            >
              <FontAwesomeIcon icon={faCheck} className="text-xs" />
              <span>{t('confirm_order')}</span>
            </button>
          </>
        }
      >
        <form onSubmit={handleOrder} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <img
              src={product.image}
              alt={displayName}
              className="w-14 h-14 rounded-lg object-cover border border-emerald-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80&fit=crop';
              }}
            />
            <div>
              <div className="font-bold text-sm text-gray-800">{displayName}</div>
              <div className="text-xs font-semibold text-emerald-700">
                {product.price.toLocaleString()} {t('product_per_kg')}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600 text-[10px]" />
                <span>{product.region}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">{t('order_quantity')} (kg)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium"
              min={1}
              max={product.quantity}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              required
            />
          </div>

          <LocationPickerMap
            value={address}
            onChange={(loc) => setAddress(loc)}
            label={t('order_address')}
          />

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200 mt-2">
            <span className="text-xs font-semibold text-gray-600">{t('order_total')} :</span>
            <strong className="text-base font-extrabold text-emerald-700">
              {(qty * product.price).toLocaleString()} FCFA
            </strong>
          </div>
        </form>
      </Modal>
    </>
  );
}

