import { RECENT_DIAGNOSES } from '../data';
import { IconBell, IconMapPin, IconLeaf, IconCalendar, IconRuler, IconWarning, IconCloud, IconCheck } from './Icons';

const STATUS_COLOR: Record<string, string> = {
  'Healthy':         'var(--color-green)',
  'At Risk':         'var(--color-gold)',
  'Needs Attention': 'var(--color-rust)',
};

export default function DashboardPreview() {
  return (
    <section className="section dashboard-section" id="platform" aria-labelledby="dashboard-heading">
      <div className="container">
        <div className="section__label">PLATFORM VISION</div>
        <h2 id="dashboard-heading" className="section__title">
          One diagnosis is useful.<br />A farming intelligence platform is transformative.
        </h2>
        <p className="section__subtitle">
          Smart Farmer is building toward a full digital companion for African farmers —
          from single crop diagnosis to whole-farm intelligence.
        </p>

        <div className="dashboard-mockup" role="img" aria-label="Smart Farmer dashboard preview">
          {/* Header */}
          <div className="dash-header">
            <div className="dash-header__left">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="6" fill="#1e5c3a"/>
                <path d="M16 6C11 9 9 14 10 20C11 24 16 26 20 22C23 18 22 12 16 6Z" fill="#52b788"/>
              </svg>
              <div>
                <div className="dash-header__title">Smart Farmer</div>
                <div className="dash-header__sub">Farm Dashboard</div>
              </div>
            </div>
            <div className="dash-header__right">
              <IconBell size={18} aria-hidden={true} className="dash-header__bell" />
              <div className="dash-header__avatar" aria-hidden="true">JK</div>
            </div>
          </div>

          <div className="dash-body">
            {/* Left panel */}
            <div className="dash-panel">
              <div className="dash-widget">
                <h4 className="dash-widget__title">My Farm</h4>
                <div className="dash-farm-info">
                  <div className="dash-farm-row"><IconMapPin size={13} aria-hidden={true}/><span>Masaka District, Uganda</span></div>
                  <div className="dash-farm-row"><IconLeaf   size={13} aria-hidden={true}/><span>Cassava, Maize, Beans</span></div>
                  <div className="dash-farm-row"><IconCalendar size={13} aria-hidden={true}/><span>Planted: March 2026</span></div>
                  <div className="dash-farm-row"><IconRuler   size={13} aria-hidden={true}/><span>2.4 hectares</span></div>
                </div>
              </div>

              <div className="dash-widget">
                <h4 className="dash-widget__title">Crop Health</h4>
                <div className="dash-health">
                  <div className="dash-health__bar">
                    <div className="dash-health__seg dash-health__seg--healthy" style={{ width: '55%' }} title="Healthy 55%" />
                    <div className="dash-health__seg dash-health__seg--risk"    style={{ width: '30%' }} title="At risk 30%" />
                    <div className="dash-health__seg dash-health__seg--attn"    style={{ width: '15%' }} title="Needs attention 15%" />
                  </div>
                  <div className="dash-health__legend">
                    <span><i style={{ background: 'var(--color-green)' }} aria-hidden="true" /> Healthy</span>
                    <span><i style={{ background: 'var(--color-gold)' }}  aria-hidden="true" /> At risk</span>
                    <span><i style={{ background: 'var(--color-rust)' }}  aria-hidden="true" /> Needs attention</span>
                  </div>
                </div>
              </div>

              <div className="dash-widget">
                <h4 className="dash-widget__title">Alerts</h4>
                <ul className="dash-alerts">
                  <li className="dash-alert dash-alert--warn">
                    <IconWarning size={14} aria-hidden={true} />
                    <div><strong>Disease risk detected</strong><p>Cassava mosaic symptoms in Field A</p></div>
                  </li>
                  <li className="dash-alert dash-alert--info">
                    <IconCloud size={14} aria-hidden={true} />
                    <div><strong>Heavy rain forecast</strong><p>Next 48 hours — monitor for fungal conditions</p></div>
                  </li>
                  <li className="dash-alert dash-alert--ok">
                    <IconCheck size={14} aria-hidden={true} />
                    <div><strong>Maize crop healthy</strong><p>Last checked 1 day ago</p></div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right panel */}
            <div className="dash-panel">
              <div className="dash-widget">
                <h4 className="dash-widget__title">Recent Diagnoses</h4>
                <ul className="dash-diagnoses">
                  {RECENT_DIAGNOSES.map((d, i) => (
                    <li key={i} className="dash-diagnosis">
                      <div className="dash-diagnosis__left">
                        <span className="dash-diagnosis__crop">{d.crop}</span>
                        <span className="dash-diagnosis__result">{d.result}</span>
                      </div>
                      <div className="dash-diagnosis__right">
                        <span className="dash-diagnosis__status" style={{ color: STATUS_COLOR[d.status] ?? 'var(--color-text)' }}>{d.status}</span>
                        <span className="dash-diagnosis__time">{d.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dash-widget">
                <h4 className="dash-widget__title">Farm History</h4>
                <div className="dash-timeline">
                  {[
                    { date: 'Sep 14', event: 'Cassava Mosaic Disease detected', type: 'warn' },
                    { date: 'Sep 13', event: 'Maize checked — healthy',         type: 'ok'   },
                    { date: 'Sep 10', event: 'Tomato Early Blight detected',    type: 'warn' },
                    { date: 'Sep 5',  event: 'Cassava healthy scan',            type: 'ok'   },
                    { date: 'Aug 28', event: 'New planting season started',     type: 'info' },
                  ].map((item, i) => (
                    <div key={i} className={`dash-timeline__item dash-timeline__item--${item.type}`}>
                      <span className="dash-timeline__dot" aria-hidden="true" />
                      <span className="dash-timeline__date">{item.date}</span>
                      <span className="dash-timeline__event">{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="dashboard-section__note">
          Dashboard preview represents a future platform vision. Features shown are in development.
        </p>
      </div>
    </section>
  );
}
