package controllers

import "github.com/elleven11/patient_api/api/middlewares"

func (srv *Server) initRoutes() {

	// Home page
	srv.Router.HandleFunc("/", middlewares.SetJSON(srv.Home)).Methods("GET")

	//
	// * Users
	//

	// Create an user (sign-up)
	srv.Router.HandleFunc("/users", middlewares.SetJSON(srv.CreateUser)).Methods("POST")

	// GET all users
	// NOTE: only admins can GET /users
	srv.Router.HandleFunc("/users", middlewares.SetJSON(middlewares.SetAuth(srv.GetUsers))).Methods("GET")

	// GET an user (needs to be admin or user itself)
	srv.Router.HandleFunc("/users/{id}", middlewares.SetJSON(middlewares.SetAuth(srv.GetUser))).Methods("GET")

	// Update an user with a PUT request (needs to be the user itself or admin)
	srv.Router.HandleFunc("/users/{id}", middlewares.SetJSON(middlewares.SetAuth(srv.UpdateUser))).Methods("PUT")

	// Delete an user with a DELETE request (needs to be the user itself or admin)
	srv.Router.HandleFunc("/users/{id}", middlewares.SetAuth(srv.DeleteUser)).Methods("DELETE")

	// Return JWT with user data using a POST request
	srv.Router.HandleFunc("/login", middlewares.SetJSON(srv.Login)).Methods("POST")

	//
	// * Patients
	//

	// Create patients
	srv.Router.HandleFunc("/patients", middlewares.SetJSON(middlewares.SetAuth(srv.CreatePatient))).Methods("POST")

	// GET all patients that the user owns
	// NOTE: if admins GET /patients they can return all patients of all users
	srv.Router.HandleFunc("/patients", middlewares.SetJSON(middlewares.SetAuth(srv.GetPatients))).Methods("GET")

	// GET one patient by id (needs to be owner or admin)
	srv.Router.HandleFunc("/patients/{id}", middlewares.SetJSON(middlewares.SetAuth(srv.GetPatient))).Methods("GET")

	// Update a patient with a PUT request (needs to be owner or admin)
	srv.Router.HandleFunc("/patients/{id}", middlewares.SetJSON(middlewares.SetAuth(srv.UpdatePatient))).Methods("PUT")

	// Delete a patient with a DELETE request (needs to be owner or admin)
	srv.Router.HandleFunc("/patients/{id}", middlewares.SetAuth(srv.DeletePatient)).Methods("DELETE")

}
