package main

import (
	"github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
	"go-server/internal/handlers"
)

func main() {
    router := gin.Default()

    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"}

    router.Use(cors.New(config))

    router.GET("/board", handlers.GetBoard)
    router.POST("/move", handlers.PostMove)

    router.Run(":8080")
}