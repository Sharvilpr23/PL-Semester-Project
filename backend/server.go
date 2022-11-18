package main

import (
	"fmt"
    "log"
	"net/http"
	"encoding/json"
    "github.com/gorilla/websocket"
)

type Server struct {
    port int
	Sessions []*Session
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
	s.Sessions = append(s.Sessions, newSession)
	s.updateNames()
	newSession.reader(s)
}

func (s *Server) removeFromLobby(session *Session){
	for i, lobby := range s.lobbies {
		lobby.RemovePlayer(session);

		if lobby.IsEmpty() { // If lobby now empty, remove it
			s.lobbies[i] = s.lobbies[len(s.lobbies) - 1]
			s.lobbies = s.lobbies[:len(s.lobbies) - 1]
		}
	}
}

func (s *Server) removeSession(session *Session){
	s.removeFromLobby(session)

	for i, element := range s.Sessions {
		if element.Id == session.Id {
			s.Sessions[i] = s.Sessions[len(s.Sessions) - 1]
			s.Sessions = s.Sessions[:len(s.Sessions) - 1]
			return
		}
	}

	s.updateNames()
}

func (s *Server) updateNames() {
	out, _ := json.Marshal(s) // {"Sessions": [{<id, name>}]}
	fmt.Println(string(out))
	for _, element := range s.Sessions{
		element.SendMessage(string(out))
	}
	fmt.Println(string(out))
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
			log.Println("Added player " + player.GetUserName() + " to existing lobby")
			player.SetLobby(lobby)
			return
		}
	}

	// if we do not return, we did not find a lobby the player could join. 
	// So we need to create a new lobby
	newLobby := NewLobby(gameId)
	s.lobbies = append(s.lobbies, newLobby)
	newLobby.AddPlayer(player)
	log.Println("Added player " + player.GetUserName() + " to new lobby")

	player.SetLobby(newLobby)
}
