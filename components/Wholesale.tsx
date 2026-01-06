
"use client";
import React from 'react';
import { Building2, CheckCircle, Package, Truck, MessageCircle, ArrowRight, Instagram } from 'lucide-react';
import { VIVAZZA_INSTAGRAM, VIVAZZA_CATALOG_URL } from '../constants';

const Wholesale: React.FC = () => {
  const playUISound = () => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleSocialClick = (url: string) => {
    playUISound();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    window.open(url, '_blank');
  };

  const benefits = [
    {
      title: "Calidad Estandarizada",
      desc: "Masa madre con 48h de fermentación, siempre perfecta.",
      icon: <CheckCircle className="text-vivazza-gold" />
    },
    {
      title: "Ahorro Operativo",
      desc: "De tu congelador al horno. Sin necesidad de pizzero experto.",
      icon: <Package className="text-vivazza-gold" />
    },
    {
      title: "Logística en Talca",
      desc: "Despachos programados para que nunca te quedes sin stock.",
      icon: <Truck className="text-vivazza-gold" />
    }
  ];

  return (
    <div className="animate-fade-in-up space-y-16 pb-20">
      <div className="relative rounded-[3rem] overflow-hidden bg-vivazza-stone text-white p-8 md:p-20 shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <div className="relative z-20 max-w-3xl">
          <span className="inline-block px-4 py-1.5 bg-vivazza-gold text-vivazza-stone text-[10px] font-black rounded-full mb-6 uppercase tracking-[0.2em]">Partner Estratégico</span>
          <h2 className="font-heading text-6xl md:text-8xl mb-6 leading-none tracking-tighter">
            LLEVA VIVAZZA A <br/><span className="text-vivazza-red">TU NEGOCIO</span>
          </h2>
          <p className="text-gray-300 text-xl mb-10 leading-relaxed font-medium">
            ¿Tienes un restaurante, cafetería o minimarket? Ofrece la mejor pizza artesanal prehorneada de Talca sin complicaciones técnicas.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)}
              className="bg-vivazza-red text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-red flex items-center gap-3 active:scale-95 transition-all"
            >
               SOLICITAR CATÁLOGO B2B <ArrowRight size={24} />
            </button>
          </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1950&q=80" 
          alt="Negocio de pizza" 
          className="absolute inset-0 w-full h-full object-cover opacity-30" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((b, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-vivazza-cream rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              {b.icon}
            </div>
            <h3 className="font-heading text-3xl text-vivazza-stone mb-3 uppercase">{b.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2 space-y-6">
          <h3 className="font-heading text-5xl text-vivazza-stone uppercase leading-none tracking-tighter">
            LISTAS PARA <br/><span className="text-vivazza-red">EL TOQUE FINAL</span>
          </h3>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Nuestras pizzas van congeladas al vacío para mantener la frescura de los ingredientes premium del Maule. Solo requieren 8-10 minutos de horno convencional para alcanzar la perfección.
          </p>
          <ul className="space-y-4">
            {['Formato Mediana (30cm)', 'Formato Grande (40cm)', 'Empaque individual profesional'].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-vivazza-stone font-bold uppercase text-xs tracking-widest">
                <div className="w-2 h-2 bg-vivazza-red rounded-full" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2 grid grid-cols-2 gap-4">
           <img src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80" className="rounded-3xl shadow-lg aspect-square object-cover" alt="Pizza 1" />
           <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" className="rounded-3xl shadow-lg aspect-square object-cover mt-8" alt="Pizza 2" />
        </div>
      </div>

      <div className="bg-vivazza-cream rounded-[3rem] p-12 text-center border border-vivazza-gold/20">
         <Building2 size={48} className="text-vivazza-gold mx-auto mb-6" />
         <h2 className="font-heading text-5xl text-vivazza-stone mb-6 uppercase">¿Hablamos de negocios?</h2>
         <p className="text-gray-500 mb-10 max-w-xl mx-auto font-medium">Únete a la red de distribuidores Vivazza y eleva el estándar de tu menú.</p>
         <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)}
              className="flex items-center justify-center gap-3 bg-green-600 text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle size={24} /> WHATSAPP MAYORISTA
            </button>
            <button 
              onClick={() => handleSocialClick(`https://instagram.com/${VIVAZZA_INSTAGRAM}`)}
              className="flex items-center justify-center gap-3 bg-vivazza-stone text-white px-10 py-5 rounded-2xl font-heading text-2xl active:scale-95 transition-all"
            >
              <Instagram size={24} /> NUESTRA RED B2B
            </button>
         </div>
      </div>
    </div>
  );
};

export default Wholesale;
