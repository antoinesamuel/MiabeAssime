import { createContext, useContext, useState } from 'react';
import translations from '../data/translations';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('miabe_lang') || 'fr');

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('miabe_lang', newLang);
  };

  const t = (key) => {
    const dict = translations[lang] || translations.fr;
    return dict[key] || translations.fr[key] || key;
  };

  const PRODUCT_NAME_MAP = {
    'Maïs Blanc': { en: 'White Corn', ewe: 'Bli Ɣie' },
    'Manioc Frais': { en: 'Fresh Cassava', ewe: 'Agbeli Mumue' },
    'Tomates Roma': { en: 'Roma Tomatoes', ewe: 'Tomatoe' },
    'Piment Frais': { en: 'Fresh Chili Pepper', ewe: 'Atadi Mumue' },
    'Igname Blanc': { en: 'White Yam', ewe: 'Te Ɣie' },
    'Riz Local': { en: 'Local Rice', ewe: 'Molu' },
    'Arachides Décortiquées': { en: 'Shelled Peanuts', ewe: 'Azi' },
    'Soja Grain': { en: 'Soybeans', ewe: 'Soja' },
    'Soja Bio': { en: 'Organic Soybeans', ewe: 'Soja' },
    'Plantain Mûr': { en: 'Ripe Plantain', ewe: 'Ablada Bi' },
    'Oignons Bulbe': { en: 'Onion Bulbs', ewe: 'Sabala' },
    'Sésame': { en: 'Sesame', ewe: 'Sesame' },
    'Sorgho': { en: 'Sorghum', ewe: 'Fofo' },
    'Mil': { en: 'Millet', ewe: 'Li' },
  };

  const getProductName = (product) => {
    if (!product) return '';
    if (typeof product === 'string') {
      const isEwe = lang === 'ewe' || lang === 'ee';
      if (PRODUCT_NAME_MAP[product]) {
        if (isEwe) return PRODUCT_NAME_MAP[product].ewe;
        if (lang === 'en') return PRODUCT_NAME_MAP[product].en;
        return product;
      }
      return product;
    }
    if ((lang === 'ewe' || lang === 'ee') && product.nameEwe) return product.nameEwe;
    if (lang === 'en' && product.nameEn) return product.nameEn;
    return product.name || '';
  };

  const CATEGORY_KEYS = {
    'Céréales': 'cat_cereals',
    'Tubercules': 'cat_tubers',
    'Légumes': 'cat_vegetables',
    'Fruits': 'cat_fruits',
    'Légumineuses': 'cat_legumes',
    'Épices': 'cat_spices',
    'Coton': 'cat_cotton',
  };

  const getCategoryName = (category) => {
    if (!category) return '';
    const key = CATEGORY_KEYS[category];
    return key ? t(key) : category;
  };

  const getRoleName = (role) => {
    if (!role) return '';
    if (role === 'farmer') return t('role_farmer');
    if (role === 'merchant') return t('role_merchant');
    if (role === 'transporter') return t('role_transporter');
    return role;
  };

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t, getProductName, getCategoryName, getRoleName }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
};
