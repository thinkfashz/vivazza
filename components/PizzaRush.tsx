
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Coupon } from '../types';
import { COUPONS } from '../constants';
import { Gamepad2, Play, RotateCcw, Trophy, History as HistoryIcon, Star, Fingerprint, Coins } from 'lucide-react';

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
  const [lifetimePoints, setLifetimePoints] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const requestRef = useRef<number | undefined>(undefined);
  const paddleRef = useRef({ x: 0, width: 100, height: 12 });
  const ballRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, radius: 8 });
  const bricksRef = useRef<any[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const savedHistory = localStorage.getItem('vivazza_game_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedPoints = localStorage.getItem('vivazza_lifetime_points');
    if (savedPoints) setLifetimePoints(parseInt(savedPoints));
  }, []);

  const saveToHistory = (finalScore: number, finalResult: 'Ganador' | 'Perdedor') => {
    const newRecord: GameRecord = {
      score: finalScore,
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      result: finalResult
    };
    
    const updatedHistory = [newRecord, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('vivazza_game_history', JSON.stringify(updatedHistory));

    // Persistencia de puntos históricos
    const newLifetime = lifetimePoints + finalScore;
    setLifetimePoints(newLifetime);
    localStorage.setItem('vivazza_lifetime_points', newLifetime.toString());
  };

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = containerRef.current;
    if (container) {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      dimensionsRef.current = { width: rect.width, height: rect.height };
      const ctx = canvas.getContext('2d');
      ctx?.scale(dpr, dpr);
    }

    const { width, height } = dimensionsRef.current;
    
    const cols = width < 500 ? 5 : 8;
    const rows = 4;
    const padding = 8;
    const offsetTop = 40;
    const brickWidth = (width - (padding * (cols + 1))) / cols;
    const brickHeight = 20;

    bricksRef.current = [];
    for (let c = 0; c < cols; c++) {
      bricksRef.current[c] = [];
      for (let r = 0; r < rows; r++) {
        bricksRef.current[c][r] = { 
          x: c * (brickWidth + padding) + padding, 
          y: r * (brickHeight + padding) + offsetTop, 
          width: brickWidth,
          height: brickHeight,
          status: 1 
        };
      }
    }

    ballRef.current = { 
      x: width / 2, 
      y: height - 60, 
      dx: 4, 
      dy: -4,
      radius: 8
    };
    
    paddleRef.current = {
      width: width < 500 ? 80 : 110,
      height: 12,
      x: (width - (width < 500 ? 80 : 110)) / 2
    };
  };

  useEffect(() => {
    if (!isPlaying) return;

    initGame();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);
      
      let currentBricks = 0;
      bricksRef.current.forEach((col) => {
        col.forEach((b: any) => {
          if (b.status === 1) {
            currentBricks++;
            ctx.beginPath();
            ctx.roundRect(b.x, b.y, b.width, b.height, 4);
            ctx.fillStyle = b.y % 40 === 0 ? "#A61D24" : "#D4AF37";
            ctx.fill();
            ctx.closePath();
          }
        });
      });

      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = "#A61D24";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      const px = paddleRef.current.x;
      const py = height - 25;
      const pw = paddleRef.current.width;
      const ph = paddleRef.current.height;

      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 6);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = "#A61D24";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      const ball = ballRef.current;
      if (ball.x + ball.dx > width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
      if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
      else if (ball.y + ball.dy > height - 25 - ball.radius) {
        if (ball.x > paddleRef.current.x && ball.x < paddleRef.current.x + paddleRef.current.width) {
          ball.dy = -ball.dy;
          const hitPoint = (ball.x - (paddleRef.current.x + paddleRef.current.width / 2)) / (paddleRef.current.width / 2);
          ball.dx = hitPoint * 6;
        } else if (ball.y + ball.dy > height) {
          setGameState('lost');
          setIsPlaying(false);
          saveToHistory(score, 'Perdedor');
        }
      }

      bricksRef.current.forEach((col) => {
        col.forEach((b: any) => {
          if (b.status === 1) {
            if (ball.x > b.x && ball.x < b.x + b.width && ball.y > b.y && ball.y < b.y + b.height) {
              ball.dy = -ball.dy;
              b.status = 0;
              setScore(s => s + 10);
            }
          }
        });
      });

      if (currentBricks === 0 && isPlaying) {
        setGameState('won');
        setIsPlaying(false);
        saveToHistory(score, 'Ganador');
        onWinCoupon(COUPONS[1]);
      }

      ball.x += ball.dx;
      ball.y += ball.dy;
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);

    const handleInput = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const { width } = dimensionsRef.current;
      paddleRef.current.x = Math.max(0, Math.min(width - paddleRef.current.width, relativeX - paddleRef.current.width / 2));
    };

    const onMouseMove = (e: MouseEvent) => handleInput(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleInput(e.touches[0].clientX);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    setIsPlaying(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24 font-display">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-12 soft-ui-shadow border border-gray-100 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-4 font-black text-[10px] uppercase tracking-widest">
              <Gamepad2 size={14} /> Pizza Breaker Challenge
            </div>
            <h2 className="font-heading text-6xl md:text-8xl mb-2 text-vivazza-stone uppercase leading-none tracking-tight">
              PIZZA <span className="text-primary">RUSH</span>
            </h2>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-black/5 shadow-inner">
             <div className="bg-primary text-white p-2 rounded-xl">
               <Coins size={24} />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Banco de Puntos</p>
               <p className="text-2xl font-black text-vivazza-stone">{lifetimePoints.toLocaleString()}</p>
             </div>
          </div>
        </div>

        <div className="relative w-full aspect-[4/5] md:aspect-video rounded-[2rem] overflow-hidden bg-vivazza-stone shadow-inner border-4 border-white/5" ref={containerRef}>
          <canvas ref={canvasRef} className="w-full h-full cursor-none block" />
          
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-red animate-pulse cursor-pointer" onClick={startGame}>
                <Play fill="white" size={32} className="ml-1" />
              </div>
              <p className="text-white font-heading text-3xl mb-8 uppercase tracking-tight">¿Listo para el horno?</p>
              <button onClick={startGame} className="bg-white text-vivazza-stone px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                Empezar Partida
              </button>
            </div>
          )}

          {(gameState === 'won' || gameState === 'lost') && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              {gameState === 'won' ? (
                <>
                  <Trophy size={64} className="text-vivazza-gold mb-4 animate-bounce" />
                  <h3 className="font-heading text-6xl text-vivazza-stone mb-2 uppercase tracking-tight">¡Victoria!</h3>
                  <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-8">Has ganado un cupón artesanal</p>
                </>
              ) : (
                <>
                  <h3 className="font-heading text-6xl text-vivazza-stone mb-4 uppercase leading-tight tracking-tight">PIZZA AL<br/><span className="text-primary">SUELO</span></h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">No te rindas, los puntos se acumulan</p>
                </>
              )}
              <button onClick={startGame} className="bg-vivazza-stone text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
                <RotateCcw size={20} /> Reintentar
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="absolute top-4 left-6 flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none">Score</p>
                <p className="text-xl font-black text-white">{score}</p>
              </div>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center justify-center gap-3 text-gray-400 animate-pulse">
          <Fingerprint size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Desliza para mover</span>
        </div>
      </div>

      {/* Historial */}
      {history.length > 0 && (
        <div className="mt-8 bg-white/50 backdrop-blur-md rounded-[2rem] p-6 border border-gray-100">
          <h3 className="text-lg font-black text-vivazza-stone uppercase mb-4 flex items-center gap-2">
            <HistoryIcon size={18} className="text-primary" /> Historial de Partidas
          </h3>
          <div className="flex flex-col gap-2">
            {history.map((record, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-black/5 soft-ui-shadow">
                <div className="flex items-center gap-3">
                  <Star size={14} className={record.result === 'Ganador' ? 'text-vivazza-gold' : 'text-gray-300'} fill={record.result === 'Ganador' ? 'currentColor' : 'none'} />
                  <span className="text-[10px] font-bold text-gray-500">{record.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black">{record.score} PTS</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${record.result === 'Ganador' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {record.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PizzaRush;
