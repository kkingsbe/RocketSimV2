<script>
    export let parameter
    export let value
    export let options
    export let disabled
</script>

<main>
    <p>{parameter}</p> 
    <select id={parameter} placeholder={parameter} disabled={disabled} bind:value={value}>
        {#each options as option}
            <option>{option}</option>
        {/each}
    </select>
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