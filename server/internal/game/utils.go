package game

import (
	"crypto/rand"
	"math/big"
)

func (b *Board) ToIndex(x, y int) int {
	return y*b.Size + x
}

func GenerateGameID(games map[string]*Game) string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
	charLen := big.NewInt(int64(len(characters)))

	for {
		id := make([]byte, 5)

		for i := 0; i < 5; i++ {
			idx, _ := rand.Int(rand.Reader, charLen)
			id[i] = characters[idx.Int64()]
		}

		generatedID := string(id)

		if _, exists := games[generatedID]; !exists {
			return generatedID
		}
	}
}

func (b *Board) GetAdjacent(x, y int) []int {
    adjacent := make([]int, 0, 4)
    
    // Check all four directions
    directions := [][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
    for _, dir := range directions {
        newX, newY := x+dir[0], y+dir[1]
        if newX >= 0 && newX < b.Size && newY >= 0 && newY < b.Size {
            adjacent = append(adjacent, b.ToIndex(newX, newY))
        }
    }
    return adjacent
}

func (b *Board) ToCoord(idx int) (int, int) {
    return idx % b.Size, idx / b.Size
}

func (b *Board) Clone() *Board {
    newGrid := make([]Stone, len(b.Grid))
    copy(newGrid, b.Grid)
    return &Board{
        Size: b.Size,
        Grid: newGrid,
    }
}
