import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faArrowTrendUp,
  faArrowTrendDown,
  faMinus,
  faFileLines,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LangContext';
import Navbar from '../components/layout/Navbar';
import PriceChart from '../components/charts/PriceChart';

export default function MarketTrendsPage() {
  const { t, lang } = useLang();

  const isEwe = lang === 'ewe' || lang === 'ee';
  const isEn = lang === 'en';

  const TRENDS_DATA = [
    {
      product: isEwe ? 'Bli Ɣie' : isEn ? 'White Maize' : 'Maïs Blanc',
      change: '+5%',
      status: 'up',
      reason: t('chart_insight_up'),
    },
    {
      product: isEwe ? 'Soja (Ayi)' : isEn ? 'Soybeans' : 'Soja',
      change: '-2%',
      status: 'down',
      reason: t('chart_insight_down'),
    },
    {
      product: isEwe ? 'Te Ɣie' : isEn ? 'Yam' : 'Igname',
      change: '+12%',
      status: 'up',
      reason: t('chart_insight_plateaux'),
    },
    {
      product: isEwe ? 'Molu' : isEn ? 'Local Rice' : 'Riz Local',
      change: '0%',
      status: 'stable',
      reason: t('chart_insight_stable'),
    },
  ];

  const REPORTS_DATA = [
    { month: t('report1_month'), title: t('report1_title'), readTime: '5 min' },
    { month: t('report2_month'), title: t('report2_title'), readTime: '4 min' },
    { month: t('report3_month'), title: t('report3_title'), readTime: '3 min' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fdf9]">
      <Navbar />

      {/* PAGE HEADER */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 shadow-sm">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-emerald-200 border border-white/20 mb-3">
            <FontAwesomeIcon icon={faChartLine} />
            <span>{t('trends_page_badge')}</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('trends_page_title')}
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            {t('trends_page_sub')}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16 flex flex-col gap-10">
        {/* MAIN CHART */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-xs flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('trends_chart_title')}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{t('trends_chart_sub')}</p>
          </div>
          <PriceChart multi={true} height={400} />
        </section>

        {/* INSIGHTS */}
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('trends_insights_title')}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{t('trends_insights_sub')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRENDS_DATA.map((item) => (
              <div
                key={item.product}
                className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-xs flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-gray-900">{item.product}</h3>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-extrabold px-2 py-0.5 rounded-full border ${
                      item.status === 'up'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'down'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        item.status === 'up'
                          ? faArrowTrendUp
                          : item.status === 'down'
                          ? faArrowTrendDown
                          : faMinus
                      }
                      className="text-[10px]"
                    />
                    <span>{item.change}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NEWS / REPORTS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-xs flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t('trends_reports_title')}</h2>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {REPORTS_DATA.map((report, i) => (
              <div
                key={i}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FontAwesomeIcon icon={faFileLines} />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                      {report.month}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                      {report.title}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto sm:ml-0">
                  <span className="text-xs text-gray-400">
                    {report.readTime} {t('trends_read_time')}
                  </span>
                  <button className="px-3 py-1 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1">
                    <span>{t('trends_read_btn')}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

