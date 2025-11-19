import { GridCell, ValidationResult } from '../types';
import { GRID_ROWS, GRID_COLS } from '../constants';

const getCell = (grid: GridCell[], r: number, c: number) => grid.find(cell => cell.row === r && cell.col === c);

const evaluateEquation = (num1: number, op: string, num2: number, result: number): boolean => {
  switch (op) {
    case '+': return num1 + num2 === result;
    case '-': return num1 - num2 === result;
    case 'x': return num1 * num2 === result;
    case '/': return num2 !== 0 && num1 / num2 === result;
    default: return false;
  }
};

export const validateBoard = (grid: GridCell[]): {
  correctCells: Set<string>;
  incorrectCells: Set<string>;
  isComplete: boolean;
} => {
  const correctCells = new Set<string>();
  const incorrectCells = new Set<string>();

  // We scan for patterns: Number -> Op -> Number -> Equals -> Number
  // Horizontal scan
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS - 4; c++) {
      const c1 = getCell(grid, r, c);
      const op = getCell(grid, r, c + 1);
      const c2 = getCell(grid, r, c + 2);
      const eq = getCell(grid, r, c + 3);
      const res = getCell(grid, r, c + 4);

      if (c1 && op && c2 && eq && res &&
          (c1.type === 'number' || c1.value !== null) &&
          (op.type === 'operator') &&
          (c2.type === 'number' || c2.value !== null) &&
          (eq.value === '=') &&
          (res.type === 'number' || res.value !== null)) {
        
        // Check if all have values (either static or user placed)
        if (c1.value !== null && c2.value !== null && res.value !== null) {
           const valid = evaluateEquation(Number(c1.value), String(op.value), Number(c2.value), Number(res.value));
           const ids = [c1.id, c2.id, res.id];
           if (valid) {
             ids.forEach(id => correctCells.add(id));
           } else {
             ids.forEach(id => incorrectCells.add(id));
           }
        }
      }
    }
  }

  // Vertical scan
  for (let c = 0; c < GRID_COLS; c++) {
    for (let r = 0; r < GRID_ROWS - 4; r++) {
      const c1 = getCell(grid, r, c);
      const op = getCell(grid, r + 1, c);
      const c2 = getCell(grid, r + 2, c);
      const eq = getCell(grid, r + 3, c);
      const res = getCell(grid, r + 4, c);

      if (c1 && op && c2 && eq && res &&
          (c1.type === 'number' || c1.value !== null) &&
          (op.type === 'operator') &&
          (c2.type === 'number' || c2.value !== null) &&
          (eq.value === '=') &&
          (res.type === 'number' || res.value !== null)) {
        
        if (c1.value !== null && c2.value !== null && res.value !== null) {
           const valid = evaluateEquation(Number(c1.value), String(op.value), Number(c2.value), Number(res.value));
           const ids = [c1.id, c2.id, res.id];
           if (valid) {
             ids.forEach(id => correctCells.add(id));
           } else {
             ids.forEach(id => incorrectCells.add(id));
           }
        }
      }
    }
  }

  // Filter out conflicts: If a cell is marked correct in one equation but wrong in another?
  // Strictly speaking, it must be correct in ALL contexts to be green.
  // However, usually red overrides green for immediate feedback.
  
  // Let's refine: A cell is correct if it is part of AT LEAST one valid equation AND NOT part of any invalid fully-formed equation.
  // Actually, simplest for user:
  // If part of a wrong equation -> Red.
  // If part of a correct equation and not red -> Green.
  
  const finalCorrect = new Set<string>();
  const finalIncorrect = new Set<string>();

  // Add to incorrect if in any incorrect set
  incorrectCells.forEach(id => finalIncorrect.add(id));

  // Add to correct only if not in incorrect
  correctCells.forEach(id => {
    if (!finalIncorrect.has(id)) {
      finalCorrect.add(id);
    }
  });

  // Check completeness: All non-static empty slots must be filled and valid
  const userSlots = grid.filter(c => !c.isStatic && c.type === 'number');
  const allFilled = userSlots.every(c => c.value !== null);
  // Also need to ensure NO incorrect equations exist
  const isComplete = allFilled && finalIncorrect.size === 0 && finalCorrect.size >= userSlots.length; 
  // Note: The logic above ensures every filled slot participates in at least one valid equation eventually.
  // Since the crossword is interconnected, checking user slots for validity is enough.
  
  return {
    correctCells: finalCorrect,
    incorrectCells: finalIncorrect,
    isComplete
  };
};
