
"use client";
import React, { useState, useMemo } from 'react';
import { WHOLESALE_DATA, VIVAZZA_PHONE } from '../constants';
import { formatCLP } from '../utils';
import { Building2, Package, CheckCircle2, Plus, Minus, ClipboardList, Send, MessageCircle, ArrowRight } from 'lucide-react';

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
    let message = `🤝 *COTIZACIÓN MAYORISTA VIVAZZA*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `Hola! Me interesa una cotización para distribución:\n\n`;

    let hasContent = false;

    // Packs de Masas
    const packs = Object.entries(selectedPacks).filter(([_, qty]) => (qty as number) > 0);
    if (packs.length > 0) {
      message += `📦 *MASAS CONGELADAS:*\n`;
      packs.forEach(([name, qty]) => {
        message += `• ${qty}x ${name}\n`;
      });
      message += `\n`;
      hasContent = true;
    }

    // Pizzas Congeladas
    const frozen = Object.entries(selectedFrozen).filter(([_, qty]) => (qty as number) > 0);
    if (frozen.length > 0) {
      message += `🍕 *PIZZAS CONGELADAS:*\n`;
      frozen.forEach(([size, qty]) => {
        message += `• ${qty}x ${size}\n`;
      });
      
      if (selectedFlavors.length > 0) {
        message += `🎨 *SABORES DE INTERÉS:* ${selectedFlavors.join(', ')}\n`;
      }
      message += `\n`;
      hasContent = true;
    }

    if (!hasContent) {
      message = `Hola! Me interesa recibir información y lista de precios para distribución mayorista de Vivazza.`;
    } else {
      message += `━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📍 _Solicito tiempos de entrega y métodos de pago._`;
    }

    const url = `https://wa.me/${VIVAZZA_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="animate-fade-in-up space-y-12 pb-32">
      {/* Carta Digital al Estilo Menú Físico */}
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative">
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

        {/* Header Elegante */}
        <div className="relative z-10 p-12 text-center border-b border-gray-100">
           <div className="w-16 h-1.5 bg-vivazza-red/40 mx-auto mb-6 rounded-full"></div>
           <h2 className="font-heading text-6xl md:text-8xl text-vivazza-stone uppercase leading-none mb-2 tracking-tight">
             MASAS Y <br/><span className="text-vivazza-red">DISTRIBUCIÓN AL MAYOR</span>
           </h2>
           <p className="text-[10px] font-black uppercase text-vivazza-red tracking-[0.2em] mt-2">Valores netos + IVA</p>
           <div className="flex justify-center items-center gap-4 mt-6">
              <span className="h-px w-12 bg-vivazza-gold/50"></span>
              <Building2 className="text-vivazza-gold" size={28} />
              <span className="h-px w-12 bg-vivazza-gold/50"></span>
           </div>
        </div>

        {/* Cuerpo del Menú */}
        <div className="relative z-10 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Columna Izquierda: Packs de Masas */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 mb-4 border-b border-vivazza-gold/10 pb-4">
               <h3 className="font-heading text-3xl text-vivazza-stone uppercase">Packs de Masas:</h3>
            </div>
            
            <div className="space-y-8">
              {WHOLESALE_DATA.doughPacks.map((pack, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-vivazza-stone">{pack.name}</span>
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
              <div className="bg-vivazza-cream/50 p-6 rounded-3xl border border-vivazza-gold/20">
                <p className="text-[11px] font-black text-vivazza-stone uppercase tracking-widest mb-2">Excelencia en Fermentación</p>
                <p className="text-sm italic text-vivazza-stone/80 font-medium leading-relaxed">
                  Masa Madre con 48h de maduración lenta, elaborada con ingredientes nobles del Maule.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Pizzas Congeladas */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 mb-4 border-b border-vivazza-gold/10 pb-4">
               <h3 className="font-heading text-3xl text-vivazza-stone uppercase">Pizzas Congeladas</h3>
            </div>

            <div className="space-y-8">
               {WHOLESALE_DATA.frozenPizzas.prices.map((p, idx) => (
                 <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-black text-vivazza-stone uppercase text-[11px] tracking-wider">{p.size}</span>
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
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Selecciona Sabores de Interés:</p>
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

            <div className="pt-8 text-center">
              <p className="font-heading text-2xl text-vivazza-red uppercase tracking-tight">Compra mínima {WHOLESALE_DATA.frozenPizzas.minOrder} unidades</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 bg-vivazza-stone p-8 md:p-16 border-t border-white/10 text-center space-y-8">
            <div className="max-w-xl mx-auto">
              <h4 className="font-heading text-5xl md:text-7xl text-white uppercase leading-none mb-4">SOLICITA TU <span className="text-vivazza-gold">COTIZACIÓN</span></h4>
              <p className="text-gray-400 text-lg font-medium leading-relaxed">
                Únete a nuestra red de distribución. Calidad artesanal para tu negocio con los mejores precios del mercado.
              </p>
            </div>
            
            <button 
              onClick={handleWholesaleWhatsApp}
              className="group relative inline-flex items-center justify-center px-12 py-6 bg-vivazza-red text-white rounded-2xl font-heading text-3xl shadow-red active:scale-95 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-4">
                <Send size={28} /> CONTACTAR VENTAS MAYORISTA
              </span>
            </button>
        </div>
      </div>

      {/* Floating Action Bar (Visible when selection exists) */}
      <div className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg transition-all duration-500 transform ${hasSelection ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-vivazza-stone text-white rounded-[2rem] p-4 pr-6 shadow-premium border border-white/10 flex items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-4 pl-2">
            <div className="w-12 h-12 rounded-full bg-vivazza-red flex items-center justify-center shadow-red animate-pulse">
              <Package size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-vivazza-gold">Cotización Lista</p>
              <p className="text-lg font-heading leading-none">{totalItems} UNIDADES SELECCIONADAS</p>
            </div>
          </div>
          <button 
            onClick={handleWholesaleWhatsApp}
            className="bg-white text-vivazza-stone px-6 py-3 rounded-xl font-heading text-xl flex items-center gap-2 hover:bg-vivazza-gold transition-colors active:scale-95"
          >
            ENVIAR <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer Info Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-12">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-4 shadow-sm group hover:shadow-md transition-shadow">
          <div className="p-4 bg-vivazza-cream rounded-2xl text-vivazza-red group-hover:scale-110 transition-transform"><ClipboardList size={32} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Facturación</p>
            <p className="text-lg font-bold text-vivazza-stone leading-tight">Emitimos Factura (SII) para empresas</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-4 shadow-sm group hover:shadow-md transition-shadow">
          <div className="p-4 bg-vivazza-cream rounded-2xl text-vivazza-red group-hover:scale-110 transition-transform"><Package size={32} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Logística</p>
            <p className="text-lg font-bold text-vivazza-stone leading-tight">Despacho garantizado en Talca y alrededores</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-4 shadow-sm group hover:shadow-md transition-shadow">
          <div className="p-4 bg-vivazza-cream rounded-2xl text-vivazza-red group-hover:scale-110 transition-transform"><CheckCircle2 size={32} /></div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nuestro Sello</p>
            <p className="text-lg font-bold text-vivazza-stone leading-tight">Masa Madre 48h madurada con insumos del Maule</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-20 opacity-30 px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-vivazza-stone">Vivazza Fábrica de Pizzas Artesanales // Talca // Chile</p>
      </div>
    </div>
  );
};

export default Wholesale;
