package main

import (
	"fmt"
    "log"
	"net/http"
	"strings"
    "github.com/gorilla/websocket"
)

type Server struct {
    port int
	sessions []*Session
	lobbies []*Lobby
}

func newServer(port int) *Server {
	server := Server{port: port}
	return &server
}

func (s *Server) setupRoutes() {
    http.HandleFunc("/", s.homePage)
    http.HandleFunc("/lobby", s.lobbyEndpoint)
	// http.HandleFunc("/users", usersEndpoint)
    // http.HandleFunc("/ws", s.wsEndpoint)
    http.HandleFunc("/server", s.serverEndpoint)
}

func (s *Server) addSession(conn *websocket.Conn) {
    log.Println("Client Successfully Connected...")
	newSession := startSession(conn)
	s.sessions = append(s.sessions, newSession)
	s.updateNames()
	newSession.reader(s)
}

func (s *Server) removeSession(session *Session){
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
		names = append(names, userSession.GetUserName())
	}
	for _, element := range s.sessions {
		element.SendMessage(strings.Join(names, "\n"))
	}
	fmt.Println(strings.Join(names, "\n"))
}

func (s *Server) getServerUsers () string{
	stringBuilder := ""
	for _, element := range s.sessions {
		stringBuilder = stringBuilder + "SID: " + element.id + "\t Name: " + element.GetUserName() + "\n"
	// 	stringBuilder = stringBuilder + ", " + element.user.name
	}
	// stringBuilder = append(stringBuilder, "]")
	return stringBuilder
}

func (s *Server) StartServer() {
    fmt.Println("Starting server")
    s.setupRoutes()
	colonPort := fmt.Sprintf(":%d", s.port) // unideal
    log.Fatal(http.ListenAndServe(colonPort, nil))
}

func (s *Server) JoinGame(player *Session, gameId int){
	for _, lobby := range s.lobbies{ // very lazy, I know. Not sure what would be best, maybe have player store current lobby id? 
		lobby.RemovePlayer(player)
	}
	for _, lobby := range s.lobbies {
		if lobby.GetGameId() == gameId && lobby.HasRoom() {
			lobby.AddPlayer(player)
			return
		}
	}

	// if we do not return, we did not find a lobby the player could join. 
	// So we need to create a new lobby
	newLobby := NewLobby(gameId)
	s.lobbies = append(s.lobbies, newLobby)
	newLobby.AddPlayer(player)
}
