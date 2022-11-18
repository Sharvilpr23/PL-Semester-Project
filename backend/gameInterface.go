package main

// Interfaces are used to define method signatures that you expect a struct to have implemented

type GameInterface interface {
	onUserJoin(*Session)
	onUserLeave(*Session)
	onUserMessage(*Session, string)
	getMaxUsers() int
}
