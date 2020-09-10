<script>
    export let parameter
    export let defaultValue
</script>

<main>
    <p>{parameter}</p>
    <input id={parameter} placeholder={parameter} value={defaultValue}>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    p {
        margin-bottom: 5px;
        font-size: 1.1em;
    }
</style>