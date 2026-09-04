import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faSliders,
  faXmark,
  faRotateLeft,
  faLocationDot,
  faTag,
  faCircleCheck,
  faCoins,
  faCircleXmark,
  faSeedling,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { useLang } from '../context/LangContext';
import { REGIONS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/marketplace/ProductCard';
import Navbar from '../components/layout/Navbar';

export default function MarketplacePage() {
  const { products } = useApp();
  const { t, getCategoryName } = useLang();

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('available');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    if (region) result = result.filter((p) => p.region === region);
    if (category) result = result.filter((p) => p.category === category);
    if (status === 'available') {
      result = result.filter((p) => p.status === 'available' && Number(p.quantity) > 0);
    } else if (status === 'out') {
      result = result.filter((p) => p.status === 'out' || Number(p.quantity) <= 0);
    } else if (status === 'all') {
      // Show all including out of stock
    } else if (status) {
      result = result.filter((p) => p.status === status);
    }
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'newest')
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, search, region, category, status, maxPrice, sort]);

  const resetFilters = () => {
    setSearch('');
    setRegion('');
    setCategory('');
    setStatus('available');
    setMaxPrice('');
    setSort('newest');
  };
  const hasFilters = search || region || category || status !== 'available' || maxPrice;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fdf9]">
      <Navbar />

      {/* PAGE HEADER */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t('marketplace_title')}
            </h1>
            <p className="text-emerald-200 text-sm mt-1">
              {filtered.length} {t('products_found')}
            </p>
          </div>
          <button
            className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md text-white font-bold text-xs"
            onClick={() => setFiltersOpen(!filtersOpen)}
            id="toggle-filters-mobile"
          >
            <FontAwesomeIcon icon={filtersOpen ? faXmark : faSliders} />
            <span>{filtersOpen ? t('btn_cancel') : t('filter_title')}</span>
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* ---- SIDEBAR FILTERS ---- */}
          <aside
            className={`w-full md:w-72 bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs flex flex-col gap-6 shrink-0 ${
              filtersOpen ? 'block' : 'hidden md:flex'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faSliders} className="text-emerald-600 text-sm" />
                <span>{t('filter_title')}</span>
              </h3>
              {hasFilters && (
                <button
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  onClick={resetFilters}
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                  <span>{t('filter_reset')}</span>
                </button>
              )}
            </div>

            {/* Search */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">
                {t('search_placeholder').replace('...', '')}
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  placeholder={t('search_placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="marketplace-search"
                />
              </div>
            </div>

            {/* Region */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">{t('filter_region')}</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-emerald-600 bg-white"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                id="filter-region"
              >
                <option value="">{t('all_regions')}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700">{t('filter_category')}</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                    !category
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                  }`}
                  onClick={() => setCategory('')}
                >
                  {t('all_categories')}
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                      category === c
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                    }`}
                    onClick={() => setCategory(c === category ? '' : c)}
                  >
                    {getCategoryName(c)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700">{t('filter_status')}</label>
              <div className="flex flex-col gap-1">
                {[
                  { value: 'available', label: t('filter_available_only'), icon: faCircleCheck },
                  { value: 'all', label: t('filter_all_products'), icon: null },
                  { value: 'out', label: t('filter_out_of_stock'), icon: faCircleXmark },
                ].map((s) => (
                  <button
                    key={s.value}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center gap-2 border cursor-pointer ${
                      status === s.value
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setStatus(s.value)}
                  >
                    {s.icon && <FontAwesomeIcon icon={s.icon} className="text-xs" />}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 flex justify-between">
                <span>{t('filter_price')}</span>
                {maxPrice && (
                  <span className="text-emerald-700 font-extrabold">
                    {Number(maxPrice).toLocaleString()} FCFA
                  </span>
                )}
              </label>
              <input
                type="range"
                className="w-full accent-emerald-600"
                min={0}
                max={2000}
                step={50}
                value={maxPrice || 2000}
                onChange={(e) =>
                  setMaxPrice(e.target.value === '2000' ? '' : e.target.value)
                }
                id="filter-price"
              />
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                <span>0</span>
                <span>2 000 FCFA</span>
              </div>
            </div>
          </aside>

          {/* ---- MAIN CONTENT ---- */}
          <main className="flex-1 w-full">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border border-emerald-100/80 shadow-xs">
              <button
                className="md:hidden px-3.5 py-1.5 rounded-xl border border-emerald-600 text-emerald-700 text-xs font-bold flex items-center gap-1.5"
                onClick={() => setFiltersOpen(!filtersOpen)}
                id="toggle-filters"
              >
                <FontAwesomeIcon icon={filtersOpen ? faXmark : faSliders} />
                <span>{filtersOpen ? t('btn_cancel') : t('filter_title')}</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-bold text-gray-500">{t('sort_by')} :</span>
                <select
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-emerald-600"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  id="sort-select"
                >
                  <option value="newest">{t('sort_newest')}</option>
                  <option value="price_asc">{t('sort_price_asc')}</option>
                  <option value="price_desc">{t('sort_price_desc')}</option>
                  <option value="rating">{t('product_rating')}</option>
                </select>
              </div>
            </div>

            {/* Active filter tags */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[10px]" />
                    <span>{search}</span>
                    <button onClick={() => setSearch('')} className="ml-1 text-emerald-600 hover:text-emerald-900">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </span>
                )}
                {region && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
                    <span>{region}</span>
                    <button onClick={() => setRegion('')} className="ml-1 text-emerald-600 hover:text-emerald-900">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                    <span>{getCategoryName(category)}</span>
                    <button onClick={() => setCategory('')} className="ml-1 text-emerald-600 hover:text-emerald-900">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </span>
                )}
                {status && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <FontAwesomeIcon icon={status === 'available' ? faCircleCheck : faCircleXmark} className="text-[10px]" />
                    <span>{status}</span>
                    <button onClick={() => setStatus('')} className="ml-1 text-emerald-600 hover:text-emerald-900">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </span>
                )}
                {maxPrice && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <FontAwesomeIcon icon={faCoins} className="text-[10px]" />
                    <span>Max {Number(maxPrice).toLocaleString()} FCFA</span>
                    <button onClick={() => setMaxPrice('')} className="ml-1 text-emerald-600 hover:text-emerald-900">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-emerald-100 shadow-xs flex flex-col items-center justify-center p-8">
                <span className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-4">
                  <FontAwesomeIcon icon={faSeedling} />
                </span>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{t('no_products_found')}</h3>
                <p className="text-xs text-gray-500 max-w-sm mb-5">{t('modify_search_criteria')}</p>
                <button
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  onClick={resetFilters}
                >
                  {t('filter_reset')}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

