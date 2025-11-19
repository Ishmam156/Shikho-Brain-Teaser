import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { Trophy, RefreshCw } from 'lucide-react';

interface ConfettiOverlayProps {
  timeTaken: number;
  onRestart: () => void;
}

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ timeTaken, onRestart }) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={800} />
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform scale-100 animate-bounce-small">
        <div className="mx-auto bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Puzzle Solved!</h2>
        <p className="text-gray-500 mb-6">Great mental workout.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-400 uppercase font-semibold tracking-wider">Time Taken</p>
          <p className="text-2xl font-mono font-bold text-blue-600">{formatTime(timeTaken)}</p>
        </div>

        <button 
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};
