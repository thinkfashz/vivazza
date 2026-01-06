import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, MousePointer2, Gift } from 'lucide-react';
import { HighScore, Coupon } from '../types';
import { COUPONS } from '../constants';

const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 7;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 35;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;

interface PizzaRushProps {
  onWinCoupon?: (coupon: Coupon) => void;
}

const PizzaRush: React.FC<PizzaRushProps> = ({ onWinCoupon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStatus, setGameStatus] = useState<'menu' | 'playing' | 'gameover' | 'won'>('menu');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [rewardClaimed, setRewardClaimed] = useState(false);
  
  // Game State Refs (for animation loop performance)
  const ballRef = useRef({ x: 0, y: 0, dx: 4, dy: -4 });
  const paddleRef = useRef({ x: 0 });
  const bricksRef = useRef<{ x: number; y: number; status: number; color: string }[][]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const savedScores = localStorage.getItem('vivazza_highscores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
    initGame();
  }, []);

  useEffect(() => {
    if (gameStatus === 'won' && !rewardClaimed && onWinCoupon) {
      const winCoupon = COUPONS.find(c => c.code === 'GAMERWIN');
      if (winCoupon) {
        onWinCoupon(winCoupon);
        setRewardClaimed(true);
      }
    }
  }, [gameStatus, rewardClaimed, onWinCoupon]);

  const initGame = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Reset Ball
    ballRef.current = { x: canvas.width / 2, y: canvas.height - 30, dx: 4, dy: -4 };
    
    // Reset Paddle
    paddleRef.current = { x: (canvas.width - PADDLE_WIDTH) / 2 };

    // Reset Bricks
    const newBricks = [];
    const colors = ['#A61D24', '#FDFCF0', '#4ade80', '#A61D24', '#FDFCF0']; // Red, White, Green pattern
    
    const brickWidth = (canvas.width - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLUMN_COUNT - 1))) / BRICK_COLUMN_COUNT;

    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      newBricks[c] = [];
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const brickX = (c * (brickWidth + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
        const brickY = (r * (20 + BRICK_PADDING)) + BRICK_OFFSET_TOP;
        newBricks[c][r] = { 
          x: brickX, 
          y: brickY, 
          status: 1, 
          color: colors[r % colors.length] 
        };
      }
    }
    bricksRef.current = newBricks;
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#A61D24'; // Tomato Red
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };

  const drawPaddle = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(paddleRef.current.x, ctx.canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#D4AF37'; // Wood color
    ctx.fill();
    ctx.strokeStyle = '#854d0e';
    ctx.stroke();
    ctx.closePath();
  };

  const drawBricks = (ctx: CanvasRenderingContext2D) => {
    const brickWidth = (ctx.canvas.width - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLUMN_COUNT - 1))) / BRICK_COLUMN_COUNT;
    const brickHeight = 20;

    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        if (bricksRef.current[c][r].status === 1) {
          const b = bricksRef.current[c][r];
          ctx.beginPath();
          ctx.rect(b.x, b.y, brickWidth, brickHeight);
          ctx.fillStyle = b.color;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  const collisionDetection = (canvas: HTMLCanvasElement) => {
    const brickWidth = (canvas.width - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLUMN_COUNT - 1))) / BRICK_COLUMN_COUNT;
    const brickHeight = 20;

    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const b = bricksRef.current[c][r];
        if (b.status === 1) {
          if (
            ballRef.current.x > b.x &&
            ballRef.current.x < b.x + brickWidth &&
            ballRef.current.y > b.y &&
            ballRef.current.y < b.y + brickHeight
          ) {
            ballRef.current.dy = -ballRef.current.dy;
            b.status = 0;
            setScore(prev => prev + 10);
            
            // Check win
            const remaining = bricksRef.current.flat().filter(br => br.status === 1).length;
            if (remaining === 0) {
              setGameStatus('won');
              setIsPlaying(false);
            }
          }
        }
      }
    }
  };

  const update = () => {
    if (!canvasRef.current || !isPlaying) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    collisionDetection(canvas);

    // Wall Collision
    if (ballRef.current.x + ballRef.current.dx > canvas.width - BALL_RADIUS || ballRef.current.x + ballRef.current.dx < BALL_RADIUS) {
      ballRef.current.dx = -ballRef.current.dx;
    }
    if (ballRef.current.y + ballRef.current.dy < BALL_RADIUS) {
      ballRef.current.dy = -ballRef.current.dy;
    } else if (ballRef.current.y + ballRef.current.dy > canvas.height - BALL_RADIUS - 10) {
      // Paddle Collision
      if (ballRef.current.x > paddleRef.current.x && ballRef.current.x < paddleRef.current.x + PADDLE_WIDTH) {
         // Add some angle depending on where it hits the paddle
         const hitPoint = ballRef.current.x - (paddleRef.current.x + PADDLE_WIDTH / 2);
         ballRef.current.dx = hitPoint * 0.15; // Velocity influence
         ballRef.current.dy = -Math.abs(ballRef.current.dy) * 1.05; // Speed up slightly
      } else if (ballRef.current.y + ballRef.current.dy > canvas.height) {
        // Game Over Logic
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameStatus('gameover');
            setIsPlaying(false);
            checkHighScore(score);
            return 0;
          } else {
            // Reset ball
            ballRef.current.x = canvas.width / 2;
            ballRef.current.y = canvas.height - 30;
            ballRef.current.dx = 4;
            ballRef.current.dy = -4;
            paddleRef.current.x = (canvas.width - PADDLE_WIDTH) / 2;
            return newLives;
          }
        });
      }
    }

    ballRef.current.x += ballRef.current.dx;
    ballRef.current.y += ballRef.current.dy;

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, score]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    if (relativeX > 0 && relativeX < canvasRef.current.width) {
      paddleRef.current.x = relativeX - PADDLE_WIDTH / 2;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    if (relativeX > 0 && relativeX < canvasRef.current.width) {
      paddleRef.current.x = relativeX - PADDLE_WIDTH / 2;
    }
  };

  const checkHighScore = (finalScore: number) => {
    const minScore = highScores.length < 5 ? 0 : highScores[highScores.length - 1].score;
    if (finalScore > minScore) {
      setGameStatus('gameover'); // Ensure state is gameover to show input
    }
  };

  const saveScore = () => {
    if (!playerName.trim()) return;
    const newScore: HighScore = { name: playerName, score, date: new Date().toLocaleDateString() };
    const updated = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    setHighScores(updated);
    localStorage.setItem('vivazza_highscores', JSON.stringify(updated));
    setPlayerName('');
    setGameStatus('menu');
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameStatus('playing');
    setRewardClaimed(false);
    initGame();
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Game Canvas Area */}
      <div className="flex-1 bg-vivazza-stone rounded-2xl p-4 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4 z-10 relative">
          <div>
            <h3 className="font-heading text-3xl text-vivazza-gold">Pizza Breaker</h3>
            <p className="text-gray-400 text-sm hidden sm:block">Rompe los ingredientes. ¡Gana cupones!</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl">{score} pts</div>
            <div className="flex gap-1 justify-end mt-1">
              {[...Array(lives)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-vivazza-red"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <canvas
            ref={canvasRef}
            width={600}
            height={450}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="w-full h-full cursor-none touch-none block"
          />
          
          {/* Overlays */}
          {gameStatus === 'menu' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
               <MousePointer2 className="text-white mb-4 animate-bounce" size={32} />
              <button 
                onClick={startGame}
                className="bg-vivazza-red hover:bg-red-600 text-white px-8 py-3 rounded-full font-heading text-xl flex items-center gap-2 transition-transform hover:scale-105 shadow-red"
              >
                <Play size={20}/> Jugar Ahora
              </button>
            </div>
          )}

          {(gameStatus === 'gameover' || gameStatus === 'won') && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 backdrop-blur-md p-6 text-center animate-fade-in-up">
                <Trophy className={`${gameStatus === 'won' ? 'text-vivazza-gold' : 'text-gray-400'} mb-4`} size={48} />
                <h3 className="text-4xl font-heading text-white mb-2">{gameStatus === 'won' ? '¡Victoria!' : 'Game Over'}</h3>
                <p className="text-gray-300 mb-6 font-mono">Puntuación Final: {score}</p>

                {gameStatus === 'won' && (
                  <div className="bg-vivazza-gold/20 border border-vivazza-gold p-4 rounded-xl mb-6 max-w-xs">
                     <div className="flex items-center justify-center gap-2 text-vivazza-gold font-bold mb-2">
                        <Gift size={20} className="animate-bounce" />
                        <span>¡CUPÓN DESBLOQUEADO!</span>
                     </div>
                     <p className="text-sm text-gray-200">15% OFF aplicado automáticamente a tu carrito.</p>
                  </div>
                )}
                
                {(score > 0 && (highScores.length < 5 || score > highScores[highScores.length - 1].score)) ? (
                  <div className="w-full max-w-xs mb-4">
                    <p className="text-vivazza-gold font-bold text-sm mb-2">¡Nuevo Récord!</p>
                    <input 
                      type="text" 
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Ingresa tu nombre"
                      maxLength={10}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-4 text-center focus:outline-none focus:ring-2 focus:ring-vivazza-gold border border-gray-600"
                    />
                    <button 
                      onClick={saveScore}
                      className="w-full bg-vivazza-gold text-vivazza-stone px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-yellow-500 transition-colors"
                    >
                      Guardar Récord
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={startGame}
                    className="bg-white text-vivazza-stone px-8 py-3 rounded-full font-heading text-xl flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <RotateCcw size={20}/> Intentar de Nuevo
                  </button>
                )}
             </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="w-full md:w-64 bg-white rounded-2xl p-6 shadow-premium border border-gray-100">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <Trophy size={20} className="text-vivazza-gold" />
          <h3 className="font-heading text-xl text-vivazza-stone">Hall of Fame</h3>
        </div>
        {highScores.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Sé el primero en el ranking.</p>
        ) : (
          <ul className="space-y-3">
            {highScores.map((s, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm group">
                <div className="flex gap-2 items-center">
                  <span className={`font-bold w-5 h-5 flex items-center justify-center rounded-full text-xs ${idx === 0 ? 'bg-vivazza-gold text-white' : 'text-gray-400 bg-gray-100'}`}>{idx + 1}</span>
                  <span className="text-gray-700 font-medium truncate max-w-[100px]">{s.name}</span>
                </div>
                <span className="font-mono font-bold text-vivazza-red">{s.score}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default PizzaRush;