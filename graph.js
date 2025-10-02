class Graph {
    constructor(ele, flipped = false){
        this.ele = ele
        this.ctx = ele.getContext('2d')
        this.draw = 0
        this.drawWidth = 1
        this.clear()
        this.flipped = flipped

        this.data = []
    }

    clear(){
        this.ctx.fillStyle="#000000"
        this.ctx.fillRect(0, 0, this.ele.width, this.ele.height)
        this.data = []
        this.draw = 0
    }

    plot(value){
        this.ctx.fillStyle="#ffffff"
        value*=5
        value+=1
        if(this.flipped){
            this.ctx.fillRect(this.draw, value, this.drawWidth, -value)
        }else{
            this.ctx.fillRect(this.draw, this.ele.height-value, this.drawWidth, value)
        }
        this.draw+=this.drawWidth

        this.data.push(value)

        // if(this.ele.width < this.draw){this.draw=0;this.clear()} // no auto reset
    }

    isFull(){
        return this.ele.width < this.draw
    }

    drawData(input){// draw array of values
        this.clear()
        input.forEach((v)=>{this.plot(v)})
    }

    draw2ndDer(){
        this.drawData(Graph.secondDerivative(this.data))
    }

    static derivative(input){
        let output = []
        for(var i = 1; i < input.length; i ++){
            output.push(input[i]-input[i-1])
        }
        return output
    }

    static secondDerivative(input){
        return Graph.derivative(Graph.derivative(input))
    }

    static getPeaks(input){

        // let d = Graph.derivative(input)
        // let sd = Graph.derivative(d)

        let peaks = []

        // for(var i = 1; i < d.length; i ++){
        //     if(d[i] * d[i-1] < 0){// if exactly one is negative
        //         if(sd[i] < 3){peaks.push(i)}
        //     }
        // }

        let sum = 0
        for(var i = 0; i < input.length; i ++){
            sum+=input[i]
        }
        let avg = sum/input.length
        for(var i = 0; i < input.length; i ++){
            if(input[i] > avg){peaks.push(i)}
        }

        if(peaks.length > 0){

        let probe = 1
        let last = peaks[0]
        while(probe < peaks.length){
            // console.log(peaks, last)
            if(peaks[probe] == last + 1){
                // remove
                peaks.splice(probe, 1)
                last++
            }else{
                last = peaks[probe]
                probe++
            }
        }

        return peaks

        }else{return []}

    }

}