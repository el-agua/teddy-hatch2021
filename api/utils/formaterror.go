package utils

import (
	"errors"
	"strings"
)

func FormatError(err string) error {
	if strings.Contains(err, "username") {
		return errors.New("Username already in use")
	}

	if strings.Contains(err, "email") {
		return errors.New("email already in use")
	}

	if strings.Contains(err, "hashedPassword") {
		return errors.New("Wrong password")
	}

	// general error
	return errors.New("Incorrect input")

}
