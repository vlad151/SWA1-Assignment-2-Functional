export type Generator<T> = { next: () => T };

export type Position = {
  row: number;
  col: number;
};

export type Match<T> = {
  matched: T;
  positions: Position[];
};

export type Board<T> = {
  width: number;
  height: number;
  tiles: T[][];
};

export type Effect<T> =
  | { kind: "Match"; match: Match<T> }
  | { kind: "Refill"; }; 

export type MoveResult<T> = {
  board: Board<T>;
  effects: Effect<T>[];
};

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
  const tiles: T[][] = [];
  for (let i = 0; i < height; i++) {
    const row: T[] = [];
    for (let j = 0; j < width; j++) {
      row.push(generator.next());
    }
    tiles.push(row);
  }
  return { width, height, tiles };
}

export function piece<T>(board: Board<T>, p: Position): T | undefined {
  if (isValidPosition(board, p)) {
      return board.tiles[p.row][p.col];
  }
  return undefined;
}

export function positions<T>(board: Board<T>): Position[] {
  const allPositions: Position[] = [];
  for (let i = 0; i < board.height; i++) {
    for (let j = 0; j < board.width; j++) {
      allPositions.push({ row: i, col: j });
    }
  }
  return allPositions;
}

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
  // Check if both positions are within the boundaries of the board
 if (!isValidPosition(board, first) || !isValidPosition(board, second)) return false;

 if(!areInSameRowOrColumn(first, second)) return false;

 const tempBoard = swapTiles(board, first, second);

 // Check for matches at both positions
 const hasMatchAtFirst = checkForMatch(first, tempBoard.tiles).length > 0;
 const hasMatchAtSecond = checkForMatch(second, tempBoard.tiles).length > 0;

 return hasMatchAtFirst || hasMatchAtSecond;
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
return 
}


function checkForMatch<T>(position: Position, board: T[][]):Position[] {
const tile = board[position.row][position.col];
const matches: Position[] = [];

if (!tile) return matches;

  // Vertical check
  let up = position.row;
  while (up >= 0 && board[up][position.col] === tile) {
    up--;
  }

  let down = position.row;
  while (down < board.length && board[down][position.col] === tile) {
    down++;
  }

  if (down - up - 1 >= 3) {
    for (let i = up + 1; i < down; i++) {
      matches.push({ row: i, col: position.col });
    }
  }

   // Horizontal check
   let left = position.col;
   while (left >= 0 && board[position.row][left] === tile) {
     left--;
   }

   let right = position.col;
   while (right < board[0].length && board[position.row][right] === tile) {
     right++;
   }

   if (right - left - 1 >= 3) {
     for (let i = left + 1; i < right; i++) {
       matches.push({ row: position.row, col: i });
     }
   }

return matches;
}

function isSamePostion(first: Position, second: Position): boolean {
  return
}

function handleMatches<T>(board: Board<T>, matches: Match<T>[]): MoveResult<T> {
  return
}

function processMatches<T>(board: Board<T>): MoveResult<T> {
  return
}

function processRefill<T>(board: Board<T>): MoveResult<T> {
  return
}

function isValidPosition<T>(board: Board<T>, position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < board.height &&
    position.col >= 0 &&
    position.col < board.width
  );
}

function detectMatch<T>(board: Board<T>): MoveResult<T> {
  return
}

function areInSameRowOrColumn(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row || pos1.col === pos2.col;
}

function swapTiles<T>(board: Board<T>, first: Position, second: Position): Board<T> {
  // Clone the tiles to avoid mutating the original board
    const newTiles = board.tiles.map(row => [...row]);

    // Swap the tiles
    const temp = newTiles[first.row][first.col];
    newTiles[first.row][first.col] = newTiles[second.row][second.col];
    newTiles[second.row][second.col] = temp;

    return { ...board, tiles: newTiles };
}