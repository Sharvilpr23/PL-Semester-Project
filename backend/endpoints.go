package main

import (
	"fmt"
    "log"
	"net/http"
    "github.com/gorilla/websocket"
)

func (s *Server) homePage(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Home page")
}

func (s *Server) lobbyEndpoint(w http.ResponseWriter, r *http.Request){ // Expect: http://localhost:8080/lobby?game=tictac or something
    param1 := r.URL.Query().Get("game")
    if param1 == "test" {
        fmt.Fprintf(w, "Hello!")
    }
}

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
}

func (s *Server) serverEndpoint(w http.ResponseWriter, r *http.Request){
    upgrader.CheckOrigin = func(r *http.Request) bool { return true } // decide whether to accept the connection

    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
    }
	
	s.addSession(ws)
}

// func (s *Server) wsEndpoint(w http.ResponseWriter, r *http.Request){
//     upgrader.CheckOrigin = func(r *http.Request) bool { return true } // decide whether to accept the connection

//     _, err := upgrader.Upgrade(w, r, nil)
//     if err != nil {
//         log.Println(err)
//     }
// }