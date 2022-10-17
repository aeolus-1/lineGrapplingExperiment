function renderNetwork(ctx, nn, scale) {


    
    ctx.fillStyle = "#6667"

    var dim = scale

    var minSpace = 200


    //ctx.fillRect(0, 0, dim.x, dim.y)
    ctx.font = "10px Arial"
    

    function renderLayer(layer, x) {
        var inputs = layer.nodes,
            inptHeight = dim.y,
            inptSpace = Math.min((inptHeight*0.8)/inputs.length, minSpace)

        var y = (inptHeight-(inptSpace*inputs.length))/2


        for (let i = 0; i < inputs.length; i++) {
            var node = inputs[i],
                greyNum = 0.5*255

            ctx.strokeStyle = `rgb(${greyNum},${greyNum},${greyNum})`
            ctx.lineWidth = 5
            
            var val = percepatronF.activateNode(node.value)

            greyNum = 127.5+(val*255*0.5)
            ctx.fillStyle = `rgb(${greyNum},${greyNum},${greyNum})`

            ctx.beginPath()

            ctx.arc(x, y, Math.min(inptSpace*0.45, 20), 0, Math.PI*2)

            ctx.stroke()
            ctx.fill()

            ctx.closePath()
            


            
            y += inptSpace
            ctx.lineWidth = 1

            
        }
    }

    function renderConnections(layer1, layer2, x1, x2) {

        var x3 = x1
        x1 = x2
        x2 = x3

        var inputs = layer2.nodes,
        inptHeight = dim.y,
        inptSpace = Math.min((inptHeight*0.8)/inputs.length, minSpace)

        var y = (inptHeight-(inptSpace*inputs.length))/2

        for (let i = 0; i < inputs.length; i++) {
            var node = inputs[i];

            var pos1 = {x:x1, y:y}
            var inputs2 = layer1.nodes,
                inptHeight2 = dim.y,
                inptSpace2 = Math.min((inptHeight2*0.8)/inputs2.length, minSpace)

                var y2= (inptHeight2-(inptSpace2*inputs2.length))/2

            for (let j = 0; j < node.linksTo.length; j++) {
                var link = node.linksTo[j];

                ctx.strokeStyle = "#000"

                ctx.globalAlpha = bias(Math.abs(link.weight)/10, 0.6)
                
                ctx.beginPath()
                ctx.moveTo(pos1.x, y2)
                ctx.lineTo(x2, pos1.y)
                ctx.closePath()
                ctx.stroke()
                ctx.globalAlpha = 1
                
                y2 += inptSpace2
                
            }

            
            y += inptSpace
            
        }
    }

    var bounds = 0.075

    var split = (1-(bounds*2))/nn.layers.length

    renderLayer(nn.inputs, dim.x*bounds)
    for (let i = 0; i < nn.layers.length-1; i++) {
        const layer = nn.layers[i];
        renderLayer(layer, dim.x*(bounds+(split*(i+1))))
        renderConnections(layer, nn.layers[i+1], dim.x*(bounds+(split*(i+2))), dim.x*(bounds+(split*(i+1))))


    }

    renderLayer(nn.layers[nn.layers.length-1], dim.x*(1-bounds))



    renderConnections(nn.inputs, nn.layers[0], dim.x*(bounds+(split*(0+1))), dim.x*bounds)

    

    
}