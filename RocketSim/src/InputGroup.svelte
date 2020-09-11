<script>
    export let parameter
    export let defaultValue
    export let value
    export let disabled
    value = defaultValue
</script>

<main>
    <p>{parameter}</p> 
    <input id={parameter} placeholder={parameter} disabled={disabled} bind:value={value}>
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