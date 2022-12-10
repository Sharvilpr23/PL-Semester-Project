package main

import (
	"encoding/json"
)

var ENCRYPTER_GAME_ID = 3

/*
type Message struct { // Since it is being serialized to be sent over, the members a public (capitalized)
	Timestamp  string // there's an actual timestamp data type, but I don't have the time to learn how to work with it
	SenderName string
	SenderId   int
	Body       string
}

*/

/*******************************
 * @author Kaden Adrian
*******************************/
/*
func newMessage(senderName string, senderId int, body string) *Message {
	dt := time.Now()
	// I dislike go. Why would they format datetime like this? Why not use specifiers? ?? ?
	strTime := dt.Format("3:04PM") // https://zetcode.com/golang/datetime-format/
	m := Message{Timestamp: strTime, SenderName: senderName, SenderId: senderId, Body: body}
	return &m
}

*/

type Encrypter struct { // messages public to serialize them, makes it like {"Messages": [{"Timestamp": '', "SenderName": '', "Body": ""}]}
	Messages     []*Message
	CurrentUsers []*Session // Not properly kept track of, just updated on the user callbacks so that the front end can display who all is in the room
	lobby        *Lobby
	MaxUsers     int
}

func (e *Encrypter) getMaxUsers() int {
	return e.MaxUsers
}

/*******************************
 * @author Kaden Adrian
*******************************/
func makeEncrypter(lobby *Lobby) *Encrypter { // unnecessary constructor
	var maxUsers = 10
	room := Encrypter{lobby: lobby, MaxUsers: maxUsers}
	return &room
}

/*******************************
 * @author Kaden Adrian
*******************************/
func (e *Encrypter) onUserJoin(user *Session) {
	e.CurrentUsers = e.lobby.GetRoomUsers()
	e.onUserMessage(user, "Joined")
}

/*******************************
 * @author Kaden Adrian
*******************************/
func (e *Encrypter) onUserLeave(user *Session) {
	e.CurrentUsers = e.lobby.GetRoomUsers()
	e.onUserMessage(user, "Left")
}

/*******************************
 * @author Kaden Adrian
*******************************/
func (e *Encrypter) onUserMessage(user *Session, data string) {
	message := newMessage(user.GetUserName(), user.GetUserId(), data)
	e.Messages = append(e.Messages, message)

	out, _ := json.Marshal(e)
	e.lobby.MessagePlayers(string(out))
}
