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
