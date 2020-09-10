<script>
    import InputGroup from './InputGroup.svelte'
    export let dryMass
    export let propMass
    export let thrustCurve
    export let airDensity
    export let noseConeType
    export let fuselageDiameter
    export let numFins
    export let finLegth
    export let finWidth
</script>

<main>
    <h1>Configure Parameters:</h1>
    <div class="inputGrid">
        <InputGroup parameter="Dry Mass" defaultValue={150.3} bind:value={dryMass}></InputGroup>
        <InputGroup parameter="Prop Mass" defaultValue={0.0359} bind:value={propMass}></InputGroup>
        <InputGroup parameter="Thrust Curve" defaultValue={"default"} bind:value={thrustCurve}></InputGroup>
        <InputGroup parameter="Air Density" defaultValue={"1.225"} bind:value={airDensity}></InputGroup>
        <InputGroup parameter="Nose Cone Type" defaultValue={"1"} bind:value={noseConeType}></InputGroup>
        <InputGroup parameter="Fuselage Diameter" defaultValue={"76"} bind:value={fuselageDiameter}></InputGroup>
        <InputGroup parameter="Number of Fins" defaultValue={"4"} bind:value={numFins}></InputGroup>
        <InputGroup parameter="Fin Length" defaultValue={"30"} bind:value={finLegth}></InputGroup>
        <InputGroup parameter="Fin Width" defaultValue={"50"} bind:value={finWidth}></InputGroup>
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