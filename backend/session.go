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
	connection *websocket.Conn
}

func (s *Session) SendMessage(str string) error{
	err := s.connection.WriteMessage(websocket.TextMessage, []byte(str))
	return err
}

func (s *Session) SendJSON(v interface{}) error{
	err := s.connection.WriteJSON(v);
	return err
}

func (s *Session) GetUserName() string{
	return s.uname
}

type UserDefinition struct {
	Name string
}

type UserMessage struct {
	Name string
	GameId int
	GameData int
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
			log.Println(err)
		}

		s.uname = data.Name
		server.updateNames()
		server.JoinGame(s, data.GameId)
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
