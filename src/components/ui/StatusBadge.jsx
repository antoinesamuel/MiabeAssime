import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleDollarToSlot,
  faCircleXmark,
  faClock,
  faTruckFast,
  faBan,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../../context/LangContext';

const ICONS = {
  available: faCircleCheck,
  paid: faCircleDollarToSlot,
  out: faCircleXmark,
  pending: faClock,
  transit: faTruckFast,
  delivered: faCircleCheck,
  cancelled: faBan,
};

const COLOR_MAP = {
  available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  paid: 'bg-amber-100 text-amber-800 border-amber-200',
  out: 'bg-rose-100 text-rose-800 border-rose-200',
  pending: 'bg-amber-50 text-amber-900 border-amber-200',
  transit: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

const KEY_MAP = {
  available: 'status_available',
  paid: 'status_paid',
  out: 'status_out',
  pending: 'order_status_pending',
  transit: 'order_status_transit',
  delivered: 'order_status_delivered',
  cancelled: 'order_status_cancelled',
};

export default function StatusBadge({ status, size = 'md' }) {
  const { t } = useLang();
  const icon = ICONS[status] || faCircleInfo;
  const transKey = KEY_MAP[status];
  const label = transKey ? t(transKey) : status;
  const colorClass = COLOR_MAP[status] || COLOR_MAP.default;

  const sizeClass = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size] || 'text-xs font-semibold px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${colorClass} ${sizeClass}`}
    >
      <FontAwesomeIcon icon={icon} className="text-[11px]" />
      <span>{label}</span>
    </span>
  );
}

