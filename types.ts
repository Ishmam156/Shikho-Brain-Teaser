export type CellType = 'empty' | 'number' | 'operator' | 'equals';

export interface GridCell {
  id: string;
  row: number;
  col: number;
  type: CellType;
  value: string | number | null; // The static value or current value
  isStatic: boolean; // If true, part of the puzzle structure (like '13', '+', '=')
  correctValue?: number; // For validation logic (optional, if we want strict checking)
}

export interface NumberItem {
  id: string;
  value: number;
  isUsed: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  involvedCells: string[]; // IDs of cells in this equation
}

export type GameStatus = 'playing' | 'completed';
