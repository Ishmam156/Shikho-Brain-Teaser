import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_GRID, INITIAL_BANK } from './constants';
import { GridCell, NumberItem, GameStatus } from './types';
import { Grid } from './components/Grid';
import { NumberBank } from './components/NumberBank';
import { Timer } from './components/Timer';
import { validateBoard } from './utils/gameLogic';
import { ConfettiOverlay } from './components/ConfettiOverlay';
import { RotateCcw } from 'lucide-react';

export default function App() {
  // Game State
  const [grid, setGrid] = useState<GridCell[]>(INITIAL_GRID);
  const [bank, setBank] = useState<NumberItem[]>(INITIAL_BANK);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Interaction State
  const [selectedBankItem, setSelectedBankItem] = useState<string | null>(null);
  
  // Derived State (Validation)
  const { correctCells, incorrectCells, isComplete } = useMemo(() => validateBoard(grid), [grid]);

  useEffect(() => {
    if (isComplete && gameStatus !== 'completed') {
      setGameStatus('completed');
    }
  }, [isComplete, gameStatus]);

  const handleRestart = () => {
    setGrid(INITIAL_GRID);
    setBank(INITIAL_BANK.map(b => ({ ...b, isUsed: false })));
    setGameStatus('playing');
    setTimeElapsed(0);
    setSelectedBankItem(null);
  };

  const handleBankSelect = (item: NumberItem) => {
    if (selectedBankItem === item.id) {
      setSelectedBankItem(null); // Deselect
    } else {
      setSelectedBankItem(item.id);
    }
  };

  const handleCellClick = (cell: GridCell) => {
    if (gameStatus === 'completed') return;

    // CASE 1: A bank item is selected, and we click an empty or filled cell
    if (selectedBankItem) {
      const bankItem = bank.find(b => b.id === selectedBankItem);
      if (!bankItem) return;

      // If cell already has a value, we need to return that value to bank first
      let updatedBank = [...bank];
      
      // If cell is not empty, find the bank item that was previously here and mark unused
      if (cell.value !== null) {
         // Since we don't store the specific bank ID in the cell, we search the bank for a used item with this value
         // However, there might be multiple 2s. We need a robust way.
         // A simple way for this game: Just find *first* used item in bank with matching value that isn't on the board anymore?
         // No, better: When we place an item, we can just swap if needed.
         
         // For simplicity: "Return to bank" logic
         // Find a used item in the bank that matches the cell's current value
         // We need to track which bank ID is in which cell to do this perfectly.
         // Let's just assume the first 'isUsed' item with matching value is the one to free up.
         const itemToFree = updatedBank.find(b => b.isUsed && b.value === cell.value);
         if (itemToFree) {
           itemToFree.isUsed = false;
         }
      }

      // Mark the new selected item as used
      const newBankItem = updatedBank.find(b => b.id === selectedBankItem);
      if (newBankItem) {
        newBankItem.isUsed = true;
      }

      setBank(updatedBank);
      
      // Update Grid
      const newGrid = grid.map(c => {
        if (c.id === cell.id) {
          return { ...c, value: bankItem.value };
        }
        return c;
      });
      setGrid(newGrid);
      setSelectedBankItem(null); // Clear selection after place
    } 
    // CASE 2: No bank item selected, but we click a filled cell -> Remove it (return to bank)
    else if (cell.value !== null) {
      const updatedBank = [...bank];
      // Find a used bank item with this value to free
      // To prevent freeing a '2' that is used elsewhere, we need to be careful.
      // Strategy: Count how many '2's are on the grid. Count how many '2's are marked used in bank.
      // Actually, since we are just untoggling one 'isUsed' flag, it doesn't matter *which* specific ID we free, as long as values match.
      // But wait, the bank items have IDs for selection.
      // Let's just pick the first used one with matching value.
      const itemToFree = updatedBank.find(b => b.isUsed && b.value === cell.value);
      if (itemToFree) {
        itemToFree.isUsed = false;
        setBank(updatedBank);
        
        const newGrid = grid.map(c => {
          if (c.id === cell.id) {
            return { ...c, value: null };
          }
          return c;
        });
        setGrid(newGrid);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-emerald-50">
      
      {/* Header */}
      <header className="w-full p-4 flex items-center justify-between max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-lg">Math</span>
          Crossword
        </h1>
        <div className="flex items-center gap-3">
          <Timer isRunning={gameStatus === 'playing'} onTimeUpdate={setTimeElapsed} />
          <button 
            onClick={handleRestart}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Restart Game"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-grow flex flex-col items-center justify-start pt-2 pb-32 sm:pb-40">
        <div className="text-center mb-4 px-4">
           <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
             Select a number from the bank below, then tap an empty square to place it. 
             Green squares are correct!
           </p>
        </div>

        <Grid 
          grid={grid} 
          correctCells={correctCells} 
          incorrectCells={incorrectCells} 
          onCellClick={handleCellClick}
        />
      </main>

      {/* Sticky Footer Bank */}
      <div className="fixed bottom-0 w-full z-40">
        <NumberBank 
          items={bank} 
          selectedItemId={selectedBankItem} 
          onSelect={handleBankSelect}
        />
      </div>

      {/* Success Overlay */}
      {gameStatus === 'completed' && (
        <ConfettiOverlay timeTaken={timeElapsed} onRestart={handleRestart} />
      )}
    </div>
  );
}
