import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../../public/Logo.jpeg";
import {
  faLeaf,
  faArrowRight,
  faBars,
  faXmark,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/auth";
    const map = {
      farmer: "/agriculteur",
      merchant: "/commercant",
      transporter: "/transporteur",
    };
    return map[user.role] || "/";
  };

  // Nav links WITHOUT ICONS (as requested)
  const navLinks = [
    { label: t("nav_market") || "Marché", to: "/marketplace" },
    { label: t("nav_transport") || "Transporteurs", to: "/transport" },
    { label: t("nav_trends") || "Tendances", to: "/tendances" },
  ];

  if (user) {
    navLinks.push({ label: t("nav_chat") || "Messages", to: "/chat" });
    navLinks.push({
      label: t("nav_my_space") || "Mon Espace",
      to: getDashboardLink(),
    });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-3 pb-2 ${scrolled ? "pt-2" : ""}`}
    >
      <nav
        className={`max-w-6xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md border border-emerald-200/80"
            : "bg-white/75 backdrop-blur-md shadow-xs border border-white/80"
        }`}
        aria-label="Navigation principale"
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 transition-transform group-hover:scale-105 shadow-xs">
            <img
              src={Logo}
              alt="Miab'Assimé Logo"
              fill
              className=" rounded-full object-cover"
            />
          </span>
          <span className="text-lg font-bold text-gray-800 tracking-tight">
            Miab'
            <strong className="text-emerald-700 font-extrabold">Assimé</strong>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS (NO ICONS) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-800 bg-emerald-100/70 font-semibold"
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT ACTIONS: LANG + AUTH */}
        <div className="flex items-center gap-2.5">
          {/* Segmented Language Switcher (FR / EN / EWE) */}
          <div className="flex items-center bg-gray-100/90 rounded-full p-1 border border-gray-200/80">
            <button
              type="button"
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all ${
                lang === "fr"
                  ? "bg-white text-emerald-700 shadow-xs font-extrabold"
                  : "text-gray-500 hover:text-emerald-700"
              }`}
              onClick={() => setLang("fr")}
              title="Français"
            >
              FR
            </button>
            <button
              type="button"
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all ${
                lang === "en"
                  ? "bg-white text-emerald-700 shadow-xs font-extrabold"
                  : "text-gray-500 hover:text-emerald-700"
              }`}
              onClick={() => setLang("en")}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-all ${
                lang === "ewe" || lang === "ee"
                  ? "bg-white text-emerald-700 shadow-xs font-extrabold"
                  : "text-gray-500 hover:text-emerald-700"
              }`}
              onClick={() => setLang("ewe")}
              title="Eʋegbe"
            >
              EWE
            </button>
          </div>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200/60"
                title={user.name}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-300"
                />
                <span className="hidden sm:inline text-xs font-semibold text-emerald-900">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors text-sm rounded-full hover:bg-red-50"
                title={t("nav_logout")}
                aria-label={t("nav_logout")}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center">
              <Link
                to="/auth"
                className="bg-[#1b5e20] hover:bg-[#144718] text-white rounded-full pl-4 md:pl-5 pr-1.5 py-1.5 flex items-center gap-2.5 font-bold text-xs md:text-sm shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer"
                id="navbar-login-btn"
              >
                <span>{t("hero_cta_login") || "Se Connecter"}</span>
                <span className="w-6 h-6 rounded-full bg-white text-[#1b5e20] flex items-center justify-center text-[10px] shadow-2xs font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </Link>
            </div>
          )}

          {/* Hamburger for mobile */}
          <button
            type="button"
            className="md:hidden w-8 h-8 flex items-center justify-center text-gray-700 hover:text-emerald-700 rounded-full hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faXmark : faBars}
              className="text-lg"
            />
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-xl flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-emerald-800 bg-emerald-50 font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="h-px bg-gray-100 my-1" />
          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                to={getDashboardLink()}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold"
              >
                <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
                <span>
                  {t("nav_dashboard")} ({user.name})
                </span>
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 p-2 rounded-xl text-red-600 bg-red-50 text-sm font-medium hover:bg-red-100 cursor-pointer"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>{t("nav_logout")}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="bg-[#1b5e20] hover:bg-[#144718] text-white rounded-full pl-5 pr-2 py-2.5 flex items-center justify-between font-bold text-sm shadow-sm transition-all"
              >
                <span>{t("hero_cta_login") || "Se Connecter"}</span>
                <span className="w-7 h-7 rounded-full bg-white text-[#1b5e20] flex items-center justify-center text-xs shadow-2xs font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
