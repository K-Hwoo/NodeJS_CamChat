//gocoder폴더의 app.js 역할

    // express를 import하고 express 어플리케이션을 구성, Backend에서 구동!
import express, { json } from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

    // pug 설정
app.set('view engine', 'pug');  // pug로 view engine 설정
app.set('views', __dirname + "/views"); // express에 template이 어디 있는지 지정

app.use("/public", express.static(__dirname + "/public"));  // public url을 생성하여 유저에게 파일 공유

    // gocoder 폴더의 routes
app.get("/", (req, res) => res.render("home")); // home.pug를 render 해주는 route handler를 만듦
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);



const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/*
function handleConnection (socket) {
    console.log(socket); // 여기 있는 소켓이 프론트엔드와 실시간 소통 하게 함
}
*/

const sockets = [];

wss.on("connection", /* 익명 함수로 */ (socket) => {
    sockets.push(socket);
    socket["nickname"] = "익명의 사용자";

    console.log("Connected to Browser ✅");

    socket.on("close", () => { 
        console.log("Disconnected from the browser ❎");
    });

    socket.on("message", (message) => {
        const parsed = JSON.parse(message);
        //console.log(parsed, message.toString()); // 자바스크립트 object, String 비교
        switch(parsed.type) {
            case "new_message" :
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${parsed.payload}`));
            case "nickname" :
                socket["nickname"] = parsed.payload;
        }
        // socket.send(message.toString());
    });
    
    //socket.send("Hello!!") // socket 메서드 사용, 백엔드에서 보낸 메세지를 프론트엔드로
    
})  // socket !!!

server.listen(3000, handleListen);