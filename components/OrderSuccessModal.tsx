
"use client";

import React, { useState } from 'react';
import { Instagram, Star, CheckCircle2, Heart, MessageSquare, ExternalLink, X, ChevronRight, MessageCircle } from 'lucide-react';
import { VIVAZZA_INSTAGRAM, VIVAZZA_CATALOG_URL } from '../constants';

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

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-vivazza-stone/70 backdrop-blur-xl transition-opacity animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Bottom Sheet / Centered Modal */}
      <div className="relative bg-white w-full max-w-xl rounded-t-[3.5rem] md:rounded-[4rem] p-8 md:p-14 text-center animate-slide-in-bottom md:animate-scale-in shadow-[0_-25px_80px_-15px_rgba(0,0,0,0.4)] max-h-[95vh] overflow-y-auto no-scrollbar pb-safe-bottom">
        
        {/* Handle for Mobile Drawer */}
        <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto mb-10 md:hidden" />
        
        <button onClick={onClose} className="absolute top-10 right-10 text-gray-300 hover:text-gray-600 transition-colors md:block hidden">
          <X size={28} />
        </button>

        {!isSubmitted ? (
          <div className="animate-fade-in-up">
            <div className="relative w-28 h-28 mx-auto mb-10">
               <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
               <div className="relative z-10 w-full h-full bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                  <CheckCircle2 size={64} strokeWidth={1.5} />
               </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-heading text-vivazza-stone mb-4 uppercase tracking-tighter leading-none">
              ¡TU PEDIDO <br/><span className="text-vivazza-red italic">VIENE EN CAMINO!</span>
            </h2>
            <p className="text-gray-400 mb-12 font-medium px-4 leading-relaxed text-base md:text-lg">
              Revisa tu WhatsApp para la confirmación de entrega. Mientras esperas, únete a la comunidad:
            </p>

            {/* Social Connect Cards - Mobile Focus */}
            <div className="grid grid-cols-2 gap-4 mb-14">
                <button 
                  onClick={() => window.open(`https://instagram.com/${VIVAZZA_INSTAGRAM}`, '_blank')}
                  className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-vivazza-cream/50 to-white border border-vivazza-gold/10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                    <Instagram size={28} />
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Galería</p>
                    <p className="text-sm font-bold text-vivazza-stone uppercase tracking-tighter">Instagram</p>
                  </div>
                </button>
                <button 
                  onClick={() => window.open(VIVAZZA_CATALOG_URL, '_blank')}
                  className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-vivazza-cream/50 to-white border border-vivazza-gold/10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg transform group-hover:-rotate-12 transition-transform">
                    <MessageCircle size={28} />
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Contacto</p>
                    <p className="text-sm font-bold text-vivazza-stone uppercase tracking-tighter">WhatsApp</p>
                  </div>
                </button>
            </div>

            {/* Experiencia Feedback */}
            <div className="text-center pt-8 border-t border-gray-100">
              <h3 className="font-heading text-3xl text-vivazza-stone mb-8 uppercase flex items-center justify-center gap-3">
                <Heart size={24} className="text-vivazza-red fill-current" /> CALIFÍCANOS
              </h3>
              
              <div className="flex justify-center gap-4 mb-12">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-all duration-300 transform ${rating >= star ? 'text-vivazza-gold scale-125' : 'text-gray-100 hover:text-gray-200'}`}
                    aria-label={`Calificar con ${star} estrellas`}
                  >
                    <Star size={44} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
              
              {rating > 0 && (
                <div className="animate-fade-in-up space-y-6">
                  <div className="relative group">
                    <MessageSquare size={20} className="absolute top-5 left-5 text-gray-300 group-focus-within:text-vivazza-red transition-colors" />
                    <textarea
                      placeholder="Cuéntanos qué tal tu experiencia..."
                      className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-[2rem] p-5 pl-14 text-sm font-bold focus:ring-0 focus:border-vivazza-red focus:bg-white transition-all resize-none shadow-inner"
                      rows={3}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleSubmitReview}
                    className="w-full h-18 bg-vivazza-stone text-white rounded-2xl font-heading text-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    ENVIAR RESEÑA <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={onClose} 
              className="mt-10 py-4 text-gray-300 text-[10px] font-black uppercase tracking-[0.4em] hover:text-vivazza-red transition-colors block mx-auto active:scale-90"
            >
              Cerrar y volver
            </button>
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center animate-fade-in text-center">
             <div className="w-24 h-24 bg-vivazza-red text-white rounded-full flex items-center justify-center mb-8 shadow-[0_20px_40px_-10px_rgba(166,29,36,0.5)] animate-bounce">
               <Heart size={44} fill="currentColor" />
             </div>
             <h2 className="text-5xl font-heading text-vivazza-stone mb-2 uppercase tracking-tighter">¡MIL GRACIAS!</h2>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tu opinión alimenta nuestro fuego.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in-bottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-bottom {
          animation: slide-in-bottom 0.7s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
      ` }} />
    </div>
  );
};

export default OrderSuccessModal;
