
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Coupon } from '../types';
import { COUPONS } from '../constants';
import { Gamepad2, Play, RotateCcw, Trophy, History as HistoryIcon, Star } from 'lucide-react';

interface GameRecord {
  score: number;
  date: string;
  result: 'Ganador' | 'Perdedor';
}

interface PizzaRushProps {
  onWinCoupon: (coupon: Coupon) => void;
}

const PizzaRush: React.FC<PizzaRushProps> = ({ onWinCoupon }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<GameRecord[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game Constants
  const PADDLE_HEIGHT = 15;
  const PADDLE_WIDTH = 110;
  const BALL_RADIUS = 9;
  const BRICK_ROWS = 4;
  const BRICK_COLS = 8;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 40;
  const BRICK_OFFSET_LEFT = 20;

  const requestRef = useRef<number | undefined>(undefined);
  const paddleRef = useRef(0);
  const ballRef = useRef({ x: 0, y: 0, dx: 3, dy: -3 });
  const bricksRef = useRef<any[]>([]);

  // Load History from Local Cache
  useEffect(() => {
    const savedHistory = localStorage.getItem('vivazza_game_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (finalScore: number, finalResult: 'Ganador' | 'Perdedor') => {
    const newRecord: GameRecord = {
      score: finalScore,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      result: finalResult
    };
    const updatedHistory = [newRecord, ...history].slice(0, 5); // Guardar solo los últimos 5
    setHistory(updatedHistory);
    localStorage.setItem('vivazza_game_history', JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    bricksRef.current = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      bricksRef.current[c] = [];
      for (let r = 0; r < BRICK_ROWS; r++) {
        bricksRef.current[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    ballRef.current = { 
      x: canvas.width / 2, 
      y: canvas.height - 50, 
      dx: 4, 
      dy: -4 
    };
    paddleRef.current = (canvas.width - PADDLE_WIDTH) / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Bricks
      let currentBricks = 0;
      for (let c = 0; c < BRICK_COLS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
          if (bricksRef.current[c][r].status === 1) {
            currentBricks++;
            const brickX = c * (55 + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (25 + BRICK_PADDING) + BRICK_OFFSET_TOP;
            bricksRef.current[c][r].x = brickX;
            bricksRef.current[c][r].y = brickY;
            
            ctx.beginPath();
            ctx.roundRect(brickX, brickY, 55, 25, 8);
            ctx.fillStyle = r % 2 === 0 ? "#A61D24" : "#D4AF37";
            ctx.fill();
            ctx.closePath();
          }
        }
      }

      // Ball
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#FDFCF0";
      ctx.fill();
      ctx.strokeStyle = "#A61D24";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();

      // Paddle
      ctx.beginPath();
      ctx.roundRect(paddleRef.current, canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT, 10);
      ctx.fillStyle = "#1c1917";
      ctx.fill();
      ctx.closePath();

      // Physics
      if (ballRef.current.x + ballRef.current.dx > canvas.width - BALL_RADIUS || ballRef.current.x + ballRef.current.dx < BALL_RADIUS) {
        ballRef.current.dx = -ballRef.current.dx;
      }
      if (ballRef.current.y + ballRef.current.dy < BALL_RADIUS) {
        ballRef.current.dy = -ballRef.current.dy;
      } else if (ballRef.current.y + ballRef.current.dy > canvas.height - BALL_RADIUS - 10) {
        if (ballRef.current.x > paddleRef.current && ballRef.current.x < paddleRef.current + PADDLE_WIDTH) {
          ballRef.current.dy = -ballRef.current.dy;
        } else {
          setGameState('lost');
          setIsPlaying(false);
          saveToHistory(score, 'Perdedor');
        }
      }

      // Collisions
      for (let c = 0; c < BRICK_COLS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
          const b = bricksRef.current[c][r];
          if (b.status === 1) {
            if (ballRef.current.x > b.x && ballRef.current.x < b.x + 55 && ballRef.current.y > b.y && ballRef.current.y < b.y + 25) {
              ballRef.current.dy = -ballRef.current.dy;
              b.status = 0;
              setScore(s => s + 10);
            }
          }
        }
      }

      if (currentBricks === 0) {
        setGameState('won');
        setIsPlaying(false);
        saveToHistory(score, 'Ganador');
        onWinCoupon(COUPONS[1]);
      }

      ballRef.current.x += ballRef.current.dx;
      ballRef.current.y += ballRef.current.dy;
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleRef.current = relativeX - PADDLE_WIDTH / 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    setIsPlaying(true);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up px-4 pb-20">
      <div className="bg-white rounded-[3rem] p-8 md:p-16 mb-12 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-vivazza-red/10 text-vivazza-red px-4 py-2 rounded-full mb-6 font-black text-xs uppercase tracking-widest">
            <Gamepad2 size={16} /> Desafío Vivazza
          </div>
          <h2 className="font-heading text-6xl md:text-8xl mb-4 leading-none text-vivazza-stone uppercase">PIZZA <span className="text-vivazza-red">BREAKER</span></h2>
          <p className="text-gray-500 font-medium mb-10 text-lg">Elimina los ingredientes usando la pala y gana un 15% de descuento en tu próximo pedido.</p>
          
          {gameState !== 'playing' && (
            <button onClick={startGame} className="bg-vivazza-red text-white px-12 py-5 rounded-2xl font-heading text-2xl shadow-red hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto md:mx-0">
               <Play fill="currentColor" size={24} /> {gameState === 'start' ? 'EMPEZAR JUEGO' : 'VOLVER A INTENTAR'}
            </button>
          )}

          {gameState === 'playing' && (
            <div className="bg-vivazza-cream p-6 rounded-[2rem] border border-vivazza-gold/20 inline-block">
               <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Puntaje Actual</p>
               <p className="text-5xl font-heading text-vivazza-stone leading-none">{score}</p>
            </div>
          )}
        </div>

        <div className="md:w-1/2 w-full relative group">
          <div className="bg-vivazza-stone rounded-[3rem] p-4 shadow-2xl overflow-hidden aspect-square flex items-center justify-center border-8 border-vivazza-stone">
            <canvas ref={canvasRef} width={500} height={500} className="w-full h-full bg-vivazza-cream rounded-[2.5rem] shadow-inner" />
            
            {gameState === 'won' && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                 <Trophy size={80} className="text-vivazza-gold mb-6 animate-bounce" />
                 <h3 className="font-heading text-6xl text-vivazza-stone mb-2 uppercase">¡VICTORIA TOTAL!</h3>
                 <p className="text-vivazza-red font-black uppercase tracking-widest text-xs mb-8">Usa el código PIZZABREAKER al pagar</p>
                 <button onClick={startGame} className="bg-vivazza-stone text-white px-8 py-4 rounded-xl font-heading text-xl shadow-xl flex items-center gap-2">
                   <RotateCcw size={20} /> JUGAR OTRA VEZ
                 </button>
              </div>
            )}

            {gameState === 'lost' && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                 <h3 className="font-heading text-6xl text-vivazza-stone mb-4 uppercase">MASA QUEMADA</h3>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">No te rindas, el maestro pizzero te espera.</p>
                 <button onClick={startGame} className="bg-vivazza-red text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-red flex items-center gap-3">
                   REINTENTAR DESAFÍO
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historial de Partidas - Memoria Local */}
      {history.length > 0 && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-lg border border-gray-100 animate-fade-in-up">
           <h3 className="font-heading text-4xl text-vivazza-stone uppercase mb-8 flex items-center gap-3">
              <HistoryIcon className="text-vivazza-red" /> Mis Récords Locales
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {history.map((record, i) => (
                <div key={i} className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center ${record.result === 'Ganador' ? 'border-green-100 bg-green-50' : 'border-gray-50 bg-gray-50 opacity-60'}`}>
                   <Star size={24} className={record.result === 'Ganador' ? 'text-vivazza-gold mb-3 fill-current' : 'text-gray-300 mb-3'} />
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{record.date}</p>
                   <p className="text-2xl font-heading text-vivazza-stone leading-none mb-2">{record.score} PTS</p>
                   <p className={`text-[9px] font-black uppercase tracking-widest ${record.result === 'Ganador' ? 'text-green-600' : 'text-gray-400'}`}>{record.result}</p>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default PizzaRush;
