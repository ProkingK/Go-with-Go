package main

import (
	"go-server/internal/api"
	"go-server/internal/config"
	"log"
)

func main() {
	cfg := config.NewConfig()

	router := api.SetupRouter(cfg)

	log.Printf("Starting server on port %s", cfg.Port)
	if err := router.Run(cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
