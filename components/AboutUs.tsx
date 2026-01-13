
"use client";

import React from 'react';
import { Heart, Clock, Star, Zap, Utensils, Award, MapPin, Quote } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="animate-fade-in-up space-y-24 pb-32">
      
      {/* HERO DE SECCIÓN */}
      <section className="relative h-[60vh] md:h-[70vh] rounded-[3.5rem] overflow-hidden group shadow-premium">
        <img 
          src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=80" 
          alt="Inspiración Vivazza" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vivazza-stone via-vivazza-stone/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-vivazza-red text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              <Heart size={14} fill="currentColor" /> Nuestra Razón de Ser
            </div>
            <h2 className="font-heading text-7xl md:text-[10rem] text-white leading-[0.8] uppercase tracking-tighter">
              PASIÓN POR <br/>
              <span className="text-vivazza-red">LA PERFECCIÓN</span>
            </h2>
          </div>
        </div>
      </section>

      {/* BLOQUE DE INSPIRACIÓN */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4">
        <div className="space-y-8">
          <h3 className="font-heading text-5xl md:text-7xl text-vivazza-stone uppercase leading-none tracking-tight">
            LA CHISPA QUE <br/>
            <span className="text-vivazza-gold">ENCENDIÓ EL HORNO</span>
          </h3>
          <div className="space-y-6 text-gray-500 font-medium text-lg leading-relaxed italic border-l-4 border-vivazza-red pl-8">
            <p>
              "Todo comenzó con una pregunta simple: ¿Por qué no podíamos encontrar en Talca esa pizza que recordábamos de nuestros viajes? Esa masa que no solo alimenta, sino que se siente viva."
            </p>
            <p className="not-italic text-vivazza-stone/80">
              Vivazza nació de la obsesión por crear **la pizza más deliciosa que nuestros clientes puedan probar**. No buscamos ser los más rápidos, buscamos ser los mejores. Cada burbuja en nuestra masa, cada aroma a tomate maduro, es el resultado de años de experimentación y respeto por la tradición.
            </p>
          </div>
          <div className="flex gap-6 pt-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-vivazza-cream rounded-2xl flex items-center justify-center text-vivazza-red mb-2 border border-vivazza-gold/20 shadow-sm">
                <Utensils size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Artesanal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vivazza-cream rounded-2xl flex items-center justify-center text-vivazza-red mb-2 border border-vivazza-gold/20 shadow-sm">
                <Star size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Premium</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-vivazza-gold opacity-10 rounded-[3rem] blur-2xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80" 
            alt="Masa artesanal" 
            className="relative rounded-[3rem] shadow-2xl border-8 border-white"
          />
          <div className="absolute -bottom-8 -left-8 bg-vivazza-stone text-white p-8 rounded-[2rem] shadow-2xl max-w-[240px]">
             <Quote className="text-vivazza-gold mb-2" size={32} />
             <p className="font-heading text-2xl uppercase leading-tight">"La masa es el alma, el fuego es el destino."</p>
          </div>
        </div>
      </section>

      {/* EL SECRETO DEL REPOSO SAGRADO */}
      <section className="bg-vivazza-stone rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-premium">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-vivazza-red rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(166,29,36,0.6)] animate-pulse">
              <Clock size={40} />
            </div>
          </div>
          
          <h3 className="font-heading text-6xl md:text-9xl text-white uppercase leading-none tracking-tighter">
            EL REPOSO <br/>
            <span className="text-vivazza-gold">SAGRADO</span>
          </h3>
          
          <p className="text-gray-300 text-xl md:text-2xl font-medium leading-relaxed">
            No usamos atajos. Nuestra masa reposa durante <span className="text-white font-bold underline decoration-vivazza-red decoration-4">72 HORAS DE MADURACIÓN LENTA</span>. Este proceso alquímico permite que los sabores se desarrollen en su máxima expresión, creando una estructura aireada, crujiente e increíblemente fácil de digerir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {[
              { title: "Maduración", desc: "72 Horas de Pura Alquimia" },
              { title: "Hidratación", desc: "Masa Alveolada de Autor" },
              { title: "Pasión", desc: "Hecha a mano, una a una" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                <h4 className="font-heading text-3xl text-vivazza-gold mb-2 uppercase">{item.title}</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPROMISO TALCA */}
      <section className="px-4 text-center max-w-3xl mx-auto space-y-8">
        <div className="flex justify-center items-center gap-4 text-vivazza-red">
          <MapPin size={24} />
          <span className="text-[12px] font-black uppercase tracking-[0.4em]">Orgullosamente Talquinos</span>
        </div>
        <h3 className="font-heading text-5xl md:text-7xl text-vivazza-stone uppercase leading-none">
          MÁS QUE UNA PIZZERÍA, <br/>
          <span className="text-vivazza-red">UNA COMUNIDAD</span>
        </h3>
        <p className="text-gray-500 text-lg font-medium leading-relaxed">
          Nacimos en el corazón de Talca para elevar el estándar del delivery. Queremos que cada pedido sea una celebración, un momento de alegría genuina en tu mesa. Gracias por permitirnos ser parte de tus historias.
        </p>
        <div className="pt-8 flex justify-center gap-8 opacity-20 grayscale">
          <Award size={64} />
          <Zap size={64} />
          <Award size={64} />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
