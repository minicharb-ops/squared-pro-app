import React from 'react';
import { useBilling, LOCKED_TOOL_CODES } from './BillingContext';
import { Lock, CheckCircle2, Zap } from 'lucide-react';

export const ProUnlockModal = ({ activeToolId }) => {
  const { isPro, proPrice, purchasePro, restorePurchases } = useBilling();

  if (isPro) return null;

  const lockedTool = LOCKED_TOOL_CODES.find(tool => tool.id === activeToolId);
  if (!lockedTool) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center pt-12 bg-black/80 backdrop-blur-sm p-4 text-left rounded-2xl transition-all duration-300">
      <div className="relative bg-[#0f1115] border border-amber-500/30 p-6 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-inner">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Pro Access</h2>
            <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              {lockedTool.name} is locked
            </p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Upgrade once to instantly unlock <strong className="text-white font-bold">{lockedTool.name}</strong> and save hours of manual math on site. 
        </p>

        <div className="space-y-3 mb-8">
          {[
            'Unlock all 15+ Advanced Tools',
            'Complex Framing & Concrete Math',
            'One-time payment. Zero subscriptions.'
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-sm font-medium text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button 
            onClick={purchasePro}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-4 px-4 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all"
          >
            <Zap className="w-5 h-5" fill="currentColor" />
            <span>Unlock For {proPrice}</span>
          </button>

          <button 
            onClick={() => restorePurchases(true)} 
            className="w-full py-3 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Already purchased? Restore
          </button>
        </div>
      </div>
    </div>
  );
};