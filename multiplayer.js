//import { Host, Client } from "./p2pServer.js";

Object.prototype.getName = function() { 
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((this).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
 };

var multiplayers = {}

class MultiplayerController {
    constructor() {
        this.host = false
        if (location.href.split("?").length>1) {
            var hrefdataO = {},
                hrefdata = location.href.split("?")[1].split("&")
            for (let i = 0; i < hrefdata.length; i++) {
                const data = hrefdata[i].split("=")
                if (data.length<=1) {
                    hrefdataO[data] = true
                } else {
                    hrefdataO[data[0]] = data[1]
                }
                
            }

            if (hrefdataO.host) {
                this.host = true
                this.connectionPort = new Host()
                this.connectionPort.init(hrefdataO.host)

                this.connectionPort.on("updateControls", (e, data)=>{
                    console.log("updating controls", e, data)
                    this.setControls(e, data)
                })

                this.connectionPort.on("disconnect", (e)=>{
                    console.log("disconnected tryna delete player", e)
                    this.deletePlayer(e)
                })
                
            } else if (hrefdataO.code) {
                this.connectionPort = new Client(hrefdataO.code)

                this.connectionPort.on("updateGameState", (e, data)=>{
                    this.setGameState(data)
                })
            }
        }
    }

    init() {
        setInterval(() => {
            this.mainLoop()
        }, 1000/40);

        if (this.host) {
            this.connectionPort.on("playerBall", (e, d)=>{
                //d = JSON.parse(d)
                console.log(d)
                if (multiplayers[e]==undefined) {
                    multiplayers[e] = ball()
                    
                }
                multiplayers[e].pos = d
            })
            this.connectionPort.on("shootBullet", (e, d)=>{
                bullets.push(d)
            })
        }
    }

    mainLoop() {
        if (this.connectionPort.constructor.name=="Host") {

            this.connectionPort.broadcast("updateGameState", this.getGameState())

        } else {
            this.sendPlayerPos()
        }
    }

    


    //====================================================================================================
    //========================== Functions that interact with the game ===================================
    //====================================================================================================




    getGameState() {  
        // get the gamestate of the game and outputs a stringifyed object to be transported
        // Host ----> Client
        return JSON.stringify({
            shapeArray:window.shapeArray,
            enemies:window.enemies,
            bullets:window.bullets,
        })
    }
    getControls() {
        // get the controls of the client and outputs a stringifyed object to be transported
        // Client ----> Host
        return JSON.stringify({})
    }



    setGameState(state) {
        // reverse of getGameState
        // takes stringifyed object to set the current gamestate too
        console.log(state)
        window.shapeArray = state.shapeArray
        window.enemies = state.enemies
        window.bullets = state.bullets
        
    }
    setControls(playerConnId, control) {
        // reverse of getControls
        // takes stringifyed object to set the current gamestate
        // will require the controls to be moved to the player object

        // must search for existing player to apply current controls too
        // if no player is found =====> CREATE A NEW PLAYER <======
        //      and make sure it contains the playerConnId property
    }

    deletePlayer(connId) {
        // Fires when disconnected
        // Must search for player with connId and delete it from the game

    }

    sendPlayerPos(pos) {
        if (!this.host) {
            this.connectionPort.send("playerBall", JSON.stringify(playerBall.pos))
        }
    }

    shootBullet() {
        if (!this.host) {
            this.connectionPort.send("shootBullet", JSON.stringify({ 
                pos:{...playerBall.pos},
                angle:-Math.atan2((canvas.width/2)-mouse.pos.x, (canvas.height/2)-mouse.pos.y)+(Math.PI*1.5),
              }))
        }
    }
}