const getNeighbours = (node, grid) => {
  const neighbours = [];
  if (node.i > 0) neighbours.push(grid[node.i - 1][node.j]);
  if (node.i < grid.length - 1) neighbours.push(grid[node.i + 1][node.j]);
  if (node.j > 0) neighbours.push(grid[node.i][node.j - 1]);
  if (node.j < grid[node.i].length - 1)
    neighbours.push(grid[node.i][node.j + 1]);
  return neighbours.filter((neighbour) => !neighbour.isVisited);
};

let flag = true;
const visitedNodes = [];
const visitedStack = [];

const dfs = (grid, finishNode) => {
  let startNode = visitedStack[visitedStack.length - 1];
  visitedNodes.push(startNode);
  if (startNode === finishNode) flag = false;
  while (startNode.isVisited) {
    startNode = visitedStack.pop();
    if (!!visitedStack.length) return;
  }
  startNode.isVisited = true;

  console.log(startNode);
  console.log(visitedStack);
  const neighbours = getNeighbours(startNode, grid);
  neighbours.sort(() => Math.random() - 0.5);

  if (flag) {
    for (const neighbour of neighbours) {
      if (!neighbour.isVisited && !neighbour.isWall && flag) {
        visitedStack.push(neighbour);
        dfs(grid, finishNode);
      }
    }
  }
  visitedNodes.push(startNode);

  //console.log(visitedStack.pop());
};
const dfs_main = (startNode, finishNode, grid) => {
  visitedStack.push(startNode);
  dfs(grid, finishNode);
  const arr = [];
  arr.push(visitedNodes);
  arr.push(visitedStack);
  return arr;
};

export default dfs_main;
