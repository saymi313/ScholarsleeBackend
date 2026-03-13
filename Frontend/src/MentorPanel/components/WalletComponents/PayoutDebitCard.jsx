import React from 'react';
import { CreditCard, Trash2, CheckCircle2, Building2, PhoneCall, Mail, Edit3 } from 'lucide-react';

const PayoutDebitCard = ({ method, onDelete, onEdit, isDefault }) => {
    const maskNumber = (number) => {
        if (!number) return '•••• •••• •••• ••••';
        const clean = number.replace(/\s/g, '');
        if (clean.length > 8) {
            const last4 = clean.slice(-4);
            return `•••• •••• •••• ${last4}`;
        }
        return number;
    };

    return (
        <div className="relative group w-full max-w-[400px] h-auto aspect-[1.586/1] perspective-[1000px]">
            <div className={`relative w-full h-full rounded-2xl md:rounded-3xl p-4 sm:p-8 overflow-hidden transition-all duration-700
                bg-gradient-to-br from-[#1a1c2c] via-[#24243e] to-[#0f0c29]
                border border-white/10 shadow-2xl
                group-hover:rotate-y-6 group-hover:rotate-x-3 group-hover:scale-[1.03]
                flex flex-col justify-between
                before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] before:opacity-[0.03] before:pointer-events-none`}>

                {/* Gloss Reflection Sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none" />

                {/* Glassy Overlay for Luxe depth */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/[0.02] rounded-b-[4rem] blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col gap-2 sm:gap-4">
                        {/* Golden Chip */}
                        <div className="w-10 h-8 sm:w-14 sm:h-11 rounded-lg relative overflow-hidden bg-gradient-to-br from-[#f1c40f] via-[#d4af37] to-[#8e44ad]/20 shadow-lg border border-white/20">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/20" />
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/20" />
                            <div className="absolute inset-2 border border-black/10 rounded-[2px]" />
                        </div>

                        {/* Contactless Icon */}
                        <div className="w-4 h-4 sm:w-6 sm:h-6 text-white/20 rotate-90 ml-1 sm:ml-2">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 8c2-2 5-2 7 0" />
                                <path d="M3 5c4-4 10-4 14 0" />
                                <path d="M7 11c1-1 2-1 3 0" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 sm:gap-2">
                        <div className="p-2 sm:px-4 sm:py-2 bg-white/5 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/10 shadow-inner flex items-center justify-center">
                            <Building2 size={18} className="text-gray-200" />
                        </div>
                        {isDefault && (
                            <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[8px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Primary</span>
                            </div>
                        )}
                        <span className="text-[8px] sm:text-[9px] text-white/30 font-black uppercase tracking-[0.3em] mt-1">{method.country || 'Global'}</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-[8px] sm:text-[10px] text-white/20 font-bold uppercase tracking-[0.4em] mb-1 flex justify-between">
                        <span>{method.bankName || 'Premium Card'}</span>
                    </p>
                    <p className="text-lg sm:text-2xl font-mono text-white tracking-[0.1em] sm:tracking-[0.15em] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {maskNumber(method.accountNumber)}
                    </p>
                </div>

                <div className="flex justify-between items-end relative z-10 border-t border-white/5 pt-2 sm:pt-4">
                    <div className="flex flex-col">
                        <p className="text-[8px] sm:text-[10px] text-white/20 font-bold uppercase tracking-tighter mb-0.5 italic">Card Holder</p>
                        <p className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase truncate max-w-[120px] sm:max-w-[180px]">
                            {method.accountTitle || 'SCHOLAR SLEE MENTOR'}
                        </p>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                        <button
                            onClick={() => onEdit(method)}
                            className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl sm:rounded-2xl transition-all backdrop-blur-md border border-white/5 hover:border-white/20 shadow-xl"
                        >
                            <Edit3 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(method._id)}
                            className="p-2 sm:p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl sm:rounded-2xl transition-all backdrop-blur-md border border-rose-500/10 hover:border-rose-500/30"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>


                <div className="absolute bottom-6 right-24 w-12 h-8 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="absolute top-4 sm:top-7 left-1/2 -translate-x-1/2 text-white/[0.03] font-black text-lg sm:text-2xl italic select-none pointer-events-none uppercase whitespace-nowrap z-0">
                    Scholarslee
                </div>
            </div>
        </div>
    );
};

export default PayoutDebitCard;
