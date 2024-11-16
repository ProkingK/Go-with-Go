package game

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
	prevBoard *Board
	ID        string   `json:"id"`
	Turn      Stone    `json:"turn"`
	Mode      GameMode `json:"mode"`
	Score     Score    `json:"score"`
	Board     *Board   `json:"board"`
}