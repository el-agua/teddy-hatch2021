package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/elleven11/patient_api/api/auth"
	"github.com/elleven11/patient_api/api/models"
	"github.com/elleven11/patient_api/api/responses"
	"github.com/elleven11/patient_api/api/utils"
	"golang.org/x/crypto/bcrypt"
)

func (srv *Server) Login(w http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	user := models.User{}

	err = json.Unmarshal(body, &user)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	user.Prepare()
	err = user.Validate("login")
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	token, err := srv.SignIn(user.Email, user.Password)
	if err != nil {
		fmtError := utils.FormatError(err.Error())
		fmt.Println(err)
		responses.ERROR(w, http.StatusUnprocessableEntity, fmtError)
		return
	}

	responses.JSON(w, http.StatusOK, token)

}

func (srv *Server) SignIn(email, password string) (string, error) {
	var err error

	user := models.User{}

	err = srv.DB.Debug().Model(models.User{}).Where("email = ?", email).Take(&user).Error
	if err != nil {
		return "", err
	}

	err = models.VerifyPassword(user.Password, password)
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", err
	}

	return auth.TokenCreate(user.ID)
}
