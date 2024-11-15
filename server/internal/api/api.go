package api

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go-server/internal/config"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = cfg.AllowedOrigins

	router.Use(cors.New(corsConfig))

	RegisterRoutes(router)

	return router
}
