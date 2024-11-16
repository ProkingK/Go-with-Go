package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go-server/internal/config"
	"go-server/internal/routes"
	"log"
)

func main() {
	cfg := config.NewConfig()

	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = cfg.AllowedOrigins

	router.Use(cors.New(corsConfig))

	routes.RegisterRoutes(router)

	log.Printf("Starting server on port %s", cfg.Port)
	if err := router.Run(cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
