package main

import (
	"fmt"
    "log"
	"net/http"
)

func homePage(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Home page")
}

func lobbyEndpoint(w http.ResponseWriter, r *http.Request){ // Expect: http://localhost:8080/lobby?game=tictac or something
    param1 := r.URL.Query().Get("game")
    if param1 == "test" {
        fmt.Fprintf(w, "Hello!")
    }
}

// func setup(w *http.ResponseWriter) {
// 	(*w).Header().Set("Access-Control-Allow-Origin", "*")
// 	(*w).Header().Set("Content-Type", "application/json")
// }

// func usersEndpoint(w http.ResponseWriter, r *http.Request){
// 	// fmt.Fprintf(w, getServerUsers(server))
// 	setup(&w)
// 	fmt.Fprintf(w, "{\"test\": \"ans\"}")
// }

func serverEndpoint(w http.ResponseWriter, r *http.Request){
    upgrader.CheckOrigin = func(r *http.Request) bool { return true } // decide whether to accept the connection

    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
    }
	
	addSession(server, ws)
}

func wsEndpoint(w http.ResponseWriter, r *http.Request){
    upgrader.CheckOrigin = func(r *http.Request) bool { return true } // decide whether to accept the connection

    _, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
    }
	
	// addSession(server, ws)
}