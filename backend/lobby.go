package main

type OnUserCallback func(*Session)
type OnUserCallbackWithString func(*Session, string)

type Lobby struct {
	gameId int
	lobbyId int
	maxUsers int
	sendRoom OnUserCallbackWithString
	onUserJoin OnUserCallback
	onUserLeave OnUserCallback
	users []*Session
}

var LobbyId = 1

/*******************************
 * @author Justin Lewis
*******************************/
func generateLobbyId () int {
	_id := LobbyId
	LobbyId ++
	return _id
}

/*******************************
 * @author Justin Lewis
*******************************/
func NewLobby(gameId int) *Lobby{
	l := Lobby{gameId: gameId, lobbyId: generateLobbyId()}
	lobbyAddy := &l
	var room GameInterface // interesting since there's no proper inheritence but every game will follow proper standards that I will need to write down
	if gameId == CHATROOM_GAME_ID{
		room = makeChatRoom(lobbyAddy)
	}

	lobbyAddy.sendRoom = func (player *Session, body string) {
		room.onUserMessage(player, body)
	}
	lobbyAddy.onUserJoin = func (player *Session) {
		room.onUserJoin(player)
	}
	lobbyAddy.onUserLeave = func (player *Session) {
		room.onUserLeave(player)
	}
	l.maxUsers = room.getMaxUsers()
	return lobbyAddy
}

func (l *Lobby) GetGameId() int {
	return l.gameId
}

/*******************************
 * @author Justin Lewis
*******************************/
func (l *Lobby) HasRoom() bool {
	return len(l.users) < l.maxUsers
}

/*******************************
 * @author Justin Lewis
*******************************/
func (l *Lobby) IsEmpty() bool {
	return len(l.users) == 0
}

/*******************************
 * @author Justin Lewis
*******************************/
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
		l.onUserLeave(player)
	}
}

/*******************************
 * @author Justin Lewis
*******************************/
func (l *Lobby) AddPlayer(player *Session){
	l.users = append(l.users, player)
	l.onUserJoin(player)
}

func (l *Lobby) GetRoomUsers() []*Session{
	return l.users
}

/*******************************
 * @author Justin Lewis
*******************************/
func (l *Lobby) MessagePlayers(message string){
	for _, user := range l.users{
		user.SendMessage(message)
	}
}