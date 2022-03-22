const port = 3000;
const io = require("socket.io")(port);
console.log("Server is listening on port: http://localhost:", port);
const color = require('ansi-color');

io.of("/").on("connect", (socket) => {
    console.log("\nA client is connected");
    // let room = [];

    //BROADCAST
    socket.on("broadcast", (data) => {
        console.log("\n%s", data);
        socket.broadcast.emit("broadcast", data);
    });

    //SEND
    socket.on("send", (data) => {
        console.log("\n%s", data);

        let socket_id = null;
        for (const [key, value] of io.of("/").sockets) {
            if (data.receiver.toLowerCase() === value.nickname) {
                socket_id = key;
            }
        } if (socket_id !== null) {
            io.of("/").to(socket_id).emit("send", data);
        }
    });

    socket.on("join", (data) => {
        console.log("\n%s", data);
        console.log("Nickname: ", data.sender, ", ID: ", socket.id);
        console.log("Number of clients: %d", io.of('/').server.engine.clientsCount);
        socket.nickname = data.sender;
        socket.broadcast.emit("join", data);
    });

    //LIST
    socket.on("list", (data) => {
        console.log("\n%s", data); 
        let users = []; 
        for (const [key, value] of io.of("/").sockets) {
            users.push(value.nickname);
        } socket.emit("list", { "sender": data.sender, "action": "list", "users": users });
    });

    //DECO
    socket.on("disconnect", (reason) => {
        console.log("\nA client disconnected, reason: %s", reason);
        console.log("Number of clients: %d", io.of('/').server.engine.clientsCount);
    });

    //QUIT 
    socket.on("quit", (data) => {
        console.log("\n%s", data);
        socket.broadcast.emit("quit", data);
        socket.disconnect(true);
    });

    //TRACE 
    socket.on("trace", () => {
        console.log("\n=============== Trace ===============");
        console.log(io.of("/"));
    });

    //CREATE ROOM
    socket.on("create_group", (data) => {
        socket.join(data.group);
        console.log("Group: ", data.group, ", Created: ", data.sender);
        // const rooms = room.push(data.group + " : " + data.sender)
        // console.log(rooms);
        io.of("/").to(data.group).emit("create_group", data);
    });

    //JOIN CHANNEL
    socket.on("join_group", (data) => {
        console.log("\n%s", data);
        socket.join(data.group);
        console.log("Group: ", data.group, ", Joined: ", data.sender);
        io.of("/").to(data.group).emit("join_group", data);
    });

    //BROADCAST GROUP 
    socket.on("broadcast_group", (data) => {
        console.log("\n%s", data);
        socket.to(data.group).emit("broadcast_group", data);
        if (undefined === io.of("/").room_messages) {
            io.of("/").room_messages = {};
        } if (undefined === io.of("/").room_messages[data.group]) {
            io.of("/").room_messages[data.group] = [];
        }
        io.of("/").room_messages[data.group].push(data.msg);
    });

    //LIST  LES USERS DANS LE CHANNEL
    socket.on("list_members_group", (data) => {
        console.log("\n%s", data);
        let socket_ids;
        let members = [];
        for (const [key, value] of io.of("/").adapter.rooms) {
            if (key === data.group) {
                socket_ids = value;
            }
        } socket_ids.forEach((socket_id) => {
            const socket_in_room = io.of("/").sockets.get(socket_id);
            members.push(socket_in_room.nickname);
        });
        socket.emit("list_members_group", { "sender": data.sender, "action": "list_members_group", "group": data.group, "members": members });
    });

    //LIST LES MESSAGES DU CHANNELS
    socket.on("list_messages_group", (data) => {
        console.log("\n%s", data);
        let msgs = io.of("/").room_messages[data.group];
        socket.emit("list_messages_group", { "sender": data.sender, "action": "list_messages_group", "group": data.group, "msgs": msgs });
    });

    //LIST LES CHANNELS
    socket.on("list_groups", (data) => {
        console.log("\n%s", data);
        let groups = [];
        for (const [key, value] of io.of("/").adapter.rooms) {
            if (false === value.has(key)) {
                groups.push(key);
            }
        } socket.emit("list_groups", { "sender": data.sender, "action": "list_groups", "groups": groups });
    });

    //LEAVE CHANNEL
    socket.on("leave_group", (data) => {
        console.log("\n%s", data);
        console.log("Group: ", data.group, ", Left: ", data.sender);
        io.of("/").to(data.group).emit("leave_group", data);
    });

    // DELETE GROUP
    socket.on("delete_group", (data) => {
        console.log("\n%s", data);
        console.log("Group: ", data.group, ", Delete: ", data.sender);
        socket.leave(data.group);
        io.of("/").to(data.group).emit("delete_group", data);
    });
});
