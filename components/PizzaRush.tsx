"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Coupon } from '../types';
import { COUPONS } from '../constants';
import { Gamepad2, Play, RotateCcw, Trophy } from 'lucide-react';

interface PizzaRushProps {
  onWinCoupon: (coupon: Coupon) => void;
}

const PizzaRush: React.FC<PizzaRushProps> = ({ onWinCoupon }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game Constants
  const PADDLE_HEIGHT = 15;
  const PADDLE_WIDTH = 100;
  const BALL_RADIUS = 8;
  const BRICK_ROWS = 4;
  const BRICK_COLS = 7;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 40;
  const BRICK_OFFSET_LEFT = 35;

  // Fix: Added initial value undefined to useRef to comply with strict argument checks
  const requestRef = useRef<number | undefined>(undefined);
  const paddleRef = useRef(0);
  const ballRef = useRef({ x: 0, y: 0, dx: 3, dy: -3 });
  const bricksRef = useRef<any[]>([]);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize bricks
    bricksRef.current = [];
    for (let c = 0; c < BRICK_COLS; c++) {
      bricksRef.current[c] = [];
      for (let r = 0; r < BRICK_ROWS; r++) {
        bricksRef.current[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    ballRef.current = { 
      x: canvas.width / 2, 
      y: canvas.height - 40, 
      dx: 3 + Math.random() * 2, 
      dy: -3 - Math.random() * 2 
    };
    paddleRef.current = (canvas.width - PADDLE_WIDTH) / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Bricks (Toppings)
      let currentBricks = 0;
      for (let c = 0; c < BRICK_COLS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
          if (bricksRef.current[c][r].status === 1) {
            currentBricks++;
            const brickX = c * (60 + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (25 + BRICK_PADDING) + BRICK_OFFSET_TOP;
            bricksRef.current[c][r].x = brickX;
            bricksRef.current[c][r].y = brickY;
            
            ctx.beginPath();
            ctx.roundRect(brickX, brickY, 60, 25, 5);
            ctx.fillStyle = r % 2 === 0 ? "#A61D24" : "#D4AF37"; // Red or Gold bricks
            ctx.fill();
            ctx.closePath();
          }
        }
      }

      // Draw Ball (The Dough)
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#FDFCF0";
      ctx.fill();
      ctx.strokeStyle = "#A61D24";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      // Draw Paddle (Pizza Peel)
      ctx.beginPath();
      ctx.roundRect(paddleRef.current, canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT, 8);
      ctx.fillStyle = "#1c1917";
      ctx.fill();
      ctx.closePath();

      // Collision Detection: Walls
      if (ballRef.current.x + ballRef.current.dx > canvas.width - BALL_RADIUS || ballRef.current.x + ballRef.current.dx < BALL_RADIUS) {
        ballRef.current.dx = -ballRef.current.dx;
      }
      if (ballRef.current.y + ballRef.current.dy < BALL_RADIUS) {
        ballRef.current.dy = -ballRef.current.dy;
      } else if (ballRef.current.y + ballRef.current.dy > canvas.height - BALL_RADIUS - 10) {
        if (ballRef.current.x > paddleRef.current && ballRef.current.x < paddleRef.current + PADDLE_WIDTH) {
          ballRef.current.dy = -ballRef.current.dy;
          // Add a bit of speed
          ballRef.current.dx *= 1.05;
          ballRef.current.dy *= 1.05;
        } else {
          setGameState('lost');
          setIsPlaying(false);
        }
      }

      // Collision Detection: Bricks
      for (let c = 0; c < BRICK_COLS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
          const b = bricksRef.current[c][r];
          if (b.status === 1) {
            if (ballRef.current.x > b.x && ballRef.current.x < b.x + 60 && ballRef.current.y > b.y && ballRef.current.y < b.y + 25) {
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
        onWinCoupon(COUPONS[2]);
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

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleRef.current = relativeX - PADDLE_WIDTH / 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    setIsPlaying(true);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up px-4">
      <div className="bg-vivazza-stone rounded-[2.5rem] p-8 md:p-12 text-white mb-8 shadow-premium text-center">
        <Gamepad2 size={48} className="text-vivazza-red mx-auto mb-6" />
        <h2 className="font-heading text-5xl md:text-7xl mb-4 uppercase">PIZZA <span className="text-vivazza-red">BREAKER</span></h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">¡Destruye todos los ingredientes rebotando la masa y gana un 15% de descuento!</p>
        
        {gameState !== 'playing' && (
          <button onClick={startGame} className="bg-vivazza-red text-white px-12 py-5 rounded-2xl font-heading text-2xl shadow-red hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto">
             <Play fill="currentColor" size={24} /> {gameState === 'start' ? 'JUGAR AHORA' : 'REINTENTAR'}
          </button>
        )}

        {gameState === 'playing' && (
          <div className="text-2xl font-heading text-vivazza-gold">
            PUNTOS: <span>{score}</span>
          </div>
        )}
      </div>

      <div className={`relative bg-vivazza-cream rounded-3xl overflow-hidden shadow-2xl border-4 border-vivazza-stone/10 h-[500px] flex items-center justify-center ${gameState === 'playing' ? 'cursor-none' : ''}`}>
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={500} 
          className="max-w-full h-full aspect-square"
        />

        {gameState === 'won' && (
          <div className="absolute inset-0 bg-vivazza-stone/90 flex flex-col items-center justify-center p-8 animate-fade-in">
             <Trophy size={80} className="text-vivazza-gold mb-6 animate-bounce" />
             <h3 className="font-heading text-6xl text-white mb-4">¡VICTORIA!</h3>
             <p className="text-vivazza-gold font-bold uppercase tracking-widest text-sm text-center mb-8">Has ganado el cupón PIZZABREAKER</p>
             <button onClick={startGame} className="text-white border border-white/20 px-8 py-3 rounded-xl font-bold text-xs uppercase hover:bg-white/10 transition-all flex items-center gap-2">
               <RotateCcw size={16} /> VOLVER A JUGAR
             </button>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-8 animate-fade-in">
             <h3 className="font-heading text-6xl text-white mb-4">Masa Quemada</h3>
             <p className="text-gray-300 font-bold uppercase tracking-widest text-xs text-center mb-8">No te rindas, ¡inténtalo de nuevo!</p>
             <button onClick={startGame} className="bg-vivazza-red text-white px-8 py-4 rounded-xl font-heading text-xl shadow-lg active:scale-95 transition-all">
               REINTENTAR DESAFÍO
             </button>
          </div>
        )}
      </div>
      
      <p className="text-center text-gray-400 text-[10px] font-bold mt-4 uppercase tracking-widest">
        Control: Mueve el mouse o desliza el dedo para mover la pala
      </p>
    </div>
  );
};

export default PizzaRush;