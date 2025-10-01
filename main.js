const c = document.getElementById('main-canvas')
const ctx = c.getContext('2d')

c.width = 512; c.clientWidth = 512
c.height = 512; c.clientHeight = 512

const canvas = {
    clear:function(){
        ctx.fillStyle="#ffffff"
        ctx.fillRect(0, 0, c.width, c.height)
    },
    render:function(){

        this.clear()

        ctx.fillStyle="#000000"
        for(var i = 0; i < lines.list.length; i ++){
            ctx.beginPath()
            // ctx.fillRect(lines.list[i].x1, lines.list[i].y1, 4, 4)
            ctx.moveTo(lines.list[i].x1, lines.list[i].y1)
            ctx.lineTo(lines.list[i].x2, lines.list[i].y2)

            ctx.strokeStyle="#000000"

            // for(var ii = 0; ii < lines.list.length; ii ++){// intersection checker
            //     if(i == ii){continue}
            //     if(lines.list[i].intersectsLine(lines.list[ii])){
            //         ctx.strokeStyle="#ff0000"
            //         break
            //     }
            // }

            ctx.stroke()
        }

        particles.list.forEach((v)=>{
            v.render()
        })

        // ctx.stroke()
    }
}

lines.create(2)

c.addEventListener('mousedown', (e)=>{
    // console.log(e)
    particles.createBurst(e.offsetX, e.offsetY, 512)
})
let mx = 0
let my = 0
c.addEventListener('mousemove', (e)=>{
    mx = e.offsetX
    my = e.offsetY
})
// particles.createBurst(200, 200, 100)
canvas.render()

document.addEventListener('keydown', ()=>{// get peaks
    console.log(Microphone.getDifferences(micgraph.data, micgraph2.data))
    // micgraph.data.forEach((v,i)=>{if(v!=1){console.log(i)}})
    // console.log(micgraph.data)
})

const micl = new Microphone(mx, my)
const micr = new Microphone(mx, my)
const micgraph = new Graph(document.getElementById('mic-canvas'))
const micgraph2 = new Graph(document.getElementById('mic-canvas2'), true)

const timer = setInterval(()=>{
    particles.iterate()
    canvas.render()
    micl.x = mx - 20
    micl.y = my
    micr.x = mx + 20
    micr.y = my
    micl.display(ctx)
    micr.display(ctx)
    micgraph.plot(micl.check())
    micgraph2.plot(micr.check())
}, 30)

// const timer2 = setInterval(()=>{
//     if(mx ==0){return}
//     particles.createBurst(mx, my, 800)
// }, 1000)