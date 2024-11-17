package game

type Territory struct {
	Color       Stone
	IsTerritory bool
}

type Score struct {
	Black int `json:"black"`
	White int `json:"white"`
}

type GameMode string

const (
	AI     GameMode = "ai"
	Local  GameMode = "local"
	Online GameMode = "online"
)

type Game struct {
	PassCount int
	prevBoard *Board
	ID        string   `json:"id"`
	Turn      Stone    `json:"turn"`
	Mode      GameMode `json:"mode"`
	Score     Score    `json:"score"`
	Board     *Board   `json:"board"`
	IsOver    bool     `json:"isOver"`
}

func (game *Game) Pass() *Game {
	game.PassCount++

	if game.PassCount >= 2 {
		game.IsOver = true
		game.calculateFinalScore()
	}

	game.Turn = 3 - game.Turn

	return game
}

func (game *Game) Resign() *Game {
	game.IsOver = true

	if game.Turn == Black {
		game.Score.White = 10
		game.Score.Black = 0

	} else {
		game.Score.White = 0
		game.Score.Black = 10
	}

	return game
}

func (game *Game) calculateFinalScore() {
	territories := game.Board.calculateTerritories()

	blackTerritory := 0
	whiteTerritory := 0

	for _, t := range territories {
		if t.IsTerritory {
			if t.Color == Black {
				blackTerritory++
			} else if t.Color == White {
				whiteTerritory++
			}
		}
	}

	game.Score.Black += blackTerritory
	game.Score.White += whiteTerritory + 6 // Add komi (6 points for White)
}

func (game *Game) Clone() *Game {
	return &Game{
		ID:        game.ID,
		Turn:      game.Turn,
		Mode:      game.Mode,
		Score:     game.Score,
		IsOver:    game.IsOver,
		PassCount: game.PassCount,
		prevBoard: game.prevBoard,
		Board:     game.Board.Clone(),
	}
}
