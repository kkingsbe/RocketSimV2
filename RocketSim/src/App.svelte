<script>
	export let name
	import 'chart.js'

	//Couldn't figure out the best way to import these files, so I just put everything into one file... Bad coding, I know
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
			let maxAlt = this.getMax(rocket.altitudeOverTime)
			let maxV = this.getMax(rocket.velocityOverTime)
			let maxA = this.getMax(rocket.accelerationOverTime)
			let maxT = this.getMax(rocket.thrustOverTime)
			let maxD = this.getMax(rocket.dragOverTime)

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
			this.thrust             = new Thrust(options.thrustCurve)

			//Set the initial value of the variables
			this.accelerationOverTime = []
			this.velocityOverTime     = []
			this.altitudeOverTime     = []
			this.dragOverTime         = []
			this.thrustOverTime       = []
			this.thrustForce          = 0
			this.acceleration         = 0
			this.elapsedTime          = 0
			this.altitude             = 0.1
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
			let noseDrag = 0.5 * this.airDensity * this.velocity**2 * noseDragCoefficient * this.crossSectionalArea
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
				console.log("Terminating sim. Rocket went underground.")
				console.log(this.altitude)
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

	class Thrust {
		constructor (name) {
			this.thrustData = thrustCurves[name]
		}

		linearlyInterpolate(x1, x2, x3, y1, y3) {
			return (((x2 - x1) * (y3 - y1)) / (x3 - x1)) + y1
		}

		getThrust(t) {
			let t0 = 0, t1 = 1, a0 = 0, a1 = 0
			for(let i = 0; i < this.thrustData.length; i++) {
				let point = this.thrustData[i]
				
				if(point.x == t) {
					return point.y
				}

				if(point.x < t) {
					t0 = point.x
					a0 = point.y

				}

				else if(point.x > t) {
					t1 = point.x
					a1 = point.y
					break
				}

				if(t1 == 0 && a1 == 0) {
					return 0
				}
			}
			return this.linearlyInterpolate(t0, t, t1, a0, a1)
		}
	}

	const thrustCurves = {
		default:
		[
			{"x": 0.052,"y": 5.045},
			{"x": 0.096,"y": 9.910},
			{"x": 0.196,"y": 24.144},
			{"x": 0.251,"y": 31.351},
			{"x": 0.287,"y": 32.973},
			{"x": 0.300,"y": 29.910},
			{"x": 0.344,"y": 17.117},
			{"x": 0.370,"y": 14.414},
			{"x": 0.400,"y": 12.973},
			{"x": 0.500,"y": 11.712},
			{"x": 0.600,"y": 11.171},
			{"x": 0.700,"y": 10.631},
			{"x": 0.800,"y": 10.09},
			{"x": 0.900,"y": 9.73},
			{"x": 1.000,"y": 9.55},
			{"x": 1.101,"y": 9.91},
			{"x": 1.200,"y": 9.55},
			{"x": 1.300,"y": 9.73},
			{"x": 1.400,"y": 9.73},
			{"x": 1.500,"y": 9.73},
			{"x": 1.600,"y": 9.73},
			{"x": 1.700,"y": 9.55},
			{"x": 1.800,"y": 9.73},
			{"x": 1.900,"y": 9.73},
			{"x": 2.000,"y": 9.55},
			{"x": 2.100,"y": 9.55},
			{"x": 2.200,"y": 9.73},
			{"x": 2.300,"y": 9.19},
			{"x": 2.375,"y": 9.37},
			{"x": 2.400,"y": 5.95},
			{"x": 2.440,"y": 0.0},
		]
	}

	//Turns an array of objects into an array of the value of the given property of those objects
	function extract(arr, prop) {
		let newArr = []
		arr.forEach(item => {
			newArr.push(item[prop])
		})
		return newArr
	}

	var rocket
	async function runSim() {
		rocket = new Rocket({
			dryMass: 150.3,
			propMass: 0.0359,
			thrustCurve: "default",
			airDensity: 1.225,
			noseConeType: 1,
			fuselageDiameter: 76,
			numFins: 4,
			finLength: 30,
			finWidth: 50
		})
		let simulation = new Simulation(rocket, 0.01, 1.225)
		await simulation.run()
		simulation.printData()

		graphData(rocket)
	}

	function graphData(rocket) {
		var altCanvas = document.getElementById("altChart")
		var vCanvas = document.getElementById("vChart")
		var aCanvas = document.getElementById("aChart")
		var dCanvas = document.getElementById("dChart")
		var tCanvas = document.getElementById("tChart")

		var altChart = new Chart(altCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.altitudeOverTime, "x"),
				datasets: [{
					label: "Altitude over time (s)",
					data: extract(rocket.altitudeOverTime, "y")
				}],
			},
			options: {
				fill: true,
				scales: { 
					xAxes: [{
						ticks:{ 
							callback: function(value) { 
								return Number(value).toFixed(0); 
							} 
						} 
					} 
				]},

			}
		})
		var vChart = new Chart(vCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.velocityOverTime, "x"),
				datasets: [{
					label: "Velocity over time (s)",
					data: extract(rocket.velocityOverTime, "y")
				}],
			},
			options: {
				fill: true,
				scales: { 
					xAxes: [{
						ticks:{ 
							callback: function(value) { 
								return Number(value).toFixed(0); 
							} 
						} 
					} 
				]},
				
			}
		})
		var aChart = new Chart(aCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.accelerationOverTime, "x"),
				datasets: [{
					label: "Acceleration over time (s)",
					data: extract(rocket.accelerationOverTime, "y")
				}],
			},
			options: {
				fill: true,
				scales: { 
					xAxes: [{
						ticks:{ 
							callback: function(value) { 
								return Number(value).toFixed(0); 
							} 
						} 
					} 
				]},
				
			}
		})
		var dChart = new Chart(dCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.dragOverTime, "x"),
				datasets: [{
					label: "Drag over time (s)",
					data: extract(rocket.dragOverTime, "y")
				}],
			},
			options: {
				fill: true,
				scales: { 
					xAxes: [{
						ticks:{ 
							callback: function(value) { 
								return Number(value).toFixed(0); 
							} 
						} 
					} 
				]},
				
			}
		})
		var tChart = new Chart(tCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.thrustOverTime, "x"),
				datasets: [{
					label: "Thrust over time (s)",
					data: extract(rocket.thrustOverTime, "y")
				}],
			},
			options: {
				fill: true,
				scales: { 
					xAxes: [{
						ticks:{ 
							callback: function(value) { 
								return Number(value).toFixed(0); 
							} 
						} 
					} 
				]},
				
			}
		})
	}

	runSim()

</script>

<main>
	<canvas id="altChart"></canvas>
	<canvas id="vChart"></canvas>
	<canvas id="aChart"></canvas>
	<canvas id="dChart"></canvas>
	<canvas id="tChart"></canvas>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	canvas {
		/*width: 50% !important;
		height: 100% !important;*/
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>