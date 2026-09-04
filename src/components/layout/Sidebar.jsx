import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faSeedling,
  faBoxesStacked,
  faCartShopping,
  faChartLine,
  faComments,
  faHouse,
  faTruck,
  faMapLocationDot,
  faGlobe,
  faRightFromBracket,
  faCircleCheck,
  faStore,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';

const FARMER_MENU = [
  { icon: faChartPie, labelKey: 'farmer_dashboard', to: '/agriculteur' },
  { icon: faSeedling, labelKey: 'farmer_products', to: '/agriculteur/produits' },
  { icon: faBoxesStacked, labelKey: 'farmer_orders', to: '/agriculteur/commandes' },
  { icon: faCartShopping, labelKey: 'nav_market', to: '/marketplace' },
  { icon: faChartLine, labelKey: 'nav_trends', to: '/tendances' },
  { icon: faComments, labelKey: 'nav_chat', to: '/chat' },
];

const MERCHANT_MENU = [
  { icon: faHouse, labelKey: 'merchant_dashboard', to: '/commercant' },
  { icon: faCartShopping, labelKey: 'nav_market', to: '/marketplace' },
  { icon: faBoxesStacked, labelKey: 'merchant_orders', to: '/commercant/commandes' },
  { icon: faTruck, labelKey: 'nav_transport', to: '/transport' },
  { icon: faChartLine, labelKey: 'nav_trends', to: '/tendances' },
  { icon: faComments, labelKey: 'nav_chat', to: '/chat' },
];

const TRANSPORTER_MENU = [
  { icon: faMapLocationDot, labelKey: 'transport_dashboard', to: '/transporteur' },
  { icon: faTruck, labelKey: 'transport_my_routes', to: '/transporteur/trajets' },
  { icon: faBoxesStacked, labelKey: 'merchant_orders', to: '/transporteur/livraisons' },
  { icon: faComments, labelKey: 'nav_chat', to: '/chat' },
];

const MENU_MAP = { farmer: FARMER_MENU, merchant: MERCHANT_MENU, transporter: TRANSPORTER_MENU };

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const { t, getRoleName } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const menu = MENU_MAP[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose?.();
  };

  const roleIcon = { farmer: faSeedling, merchant: faStore, transporter: faTruck }[user.role] || faUser;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white/95 backdrop-blur-md border-r border-emerald-100/80 flex flex-col p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:static lg:shadow-none'
        }`}
      >
        {/* USER CARD */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-gray-900 text-sm truncate">{user.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <FontAwesomeIcon icon={roleIcon} className="text-xs" />
              <span>{getRoleName(user.role)}</span>
            </div>
            {user.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
                <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
                <span>{t('verified_badge')}</span>
              </span>
            )}
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {menu.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
                }`}
                onClick={onClose}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-4 text-center ${isActive ? 'text-white' : 'text-emerald-600'}`}
                />
                <span className="truncate">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-1.5 mt-auto">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70 transition-all"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faGlobe} className="w-4 text-emerald-600" />
            <span>{t('nav_home')}</span>
          </Link>
          <button
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full text-left"
            onClick={handleLogout}
            id="sidebar-logout"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
            <span>{t('nav_logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

