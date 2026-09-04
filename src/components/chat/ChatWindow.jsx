import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faComments,
  faSeedling,
  faStore,
  faTruck,
  faLocationDot,
  faPhone,
  faMicrophone,
  faStop,
  faPaperPlane,
  faCircle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { farmers, merchants, transporters } from '../../data/mockData';

const ALL_USERS = [...farmers, ...merchants, ...transporters];

export default function ChatWindow({ partnerId }) {
  const { user } = useAuth();
  const { t, getRoleName, lang } = useLang();
  const { sendMessage, getConversation, getConversationKey } = useApp();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // String comparison because IDs are 'f1', 'm1', 't1' etc.
  const partner = ALL_USERS.find((u) => String(u.id) === String(partnerId));
  const conversationKey =
    user && partnerId ? getConversationKey(String(user.id), String(partnerId)) : null;
  const messages = conversationKey ? getConversation(String(user.id), String(partnerId)) : [];

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice recognition setup
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(t('voice_not_supported'));
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-US' : 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (e) => {
        setIsListening(false);
        if (e.error !== 'no-speech') {
          setVoiceError(`Microphone : ${e.error}`);
        }
      };

      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((r) => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setVoiceError(t('voice_error_mic'));
      setIsListening(false);
    }
  }, [lang, t]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || !user || !partnerId) return;

    const sentText = input.trim();
    sendMessage(conversationKey, String(user.id), String(partnerId), sentText);
    setInput('');

    // Simulated contextual auto-reply from partner after 1.2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const isEwe = lang === 'ewe' || lang === 'ee';
      const isEn = lang === 'en';

      const replies =
        partner?.role === 'transporter'
          ? isEwe
            ? [
                "Ŋdi na wò! Nye lɔri le mɔ dzi. Mate ŋu atrɔ adzɔnuwo na wò.",
                `Nye ga xɔxɔ nye ${partner.pricePerKm || 350} FCFA/km. Afika tututu ye woatsɔe le?`,
                "Elolo, melɔ̃ ɖe edzi! Mele lɔri la dzram ɖo hena zɔzɔ.",
                "Enyo ŋutɔ. Ne meɖo teƒe la, maƒo ka na wò enumake."
              ]
            : isEn
            ? [
                "Hello! My truck is available along this route. I can handle the delivery.",
                `My current rate is ${partner.pricePerKm || 350} FCFA/km. Where is the exact pickup point?`,
                "Deal agreed! I am preparing the truck for departure now.",
                "Perfect, everything is confirmed. I will call you upon arrival at the depot."
              ]
            : [
                "Bonjour ! Mon camion est disponible sur cet axe. Je peux assurer la livraison.",
                `Mon tarif actuel est de ${partner.pricePerKm || 350} FCFA/km. Quelle est l'adresse exacte d'enlèvement ?`,
                "C'est d'accord pour moi ! Je prépare le véhicule pour le départ.",
                "Parfait, nous sommes en accord. Je vous contacte dès mon arrivée au dépôt."
              ]
          : partner?.role === 'farmer'
          ? isEwe
            ? [
                "Ŋdi na wò! Nuwɔwɔ yeyewo le asinye le agble me.",
                "Ɛ̃, mate ŋu aɖe asi le eŋu na wò ne èƒle 500 kg alo wu nenema.",
                "Nuwɔwɔ nyuiwoe, woƒo ŋdɔ na wo nyuie. Ɣekaɣi ye nèdi be woatsɔe vɛ?",
                "Mese egɔme nyuie, mele kotokuwo dzram ɖo na lɔrikula la!"
              ]
            : isEn
            ? [
                "Hello! My stock is fresh and directly from harvest.",
                "Yes, I can offer a wholesale discount if you take 500 kg or more.",
                "High quality guaranteed, naturally sun-dried. When do you need delivery?",
                "Noted! I am packing the bags ready for the transport truck."
              ]
            : [
                "Bonjour ! Mon stock est frais et disponible à la récolte.",
                "Oui, je peux vous faire un prix de gros si vous prenez 500 kg ou plus.",
                "La qualité est garantie, séchage naturel au soleil. Quand souhaitez-vous être livré ?",
                "C'est noté, je prépare les sacs pour le transporteur !"
              ]
          : isEwe
          ? [
              "Ŋdi na wò! Asixɔxɔ kae nèna hena adzɔnu gbogbowo?",
              "Enyo ŋutɔ, kɔƒea dze ŋunye. Medo asime na wò!",
              "Lɔrikula aɖe le asiwò xoxo hena adzɔnua tsɔtsɔa?",
              "Akpe kakaka na wò dɔwɔwɔ kabakaba, míado go le asime!"
            ]
          : isEn
          ? [
              "Hello! What is your best wholesale price for a bulk order?",
              "Sounds good to me, the terms are agreeable. Order confirmed!",
              "Do you already have a transporter arranged for pickup?",
              "Thank you for the quick reply, see you at the market!"
            ]
          : [
              "Bonjour ! Quel est votre meilleur prix pour une commande groupée ?",
              "Très bien, les conditions me conviennent. Je valide la commande !",
              "Avez-vous déjà un transporteur disponible pour l'enlèvement ?",
              "Merci pour votre réactivité, à bientôt au marché !"
            ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      sendMessage(conversationKey, String(partnerId), String(user.id), randomReply);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-emerald-100 shadow-xs">
        <span className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 text-2xl mb-4">
          <FontAwesomeIcon icon={faLock} />
        </span>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{t('nav_login')}</h3>
        <p className="text-sm text-gray-500 max-w-sm">{t('chat_select_convo_desc')}</p>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-emerald-100 shadow-xs">
        <span className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 text-2xl mb-4">
          <FontAwesomeIcon icon={faComments} />
        </span>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{t('chat_select_convo')}</h3>
        <p className="text-sm text-gray-500 max-w-sm">{t('chat_select_convo_desc')}</p>
      </div>
    );
  }

  const roleIcon =
    partner.role === 'farmer' ? faSeedling : partner.role === 'merchant' ? faStore : faTruck;

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-emerald-100/80 shadow-xs overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-11 h-11 rounded-full object-cover border border-emerald-200"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">{partner.name}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                <FontAwesomeIcon icon={roleIcon} className="text-[10px]" />
                <span>{getRoleName(partner.role)}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <FontAwesomeIcon icon={faCircle} className="text-[8px] animate-pulse" />
                <span>{t('chat_online')}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
                <span>{partner.region}</span>
              </span>
              <span>·</span>
              <span>{partner.phone}</span>
            </div>
          </div>
        </div>
        <div>
          <a
            href={`tel:${partner.phone}`}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all"
            title={t('chat_call_btn')}
          >
            <FontAwesomeIcon icon={faPhone} className="text-xs" />
            <span className="hidden sm:inline">{t('chat_call_btn')}</span>
          </a>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50/40">
        {messages.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center p-6 text-center text-gray-400">
            <span className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-3">
              <FontAwesomeIcon icon={roleIcon} />
            </span>
            <h4 className="font-bold text-gray-700 text-sm mb-1">{partner.name}</h4>
            <p className="text-xs text-gray-500 max-w-xs mb-4">{t('chat_select_convo_desc')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-xs"
                onClick={() => setInput(t('chat_suggest_avail'))}
              >
                "{t('chat_suggest_avail')}"
              </button>
              <button
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-xs"
                onClick={() => setInput(t('chat_suggest_bulk'))}
              >
                "{t('chat_suggest_bulk')}"
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = String(msg.from) === String(user.id);
          return (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={partner.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover border border-emerald-200 mb-1"
                />
              )}
              <div
                className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 text-right ${
                    isMe ? 'text-emerald-100' : 'text-gray-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5 justify-start">
            <img
              src={partner.avatar}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-emerald-200 mb-1"
            />
            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* VOICE ERROR / HINT */}
      {voiceError && (
        <div className="px-4 py-2 bg-rose-50 text-rose-700 text-xs font-semibold border-t border-rose-200">
          {voiceError}
        </div>
      )}

      {/* INPUT */}
      <form
        className="p-3 border-t border-gray-100 bg-white flex items-center gap-2.5"
        onSubmit={handleSend}
      >
        {/* Voice Button */}
        <button
          type="button"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
          onClick={isListening ? stopListening : startListening}
          title={isListening ? t('chat_voice_stop') : t('chat_voice_start')}
          id="voice-btn"
        >
          <FontAwesomeIcon icon={isListening ? faStop : faMicrophone} className="text-sm" />
        </button>

        <textarea
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium resize-none max-h-24"
          placeholder={isListening ? t('chat_voice_listening') : t('chat_placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          id="chat-input"
        />

        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none shadow-xs"
          disabled={!input.trim()}
          id="chat-send-btn"
          title={t('chat_send')}
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
        </button>
      </form>
    </div>
  );
}

