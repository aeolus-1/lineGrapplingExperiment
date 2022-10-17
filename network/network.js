function roundByNumber(number, count) {
    return Math.floor(number*Math.pow(10, count))/Math.pow(10, count)
}



function objectArray(callback, length) {
    var ar = new Array(length)
    for (let i = 0; i < ar.length; i++) {
        var ob = ar[i];
        ob = callback(i)
    }

    return ar
}

var layerF = {
    linkLayer(self, layer) {
        for (let i1 = 0; i1 < self.nodes.length; i1++) {
            var percepatron1 = self.nodes[i1];
            for (let i2 = 0; i2 < layer.nodes.length; i2++) {
                var percepatron2 = layer.nodes[i2];
                percepatronF.formLink(percepatron1, percepatron2)
            }
        }
    },
    randomize(self) {
        for (let i = 0; i < self.nodes.length; i++) {
            const node = self.nodes[i];
            node.value = (Math.random()*2)-1
        }
    }
},
percepatronF = {
    formLink(self, percepatron) {
        //console.log("linking", percepatron.number, "to", this.number)

        var weight = 0//(Math.random()*2)-1

        var link = new Link(self, weight)

        //this.linksFrom.push(link)
        percepatron.linksTo.push(link)

    },
    init(self, nextLayer) {
        for (let i = 0; i < nextLayer.length; i++) {
            var nextPercepatron = nextLayer[i];
            percepatronF.formLink(nextPercepatron, self)
        }
    },
    solve(self) {
        var value = 0
        for (let i = 0; i < self.linksTo.length; i++) {
            var link = self.linksTo[i],
                percepValue = link.p.value * link.weight

            value += percepValue
            
        }
        self.value = percepatronF.activateNode((value / self.linksTo.length)*self.weight)

    },
    activateNode(input) {
        return input
    }
}




class Layer {
    constructor(length) {
        this.nodes = new Array(length)
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i] = new Percepatron(i)
        }
    }
    
}

class Link {
    constructor(p, weight=0) {
        this.p = p
        this.weight = weight
    }
}

class Percepatron {
    constructor(number) {
        this.linksTo = []
        this.number = number

        this.weight = 1

        this.value = 0
    }
    
}




class NerualNetwork {
    constructor(options) {
        options = {
            inputs:5,
            hiddenLayers:[],
            outputs:2,


            ...options,
        }
        this.id = Math.random()
        this.options = options

        this.inputs = new Layer(options.inputs)
        layerF.randomize(this.inputs)

        this.layers = new Array()

        this.outputs = new Layer(options.outputs)

        var nextLayer = this.outputs

        for (let i = options.hiddenLayers.length-1; i >= 0; i--) {
            var layerCount = options.hiddenLayers[i],
                layer = new Layer(layerCount)


            this.layers.push(layer)
            
            nextLayer = layer
        }

        this.layers.push(this.outputs)


        for (let i = 0; i < this.layers.length-1; i++) {
            const layer = this.layers[i];
            layerF.linkLayer(layer, this.layers[i+1])

        }


        layerF.linkLayer(this.inputs, (options.hiddenLayers.length) ? this.layers[0] : this.outputs )
    }

    

    solve() {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            for (let j = 0; j < layer.nodes.length; j++) {
                const node = layer.nodes[j];
                percepatronF.solve(node)
            }
        }
        
    }
    mutate(strength) {
        function mutateLayer(strength, layer) {
            for (let i = 0; i < layer.nodes.length; i++) {
                var node = layer.nodes[i];

                node.weight += (((Math.random()*2)-1)*1)*strength

                for (let j = 0; j < node.linksTo.length; j++) {
                    

                    //console.log((((Math.random()*2)-1)*1)*strength)
                    var rand = bias(Math.random(), 0.3)
                    layer.nodes[i].linksTo[j].weight += (((Math.random()*2)-1)*1)*strength

                }
                
            }
            


        } 
        mutateLayer(strength, this.inputs)

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            mutateLayer(strength, layer)

        }

        this.solve()
        
        
    }

    setInputs(inputs) {
        for (let i = 0; i < this.inputs.nodes.length; i++) {
            var input = this.inputs.nodes[i];
            input.value = inputs[i]
        }
    }
    getOutputs() {
        var ra = []
        for (let i = 0; i < this.outputs.nodes.length; i++) {
            const output = this.outputs.nodes[i];
            ra.push(output.value)
        }
        return ra
    }

    static clone(replace) {
        var stri = JSON.parse(JSON.stringify(replace)),
            newNN = new NerualNetwork(stri.options)

        for (let k = 0; k < stri.layers.length; k++) {
            const layer = stri.layers[k];
            for (let i = 0; i < layer.nodes.length; i++) {
                const node = layer.nodes[i];
                newNN.layers[k].nodes[i].weight = node.weight
                for (let j = 0; j < node.linksTo.length; j++) {
                    const link = node.linksTo[j];
                    newNN.layers[k].nodes[i].linksTo[j].weight = link.weight
                }
            }
        }
        
        


        return newNN

    
    }
}