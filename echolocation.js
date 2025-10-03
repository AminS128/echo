class Echolocator {

    static speedOfSound = 5
    static micDistance = 30

    static micL
    static micR

    static x
    static y

    static bufferL = []
    static bufferR = []

    static getAngles(differences){
        // accepts output from Microphone.getDifferences()
        // returns a list of lists
        // each item: [angle (+ only), distance]
        // distance in px
        let output = []

        if(differences.length < 2){return}

        // let tZero = differences[0][0] // temp: assumes that the first difference, normally coming from initial burst, is t=0
        // this is for any dataset with one burst at some point in the data, and all of its echos
        let tZero = 0


        for(var i = 1; i < differences.length; i ++){
            let dt = differences[i][1]
            let a = 0.5 * dt * this.speedOfSound
            let c = this.micDistance/2
            let b = Math.sqrt(c*c - a*a)
            
            let angle = 1.57079 // pi/2
            if(dt < 0){
                angle = Math.atan(b/a)
            }else if(dt > 0){
                angle = 3.1415 - Math.atan(b/a)// pi - atan(b/a)
            }

            output.push([(differences[i][0]-tZero)*0.5, angle])
        }

        return output

    }

    static createBurst(x, y, amount){
        let angle = Math.random()
        for(var i = 0; i < amount ; i++){
            particles.list.push(new Particle(
                x, 
                y, 
                this.speedOfSound*Math.cos(angle), 
                this.speedOfSound*Math.sin(angle)
            ))
            angle+=6.28/amount
        }
    }


    static ec = document.getElementById('echo-canvas')
    static ectx = this.ec.getContext('2d')

    static clearVis(){

        this.ectx.transform(this.ec.width/512, 0, 0, this.ec.height/512, 0, 0)

        this.ectx.fillStyle="#000000"
        this.ectx.fillRect(0, 0, 512, 512)
    }

    static visualize(x, y, angle){
        // angle is an item from Echolocator.getAngle()

        if(Math.random()<0.01){
            this.ectx.fillStyle="#00000005"
            this.ectx.fillRect(0,0,512,512)
        }

        this.drawPerpRay(x, y, angle[1], angle[0])
        this.drawPerpRay(x, y, -angle[1], angle[0])

    }
    static drawSurface(x, y, angle, transparency = 255){
        transparency=Math.trunc(transparency)
        this.ectx.strokeStyle = "#ffffff" + (transparency < 16 ? "0" : "") + transparency.toString(16)
        this.ectx.beginPath()
        const d = 15
        this.ectx.moveTo(x - -d*Math.sin(angle), y - d*Math.cos(angle))
        this.ectx.lineTo(x + -d*Math.sin(angle), y + d*Math.cos(angle))
        this.ectx.stroke()
    }

    static drawPerpRay(x, y, angle, distance){
        this.ectx.strokeStyle = "#ffffff11"

        this.ectx.beginPath()
        this.ectx.moveTo(x, y)

        let nx = x + this.speedOfSound*distance*Math.cos(angle)
        let ny = y + this.speedOfSound*distance*Math.sin(angle)
        
        this.ectx.lineTo(nx, ny)
        this.ectx.stroke()


        this.ectx.strokeStyle = "#ffffff"
        this.ectx.beginPath()
        const d = 15
        this.ectx.moveTo(nx - -d*Math.sin(angle), ny - d*Math.cos(angle))
        this.ectx.lineTo(nx + -d*Math.sin(angle), ny + d*Math.cos(angle))
        this.ectx.stroke()

    }

    static timer = null

    static echolocate(){
        // clearTimeout(this.timer)
        this.createBurst(this.x, this.y, 512)

        this.micL.x = this.x - this.micDistance/2
        this.micL.y = this.y
        this.micR.x = this.x + this.micDistance/2
        this.micR.y = this.y
        this.bufferL = []
        this.bufferR = []
        for(var i = 0; i < 256; i ++){
            Echolocator.echolocateFrame()
        }
        Echolocator.echolocateEnd()
    }
    static echolocateFrame(){
        particles.iterate()
        let L = this.micL.check()
        let R = this.micR.check()
        // console.log(L)
        this.bufferL.push(L)
        this.bufferR.push(R)
        micgraph.plot(L)
        micgraph2.plot(R)
        // if(micgraph.isFull() || micgraph2.isFull()){
        //     Echolocator.echolocateEnd()
        // }
    }
    static echolocateEnd(){

        particles.clear()

        // clearTimeout(this.timer)

        let angles = this.getAngles(Microphone.getDifferences(micgraph.data, micgraph2.data))
        if(!angles){return}


        for(var i = 0; i < angles.length; i ++){
            // this.visualize(mx, my, angles[i])
            this.pings.push([
                this.x + this.speedOfSound*angles[i][0]*Math.cos(angles[i][1]),
                this.y + this.speedOfSound*angles[i][0]*Math.sin(angles[i][1]),
                angles[i][1],
                1
            ])
            this.pings.push([
                this.x + this.speedOfSound*angles[i][0]*Math.cos(-angles[i][1]),
                this.y + this.speedOfSound*angles[i][0]*Math.sin(-angles[i][1]),
                -angles[i][1],
                1
            ])
        }

        this.updatePings()
    }

    // stores all the hits
    // list of lists: form
    // [ping x, ping y, angle (perpendicular to when sound was cast), relevance]
    // relevance is a score for whether it is real
    static pings = []
    static maxPings = 1024
    static updatePings(){
        if(this.pings.length > this.maxPings){
            this.pings.splice(0, this.pings.length - this.maxPings)
        }
        for(var i = 0; i < this.pings.length; i ++){
            if(this.pings[i][3] < 0.2){
                this.pings.splice(i, 1)
                i--
                continue
            }

            let corroborated = 0

            for(var ii = 0; ii < this.pings.length; ii ++){
                if(i == ii){continue}
                if(Math.abs(this.pings[i][0] - this.pings[ii][0]) + Math.abs(this.pings[i][1] - this.pings[ii][1]) < 50){
                    if(Raycast.getDistance(this.pings[ii], this.pings[i]) < 15){
                        if(Math.abs(this.pings[i][2] - this.pings[ii][2]) < 0.5){// angle similarity
                            // doesnt account for 3.14 = -3.14 radians (boo hoo hoo)
                            corroborated++
                        }
                    }
                }
            }
            this.pings[i][3] *= corroborated > 2 ? 0.998 : 0.95
        }

        this.clearVis()
        for(var i = 0; i < this.pings.length; i ++){
            // console.log(this.pings[i])
            Echolocator.drawSurface(this.pings[i][0], this.pings[i][1], this.pings[i][2], this.pings[i][3]*255)
        }
    }

}