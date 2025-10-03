class Raycast {
    static getDistance(ping, ping2){

        // this is not a true distance but rather an approximation

        // ping is a ping from Echolocator.pings

        if(ping[2] == 0){// angle 0 special case
            return Math.abs(ping2[1]-ping[1])
        }

        return Math.abs((ping2[0] - ping[0]) - (ping2[1] - ping[1])/Math.atan(ping[2]))
    }
}