class Particle{
    constructor(x, y, vx, vy){
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.life = 255
    }
    static hitDecay = 150
    iterate(){
        this.life-=Math.random()*2
        this.x += this.vx;
        this.y += this.vy;
        if(this.x < 0 || this.x > c.width){
            this.vx *= -1
            this.life-=Math.random()*Particle.hitDecay
        }
        if(this.y < 0 || this.y > c.height){
            this.vy *= -1
            this.life-=Math.random()*Particle.hitDecay
        }

        // if hits wall
        for(var i = 0; i < lines.list.length; i ++){
            if(lines.list[i].intersects(this.x, this.y, this.x + this.vx, this.y + this.vy)){
                // this.vx*=-1
                // this.vy*=-1
                // reflect about normal line
                // <=> multiplying by matrix cos2theta, sin2theta / sin2theta, -cos2theta
                let theta = Math.atan2(lines.list[i].y2-lines.list[i].y1, lines.list[i].x2-lines.list[i].x1)
                let cos2theta = Math.cos(2*theta)
                let sin2theta = Math.sin(2*theta)
                let nvx = this.vx * cos2theta + this.vy * sin2theta
                let nvy = this.vx * sin2theta + this.vy *-cos2theta
                this.vx = nvx
                this.vy = nvy
                this.life-=Math.random()*Particle.hitDecay
            }
        }
        if(this.life < 0){
            particles.list.splice(particles.list.indexOf(this), 1)
        }
    }
    render(){
        ctx.fillStyle="#000000" + (this.life < 16 ? "0":"") + Math.trunc(this.life).toString(16)
        ctx.fillRect(this.x-2, this.y-2, 4, 4)
    }
}

const particles = {
    list:[],
    create:function(amount){
        for(var i = 0; i < amount ; i++){
            this.list.push(new Particle(
                Math.random()*c.width, 
                Math.random()*c.height, 
                5*(Math.random()-0.5), 
                5*(Math.random()-0.5)))
        }
    },
    iterate:function(){
        this.list.forEach((v)=>{v.iterate()})
    },
    createBurst:function(x, y, amount){
        let angle = Math.random()
        for(var i = 0; i < amount ; i++){
            this.list.push(new Particle(
                x, 
                y, 
                5*Math.cos(angle), 
                5*Math.sin(angle)
            ))
            angle+=6.28/amount
        }
    }
}