export {}

declare global {
  type Level = 'easy' | 'medium' | 'hard'
  type GameMode = 'local' | 'online' | 'ai'
  type Stone = 0 | 1 | 2 // None = 0, Black = 1, White = 2

  interface Game {
    id: string
    turn: Stone
    isOver: bool
    board: Board
    score: Score
    mode: GameMode
  }

  interface Move {
    x: number
    y: number
  }

  interface Board {
    size: number
    grid: Stone[]
  }

  interface Score {
    black: number
    white: number
  }

  interface CreateGameRequest {
    size: number
    mode: GameMode
    aiLevel?: Level
  }

  interface EndGameInfo {
    winner: Stone
    margin: number
    blackScore: number
    whiteScore: number
  }
}
