package main

// import (
// 	"strings"
// )

type SendRoomMessage func(string, string)

type Lobby struct {
	gameId int
	lobbyId int
	sendRoom SendRoomMessage// strategy pattern ish
	users []*Session
}

var LobbyId = 1

func generateLobbyId () int {
	_id := LobbyId
	LobbyId ++
	return _id
}

func NewLobby(gameId int) *Lobby{
	l := Lobby{gameId: gameId, lobbyId: generateLobbyId()}
	lobbyAddy := &l
	// VIOLATES OPEN/CLOSED FROM SOLID
	if gameId == 1{
		room := makeChatRoom(lobbyAddy)
		lobbyAddy.sendRoom = func (uname string, body string) {
			room.handleUserMessage(uname, body)
		}
	}
	return lobbyAddy
}

func (l *Lobby) GetGameId() int {
	return l.gameId
}

func (l *Lobby) HasRoom() bool {
	return len(l.users) < 2
}

func (l *Lobby) RemovePlayer(player *Session){
	// Player may not be in the list of players, since I am doing this in a rather lazy way
	var toRemove int = -1
	for i, user := range l.users {
		if user == player {
			toRemove = i
		}
	}
	if toRemove != -1{ // Standard remove index i from slice
		l.users[toRemove] = l.users[len(l.users) - 1]
		l.users = l.users[:len(l.users) - 1]
	}
}

func (l *Lobby) AddPlayer(player *Session){
	l.users = append(l.users, player)
	// playersString := "{\"Players\":" + "[\"" + strings.Join(l.GetRoomUserNames(), "\",\"") + "\"]}" 
	// l.MessagePlayers(playersString)
	// fmt.Println(playersString)
}

func (l *Lobby) GetRoomUserNames() []string{
	names := []string{}
	for _, user:= range l.users {
		names = append(names, user.GetUserName())
	}

	return names
}

func (l *Lobby) MessagePlayers(message string){
	for _, user := range l.users{
		user.SendMessage(message)
	}
}