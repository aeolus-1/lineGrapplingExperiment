function so(num, max) {
    return ((((num)) % max + max) % max)
    
}

function getCarScore(car) {
    return car.currentScore + (car.completedLaps*6692)
}

class Car {
    constructor() {
        this.pos = v(targets[0].x, targets[0].y+150)
        this.vel = v()
        this.rotation = 90

        this.dim = v(25, 15)

        this.colliding = false
        this.alive = true

        this.currentScore = 0
        this.completedLaps = 0
        this.currentTarget = 0
        this.timeStart = new Date().getTime()
        this.time = new Date().getTime()

        this.score = 0
        this.currentScore = 0

        this.nn = new NerualNetwork({
            inputs:9,
            hiddenLayers:[18],
            outputs:3,
        })

        this.controlled = false

        //this.nn.mutate(10)
        this.nn.solve()

        this.drifting = false

    }

    getTargetScore() {
        var smolPoint = {point:undefined,line:undefined,dst:Infinity}
        for (let i = 0; i < targetLines.length; i++) {
            const line = targetLines[i];
            var closestPoint = linePoint(this.pos, {p1:v(line.x1,line.y1),p2:v(line.x2,line.y2)}),
                dst = getDst(v(closestPoint.x, closestPoint.y), this.pos)

            if (dst < smolPoint.dst) {
                smolPoint = {point:closestPoint, line:line, dst:dst}
            }
        }

        if (this.controlled) {

            ctx.beginPath()
            ctx.moveTo(smolPoint.point.x, smolPoint.point.y)
            ctx.lineTo(this.pos.x, this.pos.y)
            ctx.lineWidth = 5
            ctx.strokeStyle = "#0f0"
            ctx.stroke()
            ctx.closePath()
        }

        if (smolPoint.point != undefined) {
            var d = (getDst(v(smolPoint.line.x1, smolPoint.line.y1), smolPoint.point)+smolPoint.line.startDst),
                ds = d-this.currentScore
        
            if (ds > 0 && ds < 250) {
                if (d > 6692 && this.currentScore < 6692) {
                    this.currentScore = 0
                    this.completedLaps += 1
                } else if (d < 6692 && this.currentScore < 6692) {
                    this.currentScore = d
                } else {

                }
            }
        }

    }
    

    drive(strength) {
        strength = Math.max(Math.min(strength, 0.354), -0.3)

        var mod = 0.2

        this.vel.x += Math.cos(this.rotation*(Math.PI/180))*strength*mod
        this.vel.y += Math.sin(this.rotation*(Math.PI/180))*strength*mod
    }
    turn(strength) {
        strength = Math.max(Math.min(strength, 1), -1)

        var mod = 10,
            speed = getDst(v(), this.vel)
        
        this.rotation += Math.max(Math.min(strength*mod*(speed/10), 3), -3)
    }
    update() {
        this.time = new Date().getTime()
        this.setNNInput()
        this.nn.solve()  


        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        this.vel.x *= 0.99
        this.vel.y *= 0.99

        this.testCollision(lines)

        var currentTargetPos = targets[this.currentTarget],
            dst = getDst(this.pos, currentTargetPos),
            maxDst = getDst(targets[this.currentTarget], targets[so(this.currentTarget+1, targets.length)])

        
        

        if (this.colliding) {
            this.colliding = false
            if (this.controlled) {
                this.pos =  v(targets[0].x, targets[0].y+150)
                this.rotation = 90
                this.vel = v()
            }

            //this.score /= (new Date().getTime()) - this.timeStart

            this.alive = false

            return 0
        }


        this.correctMovement((this.drifting)?0.955:0.7)

        if (this.controlled) this.updateKeys()

        if (this.alive && !this.controlled) this.runNN()

    }
    updateKeys() {
        if (keys["s"]) {
            this.drive(1)
        }
        if (keys["w"]) {
            this.drive(-1)
        }
        if (keys["a"]) {
            this.turn(-1)
        }
        if (keys["d"]) {
            this.turn(1)
        }
        this.drifting = keys[" "]
    }
    setNNInput() {
        this.nn.setInputs([
            ...this.runRayDectection(ctx),
        ])
    }
    runNN() {
        var output = this.nn.getOutputs()
        this.turn(Math.sign(output[1]))
        this.drifting = Math.round(Math.min(Math.max(output[2], 0), 1))
        this.drive(Math.sign(output[0])*((this.drifting)?0.7:1)) 

    }

    correctMovement(strength=0.8) {
        var correctAngle = rotateVelocity(this.vel, -this.rotation)
        correctAngle.y *= strength
        this.vel = rotateVelocity(correctAngle, this.rotation)
    }

    testCollision(lines) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (lineRect(v(line.x1, line.y1), v(line.x2, line.y2), {
                x:this.pos.x-(this.dim.x/2),
                y:this.pos.y-(this.dim.y/2),
                width:this.dim.x,
                height:this.dim.y
            }, this.rotation)) {
                this.colliding = true
            }

        }
        
    }
    runRayDectection(ctx) {
        var length = 14,
            rays = []
        for (let i = 0; i < length; i++) {
            rays.push(this.testRay(ctx, this.rotation+((i/length)*360), 600))
            
        }

        return rays
    }

    testRay(ctx, angle, length=150) {
        angle += this.rotation
        //drawLine(ctx, this.pos, angle, length)


        var pos1 = this.pos,
            pos2 = v(this.pos.x+(cos(angle)*length), this.pos.y+(sin(angle)*length)),

            smallestDst = 0

        for (let i = 0; i < lines.length; i++) {
            var line = lines[i],
                pos3 = v(line.x1, line.y1),
                pos4 = v(line.x2, line.y2),
                collision = lineLine(pos1.x, pos1.y, pos2.x, pos2.y, pos3.x, pos3.y, pos4.x, pos4.y)
            

            if (collision) {
                //console.log(collision)
                
                ctx.beginPath()

                ctx.arc(collision.x, collision.y, 10, 0, Math.PI*2)
                //ctx.fill()
                ctx.closePath()

                var dst = 1-(getDst(v(collision.x, collision.y), this.pos)/length)

                if (dst > smallestDst) {
                    smallestDst = dst
                }
            }

        }

        return smallestDst

    }

    draw(ctx) {
        ctx.save()

        if (this.pos === selectedCar.pos) {
            var length = 9,
            rays = []
        for (let i = 0; i < length; i++) {
            ctx.beginPath()
    
            var range = 600
    
            ctx.moveTo(this.pos.x, this.pos.y)
            ctx.lineTo(
                this.pos.x + (Math.cos(
                (this.rotation+((i/length)*360)+180)*(Math.PI/180)
            ) * range),
            this.pos.y + (Math.sin(
                (this.rotation+((i/length)*360)+180)*(Math.PI/180)
            ) * range),
            )
            ctx.strokeStyle = "#0004"
            ctx.stroke()
            ctx.closePath()
            
        }
        }
        

        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(this.rotation*(Math.PI/180))
        ctx.translate(-this.pos.x, -this.pos.y)

        


        var dim = this.dim

        ctx.fillStyle = (this.controlled) ? "#00f" : (this.selected) ? "#0f0" : "#f00"
        ctx.fillRect(this.pos.x-(dim.x/2), this.pos.y-(dim.y/2), dim.x, dim.y)
        ctx.restore()
        this.selected = false


        

        return rays

    }
}