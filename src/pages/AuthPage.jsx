import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { REGIONS } from "../data/mockData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faStore,
  faTruck,
  faCircleCheck,
  faComments,
  faMapLocationDot,
  faChartLine,
  faGlobe,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const ROLES = [
  {
    id: "farmer",
    icon: faSeedling,
    labelKey: "role_farmer",
    descKey: "role_farmer_desc",
  },
  {
    id: "merchant",
    icon: faStore,
    labelKey: "role_merchant",
    descKey: "role_merchant_desc",
  },
  {
    id: "transporter",
    icon: faTruck,
    labelKey: "role_transporter",
    descKey: "role_transporter_desc",
  },
];

export default function AuthPage() {
  const { login, register, isAuthenticated, user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState(
    searchParams.get("mode") === "register" ? "register" : "login",
  );
  const [role, setRole] = useState(searchParams.get("role") || "farmer");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    region: REGIONS[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo credentials
  const DEMO = [
    { roleKey: "role_farmer", email: "kofi@miabe.tg", firstName: "Kofi" },
    {
      roleKey: "role_merchant",
      email: "aissata@miabe.tg",
      firstName: "Aissata",
    },
    { roleKey: "role_transporter", email: "edem@miabe.tg", firstName: "Edem" },
  ];

  const roleParam = searchParams.get("role");
  const modeParam = searchParams.get("mode");

  useEffect(() => {
    if (
      roleParam &&
      ["farmer", "merchant", "transporter"].includes(roleParam)
    ) {
      setRole(roleParam);
      const demoUser = DEMO.find((d) => d.roleKey === `role_${roleParam}`);
      if (demoUser) {
        setForm((prev) => ({
          ...prev,
          email: demoUser.email,
          password: "demo123",
        }));
      }
    }
    if (modeParam && ["login", "register"].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [roleParam, modeParam]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const map = {
        farmer: "/agriculteur",
        merchant: "/commercant",
        transporter: "/transporteur",
      };
      navigate(map[user.role] || "/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (mode === "login") {
      const result = login(form.email, form.password);
      if (!result.success) setError(result.error);
    } else {
      const result = register({ ...form, role });
      if (!result.success)
        setError(result.error || "Erreur lors de la création du compte.");
    }
    setLoading(false);
  };

  const handleDemo = (demo) => {
    setForm((prev) => ({ ...prev, email: demo.email, password: "demo123" }));
    setMode("login");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-linear-to-br from-emerald-950 via-emerald-800 to-emerald-600 text-white relative overflow-hidden">
        {/* Decorative ambient bubbles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white hover:opacity-90 transition"
          >
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shadow-inner">
              <FontAwesomeIcon icon={faSeedling} />
            </span>
            <span>
              Agblé
              <strong className="text-emerald-300 font-black">'simé</strong>
            </span>
          </Link>
        </div>

        <div className="relative z-10 py-10 flex flex-col justify-center max-w-md">
          <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
            Bienvenue sur Agblé'simé
          </h1>
          <p className="text-white/80 text-sm xl:text-base leading-relaxed mb-8">
            {t("auth_tagline")}
          </p>

          <div className="flex flex-col gap-3.5">
            {[
              { icon: faCircleCheck, key: "feat_verified_suppliers" },
              { icon: faComments, key: "feat_voice_chat" },
              { icon: faMapLocationDot, key: "feat_transporter_map" },
              { icon: faChartLine, key: "feat_realtime_prices" },
              { icon: faGlobe, key: "feat_multilingual" },
            ].map((f) => (
              <div
                key={f.key}
                className="flex items-center gap-3 text-sm font-medium text-white/90"
              >
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-xs text-emerald-300 shadow-2xs">
                  <FontAwesomeIcon icon={f.icon} />
                </div>
                <span>{t(f.key)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo accounts */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-3">
            {t("auth_demo_title")}
          </p>
          <div className="flex flex-col gap-2">
            {DEMO.map((d) => (
              <button
                key={d.email}
                type="button"
                className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl px-4 py-2 text-left text-xs font-semibold text-white transition cursor-pointer flex items-center justify-between"
                onClick={() => handleDemo(d)}
              >
                <span>
                  {d.firstName} ({t(d.roleKey)})
                </span>
                <span className="text-white/60 text-3xs font-mono">
                  {d.email}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-neutral-50 min-h-screen">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xl flex flex-col gap-6">
          {/* Mobile Brand Link */}
          <div className="lg:hidden text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-neutral-900"
            >
              <span className="text-emerald-600">
                <FontAwesomeIcon icon={faSeedling} />
              </span>
              <span>
                Agblé
                <strong className="text-emerald-300 font-black">'simé</strong>
              </span>
            </Link>
          </div>

          {/* MODE TABS */}
          <div className="flex bg-neutral-100 rounded-full p-1 border border-neutral-200 gap-1">
            <button
              type="button"
              className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                mode === "login"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
              onClick={() => setMode("login")}
              id="tab-login"
            >
              {t("auth_login_title")}
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                mode === "register"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
              onClick={() => setMode("register")}
              id="tab-register"
            >
              {t("auth_register_title")}
            </button>
          </div>

          {/* ROLE SELECTOR (register only) */}
          {mode === "register" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral-700">
                {t("auth_role")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => {
                  const isActive = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition cursor-pointer text-center ${
                        isActive
                          ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                          : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300"
                      }`}
                      onClick={() => setRole(r.id)}
                      id={`role-${r.id}`}
                    >
                      <span
                        className={`text-xl ${isActive ? "text-emerald-700" : "text-neutral-500"}`}
                      >
                        <FontAwesomeIcon icon={r.icon} />
                      </span>
                      <span className="text-xs font-bold text-neutral-900 leading-tight">
                        {t(r.labelKey)}
                      </span>
                      <span className="text-4xs text-neutral-400 line-clamp-2 leading-tight">
                        {t(r.descKey)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "login" && role && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs">
                    <FontAwesomeIcon
                      icon={
                        ROLES.find((r) => r.id === role)?.icon || faSeedling
                      }
                    />
                  </div>
                  <div>
                    <div className="text-3xs font-bold text-neutral-400 uppercase tracking-wider">
                      Espace sélectionné
                    </div>
                    <div className="text-xs font-black text-emerald-900">
                      {t(`role_${role}`)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`px-2 py-1 rounded-lg text-3xs font-bold transition cursor-pointer ${
                        role === r.id
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                      }`}
                      onClick={() => {
                        setRole(r.id);
                        const d = DEMO.find(
                          (dm) => dm.roleKey === `role_${r.id}`,
                        );
                        if (d)
                          setForm((prev) => ({
                            ...prev,
                            email: d.email,
                            password: "demo123",
                          }));
                      }}
                    >
                      {r.id === "farmer"
                        ? "Agri"
                        : r.id === "merchant"
                          ? "Comm"
                          : "Camion"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "register" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-neutral-700">
                    {t("auth_name")}
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-emerald-600 transition"
                    placeholder="Kofi Mensah"
                    value={form.name}
                    onChange={handleChange}
                    required
                    id="input-name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-neutral-700">
                    {t("auth_phone")}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-emerald-600 transition"
                    placeholder="+228 90 00 00 00"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    id="input-phone"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-neutral-700">
                    {t("auth_region")}
                  </label>
                  <select
                    name="region"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:border-emerald-600 transition"
                    value={form.region}
                    onChange={handleChange}
                    id="input-region"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-neutral-700">
                {t("auth_email")}
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-emerald-600 transition"
                placeholder="vous@exemple.tg"
                value={form.email}
                onChange={handleChange}
                required
                id="input-email"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-neutral-700">
                {t("auth_password")}
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-emerald-600 transition"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                id="input-password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-sm transition cursor-pointer mt-2 disabled:opacity-50"
              disabled={loading}
              id="auth-submit-btn"
            >
              <FontAwesomeIcon
                icon={mode === "login" ? faArrowRight : faCheck}
              />
              <span>
                {loading
                  ? t("auth_loading")
                  : mode === "login"
                    ? t("auth_submit_login")
                    : t("auth_submit_register")}
              </span>
            </button>

            <div className="text-center mt-2">
              <button
                type="button"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login"
                  ? t("auth_switch_register")
                  : t("auth_switch_login")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
