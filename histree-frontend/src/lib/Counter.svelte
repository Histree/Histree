<script lang="typescript">
  let count = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment}>
  count is {undefinedCount}
</button>
