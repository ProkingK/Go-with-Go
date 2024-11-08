package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    router.GET("/", greet)

    router.Run(":8080")
}

func greet(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Hello from Go server"})
}
