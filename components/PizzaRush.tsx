import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const PizzaRush: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [items, setItems] = useState<{id: number, x: number, y: number, type: 'good' | 'bad'}[]>([]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * 80 + 10; // 10% to 90% width
      const type = Math.random() > 0.8 ? 'bad' : 'good'; // 20% chance of bad item (burnt crust)
      setItems(prev => [...prev, { id, x, y: -10, type }]);
    }, 600);

    const mover = setInterval(() => {
      setItems(prev => 
        prev
          .map(item => ({ ...item, y: item.y + 5 })) // Fall speed
          .filter(item => item.y < 110) // Remove if off screen
      );
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(mover);
    };
  }, [isPlaying]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(30);
    setItems([]);
    setIsPlaying(true);
  };

  const handleClickItem = (id: number, type: 'good' | 'bad') => {
    if (!isPlaying) return;
    setItems(prev => prev.filter(i => i.id !== id));
    if (type === 'good') setScore(s => s + 100);
    else setScore(s => Math.max(0, s - 200));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-vivazza-stone rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <div>
          <h3 className="font-heading text-3xl text-vivazza-gold">Pizza Rush</h3>
          <p className="text-gray-400 text-sm">Atrapa los ingredientes frescos. Evita los quemados.</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl">{score} pts</div>
          <div className={`font-mono text-sm ${timeLeft < 10 ? 'text-red-500' : 'text-gray-400'}`}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
        </div>
      </div>

      <div className="relative h-64 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 cursor-crosshair">
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
            <button 
              onClick={handleStart}
              className="bg-vivazza-red hover:bg-red-600 text-white px-8 py-3 rounded-full font-heading text-xl flex items-center gap-2 transition-transform hover:scale-105"
            >
              {timeLeft === 0 ? <RotateCcw size={20}/> : <Play size={20}/>}
              {timeLeft === 0 ? 'Jugar de Nuevo' : 'Iniciar Juego'}
            </button>
          </div>
        )}

        {items.map(item => (
          <div
            key={item.id}
            onMouseDown={() => handleClickItem(item.id, item.type)}
            className="absolute w-10 h-10 flex items-center justify-center text-xl cursor-pointer select-none transition-transform active:scale-90"
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
            }}
          >
            {item.type === 'good' ? '🍅' : '🔥'}
          </div>
        ))}
      </div>
      
      {score > 500 && timeLeft === 0 && (
        <div className="mt-4 p-3 bg-vivazza-gold/20 border border-vivazza-gold/50 rounded-lg text-center text-vivazza-gold text-sm animate-pulse">
          ¡Excelente Chef! Has desbloqueado el respeto de la cocina.
        </div>
      )}
    </div>
  );
};

export default PizzaRush;