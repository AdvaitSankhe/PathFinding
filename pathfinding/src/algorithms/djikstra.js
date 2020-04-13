const getNeighbours = (node, grid) => {
  const neighbours = [];
  if (node.i > 0) neighbours.push(grid[node.i - 1][node.j]);
  if (node.i < grid.length - 1) neighbours.push(grid[node.i + 1][node.j]);
  if (node.j > 0) neighbours.push(grid[node.i][node.j - 1]);
  if (node.j < grid[node.i].length - 1)
    neighbours.push(grid[node.i][node.j + 1]);
  return neighbours;
};

const updateNeighbours = (node, grid) => {
  const neighbours = getNeighbours(node, grid);
  for (const neighbour of neighbours) {
    console.log(node, neighbour);
    neighbour.distance = node.distance + 1;
    if (neighbour.parent == null && node.parent != neighbour)
      neighbour.parent = node;
  }
};
const getAllNodes = (grid) => {
  const allnodes = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) allnodes.push(grid[i][j]);
  }
  return allnodes;
};

const djikstra = (grid, startNode, finishNode) => {
  const visitedStack = [];
  //console.log(startNode.distance);
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  //console.log(unvisitedNodes);
  while (!!unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();
    //console.log(closestNode);
    if (closestNode.distance == Infinity) return visitedStack;
    if (closestNode.isWall) {
      continue;
    }
    visitedStack.push(closestNode);
    //closestNode.isVisited = true;
    if (closestNode === finishNode) return visitedStack;
    updateNeighbours(closestNode, grid);
  }
};

const getNodesInShortestPath = (finishNode) => {
  console.log("SHORTEST PATH EXECUTE");
  const nodesInShortestPath = [];
  let currentNode = finishNode;
  while (currentNode != null) {
    console.log(currentNode);
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  console.log("NODES ");
  console.log(nodesInShortestPath);
  return nodesInShortestPath;
};
export { djikstra, getNodesInShortestPath };
