import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../public/Logo.jpeg";
import {
  faUserCheck,
  faHandshake,
  faTruck,
  faChartArea,
  faMagnifyingGlass,
  faComments,
  faCircleCheck,
  faArrowRight,
  faStar,
  faLeaf,
  faPhone,
  faEnvelope,
  faGlobe,
  faLocationDot,
  faTableColumns,
  faBoxesStacked,
  faCoins,
  faMobileScreen,
} from "@fortawesome/free-solid-svg-icons";
import { useLang } from "../context/LangContext";
import { useApp } from "../context/AppContext";
import { siteStats, testimonials } from "../data/mockData";
import ProductCard from "../components/marketplace/ProductCard";
import PriceChart from "../components/charts/PriceChart";
import Navbar from "../components/layout/Navbar";

// Animated counter
function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const STEPS = [
  {
    icon: faUserCheck,
    titleKey: "how_step1_title",
    descKey: "how_step1_desc",
    step: "01",
  },
  {
    icon: faHandshake,
    titleKey: "how_step2_title",
    descKey: "how_step2_desc",
    step: "02",
  },
  {
    icon: faTruck,
    titleKey: "how_step3_title",
    descKey: "how_step3_desc",
    step: "03",
  },
];

export default function LandingPage() {
  const { t, lang } = useLang();
  const { products } = useApp();
  const featured = products
    .filter((p) => p.status === "available" && Number(p.quantity) > 0)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fdf9]">
      <Navbar />

      {/* ---- HERO (100vw Full Width, Rounded Bottom Only) ---- */}
      <section className="relative w-full min-h-[580px] md:min-h-[660px] lg:min-h-[720px] overflow-hidden rounded-b-[40px] md:rounded-b-[56px] lg:rounded-b-[64px] shadow-2xl flex flex-col justify-center items-center text-white px-4 sm:px-8 lg:px-12 pt-28 md:pt-36 pb-16 md:pb-24">
        {/* Background image & gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/25 to-black/60" />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center my-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.18] text-center drop-shadow-md">
            {t("hero_title")}
          </h1>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link
              to="/DownLoadApp"
              className="px-7 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm sm:text-base border border-white/35 hover:border-white/50 transition-all flex items-center gap-2.5 cursor-pointer shadow-lg hover:scale-105"
              id="hero-download-btn"
            >
              <span>{t("hero_cta_app")}</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link
              to="/auth"
              className="bg-[#1b5e20] hover:bg-[#144718] text-white rounded-full pl-7 pr-2.5 py-2.5 flex items-center gap-3.5 font-bold text-sm sm:text-base shadow-xl transition-all hover:scale-105 cursor-pointer"
              id="hero-login-btn"
            >
              <span>{t("hero_cta_login")}</span>
              <span className="w-8 h-8 rounded-full bg-white text-[#1b5e20] flex items-center justify-center text-xs shadow-sm font-bold">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar floating under hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-20 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-xl text-neutral-800">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              <Counter target={siteStats.farmers} />+
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              {t("stat_farmers")}
            </div>
          </div>
          <div className="text-center md:border-l md:border-neutral-200">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              <Counter target={siteStats.products} />+
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              {t("stat_products")}
            </div>
          </div>
          <div className="text-center md:border-l md:border-neutral-200">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              <Counter target={siteStats.orders} />+
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              {t("stat_orders")}
            </div>
          </div>
          <div className="text-center md:border-l md:border-neutral-200">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {siteStats.regions}
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              {t("stat_regions")}
            </div>
          </div>
        </div>
      </div>

      {/* ---- VOUS ÊTES (CHOOSE YOUR PROFILE) ---- */}
      <section
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full"
        id="profiles-section"
      >
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Une plateforme pensée pour
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {[
            {
              role: "merchant",
              title: t("profile_merchant_title") || "Commerçante",
              image: "/profiles/commercante.jpg",
            },
            {
              role: "farmer",
              title: t("profile_farmer_title") || "Agriculteur",
              image: "/profiles/agriculteur.jpg",
            },
            {
              role: "transporter",
              title: t("profile_transporter_title") || "Propriétaire de Camion",
              image: "/profiles/transporteur.jpg",
            },
          ].map((profile) => (
            <Link
              key={profile.role}
              to={`/auth?role=${profile.role}&mode=login`}
              className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-2"
              id={`profile-card-${profile.role}`}
            >
              <div className="w-full aspect-square overflow-hidden rounded-2xl md:rounded-3xl border border-neutral-100 shadow-sm group-hover:shadow-xl transition-all duration-300 bg-neutral-100">
                <img
                  src={profile.image}
                  alt={profile.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-4 text-center group-hover:text-emerald-700 transition-colors">
                {profile.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
            {t("how_badge")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("how_title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="relative p-8 rounded-3xl bg-white border border-emerald-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ÉTAPE {step.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                  <FontAwesomeIcon icon={step.icon} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t(step.titleKey)}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- DASHBOARD SHOWCASE SECTION ---- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/40 rounded-[36px] sm:rounded-[48px] p-6 sm:p-10 lg:p-14 border border-emerald-100 shadow-sm relative overflow-hidden">
          {/* Subtle background decorative shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3 shadow-2xs">
              <FontAwesomeIcon
                icon={faTableColumns}
                className="text-emerald-700"
              />
              <span>{t("dashboard_section_badge")}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {t("dashboard_section_title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {t("dashboard_section_subtitle")}
            </p>

            {/* Role Navigation Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <Link
                to="/agriculteur"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>{t("dashboard_tab_farmer")}</span>
              </Link>
              <Link
                to="/commercant"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                <span>{t("dashboard_tab_merchant")}</span>
              </Link>
              <Link
                to="/transporteur"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                <span>{t("dashboard_tab_transporter")}</span>
              </Link>
            </div>
          </div>

          {/* Mockup Frame with the Dashboard Image */}
          <div className="relative mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xl bg-white overflow-hidden group">
            {/* Top Chrome / Window Header */}
            <div className="bg-gray-50/90 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
                <span className="ml-3 text-[11px] font-mono font-bold text-gray-400 hidden sm:inline-block">
                  miabeassime.tg/agriculteur
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>En ligne</span>
                </span>
              </div>
            </div>

            {/* Image Preview */}
            <div className="relative overflow-hidden bg-emerald-50/20">
              <img
                src="/dashboard-preview.png"
                alt="Tableau de bord Agriculteur Miabé Assimé"
                className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.005]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Key Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-base">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  {t("dash_card_catalog_title")}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("dash_card_catalog_desc")}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-base">
                <FontAwesomeIcon icon={faBoxesStacked} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  {t("dash_card_orders_title")}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("dash_card_orders_desc")}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-base">
                <FontAwesomeIcon icon={faCoins} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  {t("dash_card_earnings_title")}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("dash_card_earnings_desc")}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-base">
                <FontAwesomeIcon icon={faMobileScreen} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  {t("dash_card_mobile_title")}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("dash_card_mobile_desc")}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA to explore */}
          <div className="mt-8 text-center relative z-10">
            <Link
              to="/agriculteur"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-800 text-white font-bold text-sm shadow-md hover:bg-emerald-900 transition-all group"
            >
              <span>{t("dashboard_view_demo")}</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-xs transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- FEATURED PRODUCTS ---- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
              {t("featured_badge")}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              {t("featured_title")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("featured_subtitle")}
            </p>
          </div>
          <Link
            to="/marketplace"
            className="px-5 py-2 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <span>{t("see_all_market")}</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---- MARKET TRENDS PREVIEW ---- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-2">
              <FontAwesomeIcon icon={faChartArea} />
              <span>{t("trends_badge")}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              {t("trends_title")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t("trends_subtitle")}</p>
          </div>
          <Link
            to="/tendances"
            className="px-5 py-2 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <span>{t("see_all_trends")}</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>
        <div className="bg-white rounded-3xl border border-emerald-100/80 p-6 shadow-sm">
          <PriceChart height={280} />
        </div>
      </section>

      {/* ---- SCENARIO (Aissata story) ---- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
            {t("scenario_badge")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            {t("scenario_title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: faMagnifyingGlass,
              title: t("scenario_step1_title"),
              desc: t("scenario_step1_desc"),
              link: "/marketplace",
              linkText: t("scenario_step1_link"),
            },
            {
              icon: faComments,
              title: t("scenario_step2_title"),
              desc: t("scenario_step2_desc"),
            },
            {
              icon: faTruck,
              title: t("scenario_step3_title"),
              desc: t("scenario_step3_desc"),
              link: "/transport",
              linkText: t("scenario_step3_link"),
            },
            {
              icon: faCircleCheck,
              title: t("scenario_step4_title"),
              desc: t("scenario_step4_desc"),
            },
          ].map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-emerald-100/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg mb-4">
                  <FontAwesomeIcon icon={s.icon} />
                </div>
                <div className="text-xs font-bold text-emerald-700 mb-1">
                  {t(`scenario_step${i + 1}_num`)}
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2">
                  {s.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              {s.link && (
                <Link
                  to={s.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-4 pt-3 border-t border-gray-100"
                >
                  <span>{s.linkText}</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[10px]"
                  />
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link
            to="/auth"
            className="inline-flex items-center gap-3.5 bg-[#1b5e20] hover:bg-[#144718] text-white rounded-full pl-7 pr-2.5 py-2.5 font-bold text-sm sm:text-base shadow-xl transition-all hover:scale-105 cursor-pointer"
            id="scenario-cta-btn"
          >
            <span>Commencer par ici</span>
            <span className="w-8 h-8 rounded-full bg-white text-[#1b5e20] flex items-center justify-center text-xs shadow-sm font-bold">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </Link>
        </div>
      </section>
      {/* ---- FOOTER ---- */}
      <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
                <span className="">
                  <img
                    src={Logo}
                    alt="Logo de MiabéAssimé"
                    className="h-10 w-auto rounded-full"
                  />
                </span>
                <span className=""> Miab'Assimé</span>
              </div>
              <p className="text-xs text-emerald-300/80 leading-relaxed mb-4">
                {t("footer_tagline")}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <h4 className="font-bold text-white text-sm mb-1">
                {t("footer_links")}
              </h4>
              <Link
                to="/marketplace"
                className="hover:text-white transition-colors"
              >
                {t("nav_market")}
              </Link>
              <Link
                to="/tendances"
                className="hover:text-white transition-colors"
              >
                {t("nav_trends")}
              </Link>
              <Link
                to="/transport"
                className="hover:text-white transition-colors"
              >
                {t("nav_transport")}
              </Link>
              <Link to="/auth" className="hover:text-white transition-colors">
                {t("nav_login")}
              </Link>
              <Link
                to="/auth?mode=register"
                className="hover:text-white transition-colors"
              >
                {t("nav_register")}
              </Link>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <h4 className="font-bold text-white text-sm mb-1">
                {t("footer_roles")}
              </h4>
              <Link
                to="/auth?role=farmer"
                className="hover:text-white transition-colors"
              >
                {t("role_farmer")}
              </Link>
              <Link
                to="/auth?role=merchant"
                className="hover:text-white transition-colors"
              >
                {t("role_merchant")}
              </Link>
              <Link
                to="/auth?role=transporter"
                className="hover:text-white transition-colors"
              >
                {t("role_transporter")}
              </Link>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <h4 className="font-bold text-white text-sm mb-1">
                {t("footer_contact")}
              </h4>
              <p className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-emerald-400"
                />
                <span>Lomé, Togo</span>
              </p>
              <p className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-emerald-400" />
                <span>+228 90 00 00 00</span>
              </p>
              <p className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-emerald-400"
                />
                <span>contact@miabe.tg</span>
              </p>
              <p className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="text-emerald-400" />
                <span>miabeassime.netlify.app/</span>
              </p>
            </div>
          </div>

          <div className="text-center my-8 select-none pointer-events-none opacity-10">
            <h1 className="text-[14vw] font-black text-white tracking-tight">
              Miab'Assimé
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-400/80 pt-4">
            <p>© 2025 Miab'Assimé · {t("footer_rights")}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">
                {t("footer_privacy")}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t("footer_terms")}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t("footer_help")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
