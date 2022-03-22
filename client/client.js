const io = require("socket.io-client");
const socket = io("http://localhost:3000"); //DEFAULT NAMESPACE
let nickname = null;
let id = null;
color = require('ansi-color').set

console.log(color("\nConnecting to the server...\n", "blue"));
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let s_pattern = /^\/msg ([A-Z0-9]+) (.+)/i;
let bg_pattern = /^\/group ([A-Z0-9]+) (.+)/i

//CONNECT
socket.on("connect", () => {

    id = socket.id;

    if (id) {

        console.log(color("\n[INFO]: Welcome\n", "green"));

        rl.question(color("[ADMIN]: What's your nickname ?\n\n", "blue"), function (answer) {

            nickname = answer;
            if (nickname) {
                console.log(color("\n[ADMIN]: Hello, " + nickname + "\n", "blue"))
                let msg = "[INFO]: Welcome to our chatroom\n";
                console.log(color(msg, "green"))
                socket.emit("join", { "sender": nickname, "action": "join" });
            } else {
                console.log(color("[ADMIN]: You have to enter a nickname in order to log in\n", "red"))
                rl.question(color("[ADMIN]: What's your nickname ?\n ", "blue"), function (answer) {
                    nickname = answer;
                    if (nickname) {
                        console.log(color("[ADMIN]: Hello, " + nickname + "\n", "blue"))
                        let msg = "[INFO]: Welcome to our chatroom";
                        console.log(color(msg, "green"))
                        socket.emit("join", { "sender": nickname, "action": "join" });
                    } else {
                        rl.close();
                    }
                })
            }
        })
    }
});

rl.on("close", function () {
    console.log(color("\nSee You Soon, bye bye\n", "blue"));
    process.exit(0);
});

socket.on("disconnect", (reason) => {
    console.log(color("[INFO]: Client disconnected, reason: %s", "blue"), reason);
});

rl.on("line", (input) => {
    // ENVOYER UN MSG DANS CHAT GENERAL
    if (true === input.startsWith("/ ")) {
        let str = input.slice(2);
        socket.emit("broadcast", { "sender": nickname, "action": "broadcast", "msg": str });
        //LISTE TOUT LES USERS TOUT CHANNEL CONFONDUS
    } else if ("/list_user" === input || "/lu" === input) {
        socket.emit("list", { "sender": nickname, "action": "list" });
        //QUITTER LE CHAT
    } else if (true === input.startsWith('/quit')) {
        socket.emit("quit", { "sender": nickname, "action": "quit" });
        //TRACE SUR LE TERMINAL COTE SERVEUR
    } else if ("tr;" === input) {
        socket.emit("trace");
        //ENVOYER UN DM DE USER A USER
    } else if (true === s_pattern.test(input)) {
        let info = input.match(s_pattern);
        socket.emit("send", { "sender": nickname, "action": "send", "receiver": info[1], "msg": info[2] });
        // CREE ET ENTRE DANS UN CHANNEL
    } else if (true === input.startsWith("/join ")) {
        let str = input.slice(6);
        socket.emit("join_group", { "sender": nickname, "action": "join_group", "group": str });
        //ENVOYER UN MSG AU CHANNEL A QUE LES USERS DU CHANNEL
    } else if (true === bg_pattern.test(input)) {
        let info = input.match(bg_pattern);
        socket.emit("broadcast_group", { "sender": nickname, "action": "broadcast_group", "group": info[1], "msg": info[2] });
        //LISTE LES USERS DU CHANNEL
    } else if (true === input.startsWith("/users ")) {
        let str = input.slice(7);
        socket.emit("list_members_group", { "sender": nickname, "action": "list_members_group", "group": str });
        //LISTE LES CHANNELS DU CHAT
    } else if ("/list" === input) {
        socket.emit("list_groups", { "sender": nickname, "action": "list_groups" });
        //QUITTER UN CHANNEL
    } else if (true === input.startsWith("/leave ")) {
        let str = input.slice(7);
        socket.emit("leave_group", { "sender": nickname, "action": "leave_group", "group": str });
    } else if (true === input.startsWith("/delete ")) {
        let str = input.slice(8);
        socket.emit("delete_group", { "sender": nickname, "action": "delete_group", "group": str });
    } else if (true === input.startsWith("/create ")) {
        let str = input.slice(8);
        socket.emit("create_group", { "sender": nickname, "action": "create_group", "group": str });
    } else if (true === input.startsWith('/nick')) {
        rl.question(color("[ADMIN]: Want to update your nickname ? ", "blue"), function (answer) {
            console.log(color("[ADMIN]: nickname updated, " + answer, "blue"))
            nickname = answer;
            socket.emit("join", { "sender": nickname, "action": "join" });
        })
    }
});

//BROADCAST A CEUX DU CHANNEL MEME SI LE USER NE FAIT PAS PARTIE DE LA ROOM
socket.on("broadcast", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color(client_nickname + ": ", "yellow") + data.msg);
    }
});

//NEW JOIN TO THE CHAT
socket.on("join", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color("\n[INFO]: " + client_nickname + " has joined the chat\n", "yellow"))
    }
});

//DISPLAY LIST OF USERS CONNECTED
socket.on("list", (data) => {
    console.log(color("[INFO]: List of nicknames:", "green"));
    for (let i = 0; i < data.users.length; i++) {
        console.log(data.users[i]);
    }
})

//QUIT THE CHAT
socket.on("quit", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color("\n[INFO]: " + client_nickname + " quit the chat\n", "blue"), data.sender);
    }
});

//SEND
socket.on("send", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color(client_nickname + ": ", "yellow") + color(data.msg, "blue"));
    } 
});

//JOIN CHANNEL
socket.on("join_group", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color("\n[INFO]: " + client_nickname + " has joined the group\n", "green"));
    }
});

//CREATE CHANNEL
socket.on("create_group", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color("\n[INFO]: " + client_nickname + " has created the group\n", "green"));
    }
});

//BROADCAST TO A CHANNEL THAT I M NOT INTO
socket.on("broadcast_group", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color(client_nickname + ": ", "yellow") + data.msg);
    }
});

//LIST USER DU CHANNEL
socket.on("list_members_group", (data) => {
    console.log(color("\n[INFO]: List of members:\n", "blue"));
    for (let i = data.members.length - 1; i >= 0; i--) {
        console.log(data.members[i]);
    }
});

//LIST CHANNEL
socket.on("list_groups", (data) => {
    console.log(color("\n[INFO]: List of groups:\n", "blue"));
    for (let i = data.groups.length - 1; i >= 0; i--) {
        console.log(data.groups[i]);
    }
});

//LEAVE CHANNEL
socket.on("leave_group", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color("\n[INFO]: " + client_nickname + " left the group\n", "yellow"));
    }
});

//DELETE CHANNEL
socket.on("delete_group", (data) => {
    let client_nickname = data.sender
    if (id != data.id) {
        console.log(color("\n[INFO]: " + client_nickname + " deleted the group\n", "yellow"));
    }
});
