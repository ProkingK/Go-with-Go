package handlers

import (
    "net/http"
	"go-server/internal/game"
    "github.com/gin-gonic/gin"
)

type MoveRequest struct {
    X int `json:"x"`
    Y int `json:"y"`
}

var board = game.NewBoard(19)

func GetBoard(c *gin.Context) {
    c.JSON(http.StatusOK, board)
}

func PostMove(c *gin.Context) {
    var move MoveRequest
    err := c.ShouldBindJSON(&move)

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

	result, message := board.PlaceStone(move.X, move.Y) 

	if result {
		c.JSON(http.StatusOK, gin.H{"message": message})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": message})
	}
}