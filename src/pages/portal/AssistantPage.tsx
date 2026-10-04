import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { t, LOCALE_LABELS, type Locale } from '../../i18n/translations';
import { mockAuthService } from '../../auth/mockAuthService';
import { sendChatMessage } from '../../services/chatService';
import type { ChatConversation, ChatMessage } from '../../types';
import {
  IconMessageCircle, IconArrowRight, IconWarning,
  IconInfo, IconStar, IconLeaf,
} from '../../components/Icons';

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

/**
 * System prompt lives in backend/bedrock_chat.py (SMARTFARMER_SYSTEM_PROMPT).
 * The frontend sends the conversation history; the backend owns the prompt.
 */

export default function AssistantPage() {
  const {
    user, quota, locale: appLocale, consumeChat, resetDemoChatCredits, setLocale,
  } = useAuth();
  const [locale,   setLocalLocale] = useState<Locale>(appLocale);
  const [convos,   setConvos]   = useState<ChatConversation[]>([]);
  const [active,   setActive]   = useState<ChatConversation | null>(null);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatUsed  = quota?.chatCreditsUsedToday  ?? 0;
  const chatLimit = quota?.chatLimitDaily ?? 5;
  const chatLeft  = Math.max(0, chatLimit - chatUsed);
  const outOfCredits = chatLeft <= 0;

  useEffect(() => {
    if (user?.id) {
      mockAuthService.getConversations(user.id).then(c => {
        setConvos(c);
        if (c.length > 0) setActive(c[0]);
      });
    }
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length, typing]);

  function newConversation() {
    const convo: ChatConversation = {
      id: uid(),
      userId: user?.id ?? '',
      title: 'New Chat',
      messages: [],
      locale,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConvos(prev => [convo, ...prev]);
    setActive(convo);
  }

  async function send() {
    if (!input.trim() || !active || typing || outOfCredits) return;

    const ok = await consumeChat();
    if (!ok) return;

    const userMsg: ChatMessage = {
      id: uid(), conversationId: active.id, role: 'user',
      content: input.trim(), locale, creditConsumed: true,
      timestamp: new Date().toISOString(),
    };

    const updated: ChatConversation = {
      ...active,
      messages: [...active.messages, userMsg],
      updatedAt: new Date().toISOString(),
      title: active.messages.length === 0 ? input.trim().slice(0, 40) : active.title,
    };
    setActive(updated);
    setConvos(prev => prev.map(c => c.id === updated.id ? updated : c));
    setInput('');
    setTyping(true);

    try {
      // Send full conversation history (including the new user message) to
      // the backend. The backend forwards it to Bedrock with the Kebeera
      // system prompt and returns the assistant's reply.
      const reply = await sendChatMessage(updated.messages, locale);

      const aiMsg: ChatMessage = {
        id: uid(), conversationId: active.id, role: 'assistant',
        content: reply, locale, creditConsumed: false,
        timestamp: new Date().toISOString(),
      };
      const final = {
        ...updated,
        messages: [...updated.messages, aiMsg],
        updatedAt: new Date().toISOString(),
      };
      setActive(final);
      setConvos(prev => prev.map(c => c.id === final.id ? final : c));
      if (user?.id) await mockAuthService.saveConversation(user.id, final);
    } catch (err: unknown) {
      // Use the backend's user-facing message when available; fall back to the
      // generic translation string so the farmer always sees something sensible.
      const userMessage =
        (err as { userMessage?: string }).userMessage ?? t(locale, 'assistantError');

      const errMsg: ChatMessage = {
        id: uid(), conversationId: active.id, role: 'assistant',
        content: userMessage, locale, creditConsumed: false,
        timestamp: new Date().toISOString(), isError: true,
      };
      const withErr = { ...updated, messages: [...updated.messages, errMsg] };
      setActive(withErr);
      setConvos(prev => prev.map(c => c.id === withErr.id ? withErr : c));
    } finally {
      setTyping(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const SUGGESTS = [
    t(locale, 'assistantSuggest1'),
    t(locale, 'assistantSuggest2'),
    t(locale, 'assistantSuggest3'),
    t(locale, 'assistantSuggest4'),
  ];

  return (
    <div className="assistant-page">
      {/* Sidebar */}
      <div className="assistant-sidebar">
        <button className="btn btn--primary assistant-new-btn" onClick={newConversation}>
          <IconMessageCircle size={15} /> {t(locale, 'assistantNewChat')}
        </button>

        <div className="assistant-credits-display">
          <IconStar size={14} />
          <span>{chatLeft} {t(locale, 'assistantCreditsLeft')}</span>
          {user?.isDemo && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={resetDemoChatCredits}
              style={{ fontSize: '0.75rem', padding: '4px 8px', marginLeft: 'auto' }}
            >
              {t(locale, 'assistantRefreshCredits')}
            </button>
          )}
        </div>

        <div className="assistant-convo-list">
          {convos.map(c => (
            <button
              key={c.id}
              className={`assistant-convo-item${active?.id === c.id ? ' assistant-convo-item--active' : ''}`}
              onClick={() => setActive(c)}
            >
              <span className="assistant-convo-title">{c.title || 'Chat'}</span>
              <span className="assistant-convo-date">
                {new Date(c.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </span>
            </button>
          ))}
        </div>

        {/* Language switcher */}
        <div className="assistant-lang">
          <span className="assistant-lang-label">{t(locale, 'assistantLanguageSwitch')}:</span>
          <div className="lang-switcher" style={{ marginBottom: 0 }}>
            {(['en', 'lg', 'nyn'] as Locale[]).map(l => (
              <button key={l} type="button"
                className={`lang-btn${locale === l ? ' lang-btn--active' : ''}`}
                onClick={() => { setLocalLocale(l); setLocale(l); }}
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="assistant-chat">
        {/* Disclaimer toggle */}
        <div className="assistant-disclaimer-bar">
          <button
            className="assistant-disclaimer-toggle"
            onClick={() => setShowInfo(v => !v)}
            aria-expanded={showInfo}
          >
            <IconInfo size={13} /> {t(locale, 'assistantDisclaimerTitle')}
          </button>
          {showInfo && (
            <div className="assistant-disclaimer-body">
              <p>{t(locale, 'assistantDisclaimerBody')}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="assistant-messages" role="log" aria-live="polite">
          {(!active || active.messages.length === 0) && (
            <div className="assistant-welcome">
              <div className="assistant-welcome-icon"><IconLeaf size={36} /></div>
              <h3>{t(locale, 'assistantTitle')}</h3>
              <p>{t(locale, 'assistantSub')}</p>
              <div className="assistant-suggests">
                {SUGGESTS.map((s, i) => (
                  <button
                    key={i}
                    className="assistant-suggest-btn"
                    onClick={() => { setInput(s); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active?.messages.map(msg => (
            <div
              key={msg.id}
              className={`assistant-msg assistant-msg--${msg.role}${msg.isError ? ' assistant-msg--error' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="assistant-msg-avatar"><IconLeaf size={14} /></div>
              )}
              <div className="assistant-msg-bubble">
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: i > 0 ? '4px 0 0' : 0 }}>{line}</p>
                ))}
                <span className="assistant-msg-time">
                  {new Date(msg.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  {msg.creditConsumed && ' · 1 credit used'}
                </span>
              </div>
            </div>
          ))}

          {typing && (
            <div className="assistant-msg assistant-msg--assistant">
              <div className="assistant-msg-avatar"><IconLeaf size={14} /></div>
              <div className="assistant-msg-bubble assistant-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="assistant-input-area">
          {outOfCredits && (
            <div className="assistant-out-of-credits">
              <IconWarning size={14} />
              <span>{t(locale, 'assistantOutOfCredits')}</span>
              <button className="btn btn--primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => {}}>
                <IconStar size={13} /> {t(locale, 'assistantGetMoreCredits')}
              </button>
            </div>
          )}
          {!outOfCredits && chatLeft === 1 && (
            <p className="assistant-credit-warning">
              <IconWarning size={13} /> {t(locale, 'assistantCreditWarning')}
            </p>
          )}
          <div className="assistant-input-row">
            <textarea
              className="assistant-input"
              placeholder={outOfCredits ? t(locale, 'assistantOutOfCredits') : t(locale, 'assistantPlaceholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              disabled={outOfCredits || typing}
              aria-label={t(locale, 'assistantPlaceholder')}
            />
            <button
              className="btn btn--primary assistant-send-btn"
              onClick={send}
              disabled={!input.trim() || typing || outOfCredits}
              aria-label={t(locale, 'assistantSend')}
            >
              <IconArrowRight size={18} />
            </button>
          </div>
          <p className="assistant-input-hint">
            {chatLeft} {t(locale, 'assistantCreditsLeft')} · Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
