package main

import (
	"math"
	"math/rand"
	"encoding/json"
	"fmt"
	"time"
)

var SPACE_ROCKS_GAME_ID = 4

type vector2d struct {
	X: int
	Y: int
}

// yes ships are going to have circle hit boxes, don't @ me
type spaceObject struct {
	Position vector2d
	Radius int
	Velocity vector2d
	ObjectId int
}

func (obj *spaceObject) getInfo() (int, int, int ){
	return obj.Position.X, obj.Position.Y, obj.Radius
}

type Rock struct {
	spaceObject
}

type Ship struct {
	spaceObject
	Angle float64
	ProjectileLimit int
}

type Player struct {
	Uid int
	Lives int
	PlayerShip *Ship
}

func (game *SpaceRocks) newPlayer(user *Session) *Player {
	ship := game.newShip()
	numLives := 3
	p := Player{Uid: user.Id, Lives: numLives, PlayerShip: ship}
	return &p
}

type Projectile struct {
	spaceObject
	Angle float64
}

func (game *SpaceRocks) newShip() *Ship{
	shipRadius := 1
	// The theory behind how I set player spawn is
	// if the lobby is limited to 4 players, I can split the
	// map into quadrants and whichever quadrant has no players
	// should be a sufficient distance from everyone. 
	// Not ideal but I didn't want to cook up a 'furthest point from
	// everyone' algorithm, especially when I don't want the ship
	// to spawn in an asteroid

	halfX := game.GameWidth / 2
	halfY := game.GameHeight / 2
	// There's likely a much more efficient way to do this
	tl := 0
	tr := 0
	bl := 0
	br := 0
	// O(n), where n is length of ships array
	for _, player := range game.Players { // count num ships in each quadrant
		ship := player.PlayerShip
		if ship.Position.X <= halfX {
			if ship.Position.Y > halfY {
				tl += 1
			} else {
				bl += 1
			}
		} else {
			if ship.Position.Y > halfY {
				tr += 1
			} else {
				br += 1
			}
		}
	}

	// instead of finding a quadrant with 0, I'm going to find _a_ minimum, that way we
	// will have support for more players. 
	// makes me realize I should have just put these in an array to simplify this section lol
	min := tl
	spawnX := 5
	spawnY := game.GameHeight - 5 // ????
	if tr < min {
		min = tr
		spawnX = game.GameWidth - 5
	}
	if br < min {
		min = br
		spawnX = game.GameWidth - 5
		spawnY = 5
	}
	if bl < min {
		min = bl
		spawnX = 5
		spawnY = 5
	}

	testShip := Ship{
		spaceObject: spaceObject{
			Position: {

				X: spawnX, 
				Y: spawnY, 
			}
				Radius: shipRadius,
			Velocity: {
				X: 0,
				Y: 0,
			}, 
			}, 
		Angle: math.Pi/2,
		ProjectileLimit: 3,
	}
	for game.checkAnyCollision(testShip.spaceObject) == true {
		testShip.Position.X += 1
		testShip.Position.Y += 1
	}

	return &testShip
}

func (game *SpaceRocks) checkAnyCollision(obj spaceObject) bool {
	// check object against all of the asteroids and ships
	for _, rock := range game.Rocks {
		if checkCollision(obj, rock.spaceObject) == true {
			return true
		}
	}
	for _, player := range game.Players {
		ship := player.PlayerShip
		if checkCollision(obj, ship.spaceObject) == true {
			return true
		}
	}
	for _, projectile := range game.Projectiles {
		if checkCollision(obj, projectile.spaceObject) == true {
			return true
		}
	}
	return false
}

// circle intersection algorithm taken from GeeksForGeeks
func checkCollision(obj1 spaceObject, obj2 spaceObject) bool {
	obj1X, obj1Y, _ := obj1.getInfo()
	obj2X, obj2Y, _ := obj2.getInfo()
	distance := math.Sqrt(float64((obj1X - obj2X) * (obj1X - obj2X) + (obj1Y - obj2Y) * (obj1Y - obj2Y)))
	if distance <= float64(obj1.Radius + obj2.Radius){
		return true
	}
	return false
}

type SpaceRocks struct {
	// Ships []*Ship
	Players []*Player // contains their ship, and the user ids
	Rocks []*Rock
	Projectiles []*Projectile
	GameWidth int
	GameHeight int
	lobby *Lobby
	live bool // whether the server exists or not, since physics loop in goRoutine
	MaxUsers int
}

func (game *SpaceRocks) physicsLoop() {
	// move all autonomous objects according to their velocities and angles
	// check for collisions. 
	// rock colliding with rock can just delete rock for now
	// player colliding with anything should be disastrous (for that player)
	for game.live {
	for _, rock := range game.Rocks {
		dX := rock.spaceObject.Velocity.X
		dY := rock.spaceObject.Velocity.Y
		rock.spaceObject.Position.X += dX
		rock.spaceObject.Position.Y += dY
	}

	for _, projectile := range game.Projectiles {
		dX := projectile.spaceObject.Velocity.X
		dY := projectile.spaceObject.Velocity.X
		projectile.spaceObject.X += dX
		projectile.spaceObject.Y += dY
	}

	// for _, player := range game.Players {
	// 	if game.checkAnyCollision(player.PlayerShip.spaceObject) == true {
	// 		player.Lives -= 1
	// 		if player.Lives > 0 { // just going to leave it to the front end to actually like display that they died...
	// 							  // hopefully I can add game end state soon though. 
	// 			player.PlayerShip = game.newShip()
	// 		}
	// 	}
	// }

	out, _ := json.Marshal(game)
	if game.live {
		game.lobby.MessagePlayers(string(out))
	}
	time.Sleep(time.Second)
	}
}

func (r *SpaceRocks) getMaxUsers() int {
	return r.MaxUsers
}

/*******************************
 * @author Justin Lewis
*******************************/
func makeSpaceRocks(lobby *Lobby) *SpaceRocks{
	var maxUsers = 4
	var gameWidth = 160
	var gameHeight = 90
	var numberRocks = 50
	var maxRockVelocity = 5
	room := SpaceRocks{lobby: lobby, MaxUsers: maxUsers, GameWidth: gameWidth, GameHeight: gameHeight, live: true}

	// GENERATE ROCKS
	for i := 1; i < numberRocks; i++ {
		newRock := Rock{
			spaceObject: spaceObject{
				Position: {
					X: rand.Intn(gameWidth), 
					Y: rand.Intn(gameHeight), 
				},
					Radius: rand.Intn(4),
				Velocity: {
					X: rand.Intn(maxRockVelocity) - (maxRockVelocity / 2), 
					Y: rand.Intn(maxRockVelocity) - (maxRockVelocity / 2), 
				},
				}, 
			}
		room.Rocks = append(room.Rocks, &newRock)
	}

	go room.physicsLoop()

	return &room
}

/*******************************
 * @author Justin Lewis
*******************************/
func (room *SpaceRocks) onUserJoin(user *Session){
	newPlayer := room.newPlayer(user)
	room.Players = append(room.Players, newPlayer)
	out, _ := json.Marshal(room)
	room.lobby.MessagePlayers(string(out))
}

/*******************************
 * @author Justin Lewis
*******************************/
func (room *SpaceRocks) onUserLeave(user *Session){
	var toRemove int = -1
	for i, player := range room.Players {
		if user.Id == player.Uid {
			toRemove = i
		}
	}
	if toRemove != -1{ // Standard remove index i from slice
		room.Players[toRemove] = room.Players[len(room.Players) - 1]
		room.Players = room.Players[:len(room.Players) - 1]
	}

	if len(room.Players) == 0{
		room.live = false
	}
}

/*******************************
 * @author Justin Lewis
*******************************/
func (room *SpaceRocks) onUserMessage (user *Session, data string) {
	for _, player := range room.Players {
		if user.Id == player.Uid {
			// message came from them
			fmt.Println(data) // JSON.Unmarshall(data)
		}
	}
	// message := newMessage(user.GetUserName(), user.GetUserId(), data)
	// room.Messages = append(room.Messages, message)

	// out, _ := json.Marshal(room)
	// room.lobby.MessagePlayers(string(out))
}
