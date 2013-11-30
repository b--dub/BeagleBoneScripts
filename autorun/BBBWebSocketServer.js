// Communication between HTML used as User Interface and this server occurs by 
// passing Type/Value pairs which are DELIMITER separated tokens within a String
//
// type:                value:              comment:
// --------------       -----------------   -----------------------------------
// start                PATH + SCRIPT       file to be started (child_process)
// stop                 PATH + SCRIPT       file to be stopped
// value                string              whatever value is being sent - in
//                                          the case of multiple values this
//                                          might also be a DELIMITED pair..??
// status               connected           current status is 'connected'
// status               disconnected        current status is 'disconnected'
// command              disconnect          close [script and] socket

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8081}),
    DELIMITER = "::",
    spawnedScript, dataArr, script, pathscript;

wss.on('connection', function(ws) {
    console.log('connect');
    ws.send('status' + DELIMITER + 'connected');
    ws.on('message', function(message) {
        
        dataArr = String(message).split(DELIMITER);
        
        for (var i=0; i<(dataArr.length); i+=2) {
            switch(dataArr[i*2]) {
            case "value":
                if (spawnedScript !== undefined) spawnedScript.stdin.write(String(dataArr[i*2+1]/100)+"\n");
                break;
            case "status":
                console.log(dataArr[i*2] + ": " + dataArr[i*2+1]);
                break;
            case "command":
                if (dataArr[i*2+1]=="disconnect") {
                    if (spawnedScript !== undefined) {
                        spawnedScript.kill();
                        spawnedScript = undefined;
                        ws.send("stop" + DELIMITER + script);
                    }
                    ws.send("status" + DELIMITER + "disconnected");
                    console.log(dataArr[i*2] + ": " + dataArr[i*2+1]);
                    setTimeout(ws.close(), 500);
                    return 1;
                }
                break;
            case "start":
                var spawn = require('child_process').spawn;
                pathscript = dataArr[i*2+1];
                script = pathscript.split("/");
                script = script[script.length-1];
                    
                ws.send('start' + DELIMITER + script);
                    
                spawnedScript = spawn('node', [pathscript]);
                
                spawnedScript.stdin.setEncoding = 'utf-8';
                spawnedScript.stdout.pipe(process.stdout);
                
                spawnedScript.stdout.on('data', function (data) {
                    ws.send("value" + DELIMITER + data);
                });
                
                spawnedScript.stderr.on('data', function (data) {
                    ws.send("value" + DELIMITER + "ERROR from script: " + data);
                    console.log('stderr: ' + data);
                });
                
                spawnedScript.on('close', function (code) {
                    console.log('stop: child process ' + script + ' exited with code ' + code);
                });
                
                break;
            case "stop":
                if (spawnedScript !== undefined) {
                    spawnedScript.kill();
                    spawnedScript = undefined;
                    ws.send("stop" + DELIMITER + script);
                }
                break;
            default:
                console.log("ERROR: Invalid Token Type");
            }
        }
    });
    ws.on('close', function() {
        if (spawnedScript !== undefined) {
            spawnedScript.kill();
            spawnedScript = undefined;
        }
        console.log("ws.on('close') called");
    });
    
});

