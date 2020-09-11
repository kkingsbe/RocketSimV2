import Rocket from './rocket.js'

class Simulation {
    constructor(rocket, timeStep, airDensity) {
        this.rocket = rocket
        this.timeStep = timeStep
        this.airDensity = airDensity
    }

    async run() {
        return new Promise((resolve, reject) => {
            console.log("Starting sim!")

            let startTime = Date.now()
            do {
                this.rocket.tick(this.timeStep)
            } while (this.rocket.altitude > 0.0 || this.rocket.deltaT <= 5)
            let endTime = Date.now()

            console.log("Simulation finished!")
            resolve()
        })
    }
    
    printData() {
        let maxAlt = this.getMax(this.rocket.altitudeOverTime)
        let maxV = this.getMax(this.rocket.velocityOverTime)
        let maxA = this.getMax(this.rocket.accelerationOverTime)
        let maxT = this.getMax(this.rocket.thrustOverTime)
        let maxD = this.getMax(this.rocket.dragOverTime)

        console.log("Max Altitude: " + maxAlt.y);
        console.log("Max Velocity: " + maxV.y);
        console.log("Max Acceleration: " + maxA.y);
        console.log("Max Thrust: " + maxT.y);
        console.log("Max Drag: " + maxD.y);

        console.log(this.rocket)
    }

    getMax(data) {
        let max = {
            x: 0,
            y: 0
        }

        for(let i = 0; i < data.length; i++) {
            let point = data[i]
            let x = point.x
            let y = point.y

            if(y > max.y) {
                max.x = x
                max.y = y
            }
        }
        
        return max
    }
}

export default Simulation