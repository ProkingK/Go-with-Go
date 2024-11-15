package config

type Config struct {
	Port           string
	Environment    string
	AllowedOrigins []string
}

func NewConfig() *Config {
	return &Config{
		Port:           ":8080",
		Environment:    "development",
		AllowedOrigins: []string{"http://localhost:3000"},
	}
}
