
"use client";
import React from 'react';
import { WHOLESALE_DATA, VIVAZZA_CATALOG_URL, VIVAZZA_INSTAGRAM, VIVAZZA_PHONE } from '../constants';
import { formatCLP } from '../utils';
import { Instagram, MessageCircle, MapPin, Phone, Building2, Package, CheckCircle2, ShoppingBag } from 'lucide-react';

const Wholesale: React.FC = () => {
  const handleOrder = () => {
    window.open(VIVAZZA_CATALOG_URL, '_blank');
  };

  return (
    <div className="animate-fade-in-up space-y-12 pb-24">
      {/* Carta Digital al Estilo Menú Físico */}
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative">
        {/* Textura de papel artesanal de fondo */}
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

        {/* Header Elegante */}
        <div className="relative z-10 p-12 text-center border-b border-gray-100">
           <div className="w-16 h-1.5 bg-vivazza-red/40 mx-auto mb-6 rounded-full"></div>
           <h2 className="font-heading text-6xl md:text-8xl text-vivazza-stone uppercase leading-none mb-2 tracking-tight">
             MASAS Y <br/><span className="text-vivazza-red">DISTRIBUCIÓN AL MAYOR</span>
           </h2>
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
               <div className="w-10 h-10 rounded-full bg-vivazza-cream border border-vivazza-gold/30 flex items-center justify-center">
                  <div className="w-6 h-4 bg-vivazza-gold/40 rounded-full"></div>
               </div>
               <h3 className="font-heading text-3xl text-vivazza-stone uppercase">Packs de Masas congeladas:</h3>
            </div>
            
            <div className="space-y-6">
              {WHOLESALE_DATA.doughPacks.map((pack, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-vivazza-red rounded-full opacity-100 group-hover:scale-125 transition-transform"></div>
                      <span className="text-lg font-bold text-vivazza-stone">{pack.name}</span>
                   </div>
                   <div className="flex-grow mx-4 border-b border-dotted border-gray-300"></div>
                   <span className="font-heading text-3xl text-vivazza-red">{formatCLP(pack.price)}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 mt-8 border-t border-gray-100">
              <div className="bg-vivazza-cream/50 p-6 rounded-3xl border border-vivazza-gold/20">
                <p className="text-[11px] font-black text-vivazza-stone uppercase tracking-widest mb-4">Pizzas Artesanales Premium,</p>
                <p className="text-sm italic text-vivazza-stone/80 font-medium leading-relaxed">
                  hechas a mano y selladas para preservar su sabor. Listas para tu horno.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Pizzas Congeladas */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 mb-4 border-b border-vivazza-gold/10 pb-4">
               <h3 className="font-heading text-3xl text-vivazza-stone uppercase">Distribución al Mayor de Pizzas Congeladas</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-10">
              {WHOLESALE_DATA.frozenPizzas.flavors.map((flavor, idx) => (
                <div key={idx} className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-vivazza-gold rounded-full"></div>
                   <span className="text-xs font-black text-vivazza-stone uppercase tracking-tight">{flavor}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-6 bg-vivazza-gold/50"></div>
                  <span className="text-[11px] font-black uppercase text-vivazza-gold tracking-[0.2em]">Precios Distribuidor (IVA incluido)</span>
                  <div className="h-px w-6 bg-vivazza-gold/50"></div>
               </div>
               
               {WHOLESALE_DATA.frozenPizzas.prices.map((p, idx) => (
                 <div key={idx} className="flex justify-between items-center p-4 bg-vivazza-cream/20 rounded-2xl border border-gray-50">
                    <span className="font-black text-vivazza-stone uppercase text-[11px] tracking-wider">{p.size}</span>
                    <span className="font-heading text-4xl text-vivazza-stone">{formatCLP(p.price)}</span>
                 </div>
               ))}

               <div className="text-center pt-4">
                 <p className="font-heading text-3xl text-vivazza-red uppercase tracking-tight animate-pulse">Compra mínima 20 unidades</p>
               </div>
            </div>

            {/* Ilustración de Bollos */}
            <div className="pt-10 flex justify-center">
               <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden shadow-2xl bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90" 
                    alt="Masas Vivazza" 
                  />
                  <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white text-center shadow-2xl max-w-[85%]">
                     <p className="text-[10px] font-black uppercase tracking-widest text-vivazza-red mb-2">Precios especiales para</p>
                     <p className="text-sm font-black text-vivazza-stone uppercase leading-tight">Supermercados, Minimarkets, Emprendedores.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer de Contacto */}
        <div className="relative z-10 bg-vivazza-cream p-8 border-t border-gray-100 flex flex-wrap justify-center gap-8 md:gap-16">
           <div className="flex items-center gap-2 text-vivazza-stone">
              <MapPin size={18} className="text-vivazza-red" />
              <span className="text-[12px] font-black uppercase tracking-widest">Talca, Maule</span>
           </div>
           <div className="flex items-center gap-2 text-vivazza-stone">
              <Phone size={18} className="text-vivazza-red" />
              <span className="text-[12px] font-black uppercase tracking-widest">+{VIVAZZA_PHONE}</span>
           </div>
        </div>
      </div>

      {/* CTA Adicional */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-12 px-4">
         <button 
           onClick={handleOrder}
           className="w-full bg-vivazza-red text-white py-6 rounded-[2rem] font-heading text-4xl shadow-red flex items-center justify-center gap-4 active:scale-95 transition-all"
         >
           <MessageCircle size={32} /> SOLICITAR POR WHATSAPP
         </button>
         <button 
           onClick={() => window.open(`https://instagram.com/${VIVAZZA_INSTAGRAM}`, '_blank')}
           className="w-full bg-vivazza-stone text-white py-6 rounded-[2rem] font-heading text-2xl md:text-3xl active:scale-95 transition-all flex items-center justify-center gap-4 px-6 shadow-xl"
         >
           <Instagram size={32} /> VISITA NUESTRAS REDES SOCIALES
         </button>
      </div>

      <div className="text-center mt-12 opacity-50 px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-vivazza-stone">Vivazza Fábrica de Pizzas Artesanales // Distribución Mayorista</p>
      </div>
    </div>
  );
};

export default Wholesale;
