var ws = new WebSocket("ws://localhost:4860/"); 

ws.onmessage = function(e) {
                            console.log("Got message!"); 
                            console.log(e.data);
                            } 

ws.onclose = function(e)   { console.log("closed"); }; 

ws.onopen = function(e)    { console.log("Websocket Open"); };

