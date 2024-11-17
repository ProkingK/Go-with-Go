package game

import (
	"crypto/rand"
	"errors"
	"math/big"
	"sync"
)

type GameManager struct {
	mu    sync.RWMutex
	games map[string]*Game
}

func NewGameManager() *GameManager {
	return &GameManager{
		games: make(map[string]*Game),
	}
}

func (gm *GameManager) NewGame(size int, mode GameMode) (*Game, error) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	id := gm.GenerateGameID()

	game := &Game{
		ID:    id,
		Mode:  mode,
		Turn:  Black,
		Board: NewBoard(size),
	}

	gm.games[id] = game

	return game, nil
}

func (gm *GameManager) GetGame(id string) (*Game, bool) {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	game, exists := gm.games[id]

	return game, exists
}

func (gm *GameManager) MakeMove(id string, move Move) (*Game, error) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	updatedGame, exists := gm.games[id]

	if !exists {
		return nil, errors.New("game not found")
	}

	if updatedGame.IsOver {
		return nil, errors.New("game is already over")
	}

	updatedGame.PassCount = 0

	board := updatedGame.Board
	updatedGame, err := board.PlaceStone(updatedGame, move)

	if updatedGame == nil {
		return gm.games[id], err
	}

	if err != nil {
		if !board.hasValidMovesRemaining(updatedGame) {
			updatedGame.IsOver = true
			updatedGame.calculateFinalScore()
		}

		return updatedGame, err
	}

	return updatedGame, nil
}

func (gm *GameManager) Pass(id string) (*Game, error) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	game, exists := gm.games[id]

	if !exists {
		return nil, errors.New("game not found")
	}

	game = game.Pass()

	return game, nil
}

func (gm *GameManager) Resign(id string) (*Game, error) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	game, exists := gm.games[id]

	if !exists {
		return nil, errors.New("game not found")
	}

	game = game.Resign()

	return game, nil
}

func (gm *GameManager) GenerateGameID() string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
	charLen := big.NewInt(int64(len(characters)))

	for {
		id := make([]byte, 5)

		for i := 0; i < 5; i++ {
			idx, _ := rand.Int(rand.Reader, charLen)
			id[i] = characters[idx.Int64()]
		}

		generatedID := string(id)

		if _, exists := gm.games[generatedID]; !exists {
			return generatedID
		}
	}
}
