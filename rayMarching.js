//Functions
function getDst(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2))
}

function smoothMin(numA, numB, k) {
    var h = Math.max(k-Math.abs(numA-numB), 0)/k
    return Math.min(numA, numB) - h*h*h*k*1/6
}


function rotatePoint(x, y, angle) {
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.translate(-x, -y)
}

//clamp for rect circle
function clamp(num, min, max) {
    if (num > max) {
        num = max
    }
    if (num < min) {
        num = min
    }
    return num
}

//not actually a rayCast
function rayCast(x, y, angle, dst) {
    return {
        x:x + (Math.cos(angle)*dst),
        y:y + (Math.sin(angle)*dst),
    }
}

//rotate vertices
function rotate(cx, cy, x, y, angle) {
    //angle += Math.PI*

    var radians = angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {x:nx, y:ny};
}

//Shapes
function Circle(x, y, r) {
    return {
        x:x,
        y:y,
        
        r:r,

        shape:"circle",

        id:self.crypto.randomUUID(),
        
    }
}
function Rect(x, y, width, height, angle=0) {
    return {
        
        x:x,
        y:y,
        
        width:width,
        height:height,

        angle:angle,

        shape:"rect",

        id:self.crypto.randomUUID(),
    }
}


//Collisions
function Collisions() {

    this.circleCircle = function (circle, circle2) {
        let dst = getDst(circle.x, circle.y, circle2.x, circle2.y)
        
    
        let rad = circle.r+circle2.r
        
        return {
            dst:dst-rad
        }
    }

    this.circleRectPlain = function (circle, rect) {

        let rp = {
            x:clamp(circle.x, rect.x-(rect.width/2), rect.x+(rect.width/2)),
            y:clamp(circle.y, rect.y-(rect.height/2), rect.y+(rect.height/2))
        }

        let rad = circle.r

        let dst = getDst(circle.x, circle.y, rp.x, rp.y)

        return {
            dst:dst
        }

    }
    this.circleRect = function (circle, rect) {
        
        let rp = rotate(circle.x, circle.y, rect.x, rect.y, rect.angle),

            rotatedRect = Rect(rp.x, rp.y, rect.width, rect.height)

        let collision = this.circleRectPlain(circle, rotatedRect)

        return {
            dst:collision.dst
        }


        
        


    }
}
var collisions = new Collisions()


//Marching
function getLargestCircle(p) {

    let maxDst = Infinity,

        point = Circle(p.x, p.y, 0),

        object = shapeArray[0]
    
    for (let i = 0; i < shapeArray.length; i++) {
        const shape = shapeArray[i];
        
        if (shape.shape == "circle" ) {
            let dst = collisions.circleCircle(point, shape).dst

            if (dst < maxDst) {
                maxDst = dst
                object = shape
            }
        }
    
        if (shape.shape == "rect" ) {
            let dst = collisions.circleRect(point, shape).dst
            if (dst < maxDst) {
                maxDst = dst
                object = shape
            }
        }

    }
    

    return {
        dst:maxDst,
        ob:object
    }
}
var marchShapes = new Array(),

    marchPointsMask = {}

function stepMarching(p, angle, steps) {

    let lc = getLargestCircle(p),
        dst = lc.dst

    let newP = rayCast(p.x, p.y, angle, dst),
        shapeTemp = Circle(p.x, p.y, dst)
    shapeTemp.color = "#696969"
    marchShapes.push(shapeTemp)

    

    steps -= 1

    let point = Circle(newP.x, newP.y, 0)
    let screenRect = Rect(canvas.width*0.5, canvas.height*0.5, canvas.width, canvas.height)

    let outSideCol = collisions.circleRect(point, screenRect)

    let minDst = 0.01

    if (dst > minDst && steps > 1 && (outSideCol.dst <= 0)) {
        return stepMarching(newP, angle, steps)
    } else {
        ctx.beginPath()

        var totDst = getDst(playerBall.pos.x, playerBall.pos.y, newP.x, newP.y)

            ctx.moveTo(playerBall.pos.x, playerBall.pos.y)
            ctx.lineTo(newP.x, newP.y)
            ctx.strokeStyle = "#000"
            //ctx.stroke()
        if (true) {

            ctx.globalAlpha = clamp(dst/1000, 0.7, 1)
            
            
    
            ctx.beginPath()

        
    
            ctx.arc(newP.x, newP.y, 2, 0, Math.PI*2)
    
            ctx.closePath()

            ctx.fillStyle = "#ffffff"
            ctx.fill()

            if (dst <= minDst) {
                if (marchPointsMask[lc.ob.id] == undefined) {
                    marchPointsMask[lc.ob.id] = new Array()
                }
                var mask = marchPointsMask[lc.ob.id]
                mask.push({x:newP.x, y:newP.y, angle:angle, dst:totDst})
                return newP

            }
            

            //renderShape(outSideCol.ob)

            
        }
        
        for (let i = 0; i < marchShapes.length; i++) {
            const shape = marchShapes[i];
            //renderShape(shape)
        }
    }

}
var start = undefined
function march(p, angle, steps) {
    
    marchShapes = new Array()

    start = p

    return stepMarching(p, angle, steps)

    


}
