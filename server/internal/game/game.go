package game

import (
	"sync"
)

type Stone uint8

const (
	None Stone = iota
	Black
	White
)

type GameMode string

const (
	AI          GameMode = "ai"
	Local       GameMode = "local"
	Multiplayer GameMode = "multiplayer"
)

type Game struct {
	mu    sync.RWMutex
	ID    string   `json:"id"`
	Turn  Stone    `json:"turn"`
	Mode  GameMode `json:"mode"`
	Score Score    `json:"score"`
	Board *Board   `json:"board"`
}

type Board struct {
	Size uint8   `json:"size"`
	Grid []Stone `json:"grid"`
}

type Score struct {
	Black uint8 `json:"black"`
	White uint8 `json:"white"`
}
