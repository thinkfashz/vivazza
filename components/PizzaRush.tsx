
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Coupon, HighScore } from '../types';
import { COUPONS } from '../constants';
import { Gamepad2, Trophy, Play, RotateCcw, Pizza } from 'lucide-react';

// Minijuego para ganar cupones de descuento
interface PizzaRushProps {
  onWinCoupon: (coupon: Coupon) => void;
}

const PizzaRush: React.FC<PizzaRushProps> = ({ onWinCoupon }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    pizzas: [] as { x: number; y: number; id: number; speed: number }[],
    lastSpawn: 0,
    score: 0
  });

  useEffect(() => {
    const savedScores = localStorage.getItem('vivazza_highscores');
    if (savedScores) setHighScores(JSON.parse(savedScores));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const update = (time: number) => {
      if (gameStateRef.current.lastSpawn === 0) gameStateRef.current.lastSpawn = time;
      
      if (time - gameStateRef.current.lastSpawn > 800) {
        gameStateRef.current.pizzas.push({
          x: Math.random() * (canvas.width - 50),
          y: -50,
          id: Date.now(),
          speed: 2 + Math.random() * 3
        });
        gameStateRef.current.lastSpawn = time;
      }

      gameStateRef.current.pizzas = gameStateRef.current.pizzas.filter(p => {
        p.y += p.speed;
        return p.y < canvas.height;
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gameStateRef.current.pizzas.forEach(p => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 40, p.y);
        ctx.lineTo(p.x + 20, p.y + 50);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(p.x + 20, p.y + 15, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(timer);
    };
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    gameStateRef.current = { pizzas: [], lastSpawn: 0, score: 0 };
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    const finalScore = gameStateRef.current.score;
    setScore(finalScore);

    const newScore: HighScore = { name: 'Jugador', score: finalScore, date: new Date().toLocaleDateString() };
    const updatedHighScores = [...highScores, newScore].sort((a, b) => b.score - a.score).slice(0, 5);
    setHighScores(updatedHighScores);
    localStorage.setItem('vivazza_highscores', JSON.stringify(updatedHighScores));

    if (finalScore >= 10) {
      onWinCoupon(COUPONS[2]); // GAMERWIN
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedPizzaIndex = gameStateRef.current.pizzas.findIndex(p => 
      x >= p.x && x <= p.x + 40 && y >= p.y && y <= p.y + 50
    );

    if (clickedPizzaIndex !== -1) {
      gameStateRef.current.pizzas.splice(clickedPizzaIndex, 1);
      gameStateRef.current.score += 1;
      setScore(gameStateRef.current.score);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-vivazza-stone rounded-[2.5rem] p-8 md:p-12 text-white mb-8 shadow-premium text-center">
        <Gamepad2 size={48} className="text-vivazza-red mx-auto mb-6" />
        <h2 className="font-heading text-5xl md:text-7xl mb-4 uppercase">PIZZA <span className="text-vivazza-red">RUSH</span></h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">¡Corta 10 pizzas antes de que caigan y gana un 15% de descuento en tu pedido!</p>
        
        {!isPlaying ? (
          <button onClick={startGame} className="bg-vivazza-red text-white px-12 py-5 rounded-2xl font-heading text-2xl shadow-red hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto">
            <Play fill="currentColor" size={24} /> COMENZAR DESAFÍO
          </button>
        ) : (
          <div className="flex justify-center gap-8 text-2xl font-heading">
             <div className="bg-white/10 px-6 py-2 rounded-xl border border-white/20">SCORE: <span className="text-vivazza-gold">{score}</span></div>
             <div className="bg-white/10 px-6 py-2 rounded-xl border border-white/20">TIEMPO: <span className="text-vivazza-red">{timeLeft}s</span></div>
          </div>
        )}
      </div>

      {isPlaying && (
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-vivazza-stone/10 cursor-crosshair h-[500px]">
          <canvas ref={canvasRef} width={800} height={500} className="w-full h-full" onClick={handleCanvasClick} />
        </div>
      )}

      {!isPlaying && score > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center animate-bounce-in mb-8">
           <h3 className="font-heading text-4xl text-vivazza-stone mb-2">¡PUNTUACIÓN: {score}!</h3>
           <p className="text-gray-500 mb-6">{score >= 10 ? '¡Has ganado el cupón GAMERWIN!' : '¡Casi! Necesitas 10 puntos.'}</p>
           <button onClick={startGame} className="flex items-center gap-2 mx-auto text-vivazza-red font-bold uppercase tracking-widest text-xs hover:underline">
             <RotateCcw size={14} /> Reintentar
           </button>
        </div>
      )}
    </div>
  );
};

// Se agrega exportación por defecto para corregir error de importación
export default PizzaRush;
