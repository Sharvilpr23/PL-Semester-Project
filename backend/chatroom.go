package main

import (
	"time"
)

type Message struct {
	timestamp string // there's an actual timestamp data type, but I don't have the time to learn how to work with it
	senderName string
	body string
}

func (m *Message) JSONStringify() string {
	var stringBuilder = "{"
	stringBuilder += "\"name\": \"" + m.senderName + "\", "
	stringBuilder += "\"time\": \"" + m.timestamp + "\", "
	stringBuilder += "\"body\": \"" + m.body + "\""
	stringBuilder += "}"
	return stringBuilder
}

func newMessage(senderName string, body string) *Message{
	dt := time.Now()
							 // I dislike go. Why would they format datetime like this? Why not use specifiers? ?? ? 
	strTime := dt.Format("3:04PM") // https://zetcode.com/golang/datetime-format/ 
	m := Message{timestamp: strTime, senderName: senderName, body: body}
	return &m
}


type Chatroom struct {
	messages []*Message
	lobby *Lobby
}

func makeChatRoom(lobby *Lobby) *Chatroom{ // unnecesary constructor
	room := Chatroom{lobby: lobby}
	return &room
}

func (room *Chatroom) handleUserMessage (uname string, data string) {
	message := newMessage(uname, data)
	room.messages = append(room.messages, message)


	var strBuilder = "{\"messages\": ["
	for _, message := range room.messages {
		strBuilder += message.JSONStringify() + ","
	}
	strBuilder = strBuilder[:len(strBuilder) - 1] // delete the comma
												  // note this would likely break if there were no messages in the list, however we are guarunteed one!
	strBuilder += "]}"
	room.lobby.MessagePlayers(strBuilder)
}
