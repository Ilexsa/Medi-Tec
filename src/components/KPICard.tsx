import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';
interface KPICardProps {
  title: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  icon: ReactNode;
  accentColor: string;
  accentBg: string;
  index?: number;
}
export function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon,
  accentColor,
  accentBg,
  index = 0
}: KPICardProps) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{
        scale: 1.02,
        transition: {
          duration: 0.15
        }
      }}
      className="bg-white rounded-xl shadow-card border border-slate-100 p-6 cursor-default">

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
          <div className="flex items-center mt-3 gap-1.5">
            {isNeutral ?
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                <MinusIcon className="w-3 h-3" />
                Sin cambios
              </span> :
            isPositive ?
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUpIcon className="w-3 h-3" />+{trend}%
              </span> :

            <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                <TrendingDownIcon className="w-3 h-3" />
                {trend}%
              </span>
            }
            <span className="text-xs text-slate-400">{trendLabel}</span>
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: accentBg
          }}>

          <span
            style={{
              color: accentColor
            }}>

            {icon}
          </span>
        </div>
      </div>
    </motion.div>);

}