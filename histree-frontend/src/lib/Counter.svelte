<script lang="typescript">
  let count = 0;
  const increment = () => {
    countr += 1;
  };
</script>

<button on:click={increment}>
  count is {count}
</button>
