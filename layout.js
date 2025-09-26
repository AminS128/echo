class Line {
    constructor(x1,y1,x2,y2){
        this.x1=x1
        this.y1=y1
        this.x2=x2
        this.y2=y2
    }
    
    intersectsLine(other){
        return this.intersects(other.x1, other.y1, other.x2, other.y2)
    }

    intersects(ox1, oy1, ox2, oy2){
        // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment

        let x1; let y1; let x2; let y2
        let x3; let y3; let x4; let y4

        // if(this.x1 > ox1 && this.x2 > ox2){
            x1 = this.x1; y1 = this.y1; x2 = this.x2; y2 = this.y2
            x3 = ox1; y3 = oy1; x4 = ox2; y4 = oy2
        // }else{
        //     x3 = this.x1; y3 = this.y1; x4 = this.x2; y4 = this.y2
        //     x1 = ox1; y1 = oy1; x2 = ox2; y2 = oy2
        // }

        return lines.intersects(x1,y1,x2,y2,x3,y3,x4,y4) ? true : lines.intersects(x3,y3,x4,y4,x1,y1,x2,y2)
    }
}

const lines = {
    list:[],
    create:function(amount){
        for(var i = 0; i < amount; i ++){
            this.list.push(
                new Line(Math.random()*c.width, 
                    Math.random()*c.height, 
                    Math.random()*c.width, 
                    Math.random()*c.height)
            )
        }
    },
    intersects (x1,y1,x2,y2,x3,y3,x4,y4){
        // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
        // t numerator
        let tnum = ((x1-x3)*(y3-y4))-((y1-y3)*(x3-x4))
        if(tnum > 0 && tnum < ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4))){
            // u numerator
            let unum = - ((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3))
            if(unum > 0 && unum < (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)){
                return true
            }
        }
        return 
    }
}