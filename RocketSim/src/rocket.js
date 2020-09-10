class Rocket {
    constructor(options) {
        //Unload the settings from the options object
        this.dryMass            = options.dryMass / 1000
        this.propMass           = options.propMass
        this.airDensity         = options.airDensity
        this.noseConeType       = options.noseConeType
        this.fuselageDiameter   = options.fuselageDiameter / 1000
        this.crossSectionalArea = Math.PI * (this.fuselageDiameter / 2) ** 2
        this.numFins            = options.numFins
        this.finLength          = options.finLength / 1000
        this.finWidth           = options.finWidth / 1000

        //Create a thrust object with the desired thrust curve
        this.thrust             = new this.thrust(thrustCurve)

        //Set the initial value of the variables
        this.accelerationOverTime = []
        this.velocityOverTime     = []
        this.altitudeOverTime     = []
        this.dragOverTime         = []
        this.thrustOverTime       = []
        this.thrustForce          = 0
        this.acceleration         = 0
        this.elapsedTime          = 0
        this.altitude             = 0
        this.velocity             = 0
    }

    calculateAcceleration(force) {
        return((force / (this.dryMass + this.propMass)) - 9.81)
    }

    calculateAndPushAcceleration(force) {
        this.acceleration = this.calculateAcceleration(force)
        if (this.altiude <= 0 && this.acceleration < 0) this.acceleration = 0.0
        let point = {
            x: this.elapsedTime,
            y: this.acceleration
        }
        this.accelerationOverTime.push(point)
        return this.acceleration
    }

    calculateDrag() {
        let noseDragCoefficient = this.noseConeToDragCoefficient()
        let noseDrag = 0.5 * this.airDensity * this.velocity**2 * noseDragCoeficent * this.crossSectionalArea
        let finDrag = (0.5 * this.airDensity * this.velocity**2 * 0.21 * this.finLength * this.finWidth) * this.numFins
        
        //Add up the nose and fin drag magnitudes to get the net force of drag
        let Fd = noseDrag + finDrag
        
        //Flip the magnitude of the drag if the rocket is moving downwards
        if(this.velocity > 0) return -1 * Fd
        else return Fd
    }

    noseConeToDragCoefficient() {
        switch (this.noseConeType)
        {
            case 1:
                return 0.05
                break
            case 2:
                return 0.01
                break
            case 3:
                return 0.2
                break
            default:
                return 0
                break
        }
    }

    tick(deltaT) {
        //Calculate the drag acting on the rocket
        let Df = this.calculateDrag()

        //Calculate the acceleration
        let Da = Df / (this.dryMass + this.propMass)
        
        //Get new state of rocket
        this.thrustForce = this.thrust.getThrust(this.elapsedTime)
        this.acceleration = this.calculateAcceleration(this.thrustForce) + (Df / (this.propMass + this.dryMass))
        this.elapsedTime += deltaT
        this.altitude += deltaT * (this.velocity + deltaT * this.acceleration / 2)
        this.velocity += deltaT * this.acceleration

        //Prevent rocket from going underground
        if(this.altitude < 0) {
            this.altitude = 0
            this.velocity = 0
        }

        let a = {
            x: this.elapsedTime,
            y: this.acceleration
        }
        let v = {
            x: this.elapsedTime,
            y: this.velocity
        }
        let alt = {
            x: this.elapsedTime,
            y: this.altitude
        }
        let d = {
            x: this.elapsedTime,
            y: Df
        }
        let t = {
            x: this.elapsedTime,
            y: this.thrustForce
        }

        this.accelerationOverTime.push(a)
        this.velocityOverTime.push(v)
        this.altitudeOverTime.push(alt)
        this.dragOverTime.push(d)
        this.thrustOverTime.push(t)
    }
}