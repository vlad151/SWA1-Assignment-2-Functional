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
 return
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
return 
}


function checkForMatch<T>(board: Board<T>, position: Position): Match<T> | undefined {
  return
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

