package main

import (
	"log"
	"fmt"
    "github.com/gorilla/websocket"
	"encoding/json"
)

type Session struct {
	id string
	connection *websocket.Conn
	user *User
}

func (s *Session) SendMessage(str string) error{
	err := s.connection.WriteMessage(websocket.TextMessage, []byte(str))
	return err
}

func (s *Session) SendJSON(v interface{}) error{
	err := s.connection.WriteJSON(v);
	return err
}

type UserDefinition struct {
	Name string
}

func reader(s *Session){
    for { // Listen for messages
        messageType, p, err := s.connection.ReadMessage()
        if err != nil{
            log.Println(err)
			removeSession(server, s)
            return
        }

        log.Println(string(p))
		if messageType == websocket.CloseMessage { // To gracefully close the connection, parrot message back (TCP)
			s.connection.WriteMessage(messageType, p)
			removeSession(server, s)
			return
		}
		// Process message
		var data UserDefinition
		err = json.Unmarshal(p, &data)
		if err != nil{
			log.Println(err)
		}

		updateUserName(s, data.Name)
		server.updateNames()
    }

}

var nextSessionId = 1

func generateSessionId() string {
	sid := nextSessionId
	nextSessionId++
	return fmt.Sprintf("%d", sid);
}

func startSession(conn *websocket.Conn) *Session{
	s := Session{id: generateSessionId(), connection: conn, user: newUser() }
	return &s
}

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
}