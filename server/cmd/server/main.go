package main

import (
	"github.com/gin-gonic/gin"
	"go-server/internal/handlers"
)

func main() {
    router := gin.Default()

    router.GET("/board", handlers.GetBoard)
    router.POST("/move", handlers.PostMove)

    router.Run(":8080")
}