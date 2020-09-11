<script>
	export let name
	import 'chart.js'
	import Configuration from './Configuration.svelte'
	import Rocket from './rocket.js'
	import Simulation from './simulator.js'

	document.title = "Rocket Simulation"

	var dryMass = 0
	var propMass = 0
	var thrustCurve = "default"
	var airDensity = 0
	var noseConeType = 0
	var fuselageDiameter = 0
	var numFins = 0
	var finLength = 0
	var finWidth = 0

	var altChart, vChart, aChart, dChart, tChart

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
		console.log(thrustCurve)
		rocket = new Rocket({
			dryMass: dryMass,
			propMass: propMass,
			thrustCurve: thrustCurve,
			airDensity: airDensity,
			noseConeType: noseConeType,
			fuselageDiameter: fuselageDiameter,
			numFins: numFins,
			finLength: finLength,
			finWidth: finWidth
		})
		let simulation = new Simulation(rocket, 0.01, 1.225)
		await simulation.run()
		simulation.printData()

		graphData(rocket)
	}

	function graphData(rocket) {
		let axisLabelFontSize = 20
		
		var altCanvas = document.getElementById("altChart").getContext('2d')
		//var gradient = altCanvas.createLinearGradient(450,0,0,0)
		//gradient.addColorStop(0,"rgb(0, 99, 132)")
		//gradient.addColorStop(1,"rgb(255, 99, 132)")
		var gradient = altCanvas.createLinearGradient(450,0,0,0)
		gradient.addColorStop(0,"#8DD9CA")
		gradient.addColorStop(1,"#D2B5EC")

		var vCanvas = document.getElementById("vChart")
		var aCanvas = document.getElementById("aChart")
		var dCanvas = document.getElementById("dChart")
		var tCanvas = document.getElementById("tChart")

		if(typeof(altChart) !== "undefined")
			altChart.destroy()
		if(typeof(vChart) !== "undefined")
			vChart.destroy()
		if(typeof(aChart) !== "undefined")
			aChart.destroy()
		if(typeof(dChart) !== "undefined")
			dChart.destroy()
		if(typeof(tChart) !== "undefined")
			tChart.destroy()

		altChart = new Chart(altCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.altitudeOverTime, "x"),
				datasets: [{
					label: "Altitude",
					data: extract(rocket.altitudeOverTime, "y"),
					fill: true,
					backgroundColor: gradient
				}],
			},
			options: {
				scales: { 
					xAxes: [{
						ticks:{
							callback: function(value) { 
								return Number(value).toFixed(0); 
							}
						},
						scaleLabel: {
							display: true,
							labelString: "Time Elapsed (s)",
							fontSize: axisLabelFontSize
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Altitude (m)",
							fontSize: axisLabelFontSize
						}
					}]
				},
				elements: {
					point: {
						radius: 0.5
					}
				},
				legend: {
					display: false
				}
			}
		})
		vChart = new Chart(vCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.velocityOverTime, "x"),
				datasets: [{
					label: "Velocity",
					data: extract(rocket.velocityOverTime, "y"),
					backgroundColor: gradient
				}],
			},
			options: {
				scales: { 
					xAxes: [{
						ticks:{
							callback: function(value) { 
								return Number(value).toFixed(0); 
							},
							fontSize: 15
						},
						scaleLabel: {
							display: true,
							labelString: "Time Elapsed (s)",
							fontSize: axisLabelFontSize
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Velocity (m/s)",
							fontSize: axisLabelFontSize
						}
					}]
				},
				elements: {
					point: {
						radius: 0
					}
				},
				legend: {
					display: false
				}
			}
		})
		aChart = new Chart(aCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.accelerationOverTime, "x"),
				datasets: [{
					label: "Acceleration",
					data: extract(rocket.accelerationOverTime, "y"),
					backgroundColor: gradient
				}],
			},
			options: {
				scales: { 
					xAxes: [{
						ticks:{
							callback: function(value) { 
								return Number(value).toFixed(0); 
							},
							fontSize: 15
						},
						scaleLabel: {
							display: true,
							labelString: "Time Elapsed (s)",
							fontSize: axisLabelFontSize
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Acceleration (m/s^2)",
							fontSize: axisLabelFontSize
						}
					}]
				},
				elements: {
					point: {
						radius: 0
					}
				},
				legend: {
					display: false
				}
			}
		})
		dChart = new Chart(dCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.dragOverTime, "x"),
				datasets: [{
					label: "Drag",
					data: extract(rocket.dragOverTime, "y"),
					backgroundColor: gradient
				}],
			},
			options: {
				scales: { 
					xAxes: [{
						ticks:{
							callback: function(value) { 
								return Number(value).toFixed(0); 
							},
							fontSize: 15
						},
						scaleLabel: {
							display: true,
							labelString: "Time Elapsed (s)",
							fontSize: axisLabelFontSize
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Drag (N)",
							fontSize: axisLabelFontSize
						}
					}]
				},
				elements: {
					point: {
						radius: 0
					}
				},
				legend: {
					display: false
				}
			}
		})
		tChart = new Chart(tCanvas, {
			type: 'line',
			data: {
				labels: extract(rocket.thrustOverTime, "x"),
				datasets: [{
					label: "Thrust",
					data: extract(rocket.thrustOverTime, "y"),
					backgroundColor: gradient
				}],
			},
			options: {
				scales: { 
					xAxes: [{
						ticks:{
							callback: function(value) { 
								return Number(value).toFixed(0); 
							},
							fontSize: 15
						},
						scaleLabel: {
							display: true,
							labelString: "Time Elapsed (s)",
							fontSize: axisLabelFontSize
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: "Thrust (N)",
							fontSize: axisLabelFontSize
						}
					}]
				},
				elements: {
					point: {
						radius: 0
					}
				},
				legend: {
					display: false
				}
			}
		})
	}

</script>

<main>
	<div class="card">
		<Configuration
			bind:dryMass={dryMass} 
			bind:propMass={propMass} 
			bind:thrustCurve={thrustCurve}
			bind:airDensity={airDensity}
			bind:noseConeType={noseConeType}
			bind:fuselageDiameter={fuselageDiameter}
			bind:numFins={numFins}
			bind:finLength={finLength}
			bind:finWidth={finWidth}>
		</Configuration>
		<button class="start" on:click={runSim}>Run Simulation</button>
	</div>
	
	{#if typeof(altChart) !== "undefined"}
		<h1>View Data:</h1>
		<h2>Altitude</h2>
	{/if}
	<canvas id="altChart"></canvas>

	{#if typeof(vChart) !== "undefined"}
		<h2>Velocity</h2>
	{/if}
	<canvas id="vChart"></canvas>

	{#if typeof(aChart) !== "undefined"}
		<h2>Acceleration</h2>
	{/if}
	<canvas id="aChart"></canvas>

	{#if typeof(dChart) !== "undefined"}
		<h2>Drag</h2>
	{/if}
	<canvas id="dChart"></canvas>

	{#if typeof(tChart) !== "undefined"}
		<h2>Thrust</h2>
	{/if}
	<canvas id="tChart"></canvas>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
        font-weight: 100;
        font-size: 4em;
        margin-top: 1.2em;
        margin-bottom: 10px;
    }

	canvas {
		margin-bottom: 100px;
	}

	.start {
		padding: 10px;
		background: rgb(16, 155, 16);
		color: white;
		cursor: pointer;
		width: fit-content;
		border-radius: 5px;
		font-size: 1.2em;
	}

	.card {
		padding: 30px;
		box-shadow: 3px 3px 6px rgba(0,0,0,0.2);
		border-radius: 10px;
		background: linear-gradient(45deg, #ffe6ea, #ffd8c1);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>