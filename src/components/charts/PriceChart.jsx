import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartArea,
  faChartLine,
  faLocationDot,
  faSeedling,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../../context/LangContext';
import {
  priceHistory,
  TOGO_REGIONS,
  CEREALS_LIST,
  regionalCerealPriceHistory,
} from '../../data/mockData';

const NATIONAL_PRODUCTS = Object.keys(priceHistory);
const NATIONAL_COLORS = ['#15803d', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label, getProductName, mode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200 shadow-xl text-xs flex flex-col gap-2 min-w-[170px]">
      <div className="font-extrabold text-gray-900 border-b border-gray-100 pb-1 flex items-center justify-between">
        <span>{label}</span>
        {mode === 'regional' && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            Togo
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {payload.map((p, i) => {
          const displayName =
            mode === 'regional'
              ? TOGO_REGIONS.find((r) => r.id === p.dataKey)?.name || p.name
              : getProductName
              ? getProductName(p.name)
              : p.name;

          return (
            <div
              key={i}
              className="flex items-center justify-between gap-3 font-semibold"
              style={{ color: p.color }}
            >
              <span className="truncate max-w-[120px]">{displayName} :</span>
              <strong className="text-gray-900 font-extrabold whitespace-nowrap">
                {p.value ? p.value.toLocaleString() : '-'} FCFA/kg
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function PriceChart({
  multi = true,
  defaultProduct = 'Maïs Blanc',
  height = 340,
  defaultMode = 'regional',
}) {
  const { t, getProductName } = useLang();

  // Mode: 'regional' (Céréales par régions du Togo) or 'national' (Vue tous produits)
  const [viewMode, setViewMode] = useState(defaultMode);

  // Regional state
  const [selectedCereal, setSelectedCereal] = useState('Maïs Blanc');
  const [selectedRegions, setSelectedRegions] = useState(TOGO_REGIONS.map((r) => r.id));

  // National state
  const [selectedProducts, setSelectedProducts] = useState(
    multi ? NATIONAL_PRODUCTS.slice(0, 3) : [defaultProduct]
  );

  // Common controls
  const [chartType, setChartType] = useState('area');
  const [period, setPeriod] = useState('year');

  const toggleRegion = (regionId) => {
    setSelectedRegions((prev) => {
      if (prev.includes(regionId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((id) => id !== regionId);
      }
      return [...prev, regionId];
    });
  };

  const toggleNationalProduct = (product) => {
    if (!multi) {
      setSelectedProducts([product]);
      return;
    }
    setSelectedProducts((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  // Data calculation
  const periodSlice = { week: 7, month: 6, year: 12 };

  // 1. Regional Cereal Data
  const currentCerealHistory = regionalCerealPriceHistory[selectedCereal] || regionalCerealPriceHistory['Maïs Blanc'];
  const regionalAllData = currentCerealHistory.maritime.map((entry, i) => {
    const row = { date: entry.date };
    TOGO_REGIONS.forEach((reg) => {
      row[reg.id] = currentCerealHistory[reg.id]?.[i]?.price || 0;
    });
    return row;
  });
  const regionalData = regionalAllData.slice(-periodSlice[period]);

  // 2. National Overview Data
  const nationalAllData = priceHistory[NATIONAL_PRODUCTS[0]].map((entry, i) => {
    const row = { date: entry.date };
    NATIONAL_PRODUCTS.forEach((p) => {
      row[p] = priceHistory[p][i]?.price;
    });
    return row;
  });
  const nationalData = nationalAllData.slice(-periodSlice[period]);

  const activeData = viewMode === 'regional' ? regionalData : nationalData;
  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
  const DataComponent = chartType === 'area' ? Area : Line;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header Controls: Mode Selector + Period + Chart Type */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-gray-100">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100/90 rounded-full p-1 border border-gray-200">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              viewMode === 'regional'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
            onClick={() => setViewMode('regional')}
          >
            <FontAwesomeIcon icon={faLocationDot} className="text-[11px]" />
            <span>{t('chart_mode_regional')}</span>
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              viewMode === 'national'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
            onClick={() => setViewMode('national')}
          >
            <FontAwesomeIcon icon={faGlobe} className="text-[11px]" />
            <span>{t('chart_mode_national')}</span>
          </button>
        </div>

        {/* Period & Chart Type Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Toggle */}
          <div className="flex items-center bg-gray-100/90 rounded-full p-1 border border-gray-200">
            {['week', 'month', 'year'].map((p) => (
              <button
                key={p}
                type="button"
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  period === p
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
                onClick={() => setPeriod(p)}
              >
                {p === 'week' ? t('chart_week') : p === 'month' ? t('chart_month') : t('chart_year')}
              </button>
            ))}
          </div>

          {/* Chart Type */}
          <div className="flex items-center bg-gray-100/90 rounded-full p-1 border border-gray-200">
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-gray-600 hover:text-emerald-700'
              }`}
              onClick={() => setChartType('area')}
            >
              <FontAwesomeIcon icon={faChartArea} className="text-xs" />
              <span>{t('chart_area')}</span>
            </button>
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                chartType === 'line'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-gray-600 hover:text-emerald-700'
              }`}
              onClick={() => setChartType('line')}
            >
              <FontAwesomeIcon icon={faChartLine} className="text-xs" />
              <span>{t('chart_line')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* REGIONAL MODE FILTERS */}
      {viewMode === 'regional' && (
        <div className="flex flex-col gap-3">
          {/* Cereal selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <FontAwesomeIcon icon={faSeedling} className="text-emerald-600" />
              {t('chart_select_cereal')}
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {CEREALS_LIST.map((cereal) => {
                const isSelected = selectedCereal === cereal;
                return (
                  <button
                    key={cereal}
                    type="button"
                    className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                    onClick={() => setSelectedCereal(cereal)}
                  >
                    {getProductName(cereal)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLocationDot} className="text-emerald-600" />
              {t('chart_compare_regions')}
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {TOGO_REGIONS.map((reg) => {
                const isSel = selectedRegions.includes(reg.id);
                return (
                  <button
                    key={reg.id}
                    type="button"
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                      isSel
                        ? 'text-white shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                    style={isSel ? { backgroundColor: reg.color, borderColor: reg.color } : {}}
                    onClick={() => toggleRegion(reg.id)}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isSel ? '#ffffff' : reg.color }}
                    />
                    <span>{reg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* NATIONAL MODE FILTERS */}
      {viewMode === 'national' && (
        <div className="flex flex-wrap gap-2">
          {NATIONAL_PRODUCTS.map((p, i) => {
            const isSel = selectedProducts.includes(p);
            const color = NATIONAL_COLORS[i % NATIONAL_COLORS.length];
            return (
              <button
                key={p}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  isSel
                    ? 'text-white shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                }`}
                style={isSel ? { backgroundColor: color, borderColor: color } : {}}
                onClick={() => toggleNationalProduct(p)}
              >
                {getProductName(p)}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Chart Container */}
      <div
        className="w-full bg-white rounded-2xl p-4 border border-emerald-100/60 shadow-xs"
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={activeData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              {viewMode === 'regional'
                ? TOGO_REGIONS.map((reg) => (
                    <linearGradient key={reg.id} id={`grad-reg-${reg.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={reg.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={reg.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))
                : selectedProducts.map((p, i) => (
                    <linearGradient key={p} id={`grad-nat-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={NATIONAL_COLORS[NATIONAL_PRODUCTS.indexOf(p) % NATIONAL_COLORS.length]}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={NATIONAL_COLORS[NATIONAL_PRODUCTS.indexOf(p) % NATIONAL_COLORS.length]}
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ea" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
              unit=" F"
            />
            <Tooltip
              content={
                <CustomTooltip
                  getProductName={getProductName}
                  mode={viewMode}
                />
              }
            />

            {/* Regional Mode Lines/Areas */}
            {viewMode === 'regional' &&
              TOGO_REGIONS.filter((reg) => selectedRegions.includes(reg.id)).map((reg) => (
                <DataComponent
                  key={reg.id}
                  type="monotone"
                  dataKey={reg.id}
                  name={reg.name}
                  stroke={reg.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: reg.color }}
                  fill={chartType === 'area' ? `url(#grad-reg-${reg.id})` : undefined}
                />
              ))}

            {/* National Mode Lines/Areas */}
            {viewMode === 'national' &&
              selectedProducts.map((p, i) => {
                const color = NATIONAL_COLORS[NATIONAL_PRODUCTS.indexOf(p) % NATIONAL_COLORS.length];
                return (
                  <DataComponent
                    key={p}
                    type="monotone"
                    dataKey={p}
                    name={p}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: color }}
                    fill={chartType === 'area' ? `url(#grad-nat-${i})` : undefined}
                  />
                );
              })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Regional Price Highlights Card Grid */}
      {viewMode === 'regional' && (
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col gap-2.5">
          <div className="text-xs font-bold text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLocationDot} className="text-emerald-700" />
              <span>
                {t('chart_regional_summary')} — <strong>{getProductName(selectedCereal)}</strong>
              </span>
            </span>
            <span className="text-3xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              Mise à jour en direct
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {TOGO_REGIONS.map((reg) => {
              const hist = currentCerealHistory[reg.id] || [];
              const latestPrice = hist[hist.length - 1]?.price || 0;
              const prevPrice = hist[hist.length - 2]?.price || latestPrice;
              const diff = latestPrice - prevPrice;
              const isPlateaux = reg.id === 'plateaux';

              return (
                <div
                  key={reg.id}
                  className="bg-white rounded-xl p-2.5 border border-emerald-100 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 truncate">{reg.name.split(' ')[0]}</span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: reg.color }}
                    />
                  </div>
                  <div className="mt-1">
                    <span className="text-sm sm:text-base font-black text-gray-900">
                      {latestPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold ml-0.5">FCFA/kg</span>
                  </div>
                  <div className="text-[10px] font-semibold mt-0.5 flex items-center justify-between">
                    <span className={diff >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                      {diff > 0 ? `+${diff}` : diff} FCFA
                    </span>
                    {isPlateaux && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">
                        Bassin producteur
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
