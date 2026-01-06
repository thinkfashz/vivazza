import React, { useState } from 'react';
import { Instagram, Facebook, Star, Send, X, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 text-center animate-fade-in-up shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar pb-[max(2rem,env(safe-area-inset-bottom))]">
        
        {/* Pull bar para estética mobile nativa */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 md:hidden" />

        {!isSubmitted ? (
          <>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
              <CheckCircle2 size={44} className="animate-bounce" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading text-vivazza-stone mb-2 uppercase tracking-tight">¡Pizza en Camino!</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-[280px] mx-auto">Te avisaremos por WhatsApp en unos segundos para confirmar los detalles.</p>

            <div className="bg-gray-50 rounded-[2rem] p-6 mb-8 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Síguenos y etiqueta tu pizza</p>
              <div className="flex justify-around items-center">
                <a href="#" className="flex flex-col items-center gap-3 group active:scale-90 transition-transform">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-xl">
                    <Instagram size={28} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Insta</span>
                </a>
                <a href="#" className="flex flex-col items-center gap-3 group active:scale-90 transition-transform">
                  <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl">
                    <TikTokIcon />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">TikTok</span>
                </a>
                <a href="#" className="flex flex-col items-center gap-3 group active:scale-90 transition-transform">
                  <div className="w-14 h-14 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-xl">
                    <Facebook size={28} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Face</span>
                </a>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-heading text-2xl text-vivazza-stone mb-4 uppercase">¿Qué tal la Web?</h3>
              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-all active:scale-125 ${rating >= star ? 'text-vivazza-gold scale-110' : 'text-gray-200'}`}
                  >
                    <Star size={36} fill={rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              
              {rating > 0 && (
                <div className="animate-fade-in-up space-y-4">
                  <textarea
                    placeholder="Escribe tu opinión (opcional)"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-base focus:ring-2 focus:ring-vivazza-red focus:bg-white transition-all resize-none shadow-inner"
                    rows={2}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  <button 
                    onClick={handleSubmitReview}
                    className="w-full bg-vivazza-red text-white py-4 rounded-2xl font-bold uppercase tracking-widest shadow-red active:scale-95 transition-all"
                  >
                    Enviar y Cerrar
                  </button>
                </div>
              )}
            </div>
            
             <button onClick={onClose} className="mt-8 text-gray-300 text-xs font-bold uppercase tracking-widest hover:text-vivazza-stone p-4">
                Volver al Menú
              </button>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center">
             <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl animate-pulse">
               <CheckCircle2 size={40} />
             </div>
             <h2 className="text-4xl font-heading text-vivazza-red mb-2 uppercase">¡Gracias!</h2>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Tu feedback nos ayuda a crecer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessModal;