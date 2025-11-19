import { GridCell, NumberItem } from './types';

// Initial Bank of Numbers based on the image
export const INITIAL_BANK: NumberItem[] = [
  { id: 'b1', value: 12, isUsed: false },
  { id: 'b2', value: 4, isUsed: false },
  { id: 'b3', value: 2, isUsed: false },
  { id: 'b4', value: 4, isUsed: false },
  { id: 'b5', value: 12, isUsed: false },
  { id: 'b6', value: 9, isUsed: false },
  { id: 'b7', value: 24, isUsed: false },
  { id: 'b8', value: 28, isUsed: false },
  { id: 'b9', value: 3, isUsed: false },
  { id: 'b10', value: 2, isUsed: false },
  { id: 'b11', value: 2, isUsed: false },
  { id: 'b12', value: 7, isUsed: false },
  { id: 'b13', value: 15, isUsed: false },
  { id: 'b14', value: 2, isUsed: false },
  { id: 'b15', value: 28, isUsed: false },
  { id: 'b16', value: 12, isUsed: false },
  { id: 'b17', value: 18, isUsed: false },
  { id: 'b18', value: 1, isUsed: false },
];

// Helper to create cells
const c = (row: number, col: number, val: string | number | null, isStatic = false): GridCell => ({
  id: `r${row}-c${col}`,
  row,
  col,
  type: typeof val === 'number' || val === null ? 'number' : (val === '=' ? 'equals' : 'operator'),
  value: val,
  isStatic,
});

// We will use a sparse grid approach. 
// The grid is roughly 9 rows x 12 columns based on the visual connections.
// We map the non-null cells.

export const INITIAL_GRID: GridCell[] = [
  // --- ROW 0 ---
  // [ ] - [ ] = 13     ...     [ ] + 14 = [ ]
  c(0, 0, null), c(0, 1, '-', true), c(0, 2, null), c(0, 3, '=', true), c(0, 4, 13, true),
  // Gap
  c(0, 7, null), c(0, 8, '+', true), c(0, 9, 14, true), c(0, 10, '=', true), c(0, 11, null),

  // --- ROW 1 (Vertical Connectors) ---
  //  |     |      |              |      |      |
  //  -     -      -              -      x      -
  c(1, 0, '-', true), c(1, 2, '-', true), c(1, 4, '-', true),
  c(1, 7, '-', true), c(1, 9, 'x', true), c(1, 11, '-', true),

  // --- ROW 2 ---
  // [ ] -  6  = [ ]     ...     [ ] x [ ] = [ ]
  c(2, 0, null), c(2, 1, '-', true), c(2, 2, 6, true), c(2, 3, '=', true), c(2, 4, null),
  // Gap
  c(2, 7, null), c(2, 8, 'x', true), c(2, 9, null), c(2, 10, '=', true), c(2, 11, null),

  // --- ROW 3 (Vertical Connectors) ---
  //  |            |              |      |      |
  //  =            =              =      =      1 (Actually 1 is part of vertical equation on right?)
  // Looking at right side: (0,11) - (2,11) = (4,11) which is '1'.
  // Let's trace vertical logic.
  // Left Col 0: (0,0) - (2,0) = 21.
  // Left Col 2: (0,2) - (2,2)6 = (4,2).
  // Left Col 4: 13 - (2,4) = (4,4).
  
  // Right Col 7: (0,7) - (2,7) = (4,7) which is '=' ? No.
  // Let's look at Row 4 Right side: It has '1' at the end.
  
  c(3, 0, '=', true), c(3, 4, '=', true),
  c(3, 7, '=', true), c(3, 9, '=', true), c(3, 11, '=', true), // Vertical equals

  // --- ROW 4 ---
  // 21    [ ] / [ ] = [ ]           ...   1
  c(4, 0, 21, true), 
  // The horizontal equation here starts at col 2?
  // Image: 21 is isolated vertical result.
  // Next to it: [ ] / [ ] = [ ] ? 
  // Looking at the image: 
  // Row 4 starts at Col 2: [ ] / [ ] = [ ]
  c(4, 2, null), c(4, 3, '/', true), c(4, 4, null), c(4, 5, '=', true), c(4, 6, null),
  
  // Right side vertical bottoms
  c(4, 11, 1, true), // Result of (0,11) - (2,11) = 1

  // --- ROW 5 (Vertical Connectors) ---
  //        |
  //        -
  c(5, 2, '-', true), 

  // --- ROW 6 ---
  //        [ ] / 6 = [ ]
  c(6, 2, null), c(6, 3, '/', true), c(6, 4, 6, true), c(6, 5, '=', true), c(6, 6, null),

  // --- ROW 7 (Vertical Connectors) ---
  //        |
  //        =
  c(7, 2, '=', true),

  // --- ROW 8 ---
  //        [ ] - [ ] = 3
  c(8, 2, null), c(8, 3, '-', true), c(8, 4, null), c(8, 5, '=', true), c(8, 6, 3, true),
];

// Total dimensions for rendering grid
export const GRID_ROWS = 9;
export const GRID_COLS = 12;
