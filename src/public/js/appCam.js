// Frontend에서 구동
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickname");
    
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    const chatLi = document.createElement("li");
    chatLi.innerText = message.data;
    messageList.append(chatLi);

    //console.log('New message :', message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❎")
});

/*
setTimeout(() => {
    socket.send("hello from the browser!") // 프론트엔드에서 백엔드로 메세지 보내기
}, 5000)
*/

    // 닉네임이랑 채팅이랑 구분하기 위해 JSON으로 타입 구분
function makeMessage(type, payload) {
    const msg = { type, payload }
    return JSON.stringify(msg);
}

function handleSubmit(event) {
    event.preventDefault();

    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = ""
}

function handleNickSubmit(event) {
    event.preventDefault();

    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);