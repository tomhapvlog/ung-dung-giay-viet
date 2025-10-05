import React from 'react';

type IconProps = {
  className?: string;
};

export const ShoeLogo: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V7a5 5 0 0 1 5-5h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-4.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1.5a.5.5 0 0 0 .5-.5V17a.5.5 0 0 0-.5-.5H7z"/>
        <path d="M4 22v-1a4 4 0 0 1 4-4h10"/>
    </svg>
);
export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
export const ShoeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V7a5 5 0 0 1 5-5h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-4.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H15" /><path d="M4 22v-1a4 4 0 0 1 4-4h10" />
    </svg>
);
export const CameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
);
export const GalleryIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
    </svg>
);
export const WandIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c.905 0 1.68-.61 1.93-1.464C14.015 8.94 14 8.71 14 8.5c0-.905-.61-1.68-1.464-1.93C11.94 6.485 11.71 6.5 11.5 6.5c-.905 0-1.68.61-1.93 1.464C9.485 8.56 9.5 8.79 9.5 9c0 .905.61 1.68 1.464 1.93.25.075.48.07.736.07zM12 11V3m0 8h8M3 12h8m0 0v8" />
    </svg>
);
export const LoadingSpinner: React.FC<IconProps> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
export const BackArrowIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
export const FlipIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.592l-5.33-5.33a1 1 0 011.414-1.414L12 12.764l3.916-3.916a1 1 0 111.414 1.414L12 15.592z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
    </svg>
);
export const ColorIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21a2.5 2.5 0 005 0 2.5 2.5 0 00-5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.5 16.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-2.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 00-9 9c0 4.08 2.21 7.6 5.5 8.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 019 9c0 .79-.1 1.55-.29 2.27" />
    </svg>
);
export const ShadowIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
    </svg>
);
export const EraseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 10.5V5.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006 21h10.5a2.25 2.25 0 002.25-2.25v-2.25M15.75 12h-7.5" />
    </svg>
);
export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
export const ShareIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.104-.055.215-.1.334-.14a2.25 2.25 0 012.332 2.332c-.04.119-.085.23-.14.334m0 0a2.25 2.25 0 100-2.186m0 2.186c-.104.055-.215.1-.334.14a2.25 2.25 0 00-2.332-2.332c.04-.119.085-.23.14-.334m0 0a2.25 2.25 0 002.186 0m-2.186 0c.104-.055.215-.1.334-.14a2.25 2.25 0 012.332 2.332c-.04.119-.085-.23-.14.334m-2.186 0a2.25 2.25 0 100 2.186m0 2.186c.104.055.215.1.334.14a2.25 2.25 0 002.332-2.332c-.04-.119-.085-.23-.14.334" />
    </svg>
);
export const TwitterIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085 4.93 4.93 0 004.6 3.42 9.86 9.86 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
);
export const FacebookIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88A10.003 10.003 0 0022 12z" />
    </svg>
);
export const InstagramIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zM12 0C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.26 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const SwitchCameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.695v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.664 0l-3.181 3.183" />
    </svg>
);
export const HighHeelIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5,2H8.44A4.45,4.45,0,0,0,4,6.44c0,2.45,2,4.44,4.44,4.44h.59l-4,6.67a1,1,0,0,0,.86,1.53H9v2.67a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V19.08l8.28-5.52a1,1,0,0,0,.47-1.36L19,9.45a3.83,3.83,0,0,0,1.25-1.2A4.28,4.28,0,0,0,20.8,6,3.81,3.81,0,0,0,19.5,2Z" />
    </svg>
);

export const ZaloIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <g>
            <rect width="100" height="100" rx="22" ry="22" fill="#0068FF"/>
            <path d="M20 75 C12 75 12 65 12 65 L12 35 C12 25 20 25 20 25 L80 25 C88 25 88 35 88 35 L88 65 C88 75 80 75 80 75 L35 75 L24 88 L28 75 Z" fill="white"/>
            <text x="50" y="52" fontFamily="Arial, Helvetica, sans-serif" fontSize="28" fontWeight="bold" fill="#0068FF" textAnchor="middle" dominantBaseline="middle">Zalo</text>
        </g>
    </svg>
);

export const VideoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
);