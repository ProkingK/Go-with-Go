package game

import (
	"errors"
)

type Move struct {
	X int `json:"x" binding:"required"`
	Y int `json:"y" binding:"required"`
}

func NewBoard(size int) *Board {
	return &Board{
		Size: size,
		Grid: make([]Stone, uint16(size)*uint16(size)),
	}
}

func (g *Game) PlaceStone(move Move) (*Game, error) {
	g.mu.Lock()
	defer g.mu.Unlock()

	idx := g.Board.ToIndex(move.X, move.Y)

	if g.Board.Grid[idx] != None {
		return nil, errors.New("position already occupied")
	}

	g.Board.Grid[idx] = g.Turn

	// TODO: Implement game logic here

	g.Turn = 3 - g.Turn // Toggle turn

	return g, nil
}
