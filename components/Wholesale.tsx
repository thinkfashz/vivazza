
"use client";
import React, { useState, useMemo } from 'react';
import { WHOLESALE_DATA, VIVAZZA_PHONE } from '../constants';
import { formatCLP } from '../utils';
import { Building2, Package, CheckCircle2, Plus, Minus, ClipboardList, Send, MessageCircle, ArrowRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const Wholesale: React.FC = () => {
  const [selectedPacks, setSelectedPacks] = useState<Record<string, number>>({});
  const [selectedFrozen, setSelectedFrozen] = useState<Record<string, number>>({});
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  const updatePack = (name: string, delta: number) => {
    setSelectedPacks(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  const updateFrozen = (size: string, delta: number) => {
    setSelectedFrozen(prev => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta)
    }));
  };

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors(prev => 
      prev.includes(flavor) ? prev.filter(f => f !== flavor) : [...prev, flavor]
    );
  };

  const hasSelection = useMemo(() => {
    const packsCount = (Object.values(selectedPacks) as number[]).reduce((a, b) => a + b, 0);
    const frozenCount = (Object.values(selectedFrozen) as number[]).reduce((a, b) => a + b, 0);
    return packsCount > 0 || frozenCount > 0;
  }, [selectedPacks, selectedFrozen]);

  const totalItems = useMemo(() => {
    const packsCount = (Object.values(selectedPacks) as number[]).reduce((a, b) => a + b, 0);
    const frozenCount = (Object.values(selectedFrozen) as number[]).reduce((a, b) => a + b, 0);
    return packsCount + frozenCount;
  }, [selectedPacks, selectedFrozen]);

  const handleWholesaleWhatsApp = () => {
    let message = `🤝 *INTERÉS DISTRIBUIDOR VIVAZZA - PEDIDO PRIORITARIO*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `Hola! Quiero convertirme en distribuidor y asegurar stock. Mi selección:\n\n`;

    let hasContent = false;

    const packs = Object.entries(selectedPacks).filter(([_, qty]) => (qty as number) > 0);
    if (packs.length > 0) {
      message += `📦 *PACKS DE MASAS (Con Pomodoro):*\n`;
      packs.forEach(([name, qty]) => {
        message += `• ${qty}x ${name}\n`;
      });
      message += `\n`;
      hasContent = true;
    }

    const frozen = Object.entries(selectedFrozen).filter(([_, qty]) => (qty as number) > 0);
    if (frozen.length > 0) {
      message += `🍕 *PIZZAS CONGELADAS:*\n`;
      frozen.forEach(([size, qty]) => {
        message += `• ${qty}x ${size}\n`;
      });
      
      if (selectedFlavors.length > 0) {
        message += `🎨 *SABORES PREFERIDOS:* ${selectedFlavors.join(', ')}\n`;
      }
      message += `\n`;
      hasContent = true;
    }

    if (!hasContent) {
      message = `Hola! Quiero recibir la lista de precios mayorista y convertirme en distribuidor oficial de Vivazza.`;
    } else {
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🚀 *Solicito agendar entrega y coordinar pago de inmediato.*`;
    }

    const url = `https://wa.me/${VIVAZZA_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="animate-fade-in-up space-y-12 pb-32">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative">
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

        <div className="relative z-10 p-12 text-center border-b border-gray-100 bg-gradient-to-b from-vivazza-cream/30 to-white">
           <div className="w-16 h-1.5 bg-vivazza-red/40 mx-auto mb-6 rounded-full"></div>
           <p className="text-[10px] font-black uppercase text-vivazza-red tracking-[0.4em] mb-4">Aumenta tus ingresos con un producto premium</p>
           <h2 className="font-heading text-6xl md:text-8xl text-vivazza-stone uppercase leading-none mb-2 tracking-tight">
             MASAS Y PIZZAS <br/><span className="text-vivazza-red">PARA DISTRIBUIDORES</span>
           </h2>
           <div className="flex justify-center items-center gap-4 mt-6">
              <span className="h-px w-12 bg-vivazza-gold/50"></span>
              <Building2 className="text-vivazza-gold" size={28} />
              <span className="h-px w-12 bg-vivazza-gold/50"></span>
           </div>
        </div>

        <div className="relative z-10 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-10">
            <div className="flex flex-col mb-4 border-b border-vivazza-gold/10 pb-4">
               <div className="flex items-center justify-between">
                 <h3 className="font-heading text-3xl text-vivazza-stone uppercase leading-none">Conviértete en distribuidor Vivazza:</h3>
                 <span className="bg-vivazza-red/10 text-vivazza-red px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Alta Rentabilidad</span>
               </div>
               <p className="text-vivazza-red font-heading text-xl uppercase mt-1">Pack de Masas</p>
            </div>
            
            <div className="space-y-8">
              {WHOLESALE_DATA.doughPacks.map((pack, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      {/* Animación Pizza Chica visual de tamaño */}
                      <div className="relative flex items-center justify-center">
                        <div className={`rounded-full bg-vivazza-gold/20 border-2 border-vivazza-gold/40 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${pack.name.includes('30 cm') ? 'w-10 h-10' : 'w-8 h-8'}`}>
                          <div className="w-1/2 h-1/2 bg-vivazza-red/20 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <span className="text-lg font-bold text-vivazza-stone block">{pack.name}</span>
                        <span className="text-[10px] text-vivazza-red font-bold uppercase tracking-tight">Incluye salsa Pomodoro de la casa</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-heading text-3xl text-vivazza-red block leading-none">{formatCLP(pack.price)}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">IVA incl.</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <button 
                      onClick={() => updatePack(pack.name, -1)}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all text-gray-400"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="font-heading text-3xl w-8 text-center">{selectedPacks[pack.name] || 0}</span>
                    <button 
                      onClick={() => updatePack(pack.name, 1)}
                      className="w-10 h-10 rounded-full bg-vivazza-stone text-white flex items-center justify-center hover:bg-stone-800 active:scale-90 transition-all shadow-md"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <div className="bg-vivazza-cream/50 p-6 rounded-3xl border border-vivazza-gold/20 flex gap-4 items-start shadow-sm">
                <TrendingUp className="text-vivazza-red flex-shrink-0" size={24} />
                <div>
                  <p className="text-[11px] font-black text-vivazza-stone uppercase tracking-widest mb-2">Garantía de Sabor</p>
                  <p className="text-sm italic text-vivazza-stone/80 font-medium leading-relaxed">
                    Nuestras masas con reposo artesanal te permiten ofrecer una pizza ligera y crujiente con el mínimo esfuerzo operativo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between mb-4 border-b border-vivazza-gold/10 pb-4">
               <h3 className="font-heading text-3xl text-vivazza-stone uppercase leading-none">Pizza Congelada:</h3>
               <span className="bg-vivazza-gold/10 text-vivazza-gold px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Listo para servir</span>
            </div>

            <div className="space-y-8">
               {WHOLESALE_DATA.frozenPizzas.prices.map((p, idx) => (
                 <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-4">
                        {/* Animación Pizza Chica visual de tamaño */}
                        <div className="relative flex items-center justify-center">
                          <div className={`rounded-full bg-vivazza-stone/5 border-2 border-vivazza-stone/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 ${p.size.includes('32 cm') ? 'w-12 h-12' : 'w-9 h-9'}`}>
                             <div className="w-2/3 h-2/3 border-2 border-dashed border-vivazza-red/30 rounded-full flex items-center justify-center">
                               <div className="w-1/2 h-1/2 bg-vivazza-gold/20 rounded-full" />
                             </div>
                          </div>
                        </div>
                        <div>
                          <span className="font-black text-vivazza-stone uppercase text-[11px] tracking-wider block">{p.size}</span>
                          <span className="text-[10px] text-gray-400 font-medium">Formato ultra-congelado premium</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-4xl text-vivazza-stone block leading-none">{formatCLP(p.price)}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">IVA incl.</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={() => updateFrozen(p.size, -1)}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all text-gray-400"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-heading text-3xl w-8 text-center">{selectedFrozen[p.size] || 0}</span>
                      <button 
                        onClick={() => updateFrozen(p.size, 1)}
                        className="w-10 h-10 rounded-full bg-vivazza-stone text-white flex items-center justify-center hover:bg-stone-800 active:scale-90 transition-all shadow-md"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                 </div>
               ))}
            </div>

            <div className="pt-6">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                <Zap size={14} className="text-vivazza-gold" /> Sabores de alta rotación:
              </p>
              <div className="flex flex-wrap gap-2">
                {WHOLESALE_DATA.frozenPizzas.flavors.map((flavor, idx) => (
                  <button 
                    key={idx}
                    onClick={() => toggleFlavor(flavor)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all border ${selectedFlavors.includes(flavor) ? 'bg-vivazza-red border-vivazza-red text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-vivazza-red/30'}`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 text-center bg-gray-50 rounded-3xl p-6 border border-dashed border-gray-200">
              <p className="font-heading text-2xl text-vivazza-red uppercase tracking-tight">PEDIDO MÍNIMO: {WHOLESALE_DATA.frozenPizzas.minOrder} UNIDADES</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Asegura el abastecimiento de tu negocio hoy</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-vivazza-stone p-8 md:p-16 border-t border-white/10 text-center space-y-10">
            <div className="max-w-2xl mx-auto">
              <h4 className="font-heading text-5xl md:text-7xl text-white uppercase leading-none mb-4">¡IMPULSA <span className="text-vivazza-gold">TU NEGOCIO!</span></h4>
              <p className="text-gray-400 text-lg font-medium leading-relaxed mb-8">
                No pierdas más clientes. Asegura hoy el suministro de la pizza artesanal preferida por su calidad y sabor inigualable.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={handleWholesaleWhatsApp}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 bg-vivazza-red text-white rounded-2xl font-heading text-3xl shadow-red active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-4">
                  <MessageCircle size={28} /> QUIERO SER DISTRIBUIDOR
                </span>
              </button>
              
              <div className="flex flex-col items-center sm:items-start text-left">
                <p className="text-white/60 text-xs font-black uppercase tracking-widest leading-tight">
                  Atención B2B Prioritaria
                </p>
                <p className="text-vivazza-gold text-[10px] font-bold">Respuesta inmediata por WhatsApp</p>
              </div>
            </div>
        </div>
      </div>

      <div className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg transition-all duration-700 transform ${hasSelection ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-white text-vivazza-stone rounded-[2.5rem] p-5 pr-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 pl-3">
            <div className="w-14 h-14 rounded-2xl bg-vivazza-red text-white flex items-center justify-center shadow-red animate-pulse">
              <Package size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-vivazza-red">Confirmar Pedido</p>
              <p className="text-xl font-heading leading-none uppercase">{totalItems} Unidades Seleccionadas</p>
            </div>
          </div>
          <button 
            onClick={handleWholesaleWhatsApp}
            className="bg-vivazza-stone text-white px-8 py-4 rounded-2xl font-heading text-2xl flex items-center gap-3 hover:bg-stone-800 transition-colors active:scale-95"
          >
            SOLICITAR <ArrowRight size={22} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-12">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-4 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="p-4 bg-vivazza-cream rounded-2xl text-vivazza-red group-hover:bg-vivazza-red group-hover:text-white transition-colors duration-500"><ClipboardList size={32} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Proceso Ágil</p>
            <p className="text-lg font-bold text-vivazza-stone leading-tight italic">Facturación inmediata para tu empresa.</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-4 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="p-4 bg-vivazza-cream rounded-2xl text-vivazza-red group-hover:bg-vivazza-red group-hover:text-white transition-colors duration-500"><Zap size={32} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Despacho Veloz</p>
            <p className="text-lg font-bold text-vivazza-stone leading-tight italic">Entrega directa en tu local comercial.</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-4 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="p-4 bg-vivazza-cream rounded-2xl text-vivazza-red group-hover:bg-vivazza-red group-hover:text-white transition-colors duration-500"><ShieldCheck size={32} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Calidad Inigualable</p>
            <p className="text-lg font-bold text-vivazza-stone leading-tight italic">Reposo artesanal en frío para un sabor superior.</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-20 opacity-30 px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-vivazza-stone">Vivazza Fábrica de Pizzas Artesanales // Tu aliado comercial</p>
      </div>
    </div>
  );
};

export default Wholesale;
