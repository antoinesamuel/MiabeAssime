import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faPlus,
  faSeedling,
  faBoxesStacked,
  faCircleCheck,
  faCoins,
  faCircleXmark,
  faPen,
  faTrashCan,
  faBox,
  faLocationDot,
  faCalendarDay,
  faInbox,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';
import { REGIONS, CATEGORIES } from '../data/mockData';
import Sidebar from '../components/layout/Sidebar';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';

const EMPTY_PRODUCT = {
  name: '',
  category: CATEGORIES[0],
  region: REGIONS[0],
  price: '',
  quantity: '',
  description: '',
  image: '',
  status: 'available',
};

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1601593346740-925612772716?w=600&q=80&fit=crop', // Maïs
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80&fit=crop', // Riz
  'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80&fit=crop', // Soja
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80&fit=crop', // Manioc
  'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&q=80&fit=crop', // Igname
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80&fit=crop', // Tomates
];

export default function FarmerDashboard() {
  const { user } = useAuth();
  const {
    getFarmerProducts,
    getFarmerOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
  } = useApp();
  const { t, getProductName, getCategoryName } = useLang();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [activeTab, setActiveTab] = useState('products');

  if (!user || user.role !== 'farmer')
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-gray-500 font-semibold">
        {t('dash_access_denied_farmer')}
      </div>
    );

  const myProducts = getFarmerProducts(user.id);
  const myOrders = getFarmerOrders(user.id);

  const totalRevenue = myOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addProduct({
      ...form,
      farmerId: user.id,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
    setForm(EMPTY_PRODUCT);
    setAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProduct(editModal.id, {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
    setEditModal(null);
    setForm(EMPTY_PRODUCT);
  };

  const openEdit = (product) => {
    setForm(product);
    setEditModal(product);
  };

  const statusCount = (s) =>
    myProducts.filter((p) =>
      s === 'available'
        ? p.status === 'available' && Number(p.quantity) > 0
        : s === 'out'
        ? p.status === 'out' || Number(p.quantity) <= 0
        : p.status === s
    ).length;

  const STAT_CARDS = [
    {
      icon: faSeedling,
      label: t('stat_online_products'),
      value: statusCount('available'),
      bg: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: faBoxesStacked,
      label: t('stat_orders_received'),
      value: myOrders.length,
      bg: 'bg-blue-50 text-blue-700',
    },
    {
      icon: faCircleCheck,
      label: t('stat_available'),
      value: statusCount('available'),
      bg: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: faCoins,
      label: t('stat_total_earnings'),
      value: `${totalRevenue.toLocaleString()} F`,
      bg: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fdf9]">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100 shadow-xs">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <span className="font-bold text-gray-900 text-sm">{t('farmer_space')}</span>
          <div className="w-9" />
        </div>

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {t('dash_greeting')}, {user.name.split(' ')[0]} !
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('farmer_subtitle')}</p>
          </div>
          <button
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            onClick={() => {
              setForm(EMPTY_PRODUCT);
              setAddModal(true);
            }}
            id="add-product-btn"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>{t('farmer_add')}</span>
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-xs flex flex-col gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${s.bg}`}>
                <FontAwesomeIcon icon={s.icon} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-2xl w-fit border border-gray-200">
          {[
            { key: 'products', label: t('tab_my_products'), icon: faSeedling },
            { key: 'orders', label: t('tab_received_orders'), icon: faBoxesStacked },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-gray-600 hover:text-emerald-700'
              }`}
              onClick={() => setActiveTab(tab.key)}
              id={`tab-${tab.key}`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs">
            {myProducts.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-3">
                  <FontAwesomeIcon icon={faSeedling} />
                </span>
                <h3 className="text-base font-bold text-gray-800 mb-1">{t('empty_products')}</h3>
                <p className="text-xs text-gray-500 max-w-sm mb-4">{t('add_first_product_hint')}</p>
                <button
                  className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold"
                  onClick={() => setAddModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                  <span>{t('farmer_add')}</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">{t('table_product')}</th>
                      <th className="pb-3">{t('table_price')}</th>
                      <th className="pb-3">{t('table_quantity')}</th>
                      <th className="pb-3">{t('table_status')}</th>
                      <th className="pb-3 text-right">{t('table_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={getProductName(p)}
                              className="w-11 h-11 rounded-xl object-cover border border-emerald-200"
                            />
                            <div>
                              <div className="font-bold text-gray-900 text-sm">
                                {getProductName(p)}
                              </div>
                              <div className="text-[11px] text-gray-400">
                                {getCategoryName(p.category)} · {p.region}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 font-extrabold text-emerald-700 whitespace-nowrap">
                          {p.price.toLocaleString()} FCFA
                        </td>
                        <td className="py-3.5 font-bold">
                          {p.status === 'out' || Number(p.quantity) <= 0 ? (
                            <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap">
                              <FontAwesomeIcon icon={faCircleXmark} className="text-[10px]" />
                              <span>0 kg ({t('status_out')})</span>
                            </span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-gray-900 font-extrabold text-sm">
                                {p.quantity.toLocaleString()} kg
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold whitespace-nowrap">
                                {t('product_qty_remaining')}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <StatusBadge
                              status={p.status === 'out' || Number(p.quantity) <= 0 ? 'out' : p.status}
                              size="sm"
                            />
                            <div className="flex items-center gap-1">
                              {[
                                { s: 'available', icon: faCircleCheck, color: 'text-emerald-600' },
                                { s: 'paid', icon: faCoins, color: 'text-amber-500' },
                                { s: 'out', icon: faCircleXmark, color: 'text-rose-500' },
                              ].map(({ s, icon, color }) => (
                                <button
                                  key={s}
                                  className={`p-1 rounded-md border text-[10px] transition-all ${
                                    p.status === s
                                      ? 'bg-emerald-50 border-emerald-400'
                                      : 'border-gray-200 hover:bg-gray-100'
                                  }`}
                                  onClick={() => updateProductStatus(p.id, s)}
                                  title={s}
                                >
                                  <FontAwesomeIcon icon={icon} className={color} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1"
                              onClick={() => openEdit(p)}
                            >
                              <FontAwesomeIcon icon={faPen} className="text-[10px]" />
                              <span>{t('btn_edit')}</span>
                            </button>
                            <button
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                              onClick={() => deleteProduct(p.id)}
                              title="Supprimer"
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs">
            {myOrders.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-3">
                  <FontAwesomeIcon icon={faInbox} />
                </span>
                <h3 className="text-base font-bold text-gray-800">{t('empty_orders')}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="font-extrabold text-xs text-gray-800">#{order.id}</span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faBox} className="text-emerald-600" />
                        <span>{t('table_quantity')} :</span>
                      </span>
                      <strong className="text-gray-900">{order.quantity.toLocaleString()} kg</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCoins} className="text-amber-500" />
                        <span>{t('table_amount')} :</span>
                      </span>
                      <strong className="text-emerald-700">
                        {order.totalPrice.toLocaleString()} FCFA
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600" />
                        <span>{t('table_delivery')} :</span>
                      </span>
                      <strong className="text-gray-900 truncate max-w-[130px]">{order.address}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-200">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span>{t('table_date')}</span>
                      </span>
                      <span>{order.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT MODAL */}
        {(addModal || editModal) && (
          <Modal
            isOpen={true}
            onClose={() => {
              setAddModal(false);
              setEditModal(null);
              setForm(EMPTY_PRODUCT);
            }}
            title={
              editModal
                ? `${t('btn_edit')} · ${getProductName(editModal)}`
                : `+ ${t('farmer_add')}`
            }
            size="lg"
            footer={
              <>
                <button
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setAddModal(false);
                    setEditModal(null);
                  }}
                >
                  {t('btn_cancel')}
                </button>
                <button
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                  onClick={editModal ? handleEditSubmit : handleAddSubmit}
                  id="save-product-btn"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>{t('btn_save')}</span>
                </button>
              </>
            }
          >
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">{t('product_name')} *</label>
                  <input
                    name="name"
                    type="text"
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Maïs Blanc"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">
                    {t('product_category')} *
                  </label>
                  <select
                    name="category"
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600 bg-white"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {getCategoryName(c)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">
                    {t('product_price_label')} *
                  </label>
                  <input
                    name="price"
                    type="number"
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min={1}
                    placeholder="180"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">
                    {t('product_qty_label')} *
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min={1}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">{t('auth_region')}</label>
                  <select
                    name="region"
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600 bg-white"
                    value={form.region}
                    onChange={handleChange}
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">
                    {t('product_status_label')}
                  </label>
                  <select
                    name="status"
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600 bg-white"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="available">{t('status_available')}</option>
                    <option value="paid">{t('status_paid')}</option>
                    <option value="out">{t('status_out')}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">{t('product_desc')}</label>
                <textarea
                  name="description"
                  className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600 resize-none"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description..."
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">
                  {t('product_image')} (URL)
                </label>
                <input
                  name="image"
                  type="url"
                  className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              {/* Image suggestions */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  {t('product_suggestions')}
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRODUCT_IMAGES.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        form.image === url
                          ? 'border-emerald-600 scale-105 shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setForm((prev) => ({ ...prev, image: url }))}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
}

