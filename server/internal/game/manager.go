package game

import (
	"errors"
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

	id := GenerateGameID(gm.games)

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

	game, exists := gm.games[id]

	if !exists {
		return nil, errors.New("game not found")
	}

	return game.PlaceStone(move)
}
