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

	adjacents := g.Board.GetAdjacent(move.X, move.Y)

	// Check for suicide move
	if !g.hasLiberties(move.X, move.Y) {
		captured := false

		for _, adj := range adjacents {
			if g.Board.Grid[adj] == (3-g.Turn) && !g.hasLiberties(g.Board.ToCoord(adj)) {
				captured = true
				g.captureGroup(g.Board.ToCoord(adj))
			}
		}

		if !captured {
			g.Board.Grid[idx] = None
			return nil, errors.New("suicide move not allowed")
		}
	}

	// Capture any surrounded opponent groups
	for _, adj := range adjacents {
		if g.Board.Grid[adj] == (3-g.Turn) && !g.hasLiberties(g.Board.ToCoord(adj)) {
			g.captureGroup(g.Board.ToCoord(adj))
		}
	}

	// Check ko rule
	if g.isKoViolation() {
		g.Board.Grid[idx] = None
		return nil, errors.New("ko rule violation")
	}

	// Save previous board state for ko rule checking
	g.prevBoard = g.Board.Clone()

	g.Turn = 3 - g.Turn

	return g, nil
}

func (g *Game) hasLiberties(x, y int) bool {
	seen := make(map[int]bool)
	return g.checkLiberties(x, y, seen)
}

func (g *Game) checkLiberties(x, y int, seen map[int]bool) bool {
	idx := g.Board.ToIndex(x, y)

	if seen[idx] {
		return false
	}

	seen[idx] = true

	adjacents := g.Board.GetAdjacent(x, y)

	for _, adj := range adjacents {
		if g.Board.Grid[adj] == None {
			return true
		}

		x, y := g.Board.ToCoord(adj)

		if g.Board.Grid[adj] == g.Board.Grid[idx] {
			if g.checkLiberties(x, y, seen) {
				return true
			}
		}
	}

	return false
}

func (g *Game) captureGroup(x, y int) {
	color := g.Board.Grid[g.Board.ToIndex(x, y)]

	captured := make(map[int]bool)
	g.captureStones(x, y, color, captured)

	captureCount := len(captured)

	if g.Turn == Black {
		g.Score.Black += captureCount
	} else {
		g.Score.White += captureCount
	}
}

func (g *Game) captureStones(x, y int, color Stone, captured map[int]bool) {
	idx := g.Board.ToIndex(x, y)

	if captured[idx] || g.Board.Grid[idx] != color {
		return
	}

	captured[idx] = true
	g.Board.Grid[idx] = None

	adjacents := g.Board.GetAdjacent(x, y)

	for _, adj := range adjacents {
		x, y := g.Board.ToCoord(adj)
		g.captureStones(x, y, color, captured)
	}
}

func (g *Game) isKoViolation() bool {
	if g.prevBoard == nil {
		return false
	}

	// Compare current board state with previous to detect ko
	for i := range g.Board.Grid {
		if g.Board.Grid[i] != g.prevBoard.Grid[i] {
			return false
		}
	}

	return true
}
