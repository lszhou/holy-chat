# holy-chat


GET   /
  - retrieve the app payload




# API

## USER

GET   /api/user
  - get list of all users
POST  /api/user
  - create new user
GET   /api/user/:uid
  - get info on user
PUT   /api/user/:uid
  - update user
DEL   /api/user/:uid
  - delete user

## GROUP
### Any number of users belong to a group
### the group will contain multiple chatrooms

GET   /api/group
  - get list of groups available to the authenticated user
POST  /api/group
  - create new group
GET   /api/group/:gid
  - get info on group
PUT   /api/group/:gid
  - update group
DEL   /api/group/:gid
  - delete group

## ROOM
### Where the conversations happen

GET   /api/group/:gid/room
  - get a list of rooms in the group, which are available to the authenticated user
POST  /api/group/:gid/room
  - create a new room in the group
GET   /api/group/:gid/room/:rid
  - get info on a specific room in a group
PUT   /api/group/:gid/room/:rid
  - update a specific room in a group
DEL   /api/group/:gid/room/:rid
  - delete a specific room in a group

## MSG

GET   /api/group/:gid/room/:rid/msg
  - get messages for a room in a group
POST   /api/group/:gid/room/:rid/msg
  - send message to a room in a group
GET   /api/group/:gid/room/:rid/msg/:mid
  - get a specific message in a room in a group (perhaps not necessary?)
PUT   /api/group/:gid/room/:rid/msg/:mid
  - update a message in a room in a group
DEL   /api/group/:gid/room/:rid/msg/:mid
  - delete a message in a room in a group
