ws = new WebSocket("ws://0.0.0.0:4860/"); 

ws.onmessage = function(e) {
                            console.log("Got message!"); 
                            console.log(e.data);
                            } 

ws.onclose = function(e)   { console.log("closed"); }; 

ws.onopen = function(e)    { ws.send("Hi"); };

