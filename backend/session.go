package main

import (
	"log"
	"fmt"
    "github.com/gorilla/websocket"
	"encoding/json"
)

type Session struct {
	id string
	uname string
	lobby *Lobby
	connection *websocket.Conn
}

func (s *Session) SendMessage(str string) error{
	err := s.connection.WriteMessage(websocket.TextMessage, []byte(str))
	return err
}

func (s *Session) SetLobby(lobby *Lobby) {
	s.lobby = lobby
}

func (s *Session) SendJSON(v interface{}) error{
	err := s.connection.WriteJSON(v);
	return err
}

func (s *Session) GetUserName() string{
	return s.uname
}

type UserMessage struct {
	Name string
	GameId int
	GameData string
}

func (s *Session) reader(server *Server){
    for { // Listen for messages
        messageType, p, err := s.connection.ReadMessage()
        if err != nil{
            log.Println(err)
			server.removeSession(s)
            return
        }

        log.Println(string(p))
		if messageType == websocket.CloseMessage { // To gracefully close the connection, parrot message back (TCP)
			s.connection.WriteMessage(messageType, p)
			server.removeSession(s)
			return
		}
		// Process message
		var data UserMessage
		err = json.Unmarshal(p, &data)
		if err != nil{
			log.Println("Errror unmarshalling data")
			log.Println(err)
		}

		log.Println("Checking user name...")
		if data.Name != "" && s.uname != data.Name{
			log.Println("Setting user name")
			s.uname = data.Name
			server.updateNames()
		}

		// Ran into issue with "(mismatched types <dt> and untyped nil"
		// and frankly I'm disturbed 
		// if data.GameId != nil && data.GameId != s.lobby.GetGameId(){
		log.Println("Checking game id...")
		if data.GameId != 0 && (s.lobby == nil || data.GameId != s.lobby.GetGameId()){
			log.Println("Joining game")
			server.JoinGame(s, data.GameId)
		}
		
		log.Println("Checking game data...")
		if data.GameData != ""{
			log.Println("Sending lobby data")
			s.lobby.sendRoom(s.uname, data.GameData)
		}
    }

}

var nextSessionId = 1

func generateSessionId() string {
	sid := nextSessionId
	nextSessionId++
	return fmt.Sprintf("%d", sid);
}

func startSession(conn *websocket.Conn) *Session{
	s := Session{id: generateSessionId(), connection: conn, uname: "Unknown User" }
	return &s
}
