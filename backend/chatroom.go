package main

import (
	"time"
	"encoding/json"
)

var CHATROOM_GAME_ID = 1

type Message struct { // Since it is being serialized to be sent over, the members a public (capitolized)
	Timestamp string // there's an actual timestamp data type, but I don't have the time to learn how to work with it
	SenderName string
	SenderId int
	Body string
}

func newMessage(senderName string, senderId int, body string) *Message{
	dt := time.Now()
							 // I dislike go. Why would they format datetime like this? Why not use specifiers? ?? ? 
	strTime := dt.Format("3:04PM") // https://zetcode.com/golang/datetime-format/ 
	m := Message{Timestamp: strTime, SenderName: senderName, SenderId: senderId, Body: body}
	return &m
}


type Chatroom struct { // messages public to serialize them, makes it like {"Messages": [{"Timestamp": '', "SenderName": '', "Body": ""}]}
	Messages []*Message
	CurrentUsers []*Session // Not properly kept track of, just updated on the user callbacks so that the front end can display who all is in the room
	lobby *Lobby
	MaxUsers int
}

func (r *Chatroom) getMaxUsers() int {
	return r.MaxUsers
}

func makeChatRoom(lobby *Lobby) *Chatroom{ // unnecesary constructor
	var maxUsers = 10
	room := Chatroom{lobby: lobby, MaxUsers: maxUsers}
	return &room
}

func (room *Chatroom) onUserJoin(user *Session){
	room.CurrentUsers = room.lobby.GetRoomUsers()
	room.onUserMessage(user, "Joined")
}

func (room *Chatroom) onUserLeave(user *Session){
	room.CurrentUsers = room.lobby.GetRoomUsers()
	room.onUserMessage(user, "Left")
}

func (room *Chatroom) onUserMessage (user *Session, data string) {
	message := newMessage(user.GetUserName(), user.GetUserId(), data)
	room.Messages = append(room.Messages, message)

	out, _ := json.Marshal(room)
	room.lobby.MessagePlayers(string(out))
}
