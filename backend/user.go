package main
import (
)

var nextUID = 1

func generateUID() int{
	uid := nextUID
	nextUID++
	return uid
}

type User struct {
	id int
	name string
}

func newUser() *User{
	u := User{id: generateUID(), name: "Unknown User"} 
	return &u
}

func updateUserName(s *Session, name string){
	s.user.name = name
}
