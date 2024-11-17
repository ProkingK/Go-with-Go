package handlers

import (
	"github.com/gin-gonic/gin"
	"go-server/internal/game"
	"net/http"
)

type Handler struct {
	gameManager *game.GameManager
}

func NewHandler(gm *game.GameManager) *Handler {
	return &Handler{
		gameManager: gm,
	}
}

type CreateGameRequest struct {
	Size  int           `json:"size" binding:"required,min=9,max=19"`
	Mode  game.GameMode `json:"mode" binding:"required,oneof=local multiplayer ai"`
	Level string        `json:"level,omitempty" binding:"omitempty,oneof=easy medium hard"`
}

func (h *Handler) CreateGame(c *gin.Context) {
	var req CreateGameRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	game, err := h.gameManager.NewGame(req.Size, req.Mode)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, game)
}

func (h *Handler) GetGame(c *gin.Context) {
	id := c.Param("id")
	game, exists := h.gameManager.GetGame(id)

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "game not found"})
		return
	}

	c.JSON(http.StatusOK, game)
}

func (h *Handler) MakeMove(c *gin.Context) {
	id := c.Param("id")
	var move game.Move

	if err := c.ShouldBindJSON(&move); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedGame, err := h.gameManager.MakeMove(id, move)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedGame)
}

func (h *Handler) Pass(c *gin.Context) {
	id := c.Param("id")
	updatedGame, err := h.gameManager.Pass(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedGame)
}

func (h *Handler) Resign(c *gin.Context) {
	id := c.Param("id")
	updatedGame, err := h.gameManager.Resign(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedGame)
}
