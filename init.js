var targetLines = JSON.parse('[{"x1":297,"y1":1008,"x2":279,"y2":871,"startDst":0},{"x1":280,"y1":871,"x2":291,"y2":843,"startDst":138.1774221788784},{"x1":291,"y1":842,"x2":320,"y2":825,"startDst":168.26064009186103},{"x1":320,"y1":825,"x2":395,"y2":817,"startDst":201.87611271980427},{"x1":394,"y1":818,"x2":417,"y2":827,"startDst":277.3015726123366},{"x1":414,"y1":830,"x2":514,"y2":933,"startDst":301.99975068279355},{"x1":514,"y1":933,"x2":559,"y2":972,"startDst":445.55810118878117},{"x1":559,"y1":972,"x2":914,"y2":1081,"startDst":505.10640091261877},{"x1":914,"y1":1081,"x2":942,"y2":1077,"startDst":876.463372033399},{"x1":941,"y1":1077,"x2":957,"y2":1057,"startDst":904.7476432808609},{"x1":957,"y1":1057,"x2":1001,"y2":916,"startDst":930.3601402305923},{"x1":1001,"y1":916,"x2":998,"y2":892,"startDst":1078.06592887816},{"x1":998,"y1":892,"x2":847,"y2":616,"startDst":1102.2527021230558},{"x1":847,"y1":619,"x2":842,"y2":577,"startDst":1416.8588050517815},{"x1":842,"y1":578,"x2":878,"y2":425,"startDst":1459.1553770168946},{"x1":878,"y1":425,"x2":872,"y2":390,"startDst":1616.3336197860515},{"x1":872,"y1":390,"x2":842,"y2":194,"startDst":1651.844181595181},{"x1":841,"y1":194,"x2":846,"y2":161,"startDst":1850.1268081664466},{"x1":846,"y1":161,"x2":871,"y2":148,"startDst":1883.5034467030039},{"x1":871,"y1":149,"x2":1036,"y2":127,"startDst":1911.6814523102146},{"x1":1037,"y1":127,"x2":1059,"y2":141,"startDst":2078.1416577648515},{"x1":1059,"y1":141,"x2":1082,"y2":171,"startDst":2104.2184673856623},{"x1":1082,"y1":168,"x2":1280,"y2":578,"startDst":2142.020583728534},{"x1":1280,"y1":578,"x2":1338,"y2":743,"startDst":2597.3270739085006},{"x1":1338,"y1":744,"x2":1457,"y2":952,"startDst":2772.2241865204587},{"x1":1457,"y1":952,"x2":1482,"y2":969,"startDst":3011.859325846894},{"x1":1482,"y1":969,"x2":1521,"y2":985,"startDst":3042.091758762556},{"x1":1521,"y1":985,"x2":1943,"y2":1072,"startDst":3084.2462365792717},{"x1":1943,"y1":1072,"x2":1973,"y2":1086,"startDst":3515.120928340113},{"x1":1973,"y1":1086,"x2":1978,"y2":1110,"startDst":3548.226819054607},{"x1":1978,"y1":1111,"x2":2010,"y2":1174,"startDst":3572.7421203988697},{"x1":2009,"y1":1174,"x2":2019,"y2":1189,"startDst":3643.403283706588},{"x1":2019,"y1":1189,"x2":2032,"y2":1194,"startDst":3661.4310400839076},{"x1":2031,"y1":1195,"x2":2054,"y2":1199,"startDst":3675.359428361092},{"x1":2054,"y1":1199,"x2":2518,"y2":1246,"startDst":3698.7046634209496},{"x1":2518,"y1":1246,"x2":2541,"y2":1265,"startDst":4165.078976607257},{"x1":2541,"y1":1265,"x2":2557,"y2":1277,"startDst":4194.91184438761},{"x1":2557,"y1":1277,"x2":2547,"y2":1293,"startDst":4214.91184438761},{"x1":2547,"y1":1293,"x2":1894,"y2":1545,"startDst":4233.7798066517225},{"x1":1894,"y1":1545,"x2":1801,"y2":1556,"startDst":4933.717661035953},{"x1":1801,"y1":1556,"x2":580,"y2":1408,"startDst":5027.365939183498},{"x1":580,"y1":1408,"x2":560,"y2":1390,"startDst":6257.302929439503},{"x1":560,"y1":1389,"x2":464,"y2":1302,"startDst":6284.2101775336505},{"x1":464,"y1":1301,"x2":440,"y2":1272,"startDst":6413.767114823786},{"x1":440,"y1":1272,"x2":326,"y2":1187,"startDst":6451.410175273223},{"x1":326,"y1":1187,"x2":307,"y2":1155,"startDst":6593.6107378600145},{"x1":307,"y1":1155,"x2":296,"y2":996,"startDst":6630.826325991871}]')

function straightLinePoint(point, line) {
    if (point.y > line.p2.y) {
        return v(line.p2.x, line.p2.y)
    } else if (point.y < line.p1.y) {
        return v(line.p1.x, line.p1.y)
    } else {
        return v(line.p1.x, point.y)
    }
    
}

function linePoint(point, line) {

    var lineAngle = -getAngle(line.p1, line.p2)+180,


        newLine = {p1:line.p1, p2:rotate(line.p1.x, line.p1.y, line.p2.x, line.p2.y, lineAngle)},
        newPoint = rotate(line.p1.x, line.p1.y, point.x, point.y, lineAngle)

    var point = straightLinePoint(newPoint, newLine)

        rotatedPoint = rotate(line.p1.x, line.p1.y, point.x, point.y, -lineAngle)

    return rotatedPoint
}




var canvas = document.getElementById("c"),
    ctx = canvas.getContext("2d")


canvas.width = window.innerWidth
canvas.height = window.innerHeight

var deathRange = -250

var lines = data,
    targets = checkpoints


var cars = new Array(),
    carNum = 1,
    player = new Car()

player.controlled = true

for (let i = 0; i < carNum; i++) {
    var car = new Car()
    car.nn.mutate(10)
    cars.push(car)
}

var generationTimeStamp = new Date().getTime()

var mainCar = cars[0]

    

var selectedCar = null

function renderLines() {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = "#000"
        ctx.stroke()
        ctx.closePath()
        
    }
    for (let i = 0; i < targetLines.length; i++) {
        const line = targetLines[i];
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = "#0f0"
        ctx.stroke()
        ctx.closePath()
        
    }
}

function getBestCar() {
    var bestCar = {car:null, score:-Infinity}
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        var score = getCarScore(car)
        if (bestCar.score < score) {
            bestCar = {car:car, score:score}
        }
    }
    return bestCar.car
}
var learningRate = 0.6
function resetGeneration(parentCar) {

    learningRate =
        Math.min(0.1/Math.max((getCarScore(parentCar)/6692), 0), 5)
    
    console.log("learnignRate", learningRate)

    deathRange = -200
    cars = new Array()

    for (let i = 0; i < carNum-1; i++) {

        var newCar = new Car(), 
            carNN = NerualNetwork.clone(parentCar.nn)

        
        carNN.mutate(learningRate*(bias(Math.random(), 0.7)+0.98))
        
        newCar.nn = carNN


            

        



        cars.push(newCar)
    }
    var newCar = new Car()
    newCar.nn = NerualNetwork.clone(parentCar.nn)
    cars.push(newCar)


            

        





    console.log("reset Generation")

    generationTimeStamp = new Date().getTime()
}
var timeLimit = Infinity
function renderLoop() {
    canvas.width = canvas.width

    ctx.save()


    var bestCar = getBestCar()

    mainCar = bestCar
    mainCar.selected = true
    selectedCar = mainCar

    ctx.fillText(( new Date().getTime())-mainCar.timeStart, 50, 50)
    ctx.fillText(((getCarScore(mainCar))/(((new Date().getTime())-mainCar.timeStart)/100)), 50, 70)

    ctx.translate(0, 0)

    var aliveCount = 0

    deathRange+=2.5
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        if (getCarScore(car) < deathRange) {
            car.alive = false
        }
        
        if (car.alive) {
            car.update()
            car.getTargetScore()

            aliveCount += 1
            
            car.draw(ctx)

        } else {
            if (getCarScore(car) == getCarScore(selectedCar)) {
                car.draw(ctx)
            }
        }



    }
    player.update()
    player.draw(ctx)
    var generationTime = new Date().getTime()-generationTimeStamp
    if (aliveCount<=0 || generationTime>timeLimit) {
        resetGeneration(selectedCar || bestCar)
    }



    renderLines()



    ctx.restore()

    ctx.font = "50px Arial"
    ctx.fillText(`Highest Score: ${Math.round((getCarScore(selectedCar)/6692)*10000)/100}`, 50, 700)
    ctx.fillText(`Cars: ${aliveCount}`, 50, 750)

    renderNetwork(ctx, mainCar.nn, v(600, 600))

    requestAnimationFrame(renderLoop)

    player.getTargetScore()
}

renderLoop()


lines[22].y2 -= 50
lines[23].y1 -= 50
lines[1].y2 += 30
lines[2].y1 += 30
lines[2].y2 += 30
lines[3].y1 += 30