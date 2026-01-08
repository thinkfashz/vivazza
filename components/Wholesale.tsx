"use client";
import React, { useState, useMemo } from 'react';
import { WHOLESALE_DATA, VIVAZZA_PHONE } from '../constants';
import { formatCLP } from '../utils';
import { Building2, Package, CheckCircle2, Plus, Minus, ClipboardList, Send, MessageCircle, ArrowRight, TrendingUp, ShieldCheck, Zap, User, Store, MapPin, Phone, Snowflake } from 'lucide-react';

const Wholesale: React.FC = () => {
  const [selectedPacks, setSelectedPacks] = useState<Record<string, number>>({});
  const [selectedFrozen, setSelectedFrozen] = useState<Record<string, number>>({});
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  
  // Nuevo estado para el formulario de contacto
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    city: '',
    notes: ''
  });

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    // Validación básica si se usa el formulario
    if (!formData.contactName || !formData.businessName || !formData.phone) {
      alert("Por favor, completa los campos obligatorios del formulario (Nombre, Negocio y Teléfono).");
      return;
    }

    let message = `🤝 *NUEVA SOLICITUD DISTRIBUIDOR VIVAZZA*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `🏢 *DATOS DE CONTACTO:*\n`;
    message += `• Negocio: ${formData.businessName}\n`;
    message += `• Contacto: ${formData.contactName}\n`;
    message += `• Teléfono: ${formData.phone}\n`;
    if (formData.city) message += `• Ciudad: ${formData.city}\n`;
    if (formData.notes) message += `• Notas: ${formData.notes}\n\n`;

    let hasContent = false;

    const packs = Object.entries(selectedPacks).filter(([_, qty]) => (qty as number) > 0);
    if (packs.length > 0) {
      message += `📦 *PEDIDO INICIAL MASAS:*\n`;
      packs.forEach(([name, qty]) => {
        message += `• ${qty}x ${name}\n`;
      });
      message += `\n`;
      hasContent = true;
    }

    const frozen = Object.entries(selectedFrozen).filter(([_, qty]) => (qty as number) > 0);
    if (frozen.length > 0) {
      message += `🍕 *PEDIDO INICIAL CONGELADAS:*\n`;
      frozen.forEach(([size, qty]) => {
        message += `• ${qty}x ${size}\n`;
      });
      
      if (selectedFlavors.length > 0) {
        message += `🎨 *SABORES:* ${selectedFlavors.join(', ')}\n`;
      }
      message += `\n`;
      hasContent = true;
    }

    if (!hasContent) {
      message += `_Deseo recibir el catálogo mayorista y lista de precios oficial._\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🚀 *Solicito contacto para coordinar distribución.*`;

    const url = `https://wa.me/${VIVAZZA_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="animate-fade-in-up space-y-12 pb-32">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative">
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

        {/* Header */}
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

        {/* Cuerpo del Menú */}
        <div className="relative z-10 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-10">
            <div className="flex flex-col mb-4 border-b border-vivazza-gold/10 pb-6">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-heading text-2xl text-vivazza-stone uppercase leading-none opacity-60">Nuestra Selección Premium:</h3>
                 <span className="bg-vivazza-red/10 text-vivazza-red px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Alta Rentabilidad</span>
               </div>
               <p className="text-vivazza-red font-heading text-6xl md:text-7xl uppercase mt-4 tracking-tighter drop-shadow-md animate-fade-in">Pack de Masas</p>
            </div>
            
            <div className="space-y-8">
              {WHOLESALE_DATA.doughPacks.map((pack, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
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
                  <p className="text-[11px] font-black text-vivazza-stone uppercase tracking-widest mb-2">Máximo estándar artesanal</p>
                  <p className="text-sm italic text-vivazza-stone/80 font-medium leading-relaxed">
                    Nuestras masas con reposo artesanal te permiten ofrecer una pizza ligera y crujiente con el mínimo esfuerzo operativo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-4">
               <h3 className="font-heading text-4xl text-blue-600 uppercase leading-none flex items-center gap-2">
                 <Snowflake className="animate-spin-slow text-blue-400" size={24} /> Pizzas congeladas:
               </h3>
               <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 animate-ice-glow">Ultra Congelado</span>
            </div>

            <div className="space-y-8">
               {WHOLESALE_DATA.frozenPizzas.prices.map((p, idx) => (
                 <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          <div className={`rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 animate-ice-pulse ${p.size.includes('32 cm') ? 'w-12 h-12' : 'w-9 h-9'}`}>
                             <div className="w-2/3 h-2/3 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center">
                               <div className="w-1/2 h-1/2 bg-blue-400/20 rounded-full" />
                             </div>
                          </div>
                        </div>
                        <div>
                          <span className="font-black text-vivazza-stone uppercase text-[11px] tracking-wider block">{p.size}</span>
                          <span className="text-[10px] text-blue-400 font-bold">Calidad bajo cero conservada</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-4xl text-blue-600 block leading-none">{formatCLP(p.price)}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">IVA incl.</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={() => updateFrozen(p.size, -1)}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 active:scale-90 transition-all text-gray-400 hover:text-blue-400"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-heading text-3xl w-8 text-center text-blue-700">{selectedFrozen[p.size] || 0}</span>
                      <button 
                        onClick={() => updateFrozen(p.size, 1)}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all shadow-md shadow-blue-200"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                 </div>
               ))}
            </div>

            <div className="pt-6">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4 flex items-center gap-2">
                <Snowflake size={14} className="animate-pulse" /> Sabores de alta rotación (frío):
              </p>
              <div className="flex flex-wrap gap-2">
                {WHOLESALE_DATA.frozenPizzas.flavors.map((flavor, idx) => (
                  <button 
                    key={idx}
                    onClick={() => toggleFlavor(flavor)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all border ${selectedFlavors.includes(flavor) ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border-blue-100 text-blue-400 hover:border-blue-300'}`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>

            {/* Pedido Mínimo Destacado */}
            <div className="pt-8 text-center bg-blue-50/50 rounded-3xl p-8 border-2 border-blue-200 shadow-inner relative group/min animate-ice-glow-intense duration-[3000ms] hover:animate-none transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-blue-200">
                Stock Mayorista Congelado
              </div>
              <p className="font-heading text-5xl md:text-6xl text-blue-600 uppercase tracking-tight leading-none mb-2">
                PEDIDO MÍNIMO: <span className="underline decoration-blue-200 decoration-4">{WHOLESALE_DATA.frozenPizzas.minOrder} UNIDADES</span>
              </p>
              <p className="text-[11px] text-blue-400 font-black uppercase tracking-widest leading-none">Asegura la frescura gélida en tu local</p>
            </div>
          </div>
        </div>

        {/* Formulario de Contacto */}
        <div className="relative z-10 bg-vivazza-cream/30 p-8 md:p-16 border-t border-gray-100">
          <div className="max-w-2xl mx-auto text-center mb-10">
             <h4 className="font-heading text-4xl md:text-5xl text-vivazza-stone uppercase leading-none mb-4">DATOS DE <span className="text-vivazza-red">CONTACTO</span></h4>
             <p className="text-gray-500 font-medium text-sm">Completa tus datos para recibir atención personalizada y agendar tu distribución.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-vivazza-red/40" size={18} />
              <input 
                type="text" 
                name="businessName"
                placeholder="Nombre del Negocio / Empresa *" 
                value={formData.businessName}
                onChange={handleFormChange}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-vivazza-red/20 focus:border-vivazza-red outline-none transition-all shadow-sm"
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-vivazza-red/40" size={18} />
              <input 
                type="text" 
                name="contactName"
                placeholder="Nombre de Contacto *" 
                value={formData.contactName}
                onChange={handleFormChange}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-vivazza-red/20 focus:border-vivazza-red outline-none transition-all shadow-sm"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-vivazza-red/40" size={18} />
              <input 
                type="tel" 
                name="phone"
                placeholder="WhatsApp / Teléfono *" 
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-vivazza-red/20 focus:border-vivazza-red outline-none transition-all shadow-sm"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-vivazza-red/40" size={18} />
              <input 
                type="text" 
                name="city"
                placeholder="Ciudad / Comuna" 
                value={formData.city}
                onChange={handleFormChange}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-vivazza-red/20 focus:border-vivazza-red outline-none transition-all shadow-sm"
              />
            </div>
            <div className="md:col-span-2 relative">
              <textarea 
                name="notes"
                placeholder="Alguna nota o requerimiento especial (ej: fecha estimada de entrega)" 
                value={formData.notes}
                onChange={handleFormChange}
                rows={2}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-vivazza-red/20 focus:border-vivazza-red outline-none transition-all shadow-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* CTA Section con Botón Animado */}
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
                className="group relative w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 bg-vivazza-red text-white rounded-2xl font-heading text-2xl md:text-3xl shadow-red active:scale-95 transition-all overflow-hidden animate-pulse-subtle"
              >
                {/* Brillo animado overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                
                <span className="relative flex items-center gap-4">
                  <MessageCircle size={32} /> CONVIÉRTETE EN DISTRIBUIDOR VIVAZZA
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
              <p className="text-[10px] font-black uppercase tracking-widest text-vivazza-red">Pedido Seleccionado</p>
              <p className="text-xl font-heading leading-none uppercase">{totalItems} Unidades para mi local</p>
            </div>
          </div>
          <button 
            onClick={() => document.querySelector('input[name="businessName"]')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-vivazza-stone text-white px-8 py-4 rounded-2xl font-heading text-2xl flex items-center gap-3 hover:bg-stone-800 transition-colors active:scale-95"
          >
            FINALIZAR <ArrowRight size={22} />
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

      {/* Fix: Replaced styled-jsx with dangerouslySetInnerHTML to resolve TypeScript errors on style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(166, 29, 36, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 15px 35px -5px rgba(166, 29, 36, 0.6); }
        }
        @keyframes ice-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.2); background-color: rgba(239, 246, 255, 1); }
          50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); background-color: rgba(219, 234, 254, 1); }
        }
        @keyframes ice-glow-intense {
          0%, 100% { box-shadow: inset 0 0 10px rgba(59, 130, 246, 0.1); border-color: rgba(191, 219, 254, 0.5); }
          50% { box-shadow: inset 0 0 25px rgba(59, 130, 246, 0.3); border-color: rgba(59, 130, 246, 0.5); }
        }
        @keyframes ice-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.05) rotate(2deg); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite ease-in-out;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite ease-in-out;
        }
        .animate-ice-glow {
          animation: ice-glow 2s infinite ease-in-out;
        }
        .animate-ice-glow-intense {
          animation: ice-glow-intense 4s infinite ease-in-out;
        }
        .animate-ice-pulse {
          animation: ice-pulse 3s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      ` }} />
    </div>
  );
};

export default Wholesale;
