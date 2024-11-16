package routes

import (
	"github.com/gin-gonic/gin"
	"go-server/internal/game"
	"go-server/internal/handlers"
)

func RegisterRoutes(router *gin.Engine) {
	gameManager := game.NewGameManager()

	h := handlers.NewHandler(gameManager)

	router.POST("/game", h.CreateGame)
	router.GET("/game/:id", h.GetGame)
	router.POST("/game/:id/move", h.MakeMove)
}
