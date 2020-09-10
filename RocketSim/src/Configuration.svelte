<script>
    import InputGroup from './InputGroup.svelte'
</script>

<main>
    <h1>Configure Parameters:</h1>
    <div class="inputGrid">
        <InputGroup parameter="Dry Mass" defaultValue={150.3}></InputGroup>
        <InputGroup parameter="Prop Mass" defaultValue={0.0359}></InputGroup>
        <InputGroup parameter="Thrust Curve" defaultValue={"default"}></InputGroup>
        <InputGroup parameter="Air Density" defaultValue={"1.225"}></InputGroup>
        <InputGroup parameter="Nose Cone Type" defaultValue={"1"}></InputGroup>
        <InputGroup parameter="Fuselage Diameter" defaultValue={"76"}></InputGroup>
        <InputGroup parameter="Number of Fins" defaultValue={"4"}></InputGroup>
        <InputGroup parameter="Fin Length" defaultValue={"30"}></InputGroup>
        <InputGroup parameter="Fin Width" defaultValue={"50"}></InputGroup>
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