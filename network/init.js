var nn = new NerualNetwork({
    inputs:6,
    hiddenLayers:[
        8,


        


    ],
    outputs:3,
})


var canvas = document.getElementById("c"),
    ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight


renderNetwork(ctx, nn)