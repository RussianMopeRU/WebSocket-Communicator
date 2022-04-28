// ==UserScript==
// @name             WebSocket Communicator
// @author           RussianMope[RU]
// @include          *://*
// @run-at           document-start
// @grant            none
// ==/UserScript==

const sockets = [];

const ws = window.WebSocket;
window.WebSocket.prototype.fakeSend = window.WebSocket.prototype.send;

window.WebSocket.prototype.send = function() {
    this.fakeSend.apply(this, arguments);
    console.debug(arguments[0]); // what client sents
}

window.WebSocket = function(...args){
  const socket = new ws(...args);
  sockets.push(socket);

  return socket;
};

function updSockets(){
window.sockets = sockets;
requestAnimationFrame(updSockets)
}

function handleWsMsg(message){
    console.debug(message.data) // what client gets
}

function getValidSocket(){
    sockets.forEach(socket => {
        if(socket.readyState == 1)  {
            window.validSocket = socket; // USAGE ---> window.validSocket.send('hello')
         socket.onmessage = (mes) => {
             handleWsMsg(mes)
         };
        }
    })
}

window.getValidSocket = getValidSocket;

setInterval(getValidSocket, 1000)

requestAnimationFrame(updSockets);