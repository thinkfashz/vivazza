
"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Pizza } from '../types';
import { formatCLP } from '../utils';
import { Info, Plus, Check } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  velocity: number;
}

interface PizzaCardProps {
  pizza: Pizza;
  onAdd: (pizza: Pizza) => void;
  onViewDetails: (pizza: Pizza) => void;
  index?: number;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAdd, onViewDetails, index = 0 }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const nextId = useRef(0);
  const isPriority = index < 3;

  const spawnConfetti = useCallback(() => {
    const colors = ['#A61D24', '#D4AF37', '#FDE68A', '#10B981', '#FFFFFF'];
    const newConfetti: Confetti[] = Array.from({ length: 12 }).map(() => ({
      id: nextId.current++,
      x: 0,
      y: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      velocity: 5 + Math.random() * 10,
    }));
    
    setConfetti(newConfetti);
    
    // Clear confetti after animation
    setTimeout(() => {
      setConfetti([]);
    }, 1000);
  }, []);

  const handleAdd = useCallback(() => {
    onAdd(pizza);
    setIsAdded(true);
    spawnConfetti();
    
    // Feedback háptico si está disponible
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    // Resetear el estado después de la animación
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  }, [onAdd, pizza, spawnConfetti]);

  return (
    <div className={`bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col md:flex-row border will-change-transform ${isAdded ? 'border-vivazza-red scale-[1.01] shadow-red' : 'border-gray-100/50'}`}>
      <div className="md:w-2/5 relative h-52 md:h-auto overflow-hidden">
        <ImageWithFallback 
          src={pizza.image} 
          alt={pizza.name} 
          fill
          priority={isPriority}
          className="group-hover:scale-105 transition-transform duration-500 ease-out" 
        />
        {pizza.type === 'special' && (
          <div className="absolute top-4 left-4 bg-vivazza-gold text-vivazza-stone text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-xl z-10 backdrop-blur-sm">
            Especial Autor
          </div>
        )}
      </div>
      
      <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-heading text-3xl text-vivazza-stone uppercase leading-none tracking-tight">
              {pizza.name}
            </h4>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 font-medium leading-relaxed">
            {pizza.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Precio (IVA incl.)</span>
            <span className="font-heading text-3xl text-vivazza-red leading-none">
              {formatCLP(pizza.price)}
            </span>
          </div>
          
          <div className="flex gap-2 relative">
            <button 
              onClick={() => onViewDetails(pizza)}
              className="p-2.5 text-vivazza-stone hover:bg-vivazza-cream rounded-xl transition-colors border border-transparent hover:border-vivazza-gold/30"
              aria-label="Ver detalles"
            >
              <Info size={20} />
            </button>
            <div className="relative">
              {/* Confetti container */}
              <div className="absolute inset-0 pointer-events-none z-50">
                {confetti.map((c) => (
                  <div
                    key={c.id}
                    className="absolute w-2 h-2 rounded-full animate-confetti-particle"
                    style={{
                      backgroundColor: c.color,
                      '--angle': `${c.angle}rad`,
                      '--velocity': `${c.velocity}`,
                      left: '50%',
                      top: '50%',
                    } as any}
                  />
                ))}
              </div>
              
              <button 
                onClick={handleAdd}
                className={`${isAdded ? 'bg-green-600' : 'bg-vivazza-red'} text-white p-3.5 rounded-xl shadow-red hover:opacity-95 active:scale-90 transition-all duration-200 group/btn relative overflow-hidden`}
                aria-label="Agregar al carrito"
              >
                <div className={`transition-transform duration-200 ${isAdded ? 'scale-0' : 'scale-100'}`}>
                  <Plus size={22} className="group-hover/btn:rotate-90 transition-transform duration-200" />
                </div>
                
                {isAdded && (
                  <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-200">
                    <Check size={22} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confetti-particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * var(--velocity) * 10px),
              calc(sin(var(--angle)) * var(--velocity) * 10px + 50px)
            ) scale(0);
            opacity: 0;
          }
        }
        .animate-confetti-particle {
          animation: confetti-particle 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default React.memo(PizzaCard);
