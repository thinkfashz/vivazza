
"use client";

import React, { useState } from 'react';
// Fix: Added missing ChevronRight icon import
import { Instagram, Star, CheckCircle2, Heart, MessageSquare, ExternalLink, X, ChevronRight } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitReview = () => {
    if (rating === 0) return;
    const newReview = { id: Date.now(), rating, text: review, date: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('vivazza_reviews') || '[]');
    localStorage.setItem('vivazza_reviews', JSON.stringify([...existing, newReview]));
    setIsSubmitted(true);
    setTimeout(onClose, 2500);
  };

  const TikTokIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Fondo con desenfoque profundo */}
      <div 
        className="absolute inset-0 bg-vivazza-stone/60 backdrop-blur-xl transition-opacity animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Native-style Sheet Container */}
      <div className="relative bg-white w-full max-w-lg rounded-t-[3rem] md:rounded-[3rem] p-8 md:p-12 text-center animate-slide-in-bottom md:animate-scale-in shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] max-h-[92vh] overflow-y-auto no-scrollbar pb-safe-bottom">
        
        {/* Grabber para móviles */}
        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 md:hidden" />
        
        {/* Botón de cierre discreto */}
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-600 md:block hidden">
          <X size={24} />
        </button>

        {!isSubmitted ? (
          <div className="animate-fade-in-up">
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
               <div className="relative z-10 w-full h-full bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                  <CheckCircle2 size={56} />
               </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading text-vivazza-stone mb-4 uppercase tracking-tight leading-none">
              ¡Pedido <span className="text-vivazza-red">Enviado!</span>
            </h2>
            <p className="text-gray-500 mb-10 font-medium px-4 leading-relaxed text-sm md:text-base">
              Gracias por elegir lo artesanal. Tu pedido llegará a WhatsApp para que confirmemos el tiempo estimado de entrega.
            </p>

            {/* Social Connect - Estilo App */}
            <div className="bg-vivazza-cream/50 rounded-3xl p-6 mb-10 border border-vivazza-gold/10 grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-sm">
                    <Instagram size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Síguenos</p>
                    <p className="text-xs font-bold text-vivazza-stone uppercase tracking-tighter">Instagram</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                    <TikTokIcon />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Viral</p>
                    <p className="text-xs font-bold text-vivazza-stone uppercase tracking-tighter">TikTok</p>
                  </div>
                </a>
            </div>

            {/* Feedback Section */}
            <div className="text-center pt-4 border-t border-gray-50">
              <h3 className="font-heading text-2xl text-vivazza-stone mb-6 uppercase flex items-center justify-center gap-2">
                <Heart size={20} className="text-vivazza-red fill-current" /> ¿Cómo fue tu experiencia?
              </h3>
              
              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
                      setRating(star);
                    }}
                    className={`transition-all duration-300 transform ${rating >= star ? 'text-vivazza-gold scale-125' : 'text-gray-100 hover:text-gray-200'}`}
                  >
                    <Star size={38} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
              
              {rating > 0 && (
                <div className="animate-fade-in-up space-y-4">
                  <div className="relative">
                    <MessageSquare size={16} className="absolute top-4 left-4 text-gray-300" />
                    <textarea
                      placeholder="Algún comentario opcional..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 text-sm focus:ring-4 focus:ring-vivazza-red/5 focus:bg-white transition-all resize-none shadow-inner"
                      rows={2}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleSubmitReview}
                    className="w-full bg-vivazza-stone text-white py-4 rounded-2xl font-heading text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    GUARDAR RESEÑA <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
            
            <button onClick={onClose} className="mt-8 text-gray-300 text-[9px] font-black uppercase tracking-[0.3em] hover:text-vivazza-red transition-colors block mx-auto">
              Volver a la carta
            </button>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center animate-fade-in">
             <div className="w-20 h-20 bg-vivazza-red text-white rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
               <Heart size={40} fill="currentColor" />
             </div>
             <h2 className="text-4xl font-heading text-vivazza-red mb-2 uppercase">¡GRAZIE!</h2>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tu feedback nos ayuda a mejorar.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in-bottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-bottom {
          animation: slide-in-bottom 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessModal;
