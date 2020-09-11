<script>
    import InputGroup from './InputGroup.svelte'
    import SelectGroup from './SelectGroup.svelte'
    import thrustCurves from './thrustCurves.js'

    export let dryMass
    export let propMass
    export let thrustCurve
    export let airDensity
    export let noseConeType
    export let fuselageDiameter
    export let numFins
    export let finLength
    export let finWidth
</script>

<main>
    <h1>Configure Parameters:</h1>
    <div class="inputGrid">
        <InputGroup parameter="Dry Mass (g)" defaultValue={150.3} bind:value={dryMass}></InputGroup>
        <InputGroup parameter="Prop Mass (g)" defaultValue={0.0359} bind:value={propMass}></InputGroup>
        <SelectGroup parameter="Thrust Curve" defaultValue={"default"} bind:value={thrustCurve} options={Object.keys(thrustCurves)}></SelectGroup>
        <InputGroup parameter="Air Density (kg/m^3)" defaultValue={"1.225"} bind:value={airDensity}></InputGroup>
        <InputGroup parameter="Nose Cone Type" defaultValue={"1"} bind:value={noseConeType} disabled={true}></InputGroup>
        <InputGroup parameter="Fuselage Diameter (mm)" defaultValue={"76"} bind:value={fuselageDiameter}></InputGroup>
        <InputGroup parameter="Number of Fins" defaultValue={"4"} bind:value={numFins}></InputGroup>
        <InputGroup parameter="Fin Width (mm)" defaultValue={"80"} bind:value={finLength}></InputGroup>
        <InputGroup parameter="Fin Thickness (mm)" defaultValue={"5"} bind:value={finWidth}></InputGroup>
    </div>
</main>

<style>
    main {
        margin-bottom: 2em;
    }

    .inputGrid {
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(5, 1fr);
    }

    @media (min-width: 200px) {
        .inputGrid {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    @media (min-width: 600px) {
        .inputGrid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 700px) {
        .inputGrid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    h1 {
        font-weight: 100;
        font-size: 4em;
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>