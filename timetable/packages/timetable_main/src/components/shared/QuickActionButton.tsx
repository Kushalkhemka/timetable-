import React from 'react';
import { Button } from 'flowbite-react';

export type QuickActionTone = 'primary' | 'failure' | 'warning' | 'info' | 'success';

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
  tone?: QuickActionTone;
  className?: string;
  onClick?: () => void;
}

// Professional, theme-aligned palettes: neutral backgrounds with brand-colored borders/text
const toneToClasses: Record<QuickActionTone, string> = {
  primary:
    'bg-white/70 dark:bg-transparent border-blue-300/70 dark:border-blue-800 text-blue-600 dark:text-blue-300 hover:bg-blue-50/40 dark:hover:bg-blue-900/10',
  failure:
    'bg-white/70 dark:bg-transparent border-rose-300/70 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-50/40 dark:hover:bg-rose-900/10',
  warning:
    'bg-white/70 dark:bg-transparent border-amber-300/70 dark:border-amber-800 text-amber-600 dark:text-amber-300 hover:bg-amber-50/40 dark:hover:bg-amber-900/10',
  info:
    'bg-white/70 dark:bg-transparent border-cyan-300/70 dark:border-cyan-800 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-50/40 dark:hover:bg-cyan-900/10',
  success:
    'bg-white/70 dark:bg-transparent border-emerald-300/70 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10',
};

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label, icon, tone = 'primary', className, onClick }) => {
  return (
    <Button
      color="light"
      onClick={onClick}
      className={`flex h-auto w-full items-center gap-3 rounded-2xl border-2 px-5 py-4 shadow-sm transition-all hover:shadow-md ${
        toneToClasses[tone]
      } ${className || ''}`}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/60 shadow-sm text-inherit">
        {icon}
      </span>
      <span className="text-sm font-semibold leading-none">{label}</span>
    </Button>
  );
};

export default QuickActionButton;
