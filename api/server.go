package api

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/elleven11/patient_api/api/controllers"
	"github.com/elleven11/patient_api/api/seed"
	"github.com/joho/godotenv"
)

var srv = controllers.Server{}

func Start() {
	var err error
	fmt.Println("Starting api...")

	err = godotenv.Load()
	if err != nil {
		log.Fatalf("Couldn't get env... Error: %v", err)
	} else {
		fmt.Println("Got env...")
	}

	srv.Init(os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PORT"), os.Getenv("DB_HOST"), os.Getenv("DB_NAME"))

	if strings.ToLower(os.Getenv("SEED")) == "true" {
		seed.Load(srv.DB)
	}

	srv.Run(":8080")
}
