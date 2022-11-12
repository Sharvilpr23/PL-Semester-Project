package main

import (
	"fmt"
    "log"
	"net/http"
	"strings"
    "github.com/gorilla/websocket"
)


func setupRoutes() {
    http.HandleFunc("/", homePage)
    http.HandleFunc("/lobby", lobbyEndpoint)
	// http.HandleFunc("/users", usersEndpoint)
    http.HandleFunc("/ws", wsEndpoint)
    http.HandleFunc("/server", serverEndpoint)
}

type Server struct {
    port int
	sessions []*Session
}

func addSession(s *Server, conn *websocket.Conn) {
    log.Println("Client Successfully Connected...")
	newSession := startSession(conn)
	s.sessions = append(s.sessions, newSession)
	reader(newSession)
	s.updateNames()
}

func removeSession(s *Server, session *Session){
	for i, element := range s.sessions {
		if element.id == session.id {
			s.sessions[i] = s.sessions[len(s.sessions) - 1]
			s.sessions = s.sessions[:len(s.sessions) - 1]
			return
		}
	}
}

func (s *Server) updateNames() {
	var names []string
	for _, userSession := range s.sessions {
		names = append(names, userSession.user.name)
	}
	for _, element := range s.sessions {
		element.SendMessage(strings.Join(names, "\n"))
	}
}

func getServerUsers(s *Server) string{
	stringBuilder := ""
	for _, element := range s.sessions {
		stringBuilder = stringBuilder + "SID: " + element.id + "\t Name: " + element.user.name + "\n"
	// 	stringBuilder = stringBuilder + ", " + element.user.name
	}
	// stringBuilder = append(stringBuilder, "]")
	return stringBuilder
}

func StartServer(port int) {
	server = &(Server{port: port})  // absolutely disgusting. Should not be global variable
									// Honestly this setup probably shouldn't be in an object oriented setup? I'm unsure
									// I do know that the http endpoint callback not being able to have an extra argument is messing this up
									// I might be able to do something like (server) => (writer, request) => { /* endpoint code here */ }
									// But I don't want to deal with nested functions in an unfamiar language
    fmt.Println("Starting server")
    setupRoutes()
	colonPort := fmt.Sprintf(":%d", port) // unideal
    log.Fatal(http.ListenAndServe(colonPort, nil))
}
