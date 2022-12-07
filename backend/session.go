package main

import (
	"log"
    "github.com/gorilla/websocket"
	"encoding/json"
)

type Session struct {
	Id int
	UserName string
	lobby *Lobby
	connection *websocket.Conn
}

/*******************************
 * @author Justin Lewis
*******************************/
func (s *Session) SendMessage(str string) error{
	err := s.connection.WriteMessage(websocket.TextMessage, []byte(str))
	return err
}

func (s *Session) SetLobby(lobby *Lobby) {
	s.lobby = lobby
}

/*******************************
 * @author Justin Lewis
*******************************/
func (s *Session) SendJSON(v interface{}) error{
	err := s.connection.WriteJSON(v);
	return err
}

func (s *Session) GetUserName() string{
	return s.UserName
}

func (s *Session) GetUserId() int{
	return s.Id
}

type UserMessage struct {
	Name string
	GameId int
	GameData string
}

/*******************************
 * @author Justin Lewis
*******************************/
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

		if data.Name != "" && s.UserName != data.Name{
			log.Println("Setting user name")
			s.UserName = data.Name
			server.updateNames()
		}

		// Ran into issue with "(mismatched types <dt> and untyped nil"
		// and frankly I'm disturbed 
		if data.GameId != 0 && (s.lobby == nil || data.GameId != s.lobby.GetGameId()){
			if(s.lobby != nil && s.lobby.GetGameId() != data.GameId){ // changing games... or potentially just adding a new one but it should be safe regardless
				s.lobby.RemovePlayer(s)
			}
			server.removeFromLobby(s)
			log.Println("Joining game")
			server.JoinGame(s, data.GameId)
		}
		
		if data.GameData != ""{
			log.Println("Sending lobby data")
			s.lobby.sendRoom(s, data.GameData)
		}
    }

}

var nextSessionId = 1

/*******************************
 * @author Justin Lewis
*******************************/
func generateSessionId() int {
	sid := nextSessionId
	nextSessionId++
	return sid;
}

type SessionStartMessage struct {
	YourId int
}

/*******************************
 * @author Justin Lewis
*******************************/
func startSession(conn *websocket.Conn) *Session{
	s := &(Session{Id: generateSessionId(), connection: conn, UserName: "Anonymous" })
	m := SessionStartMessage{YourId: s.Id}
	out, _ := json.Marshal(m)
	s.SendMessage(string(out))
	return s
}
