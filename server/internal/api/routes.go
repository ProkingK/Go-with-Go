package api

import (
	"github.com/gin-gonic/gin"
	"go-server/internal/game"
)

func RegisterRoutes(router *gin.Engine) {
	gameManager := game.NewGameManager()

	h := NewHandler(gameManager)

	router.POST("/game", h.CreateGame)
	router.GET("/game/:id", h.GetGame)
	router.POST("/game/:id/move", h.MakeMove)
}
