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
  | { kind: "Refill"; board?: Board<T> }; // board is optional because we might not always need to provide the updated board.

export type MoveResult<T> = {
  board: Board<T>;
  effects: Effect<T>[];
};

export function create<T>(
  generator: Generator<T>,
  width: number,
  height: number
): Board<T> {
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
    if (isPositionWithinBoard(p, board)) {
        return board.tiles[p.row][p.col];
    }
    return undefined;
}

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
   if (!isPositionWithinBoard(first, board) || !isPositionWithinBoard(second, board)) {
       return false;
   }

    if (!areInSameRowOrColumn(first, second)) {
         return false;
    }

   // Use the swapTiles function to get a new board with swapped tiles
   const tempBoard = swapTiles(board, first, second);

     // Check for matches at both positions
     const hasMatchAtFirst = checkForMatch(first, tempBoard.tiles).length > 0;
     const hasMatchAtSecond = checkForMatch(second, tempBoard.tiles).length > 0;
 
     return hasMatchAtFirst || hasMatchAtSecond;
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
  if (!canMove(board, first, second)) {
      return { board, effects: [] };
  }
  let currentBoard = swapTiles(board, first, second);
  let effects: Effect<T>[] = [];
  let matches: Position[] = [];

  do {
      matches = positions(currentBoard)
          .map(pos => checkForMatch(pos, currentBoard.tiles))
          .flat()
          .filter((value, index, self) => 
              self.findIndex(v => v.row === value.row && v.col === value.col) === index
          );

      if (matches.length > 0) {
          // Add Match effect
          const matchedTile = piece(currentBoard, matches[0]);
          if (matchedTile !== undefined) {
              effects.push({ kind: "Match", match: { matched: matchedTile, positions: matches } });
          }

          // Remove matched tiles and refill the board
          currentBoard = refillBoard(generator, currentBoard, matches);
          effects.push({ kind: "Refill" });
      }
  } while (matches.length > 0);

  return {
      board: currentBoard,
      effects: effects
  };
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

function areInSameRowOrColumn(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row || pos1.col === pos2.col;
}

function isPositionWithinBoard<T>(pos: Position, board: Board<T>): boolean {
  return (
    pos.row >= 0 &&
    pos.row < board.height &&
    pos.col >= 0 &&
    pos.col < board.width
  );
}

function checkForMatch<T>(position: Position, board: T[][]): Position[] {
    const tile = board[position.row][position.col];
    const matchedPositions: Position[] = [];

    if (!tile) return matchedPositions;

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
        matchedPositions.push({ row: position.row, col: i });
      }
    }

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
        matchedPositions.push({ row: i, col: position.col });
      }
    }

    return matchedPositions;
}

function swapTiles<T>(board: Board<T>, first: Position, second: Position): Board<T> {
    const newTiles = board.tiles.map((row, rowIndex) => 
      row.map((cell, colIndex) => {
        if (rowIndex === first.row && colIndex === first.col) {
          return board.tiles[second.row][second.col];
        }
        if (rowIndex === second.row && colIndex === second.col) {
          return board.tiles[first.row][first.col];
        }
        return cell;
      })
    );
    return { ...board, tiles: newTiles };
  }

  function refillBoard<T>(generator: Generator<T>, board: Board<T>, matches: Position[]): Board<T> {
    const newTiles = board.tiles.map(row => [...row]);
    for (const match of matches) {
        for (let row = match.row; row > 0; row--) {
            newTiles[row][match.col] = newTiles[row - 1][match.col];
        }
        newTiles[0][match.col] = generator.next();
    }
    return { ...board, tiles: newTiles };
}