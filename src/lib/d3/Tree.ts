import * as d3 from 'd3';

// borrowed from https://codesandbox.io/p/sandbox/d3-practice-forked-y69kkw

export function drawTree(container: HTMLElement, rootWord: any, prefixes: any[], suffixes: any[]) {
  const nodeRadius = 6;
  const width = 1000;
  const height = 400;
  const margin = { top: 24, right: 200, bottom: 24, left: 200 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  const treeLayout = d3.tree().size([innerHeight, innerWidth]);
  const stratified = d3
    .stratify()
    .id(function (d) {
      return d.name;
    })
    .parentId(function (d) {
      return d.parent;
    });

  const linkPathGenerator = d3
    .linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);

  // create 2x trees
  const nodesUpstream = treeLayout(d3.hierarchy(stratified(prefixes)).data);
  const nodesDownstream = treeLayout(d3.hierarchy(stratified(suffixes)).data);
  // align the root node x and y
  const nodesUpRoot = Array.from(nodesUpstream).find((n) => n.data.name == rootWord);
  const nodesDownRoot = Array.from(nodesDownstream).find((n) => n.data.name == rootWord);
  nodesDownRoot.x = nodesUpRoot.x;
  nodesDownRoot.y = nodesUpRoot.y;
  // NOTE - COMMENT OUT THIS STEP TO SEE THE INTEMEDIARY STEP
  // for horizontal layout, flip x and y...
  // right hand side (upstream): halve and add width / 2 to all y's (which are for x)
  Array.from(nodesUpstream).forEach((n) => (n.y = n.y / 2 + innerWidth / 2));
  // left hand side (downstream): halve and negate all y's (which are for x) and add width / 2
  Array.from(nodesDownstream).forEach((n) => (n.y = (n.y / 2) * -1 + innerWidth / 2));
  // render both trees
  // index allows left hand and right hand side to separately selected and styled
  [nodesUpstream, nodesDownstream].forEach(function (nodes, index) {
    // adds the links between the nodes
    // need to select links based on index to prevent bad rendering
    svg
      .selectAll(`links-${index}`)
      .data(nodes.links())
      .enter()
      .append('path')
      .attr('class', `link links-${index}`)
      .attr('d', linkPathGenerator);
    // adds each node as a group
    // need to select nodes based on index to prevent bad rendering
    var nodes = svg
      .selectAll(`.nodes-${index}`)
      .data(nodes.descendants())
      .enter()
      .append('g')
      .attr('class', `node nodes-${index}`)
      .attr('transform', function (d) {
        // x and y flipped here to achieve horizontal placement
        return `translate(${d.y},${d.x})`;
      });
    // adds the circle to the node
    nodes.append('circle').attr('r', nodeRadius);
    // adds the text to the node
    nodes
      .append('text')
      .attr('dy', '.35em')
      .attr('y', -20)
      .style('text-anchor', 'middle')
      .text(function (d) {
        return d.data.name;
      });
  });
}