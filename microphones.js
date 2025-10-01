class Microphone {
    constructor(x, y){

        this.x = x
        this.y = y
        this.r = 10

    }

    display(ctx){
        ctx.fillStyle="#000000aa"
        ctx.fillRect(this.x-this.r, this.y-this.r, this.r*2, this.r*2)
    }

    check(){
        var sum = 0
        particles.list.forEach((v)=>{
            if((v.x-this.x)*(v.x-this.x) + (v.y-this.y)*(v.y-this.y) < this.r*this.r){
                sum+=v.life*0.01 + 1
            }
        })
        return sum
    }

    static getDifferences(inputL, inputR){
        // returns list of list
        // each item: [delay, relative delay] where delay is delay from start and relative delay is delay between l and r (can be negative)
        
        
        let pL = Graph.getPeaks(inputL)
        let pR = Graph.getPeaks(inputR)
        const maxDelay = 10 // nothing beyond this is as yet possible anyway

        // if there is an unmatched peak, then just ignore it for now

        let output = []

        while(pL.length > 0 && pR.length > 0){
            if(pL[0] < pR[0]){// left was before
                if(pR[0] - pL[0] > maxDelay){// no match
                    pL.splice(0,1)
                }else{
                    output.push([pL[0], pR[0] - pL[0]])
                    pL.splice(0,1)
                    pR.splice(0,1)
                }
            }else{// right was before
                if(pL[0] - pR[0] > maxDelay){// no match
                    pR.splice(0,1)
                }else{
                    output.push([pR[0], pR[0] - pL[0]])
                    pL.splice(0,1)
                    pR.splice(0,1)
                }
            }
        }

        return output
    }
}