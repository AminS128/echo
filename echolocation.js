class Echolocator {

    static speedOfSound = 5
    static micDistance = 30

    static getAngles(differences){
        // accepts output from Microphone.getDifferences()
        // returns a list of lists
        // each item: [angle (+ only), distance]
        // distance in px
        let output = []

        if(differences.length < 2){return}

        let tZero = differences[0][0] // temp: assumes that the first difference, normally coming from initial burst, is t=0
        // this is for any dataset with one burst at some point in the data, and all of its echos

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

            output.push([(differences[i][0]-tZero)/2, angle])
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
        this.ectx.fillStyle="#000000"
        this.ectx.fillRect(0, 0, 512, 512)
    }

    static visualize(x, y, angle){
        // angle is an item from Echolocator.getAngle()

        this.drawPerpRay(x, y, angle[1], angle[0])
        this.drawPerpRay(x, y, -angle[1], angle[0])

    }
    static drawPerpRay(x, y, angle, distance){
        this.ectx.strokeStyle = "#222222"

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
        this.createBurst(mx, my, 512)
        micgraph.clear()
        micgraph2.clear()
        for(var i = 0; i < 256; i ++){
            Echolocator.echolocateFrame()
        }
        Echolocator.echolocateEnd()
    }
    static echolocateFrame(){
        particles.iterate()
        micgraph.plot(micl.check())
        micgraph2.plot(micr.check())
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
            this.visualize(mx, my, angles[i])
        }
    }
}