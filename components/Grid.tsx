import React from 'react';
import { GridCell } from '../types';
import { GRID_ROWS, GRID_COLS } from '../constants';

interface GridProps {
  grid: GridCell[];
  correctCells: Set<string>;
  incorrectCells: Set<string>;
  onCellClick: (cell: GridCell) => void;
  selectedCellId?: string | null; // For visual feedback if we wanted to highlight destination
}

export const Grid: React.FC<GridProps> = ({ grid, correctCells, incorrectCells, onCellClick }) => {
  
  // Helper to get cell at coordinate
  const getCellAt = (r: number, c: number) => grid.find(cell => cell.row === r && cell.col === c);

  // Generate the grid layout
  const renderGrid = () => {
    const elements = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const rowCells = [];
      for (let c = 0; c < GRID_COLS; c++) {
        const cell = getCellAt(r, c);
        
        // Determine styling based on cell type and state
        let content: React.ReactNode = null;
        let cellClass = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded text-lg sm:text-xl font-bold transition-colors duration-200 select-none ";
        
        if (!cell) {
          // Empty spacer
          cellClass += "bg-transparent";
        } else if (cell.isStatic) {
          // Pre-filled static clues
          if (cell.type === 'operator' || cell.type === 'equals') {
            cellClass += "bg-amber-100 text-amber-800 shadow-sm";
            content = cell.value;
          } else {
             // Static Number (like '13' or '21')
             cellClass += "bg-amber-200 text-amber-900 shadow border border-amber-300";
             content = cell.value;
          }
        } else {
          // User Interactive Cell
          const isCorrect = correctCells.has(cell.id);
          const isIncorrect = incorrectCells.has(cell.id);
          const hasValue = cell.value !== null;

          if (hasValue) {
            if (isCorrect) {
              cellClass += "bg-green-500 text-white shadow-md cursor-pointer hover:bg-green-600";
            } else if (isIncorrect) {
              cellClass += "bg-red-500 text-white shadow-md cursor-pointer hover:bg-red-600";
            } else {
              cellClass += "bg-white text-gray-800 shadow border border-gray-300 cursor-pointer hover:bg-gray-50";
            }
            content = cell.value;
          } else {
            // Empty slot
            cellClass += "bg-white/50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
          }
        }

        rowCells.push(
          <div 
            key={`cell-${r}-${c}`} 
            className={cellClass}
            onClick={() => cell && !cell.isStatic ? onCellClick(cell) : undefined}
            role={cell && !cell.isStatic ? "button" : undefined}
            aria-label={cell && !cell.isStatic ? `Grid cell ${r}, ${c}, ${cell.value ? 'Value ' + cell.value : 'Empty'}` : undefined}
          >
            {content}
          </div>
        );
      }
      elements.push(
        <div key={`row-${r}`} className="flex gap-1 sm:gap-2 mb-1 sm:mb-2 justify-center">
          {rowCells}
        </div>
      );
    }
    return elements;
  };

  return (
    <div className="flex flex-col items-center p-4 overflow-x-auto">
      <div className="bg-white/40 p-4 rounded-xl shadow-inner backdrop-blur-sm border border-white/50 min-w-max">
        {renderGrid()}
      </div>
    </div>
  );
};
