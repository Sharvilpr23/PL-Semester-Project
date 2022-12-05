package main

import (
	"fmt"
    "log"
	"net/http"
    "github.com/gorilla/websocket"
)

/*******************************
 * @author Justin Lewis
*******************************/
func (s *Server) homePage(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Home page")
}

/*******************************
 * @author Justin Lewis
*******************************/
func (s *Server) lobbyEndpoint(w http.ResponseWriter, r *http.Request){ // Expect: http://localhost:8080/lobby?game=tictac or something
    param1 := r.URL.Query().Get("game")
    if param1 == "test" {
        fmt.Fprintf(w, "Hello!")
    }
}

/*******************************
 * @author Justin Lewis
*******************************/
var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
}

/*******************************
 * @author Justin Lewis
*******************************/
func (s *Server) serverEndpoint(w http.ResponseWriter, r *http.Request){
    upgrader.CheckOrigin = func(r *http.Request) bool { return true } // decide whether to accept the connection

    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
    }
	
	s.addSession(ws)
}
