/* ─────────────────────────────────────────────────────────
   SmartFarmer Icon Library — inline SVG, no emoji, no deps
   All icons accept className + size props.
   ───────────────────────────────────────────────────────── */

interface IconProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  color?: string;
}

const base = (size = 20, extra = '') =>
  ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.75', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: extra || undefined, 'aria-hidden': true as const });

/* Navigation & UI */
export const IconArrowRight  = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
export const IconArrowDown   = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M12 5v14M5 12l7 7 7-7"/></svg>;
export const IconChevronDown = ({ size=18, className='' }: IconProps) => <svg {...base(size,className)}><polyline points="6 9 12 15 18 9"/></svg>;
export const IconChevronRight= ({ size=18, className='' }: IconProps) => <svg {...base(size,className)}><polyline points="9 18 15 12 9 6"/></svg>;
export const IconMenu        = ({ size=22, className='' }: IconProps) => <svg {...base(size,className)}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
export const IconX           = ({ size=22, className='' }: IconProps) => <svg {...base(size,className)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
export const IconCheck       = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><polyline points="20 6 9 17 4 12"/></svg>;
export const IconInfo        = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
export const IconShield      = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
export const IconExternalLink= ({ size=14, className='' }: IconProps) => <svg {...base(size,className)}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
export const IconUpload      = ({ size=48, className='' }: IconProps) => <svg {...base(size,className)}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
export const IconSearch      = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
export const IconClose       = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
export const IconBell        = ({ size=18, className='' }: IconProps) => <svg {...base(size,className)}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
export const IconClock       = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
export const IconWarning     = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

/* Agriculture & Crops */
export const IconLeaf        = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M2 22s4-2 10-8c4-4 6-8 6-12 0 0-4 2-10 8-4 4-6 8-6 12z"/><path d="M2 22l20-20"/></svg>;
export const IconSprout      = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8-6 8-12V7a1 1 0 00-1-1h-1.5"/><path d="M8.5 6A1 1 0 007 7v1c0 6 2.5 9.5 8 12"/><path d="M6 7.5C3.5 7.5 2 9.5 2 11c0 3 3 6 6 9"/></svg>;
export const IconSun         = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>;
export const IconDroplets    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.09 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0014 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 01-11.91 4.97"/></svg>;
export const IconMap         = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
export const IconMapPin      = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
export const IconCalendar    = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
export const IconRuler       = ({ size=16, className='' }: IconProps) => <svg {...base(size,className)}><path d="M21.3 8.7l-8-8a1 1 0 00-1.4 0l-10.2 10.2a1 1 0 000 1.4l8 8a1 1 0 001.4 0L21.3 10a1 1 0 000-1.3z"/><path d="M7.5 10.5l2-2M10.5 13.5l2-2M13.5 16.5l2-2M4.5 7.5l2-2"/></svg>;

/* Technology & AI */
export const IconCpu         = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
export const IconBrain       = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M12 5a3 3 0 10-5.997.125 4 4 0 00-2.526 5.77 4 4 0 00.556 6.588A4 4 0 1012 18Z"/><path d="M12 5a3 3 0 115.997.125 4 4 0 012.526 5.77 4 4 0 01-.556 6.588A4 4 0 1112 18Z"/><path d="M15 13a4.5 4.5 0 01-3-4 4.5 4.5 0 01-3 4"/><path d="M17.599 6.5a3 3 0 00.399-1.375"/><path d="M6.003 5.125A3 3 0 006.401 6.5"/><path d="M3.477 10.896a4 4 0 01.585-.396"/><path d="M19.938 10.5a4 4 0 01.585.396"/><path d="M6 18a4 4 0 01-1.967-.516"/><path d="M19.967 17.484A4 4 0 0118 18"/></svg>;
export const IconEye         = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
export const IconBarChart    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
export const IconTrendingUp  = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
export const IconDatabase    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
export const IconLayers      = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
export const IconZap         = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
export const IconActivity    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
export const IconScan        = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>;
export const IconRefresh     = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>;

/* People & Organization */
export const IconUsers       = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
export const IconUser        = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
export const IconUserCheck   = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;
export const IconBuilding    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01"/></svg>;
export const IconGlobe       = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
export const IconHandshake   = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>;
export const IconHeartHandshake= ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 000 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 013.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>;

/* Communication & Media */
export const IconMail        = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
export const IconPhone       = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>;
export const IconSmartphone  = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
export const IconMonitor     = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
export const IconCamera      = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
export const IconMessageCircle = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;

/* Business & Finance */
export const IconTarget      = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
export const IconLock        = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
export const IconUnlock      = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>;
export const IconFileText    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
export const IconBookOpen    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>;
export const IconPackage     = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
export const IconAward       = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
export const IconStar        = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

/* Network & Connectivity */
export const IconWifi        = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
export const IconWifiOff     = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a11 11 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.56 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
export const IconCloud       = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>;
export const IconCloudOff    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M22.61 16.95A5 5 0 0018 10h-1.26a8 8 0 00-7.05-6M5 5a8 8 0 004 15h9a5 5 0 001.7-.3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
export const IconShare       = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;

/* Weather & Environment */
export const IconCloud2      = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M17.5 19H9a7 7 0 01-7-7h0a7 7 0 017-7h.5"/><path d="M22 12a5 5 0 00-5-5h-1"/><line x1="20" y1="22" x2="20.01" y2="22"/></svg>;
export const IconThermometer = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>;
export const IconMountain    = ({ size=20, className='' }: IconProps) => <svg {...base(size,className)}><path d="M8 3L3 22h18L14 10l-3 4-3-11z"/></svg>;

/* Logo leaf mark */
export const LogoMark = ({ size = 32, className = '' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className || undefined}
    aria-hidden="true"
  >
    <rect width="32" height="32" rx="8" fill="#1e5c3a" />
    <path
      d="M16 6C11 9 9 14 10 20C11 24 16 26 20 22C23 18 22 12 16 6Z"
      fill="#52b788"
    />
    <path d="M16 6L16 26" stroke="#1a4731" strokeWidth="1.5" />
    <path d="M16 13C13.5 13.5 12 16 12.5 18" stroke="#1a4731" strokeWidth="1" opacity="0.7" />
    <path d="M16 13C18.5 13.5 20 16 19.5 18" stroke="#1a4731" strokeWidth="1" opacity="0.7" />
  </svg>
);
