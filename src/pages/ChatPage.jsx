import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { farmers, merchants, transporters } from '../data/mockData';
import ChatWindow from '../components/chat/ChatWindow';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSeedling,
  faStore,
  faTruck,
  faUsers,
  faLightbulb,
  faMagnifyingGlass,
  faXmark,
  faLocationDot,
  faComments,
} from '@fortawesome/free-solid-svg-icons';

const ALL_USERS = [...farmers, ...merchants, ...transporters];

export default function ChatPage() {
  const { user, login } = useAuth();
  const { t, getRoleName } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [contactFilter, setContactFilter] = useState('all'); // 'all', 'farmer', 'merchant', 'transporter'
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed: partnerId is string ('f1', 'm1', 't1') and NOT parsed with parseInt
  const partnerId = searchParams.get('with') || null;

  // Filter contacts: all users except currently logged-in user
  const availableContacts = useMemo(() => {
    return ALL_USERS.filter(u => {
      const isNotMe = !user || String(u.id) !== String(user.id);
      const matchesRole = contactFilter === 'all' || u.role === contactFilter;
      const matchesSearch = !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.region.toLowerCase().includes(searchQuery.toLowerCase());
      return isNotMe && matchesRole && matchesSearch;
    });
  }, [user, contactFilter, searchQuery]);

  // If no partner selected on desktop, default to the first available contact
  useEffect(() => {
    if (!partnerId && availableContacts.length > 0 && window.innerWidth > 900) {
      setSearchParams({ with: availableContacts[0].id }, { replace: true });
    }
  }, [partnerId, availableContacts, setSearchParams]);

  const handleSelectContact = (id) => {
    setSearchParams({ with: id });
    setContactsOpen(false);
  };

  const handleQuickDemoLogin = (demoRole) => {
    const creds = {
      farmer: { email: 'kofi@miabe.tg', pass: 'demo123' },
      merchant: { email: 'aissata@miabe.tg', pass: 'demo123' },
      transporter: { email: 'edem@miabe.tg', pass: 'demo123' },
    }[demoRole];
    if (creds) {
      login(creds.email, creds.pass);
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'farmer') return faSeedling;
    if (role === 'merchant') return faStore;
    return faTruck;
  };

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden font-sans">
      <Navbar />
      {user && <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col min-w-0 pt-0 md:pt-[85px] h-full">
        {/* MOBILE HEADER */}
        <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-neutral-200 font-bold text-base text-neutral-800 bg-white z-10">
          {user ? (
            <button
              type="button"
              className="text-lg p-1 text-neutral-700 hover:text-emerald-600"
              onClick={() => setSidebarOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          ) : (
            <button
              type="button"
              className="text-lg p-1 text-emerald-600"
              onClick={() => navigate('/')}
            >
              <FontAwesomeIcon icon={faSeedling} />
            </button>
          )}
          <span className="font-extrabold text-neutral-900">{t('chat_title')}</span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold"
            onClick={() => setContactsOpen(true)}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>{t('chat_view_contacts')}</span>
          </button>
        </div>

        {/* NOT LOGGED IN BANNER */}
        {!user && (
          <div className="mx-4 md:mx-6 mb-2 mt-2 md:mt-0 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 flex-wrap text-sm text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500 text-base" />
              <div>
                <strong>{t('chat_demo_banner_title')}</strong> {t('chat_demo_banner_desc')}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="px-3 py-1 text-xs font-bold rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-100 bg-white cursor-pointer transition"
                onClick={() => handleQuickDemoLogin('merchant')}
              >
                {t('auth_login_title')} Aissata ({t('role_merchant')})
              </button>
              <button
                type="button"
                className="px-3 py-1 text-xs font-bold rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-100 bg-white cursor-pointer transition"
                onClick={() => handleQuickDemoLogin('farmer')}
              >
                {t('auth_login_title')} Kofi ({t('role_farmer')})
              </button>
              <button
                type="button"
                className="px-3 py-1 text-xs font-bold rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-100 bg-white cursor-pointer transition"
                onClick={() => handleQuickDemoLogin('transporter')}
              >
                {t('auth_login_title')} Edem ({t('role_transporter')})
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden mx-0 md:mx-6 md:mb-6 rounded-none md:rounded-2xl border-t md:border border-neutral-200 shadow-xs bg-white">
          {/* CONTACTS LIST (DRAWER ON MOBILE, SIDEBAR ON DESKTOP) */}
          <aside
            className={`w-full md:w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50 fixed md:static inset-0 z-40 md:z-0 transition-transform md:translate-x-0 ${
              contactsOpen ? 'translate-x-0 bg-white' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <div>
                <h3 className="font-black text-neutral-900 text-base">
                  Contacts ({availableContacts.length})
                </h3>
                <span className="text-xs text-neutral-400">
                  {t('chat_contacts_subtitle')}
                </span>
              </div>
              <button
                type="button"
                className="md:hidden text-lg text-neutral-500 hover:text-neutral-900 p-1"
                onClick={() => setContactsOpen(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* SEARCH CONTACT */}
            <div className="p-3">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none"
                />
                <input
                  type="text"
                  placeholder={t('chat_search_placeholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-neutral-200 bg-white focus:outline-none focus:border-emerald-500 transition shadow-2xs"
                />
              </div>
            </div>

            {/* ROLE FILTER PILLS */}
            <div className="flex px-3 pb-2 gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { key: 'all', label: t('chat_filter_all') },
                { key: 'farmer', label: t('chat_filter_farmers') },
                { key: 'merchant', label: t('chat_filter_merchants') },
                { key: 'transporter', label: t('chat_filter_drivers') },
              ].map(tab => {
                const isActive = contactFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                    onClick={() => setContactFilter(tab.key)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* CONTACTS SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
              {availableContacts.map(c => {
                const roleIcon = getRoleIcon(c.role);
                const roleBadge = getRoleName(c.role);
                const isSelected = String(partnerId) === String(c.id);

                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left w-full transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 shadow-2xs'
                        : 'bg-transparent border-transparent hover:bg-neutral-100'
                    }`}
                    onClick={() => handleSelectContact(c.id)}
                    id={`select-contact-${c.id}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="font-bold text-sm text-neutral-900 truncate">{c.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-3xs font-bold text-emerald-700 flex items-center gap-1">
                          <FontAwesomeIcon icon={roleIcon} />
                          {roleBadge}
                        </span>
                        <span className="text-3xs text-neutral-400 flex items-center gap-1 truncate">
                          <FontAwesomeIcon icon={faLocationDot} className="text-4xs" />
                          {c.region}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {availableContacts.length === 0 && (
                <div className="p-8 text-center text-xs text-neutral-400">
                  {t('chat_empty_category')}
                </div>
              )}
            </div>
          </aside>

          {/* CHAT WINDOW */}
          <section className="flex-1 flex flex-col min-w-0 bg-neutral-50/30">
            {partnerId ? (
              <ChatWindow partnerId={partnerId} />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center p-8 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-3xl">
                  <FontAwesomeIcon icon={faComments} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800">{t('chat_select_convo')}</h3>
                <p className="text-sm max-w-xs text-neutral-500">{t('chat_select_convo_desc')}</p>
                <button
                  type="button"
                  className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold mt-2 shadow-xs cursor-pointer"
                  onClick={() => setContactsOpen(true)}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{t('chat_view_contacts')}</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
