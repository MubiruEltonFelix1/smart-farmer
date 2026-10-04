import { useAuth } from '../../auth/AuthContext';
import { useRouter } from '../../router';
import { t } from '../../i18n/translations';
import type { PlanConfig } from '../../types';
import {
  IconCheck, IconX, IconStar, IconArrowRight,
  IconWarning, IconClock, IconInfo,
} from '../../components/Icons';

const PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Free',
    priceUSD: 0,
    scanLimitDaily: 3,
    chatLimitDaily: 5,
    historyDays: 30,
    features: [
      '3 crop scans per day',
      '5 AI assistant credits per day',
      'Scan history: last 30 days',
      'Basic weather forecast',
      'Nearby outbreak summary',
      'English, Luganda & Runyankole',
      'No payment required',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceUSD: null,
    scanLimitMonthly: 30,
    chatLimitMonthly: 50,
    historyDays: null,
    features: [
      '30 crop scans per month',
      '50 AI assistant credits per month',
      'Full scan history — lifetime',
      'Extended 7-day forecast + proactive alerts',
      'Faster & richer outbreak alerts',
      'Downloadable scan reports',
      'Priority extension officer escalation',
      'No ads or promotional interruptions',
    ],
  },
];

const FREE_RESTRICTIONS: Record<string, boolean> = {
  'Scan history: last 30 days': true,
  'Basic weather forecast': true,
  'Nearby outbreak summary': true,
};

export default function PlansPage() {
  const { user, quota, locale } = useAuth();
  const { navigate } = useRouter();

  const isProUser = user?.plan === 'pro';
  const scanUsed  = quota?.scansUsedToday ?? 0;
  const scanLimit = quota?.scanLimitDaily ?? 3;
  const chatUsed  = quota?.chatCreditsUsedToday ?? 0;
  const chatLimit = quota?.chatLimitDaily ?? 5;

  return (
    <div className="plans-page">
      {/* Current usage */}
      <div className="plans-usage-card">
        <h3 className="plans-usage-title">
          {t(locale, 'planCreditsBalance')}
          <span className="plans-usage-plan">{isProUser ? 'Pro' : 'Free'}</span>
        </h3>
        <div className="plans-usage-grid">
          <div className="plans-usage-stat">
            <span className="plans-usage-stat__label">{t(locale, 'planScansRemaining')}</span>
            <span className="plans-usage-stat__val">{scanLimit - scanUsed} / {scanLimit}</span>
            <div className="plans-usage-bar">
              <div className="plans-usage-bar__fill"
                style={{ width: `${Math.min((scanUsed / scanLimit) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="plans-usage-stat">
            <span className="plans-usage-stat__label">{t(locale, 'planChatsRemaining')}</span>
            <span className="plans-usage-stat__val">{chatLimit - chatUsed} / {chatLimit}</span>
            <div className="plans-usage-bar">
              <div className="plans-usage-bar__fill"
                style={{ width: `${Math.min((chatUsed / chatLimit) * 100, 100)}%` }} />
            </div>
          </div>
          {quota && (
            <div className="plans-usage-stat">
              <span className="plans-usage-stat__label">{t(locale, 'planResetDate')}</span>
              <span className="plans-usage-stat__val">
                <IconClock size={13} /> {new Date(quota.resetDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div className="plans-grid">
        {PLANS.map(plan => {
          const isCurrent = user?.plan === plan.id;
          const isPro = plan.id === 'pro';
          return (
            <div
              key={plan.id}
              className={`plans-card${isPro ? ' plans-card--pro' : ''}${isCurrent ? ' plans-card--current' : ''}`}
            >
              {isPro && (
                <div className="plans-card__badge">
                  <IconStar size={12} /> Recommended
                </div>
              )}
              <div className="plans-card__header">
                <h3 className="plans-card__name">{plan.name}</h3>
                <div className="plans-card__price">
                  {plan.priceUSD === 0
                    ? <span className="plans-card__price-free">{t(locale, 'planFreePrice')}</span>
                    : <>
                        <span className="plans-card__price-amount">{t(locale, 'planProPrice')}</span>
                        <span className="plans-card__price-period">{t(locale, 'planPerMonth')}</span>
                      </>
                  }
                </div>
              </div>

              <ul className="plans-feature-list">
                {plan.features.map(f => {
                  const limited = !isPro && FREE_RESTRICTIONS[f];
                  return (
                    <li key={f} className={`plans-feature${limited ? ' plans-feature--limited' : ''}`}>
                      {isPro || !limited
                        ? <IconCheck size={14} className="plans-feature__icon plans-feature__icon--ok" />
                        : <IconWarning size={14} className="plans-feature__icon plans-feature__icon--warn" />
                      }
                      {f}
                    </li>
                  );
                })}
                {!isPro && (
                  <>
                    <li className="plans-feature plans-feature--no">
                      <IconX size={14} className="plans-feature__icon plans-feature__icon--no" />
                      Full scan history
                    </li>
                    <li className="plans-feature plans-feature--no">
                      <IconX size={14} className="plans-feature__icon plans-feature__icon--no" />
                      Downloadable reports
                    </li>
                  </>
                )}
              </ul>

              <div className="plans-card__action">
                {isCurrent ? (
                  <button className="btn btn--ghost plans-card__cta" disabled>
                    <IconCheck size={14} /> {t(locale, 'planCurrent')}
                  </button>
                ) : isPro ? (
                  <div>
                    <button
                      className="btn btn--primary plans-card__cta"
                      onClick={() => {/* checkout placeholder */}}
                    >
                      {t(locale, 'planUpgrade')} <IconArrowRight size={14} />
                    </button>
                    <div className="plans-billing-notice">
                      <IconInfo size={12} />
                      <span>{t(locale, 'planBillingSetupRequired')}</span>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn--ghost plans-card__cta" onClick={() => navigate('/portal/dashboard')}>
                    Continue Free <IconArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="plans-disclaimer">
        <IconInfo size={13} /> All limits are configurable. Contact us for enterprise and cooperative pricing.
        Billing integration requires additional setup — see README for configuration.
      </p>
    </div>
  );
}
