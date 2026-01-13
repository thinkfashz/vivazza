
"use client";

import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Star, Quote, Heart, BadgeCheck } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-vivazza-stone md:rounded-[4rem] relative overflow-hidden group shadow-premium">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-vivazza-red/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-vivazza-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-vivazza-gold text-[10px] font-black uppercase tracking-[0.3em]">
            <Heart size={14} className="fill-current" /> El Muro de los Amantes de Vivazza
          </div>
          <h2 className="font-heading text-6xl md:text-8xl text-white uppercase leading-none tracking-tighter">
            LO QUE <span className="text-vivazza-red">DICEN</span> LOS QUE <br/>
            SABEN <span className="text-vivazza-gold italic">DE VERDAD.</span>
          </h2>
          <p className="text-white/40 font-medium text-lg md:text-xl max-w-2xl mx-auto italic">
            "Cuando la masa de 72 horas toca el paladar, sobran las palabras."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={t.id}
              className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between group/card hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 ${idx % 2 !== 0 ? 'md:mt-8' : ''}`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="w-16 h-16 rounded-2xl object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700 shadow-xl border-2 border-white/10"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-vivazza-gold text-vivazza-stone p-1 rounded-lg">
                      <BadgeCheck size={14} />
                    </div>
                  </div>
                  <div className="flex gap-1 text-vivazza-gold">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <Quote className="text-vivazza-red/40 mb-4" size={32} />
                <p className="text-white/80 text-base leading-relaxed font-medium italic mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/5">
                <p className="text-white font-heading text-2xl uppercase tracking-tight">{t.name}</p>
                <p className="text-vivazza-gold text-[10px] font-black uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
           <div className="bg-vivazza-red/10 border border-vivazza-red/20 px-8 py-4 rounded-3xl flex items-center gap-4">
              <div className="flex -space-x-4">
                 {TESTIMONIALS.slice(0, 5).map(t => (
                   <img key={t.id} src={t.image} className="w-10 h-10 rounded-full border-2 border-vivazza-stone object-cover" />
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-vivazza-stone bg-vivazza-red flex items-center justify-center text-[10px] font-black text-white">+1K</div>
              </div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                 Más de 1.000 clientes felices cada mes en Talca.
              </p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
