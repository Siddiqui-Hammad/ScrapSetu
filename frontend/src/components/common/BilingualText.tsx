'use client';

import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Languages } from 'lucide-react';

interface BilingualTextProps {
  en: string;
  hi: string;
  className?: string;
  showIcon?: boolean;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  en,
  hi,
  className = '',
  showIcon = false,
}) => {
  const { language } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  const primaryText = language === 'hi' ? hi : en;
  const secondaryText = language === 'hi' ? en : hi;
  const secondaryLangLabel = language === 'hi' ? 'English' : 'हिंदी';

  return (
    <span
      className={`relative inline-block cursor-help ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="inline-flex items-center gap-1 border-b border-dashed border-emerald-500/40 hover:border-emerald-400 transition-colors">
        {showIcon && <Languages className="w-3.5 h-3.5 text-emerald-400 inline" />}
        <span>{primaryText}</span>
      </span>

      {/* Floating Bilingual Translation Tooltip */}
      {isHovered && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 px-2.5 py-1.5 rounded-xl bg-zinc-950 text-white text-[11px] font-semibold whitespace-nowrap shadow-xl border border-emerald-500/40 backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-none flex items-center gap-1.5">
          <span className="text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
            {secondaryLangLabel}
          </span>
          <span className="text-zinc-100 font-bold">{secondaryText}</span>
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-zinc-950 border-r border-b border-emerald-500/40 rotate-45 -mt-1" />
        </span>
      )}
    </span>
  );
};
