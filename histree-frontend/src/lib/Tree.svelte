<script lang="ts">
  import * as d3 from "d3";

  let width = 400;
  let height = 300;
  let margin = 30;

  interface TreeData {
    name: string;
    children?: TreeData[];
  }

  let data = {
    name: "A",
    children: [
      { name: "D" },
      { name: "C", children: [{ name: "F" }, { name: "E" }] },
      { name: "B" },
    ],
  };

  let root: d3.HierarchyNode<TreeData>;
  $: root = d3
    .hierarchy(data)
    .sort(
      (a, b) => b.height - a.height || a.data.name.localeCompare(b.data.name)
    );

  let t: d3.TreeLayout<TreeData> = d3.tree();

  let treeGen: d3.TreeLayout<TreeData>;
  $: treeGen = t.size([width - 2 * margin, 100]);

  let treeX: d3.HierarchyPointNode<TreeData>;
  $: treeX = treeGen(root);
</script>

<svg {width} {height}>
  <g class="everything" style="transform:translate(0px, 30px">
    <!-- Links -->
    {#each treeX.links() as { source, target }}
      <line
        x1={source.x}
        x2={target.x}
        y1={source.y}
        y2={target.y}
        stroke="black"
      />
    {/each}

    <!-- Nodes & Labels -->
    {#each treeX.descendants() as { x, y, data }}
      <circle cx={x} cy={y} r={10} fill={"red"} />
      <text x={x - 5} y={y + 5} fill="var(--off-white)"> {data.name}</text>
    {/each}
  </g>
</svg>

<style>
</style>
