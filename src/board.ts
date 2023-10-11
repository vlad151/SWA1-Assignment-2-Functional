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
    Board: Board<T>,
    width: number,
    height: number,
    generator: Generator<T>,
    positions: Position[],
};

export type Effect<T> = {
    kind: 'Match',
    match: Match<T>
} | {
    kind: 'Refill',
} 
;
export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}    

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
    return
}    

export function piece<T>(board: Board<T>, p: Position): T | undefined {
    return 
}    

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
    return
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
    return
}
export function positions(board: Board<String>): Position[] {
    return
}

