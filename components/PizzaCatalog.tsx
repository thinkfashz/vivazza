
"use client";

import React from 'react';
import { PIZZAS, VIVAZZA_INSTAGRAM, VIVAZZA_CATALOG_URL } from '../constants';
import { formatCLP } from '../utils';
import ImageWithFallback from './ImageWithFallback';
import { Pizza } from '../types';
import { ShoppingBag, Info, Star, Flame, Utensils, Sparkles, Quote, Instagram, Facebook, Clock } from 'lucide-react';

interface PizzaCatalogProps {
  onAdd: (pizza: Pizza) => void;
  onViewDetails: (pizza: Pizza) => void;
}

const PizzaCatalog: React.FC<PizzaCatalogProps> = ({ onAdd, onViewDetails }) => {
  return (
    <div className="animate-fade-in-up space-y-16 pb-20">
      
      {/* HEADER REDISEÑADO: ENFOQUE SENSORIAL Y DE VENTA */}
      <div className="text-center max-w-5xl mx-auto mb-20 relative px-4">
        
        {/* Badge de Autoridad de Mercado */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 bg-vivazza-stone text-white px-8 py-4 rounded-full shadow-[0_20px_40px_-10px_rgba(28,25,23,0.4)] transform hover:scale-105 transition-all duration-500 border border-white/10">
            <Clock size={18} className="text-vivazza-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">72 Horas de Reposo Sagrado</span>
          </div>
        </div>

        {/* Título Monumental */}
        <h2 className="font-heading text-8xl md:text-[12rem] text-vivazza-stone uppercase leading-[0.75] mb-12 tracking-tighter">
          NUESTRA CARTA <br/>
          <span className="text-vivazza-red relative inline-block filter drop-shadow-sm">
            MAESTRA
            <svg className="absolute -bottom-6 left-0 w-full h-6 text-vivazza-red/20" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 15, 100 5" stroke="currentColor" strokeWidth="6" fill="transparent" />
            </svg>
          </span>
        </h2>
        
        {/* SECCIÓN SENSORIAL REDISEÑADA: ESTILO EDITORIAL GOURMET */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          {/* Background Decorativo Estilo Papel Artesanal */}
          <div className="absolute inset-0 bg-[#F7F5E9] rounded-[4rem] rotate-1 shadow-inner border border-black/5" />
          
          <div className="relative bg-white rounded-[4rem] p-10 md:p-20 shadow-premium border border-gray-100 flex flex-col md:flex-row gap-12 items-center -rotate-1 hover:rotate-0 transition-transform duration-700 overflow-hidden group">
            
            {/* Elemento Decorativo: Sello de Calidad */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-vivazza-gold/5 rounded-full border border-vivazza-gold/10 flex items-center justify-center rotate-12 group-hover:rotate-45 transition-transform duration-1000">
               <Sparkles className="text-vivazza-gold/20" size={80} />
            </div>

            {/* Columna Letra Capital y Gráfico */}
            <div className="flex-shrink-0 relative">
               <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-vivazza-cream border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                  <span className="font-heading text-[10rem] text-vivazza-red/10 absolute -left-2 top-0 leading-none">V</span>
                  <Utensils className="text-vivazza-red relative z-10" size={48} />
               </div>
               <div className="absolute -bottom-4 -right-4 bg-vivazza-red text-white p-3 rounded-2xl shadow-red animate-bounce">
                  <Flame size={20} fill="currentColor" />
               </div>
            </div>
            
            {/* Columna Narrativa Editorial */}
            <div className="text-center md:text-left space-y-6">
              <div className="inline-block px-4 py-1.5 bg-vivazza-cream border border-vivazza-gold/20 rounded-full">
                 <p className="text-[10px] font-black text-vivazza-gold uppercase tracking-[0.2em]">Pura Alquimia de Masa Madre</p>
              </div>
              
              <p className="text-vivazza-stone text-2xl md:text-3xl font-medium leading-relaxed italic relative">
                <span className="font-heading text-8xl text-vivazza-red float-left mr-4 leading-[0.6] mt-2 not-italic">"</span>
                Imagina el crujido perfecto. Una masa aireada y ligera, nacida de <span className="text-vivazza-red font-heading text-5xl md:text-6xl not-italic align-middle px-2">72 HORAS DE REPOSO SAGRADO</span>. 
                Salsa de tomates maduros, queso fundido y ese aroma a hogar que no encuentras en otro lugar.
                <span className="font-heading text-8xl text-vivazza-red absolute -bottom-12 right-0 leading-[0.6] not-italic opacity-20">"</span>
              </p>
              
              <div className="pt-6 flex items-center justify-center md:justify-start gap-4">
                 <div className="h-px w-12 bg-gray-200" />
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Maestría Vivazza // Talca</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] mt-24 flex justify-center items-center gap-4 opacity-40">
          <span className="w-16 h-px bg-gray-200"></span>
          Explora la Excelencia
          <span className="w-16 h-px bg-gray-200"></span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
        {PIZZAS.map((pizza) => (
          <div 
            key={pizza.id} 
            className="bg-white rounded-[3.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500"
          >
            <div className="md:w-1/3 relative h-72 md:h-auto overflow-hidden">
              <ImageWithFallback 
                src={pizza.image} 
                alt={pizza.name} 
                fill 
                className="group-hover:scale-110 transition-transform duration-1000"
              />
              {pizza.type === 'special' && (
                <div className="absolute top-8 left-8 bg-vivazza-stone text-vivazza-gold text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-2xl flex items-center gap-2 z-10 border border-white/10">
                  <Sparkles size={14} className="animate-pulse" /> Receta Signature
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 p-10 md:p-16 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-heading text-6xl text-vivazza-stone uppercase leading-none tracking-tight">
                    {pizza.name}
                  </h3>
                  <div className="text-right">
                    <span className="font-heading text-5xl text-vivazza-red block leading-none">
                      {formatCLP(pizza.price)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">IVA INCLUIDO</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-xl mb-10 leading-relaxed font-medium">
                  {pizza.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {pizza.ingredientsList.map((ing, i) => (
                    <span key={i} className="text-[10px] font-black bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 text-vivazza-stone uppercase tracking-widest shadow-sm">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-10 border-t border-gray-100">
                <button 
                  onClick={() => onAdd(pizza)}
                  className="bg-vivazza-red text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-red active:scale-95 transition-all flex items-center gap-3 hover:brightness-110"
                >
                  <ShoppingBag size={24} /> AGREGAR AL PEDIDO
                </button>
                <button 
                  onClick={() => onViewDetails(pizza)}
                  className="bg-vivazza-stone text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-xl active:scale-95 transition-all flex items-center gap-3 hover:bg-stone-800"
                >
                  <Info size={24} /> FICHA TÉCNICA
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER REDES SOCIALES */}
      <div className="mt-32 pt-16 pb-12 border-t border-gray-100 text-center animate-fade-in-up">
        <h4 className="font-heading text-5xl text-vivazza-stone uppercase mb-4 tracking-tight">Comunidad Vivazza</h4>
        <p className="text-gray-400 font-medium mb-12 text-lg max-w-xl mx-auto leading-relaxed">
           Síguenos para acceder a promociones relámpago, eventos <br className="hidden md:block"/> y el arte detrás de nuestra cocina artesanal.
        </p>
        
        <div className="flex justify-center items-center gap-6 flex-wrap">
           {/* Instagram */}
           <a 
             href={`https://instagram.com/${VIVAZZA_INSTAGRAM}`} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="group relative w-20 h-20 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center text-vivazza-stone transition-all duration-500 hover:-translate-y-3 hover:shadow-premium hover:border-[#E1306C] hover:text-[#E1306C]"
           >
              <Instagram size={32} strokeWidth={1.5} />
           </a>

           {/* Facebook */}
           <a 
             href="#" 
             className="group relative w-20 h-20 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center text-vivazza-stone transition-all duration-500 hover:-translate-y-3 hover:shadow-premium hover:border-[#1877F2] hover:text-[#1877F2]"
           >
              <Facebook size={32} strokeWidth={1.5} />
           </a>

           {/* WhatsApp */}
           <a 
             href={VIVAZZA_CATALOG_URL} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="group relative w-20 h-20 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center text-vivazza-stone transition-all duration-500 hover:-translate-y-3 hover:shadow-premium hover:border-[#25D366] hover:text-[#25D366]"
           >
              <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
           </a>
        </div>
        
        <p className="mt-20 text-[10px] font-black uppercase text-gray-300 tracking-[0.5em] flex justify-center items-center gap-4">
          <span className="w-12 h-px bg-gray-100" />
          Vivazza © 2024 · Talca Chile
          <span className="w-12 h-px bg-gray-100" />
        </p>
      </div>
    </div>
  );
};

export default PizzaCatalog;
