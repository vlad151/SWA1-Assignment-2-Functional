export type Generator<T>= { next:() => T } 

export type Position = {
    row: number,
    col: number
}    

export type Match<T> = {
    matched: T,
    positions: Position[]
}    

export type Board<T> = {
    width: number;
    height: number;
    tiles: T[][];
};

export type Effect<T> = 
    | { kind: 'Match', match: Match<T> }
    | { kind: 'Refill', board?: Board<T> }; // board is optional because we might not always need to provide the updated board.

export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}    

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
    if (p.row >= 0 && p.row < board.height && p.col >= 0 && p.col < board.width) {
        return board.tiles[p.row][p.col];
    }
    return undefined;
}

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
    // TODO: Implement the logic to check if a move is valid.
    // This will involve checking if the two positions are adjacent and if the move results in a match.
    return false; // Placeholder return.
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
    // TODO: Implement the logic to perform a move.
    // This will involve swapping the tiles, checking for matches, and refilling the board if necessary.
    return { board, effects: [] }; // Placeholder return.
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

