package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/elleven11/patient_api/api/auth"
	"github.com/elleven11/patient_api/api/models"
	"github.com/elleven11/patient_api/api/responses"
	"github.com/elleven11/patient_api/api/utils"
	"github.com/gorilla/mux"
)

func ReqPrediction(patient *models.Patient) (float64, error) {

	reqBody, err := json.Marshal(patient)
	if err != nil {
		return -1, err
	}

	res, err := http.Post("http://localhost:5000/api", "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return -1, err
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return -1, err
	}

	bodyParse := make(map[string]interface{})
	err = json.Unmarshal(body, &bodyParse)
	if err != nil {
		return -1, err
	}

	prediction := fmt.Sprintf("%v", bodyParse["prediction"])

	return strconv.ParseFloat(prediction, 64)
}

func (srv *Server) CreatePatient(w http.ResponseWriter, req *http.Request) {

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	patient := models.Patient{}

	err = json.Unmarshal(body, &patient)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	patient.Prepare()

	err = patient.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	uid, err := auth.TokenExtractTokenID(req)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}
	if uid != patient.UserID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New(http.StatusText(http.StatusUnauthorized)))
		return
	}

	patient.Prediction, err = ReqPrediction(&patient)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, errors.New("Error making prediction"))
		return
	}

	patientCreated, err := patient.CreatePatient(srv.DB)
	if err != nil {
		fmtError := utils.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmtError)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", req.Host, req.URL.Path, patientCreated.ID))
	responses.JSON(w, http.StatusCreated, patientCreated)
}

func (srv *Server) GetPatients(w http.ResponseWriter, req *http.Request) {
	uid, err := auth.TokenExtractTokenID(req)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	user := models.User{}

	userRcv, err := user.FindUserByID(srv.DB, uid)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	patient := models.Patient{}
	var patients *[]models.Patient

	if !userRcv.Admin {
		// gets patients of the user
		patients, err = patient.FindAllPatientsOfUid(srv.DB, uid)
		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}
	} else {
		// gets all patients for all users
		patients, err = patient.FindAllPatients(srv.DB)
		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}
	}

	responses.JSON(w, http.StatusOK, patients)
}

func (srv *Server) GetPatient(w http.ResponseWriter, req *http.Request) {

	vars := mux.Vars(req)

	pat_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	uid, err := auth.TokenExtractTokenID(req)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	user := models.User{}

	userRcv, err := user.FindUserByID(srv.DB, uid)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	patient := models.Patient{}

	patientRecv, err := patient.FindPatientByID(srv.DB, pat_id)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	if uid != patientRecv.UserID {
		if !userRcv.Admin {
			responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
			return
		}
	}

	responses.JSON(w, http.StatusOK, patientRecv)
}

func (srv *Server) UpdatePatient(w http.ResponseWriter, req *http.Request) {

	vars := mux.Vars(req)

	pat_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	uid, err := auth.TokenExtractTokenID(req)
	if err != nil {
		fmt.Printf("id extraction error: %v\n", err)
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	user := models.User{}

	userRcv, err := user.FindUserByID(srv.DB, uid)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	patient := models.Patient{}
	err = srv.DB.Debug().Model(models.Patient{}).Where("id = ?", pat_id).Take(&patient).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Patient not found"))
	}

	// to defeat spooky men trying to update patients that are not theirs
	if !userRcv.Admin || (uid != patient.UserID && !userRcv.Admin) {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	patientUpdate := models.Patient{}
	err = json.Unmarshal(body, &patientUpdate)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	// just double checking also the updated patient
	if uid != patientUpdate.UserID {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	patientUpdate.Prepare()

	err = patientUpdate.Validate()
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	patientUpdate.ID = patient.ID

	patientUpdate.Prediction, err = ReqPrediction(&patientUpdate)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, errors.New("Error making prediction"))
		return
	}

	patientUpdated, err := patientUpdate.UpdateAPatient(srv.DB)
	if err != nil {
		fmtError := utils.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmtError)
		return
	}

	responses.JSON(w, http.StatusOK, patientUpdated)
}

func (srv *Server) DeletePatient(w http.ResponseWriter, req *http.Request) {

	vars := mux.Vars(req)

	pat_id, err := strconv.ParseUint(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	uid, err := auth.TokenExtractTokenID(req)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	user := models.User{}

	userRcv, err := user.FindUserByID(srv.DB, uid)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	patient := models.Patient{}

	err = srv.DB.Debug().Model(models.Patient{}).Where("id = ?", pat_id).Take(&patient).Error
	if err != nil {
		responses.ERROR(w, http.StatusNotFound, errors.New("Patient not found"))
		return
	}

	if uid != patient.UserID {
		if !userRcv.Admin {
			responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
			return
		}
	}

	_, err = patient.DeletePatient(srv.DB, pat_id)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", pat_id))
	responses.JSON(w, http.StatusNoContent, "")
}
