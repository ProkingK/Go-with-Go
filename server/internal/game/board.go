package game

import (
	"errors"
	"sync"
	"fmt"
)

type Stone int

const (
	None Stone = iota
	Black
	White
)

type Move struct {
	X int `json:"x" binding:"required"`
	Y int `json:"y" binding:"required"`
}

type Board struct {
	mu   sync.RWMutex
	Size int     `json:"size"`
	Grid []Stone `json:"grid"`
}

func NewBoard(size int) *Board {
	return &Board{
		Size: size,
		Grid: make([]Stone, uint16(size)*uint16(size)),
	}
}

func (board *Board) PlaceStone(game *Game, move Move) (*Game, error) {
	board.mu.Lock()
	defer board.mu.Unlock()

	idx := board.ToIndex(move.X, move.Y)

	if board.Grid[idx] != None {
		return nil, errors.New("position already occupied")
	}

	board.Grid[idx] = game.Turn

	adjacents := board.GetAdjacent(move.X, move.Y)

	// Check for suicide move
	if !board.hasLiberties(move.X, move.Y) {
		captured := false

		for _, adj := range adjacents {
			if board.Grid[adj] == (3-game.Turn) && !board.hasLiberties(board.ToCoord(adj)) {
				captured = true
				x, y := board.ToCoord(adj)
				board.captureGroup(game, x, y)
			}
		}

		if !captured {
			board.Grid[idx] = None
			return nil, errors.New("suicide move not allowed")
		}
	}

	// Capture any surrounded opponent groups
	for _, adj := range adjacents {
		if board.Grid[adj] == (3-game.Turn) && !board.hasLiberties(board.ToCoord(adj)) {
			x, y := board.ToCoord(adj)
			board.captureGroup(game, x, y)
		}
	}

	// Check ko rule
	if board.isKoViolation(game) {
		board.Grid[idx] = None
		return nil, errors.New("ko rule violation")
	}

	// Save previous board state for ko rule checking
	game.prevBoard = board.Clone()

	game.Turn = 3 - game.Turn

	return game, nil
}

func (board *Board) hasLiberties(x, y int) bool {
	seen := make(map[int]bool)
	return board.checkLiberties(x, y, seen)
}

func (board *Board) checkLiberties(x, y int, seen map[int]bool) bool {
	idx := board.ToIndex(x, y)

	if seen[idx] {
		return false
	}

	seen[idx] = true

	adjacents := board.GetAdjacent(x, y)

	for _, adj := range adjacents {
		if board.Grid[adj] == None {
			return true
		}

		x, y := board.ToCoord(adj)

		if board.Grid[adj] == board.Grid[idx] {
			if board.checkLiberties(x, y, seen) {
				return true
			}
		}
	}

	return false
}

func (board *Board) captureGroup(game *Game, x, y int) {
	color := board.Grid[board.ToIndex(x, y)]

	captured := make(map[int]bool)
	board.captureStones(x, y, color, captured)

	captureCount := len(captured)

	if game.Turn == Black {
		game.Score.Black += captureCount
	} else {
		game.Score.White += captureCount
	}
}

func (board *Board) captureStones(x, y int, color Stone, captured map[int]bool) {
	idx := board.ToIndex(x, y)

	if captured[idx] || board.Grid[idx] != color {
		return
	}

	captured[idx] = true
	board.Grid[idx] = None

	adjacents := board.GetAdjacent(x, y)

	for _, adj := range adjacents {
		x, y := board.ToCoord(adj)
		board.captureStones(x, y, color, captured)
	}
}

func (board *Board) isKoViolation(game *Game) bool {
	if game.prevBoard == nil {
		return false
	}

	// Compare current board state with previous to detect ko
	for i := range board.Grid {
		if board.Grid[i] != game.prevBoard.Grid[i] {
			return false
		}
	}

	return true
}

func (board *Board) calculateTerritories() []Territory {
    territories := make([]Territory, len(board.Grid))
    
    // First pass: mark all stones
    for i, stone := range board.Grid {
        if stone != None {
            territories[i] = Territory{Color: stone, IsTerritory: false}
        }
    }
    
    // Second pass: flood fill empty areas to determine territory
    for i, stone := range board.Grid {
        if stone == None && territories[i].Color == None {
            x, y := board.ToCoord(i)
            surrounded := make(map[int]bool)
            owner := board.floodFillTerritory(x, y, surrounded)
            
            // Mark all points in the surrounded area
            for idx := range surrounded {
                territories[idx] = Territory{
                    Color: owner,
                    IsTerritory: owner != None,
                }
            }
        }
    }
    
    return territories
}

// floodFillTerritory determines if an empty area is surrounded by one color
func (board *Board) floodFillTerritory(x, y int, seen map[int]bool) Stone {
    idx := board.ToIndex(x, y)

    if seen[idx] {
        return None
    }

    seen[idx] = true
    surroundingBlack := false
    surroundingWhite := false
    
    adjacents := board.GetAdjacent(x, y)

    for _, adj := range adjacents {
        adjX, adjY := board.ToCoord(adj)
        
        if board.Grid[adj] == None {
            owner := board.floodFillTerritory(adjX, adjY, seen)

            if owner == Black {
                surroundingBlack = true
            } else if owner == White {
                surroundingWhite = true
            }
        } else {
            if board.Grid[adj] == Black {
                surroundingBlack = true
            } else {
                surroundingWhite = true
            }
        }
    }
    
    // Area is territory if it's surrounded by only one color
    if surroundingBlack && !surroundingWhite {
        return Black
    } else if !surroundingBlack && surroundingWhite {
        return White
    }
	
    return None
}

func (board *Board) hasValidMovesRemaining(game *Game) bool {
    for y := 0; y < board.Size; y++ {
        for x := 0; x < board.Size; x++ {
            if board.Grid[board.ToIndex(x, y)] == None {
                move := Move{X: x, Y: y}

                testBoard := board.Clone()
                _, err := testBoard.PlaceStone(game.Clone(), move)

                if err == nil {
                    return true
                }
            }
        }
    }

    return false
}

func (b *Board) ToIndex(x, y int) int {
	return y*b.Size + x
}

func (b *Board) ToCoord(idx int) (int, int) {
	return idx % b.Size, idx / b.Size
}

func (b *Board) Clone() *Board {
	newGrid := make([]Stone, len(b.Grid))

	fmt.Println("Nden");

	copy(newGrid, b.Grid)

	return &Board{
		Size: b.Size,
		Grid: newGrid,
	}
}

func (b *Board) GetAdjacent(x, y int) []int {
	adjacent := make([]int, 0, 4)
	directions := [][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

	for _, dir := range directions {
		newX, newY := x+dir[0], y+dir[1]

		if newX >= 0 && newX < b.Size && newY >= 0 && newY < b.Size {
			adjacent = append(adjacent, b.ToIndex(newX, newY))
		}
	}

	return adjacent
}
