const getNeighbours = (node, grid) => {
  const neighbours = [];
  if (node.i > 0) neighbours.push(grid[node.i - 1][node.j]);
  if (node.i < grid.length - 1) neighbours.push(grid[node.i + 1][node.j]);
  if (node.j > 0) neighbours.push(grid[node.i][node.j - 1]);
  if (node.j < grid[node.i].length - 1)
    neighbours.push(grid[node.i][node.j + 1]);
  return neighbours;
};

const updateNeighbours = (node, startNode, finishNode, grid) => {
  const neighbours = getNeighbours(node, grid);
  for (const neighbour of neighbours) {
    neighbour.g_cost =
      Math.abs(neighbour.i - startNode.i) + Math.abs(neighbour.j - startNode.j);
    neighbour.h_cost =
      Math.abs(neighbour.i - finishNode.i) +
      Math.abs(neighbour.j - finishNode.j);
    neighbour.f_cost = neighbour.g_cost + neighbour.h_cost;
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

const astar = (grid, startNode, finishNode) => {
  const visitedStack = [];
  //console.log(startNode.distance);
  startNode.distance = 0;
  startNode.g_cost = 0;
  startNode.h_cost =
    Math.abs(startNode.i - finishNode.i) + Math.abs(startNode.j - finishNode.j);
  startNode.f_cost = startNode.g_cost + startNode.h_cost;
  const unvisitedNodes = getAllNodes(grid);
  //console.log(unvisitedNodes);
  while (!!unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.f_cost - b.f_cost);
    const closestNode = unvisitedNodes.shift();
    //console.log(closestNode);
    if (closestNode.f_cost == Infinity) return visitedStack;
    if (closestNode.isWall) {
      continue;
    }
    visitedStack.push(closestNode);
    //closestNode.isVisited = true;
    if (closestNode === finishNode) return visitedStack;
    updateNeighbours(closestNode, startNode, finishNode, grid);
    console.log(closestNode);
  }
};

const getNodesInShortestPathAstar = (finishNode) => {
  const nodesInShortestPath = [];
  let currentNode = finishNode;
  while (currentNode != null) {
    console.log(currentNode);
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.parent;
  }

  return nodesInShortestPath;
};
export { astar, getNodesInShortestPathAstar };
