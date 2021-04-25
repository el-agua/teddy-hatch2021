package auth

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

func TokenCreate(user_id uint32) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = user_id
	// making token expire after a day
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("API_SECRET")))
}

func TokenValidate(req *http.Request) error {
	tokenString := TokenExtract(req)
	fmt.Printf("got token: %s\n", tokenString)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// checking signing algo
		// https://stackoverflow.com/questions/56663542/verify-jwt-token-signature
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Invalid signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("API_SECRET")), nil
	})
	if err != nil {
		return err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		Display(claims)
	}
	return nil
}

func TokenExtractTokenID(req *http.Request) (uint32, error) {
	tokenString := TokenExtract(req)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// checking signing algo
		// https://stackoverflow.com/questions/56663542/verify-jwt-token-signature
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Invalid signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("API_SECRET")), nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		uid, err := strconv.ParseUint(fmt.Sprintf("%.0f", claims["user_id"]), 10, 32)
		if err != nil {
			return 0, err
		}
		return uint32(uid), nil
	}

	return 0, nil
}

func TokenExtract(req *http.Request) string {
	token := req.URL.Query().Get("token")
	if token != "" {
		return token
	}

	// can extract token from header if not in URL
	bToken := req.Header.Get("Authorization")
	if bToken != "" {
		return bToken
	}

	// return this if nothing else has token
	return ""
}

// helper to display claims
func Display(data interface{}) {
	buff, err := json.MarshalIndent(data, "", " - ")
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println(string(buff))
}
