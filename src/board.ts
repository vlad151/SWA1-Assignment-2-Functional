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
  if (!canMove(board, first, second)) return { board, effects: [] };

  const newBoard = swapTiles(board, first, second);
  return handleMatches(newBoard, generator);
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

function isSamePostion(first:  Position[], second:  Position[]): boolean {
 if (first.length !== second.length) return false;
 for (let i = 0; i < first.length; i++) {
   if (first[i].row !== second[i].row || first[i].col !== second[i].col) return false;
 }
  return true;
}

function handleMatches<T>(board: Board<T>, generator: Generator<T>): MoveResult<T> {
  const matches = detectMatch(board);
  if (matches.length === 0) {
    return { board, effects: [] };
  }

  // Process the matches
  board = processMatches(matches, board);
  
  // Add Match effects
  const matchEffects: Effect<T>[] = matches.map(match => ({ kind: 'Match', match }));

  // Refill the board
  board = refillBoard(board, generator);

  // Add Refill effect
  const refillEffect: Effect<T> = { kind: 'Refill' };

  // Recursive call to handle any new matches after refilling
  const nextMoveResult = handleMatches(board, generator);

  return {
    board: nextMoveResult.board,
    effects: [...matchEffects, refillEffect, ...nextMoveResult.effects]
  };
}

function processMatches<T>(matches: Match<T>[],board: Board<T>): Board<T> {
  matches.forEach((match) => {
    match.positions.forEach((position) => {
      board.tiles[position.row][position.col] = undefined;
    });
  });
  return board;
}

function refillBoard<T>(board: Board<T>, generator: Generator<T>): Board<T> {
  // 3. Drop tiles from above
  for (let col = 0; col < board.width; col++) {
    let emptyRow = board.height - 1;
    for (let row = board.height - 1; row >= 0; row--) {
      if (!board.tiles[row] || board.tiles[row][col] === undefined) {
        continue;
      }
      if (row !== emptyRow) {
        board.tiles[emptyRow][col] = board.tiles[row][col];
        board.tiles[row][col] = undefined;
      }
      emptyRow--;
    } 
  }

  // 4. Generate new tiles
  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      if (!board.tiles[row] || board.tiles[row][col] === undefined) {
        board.tiles[row][col] = generator.next();
      }
    }
  }
  return board;
}


function isValidPosition<T>(board: Board<T>, position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < board.height &&
    position.col >= 0 &&
    position.col < board.width
  );
}

function detectMatch<T>(board: Board<T>): Match<T>[] 
{
  const matches: Match<T>[] = [];
  const allPositions = positions(board);

  allPositions.forEach((position) => {
    const matchedPositions = checkForMatch(position, board.tiles);
    if (matchedPositions.length) {
      const tile = board.tiles[position.row][position.col];
      if (tile) {
        const existingMatch = matches.find(m => m.matched === tile && isSamePostion(m.positions, matchedPositions));
        if (!existingMatch) {
          matches.push({ matched: tile, positions: matchedPositions });
        }
      }
    }
  });
return matches;
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