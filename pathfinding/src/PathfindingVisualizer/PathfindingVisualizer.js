import React, { useState } from "react";
import "./PathfindingVisualizer.css";
import Node from "./Node/Node";
import { djikstra, getNodesInShortestPath } from "../algorithms/djikstra";
import { astar, getNodesInShortestPathAstar } from "../algorithms/astar";
import { divide, setBorders } from "../algorithms/maze";
import dfs_main from "../algorithms/dfs";

const height = 21;
const width = 32;
const getNewGridWithWallToggled = (grid, i, j) => {
  const new_grid = grid.slice();
  const my_node = new_grid[i][j];
  const new_node = {
    ...my_node,
    isWall: !my_node.isWall,
  };
  new_grid[i][j] = new_node;
  return new_grid;
};

const PathfindingVisualizer = (props) => {
  const [startMode, setStartMode] = useState(false);
  const [finishMode, setFinishMode] = useState(false);
  const [START_NODE_I, setSTART_NODE_I] = useState(5);
  const [START_NODE_J, setSTART_NODE_J] = useState(7);
  const [FINISH_NODE_I, setFINISH_NODE_I] = useState(10);
  const [FINISH_NODE_J, setFINISH_NODE_J] = useState(3);

  let createNode = (i, j) => {
    let my_node = {
      i,
      j,
      parent: null,
      isStart: i == START_NODE_I && j == START_NODE_J,
      isEnd: i == FINISH_NODE_I && j == FINISH_NODE_J,
      isVisited: false,
      distance: Infinity,
      isWall: false,
      isShortestPath: false,
      mode: "wall",
      isBacktracked: false,
      isCurrent: false,
      g_cost: Infinity,
      h_cost: Infinity,
      f_cost: Infinity,
    };
    return my_node;
  };
  let createGrid = () => {
    let grid = [];
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        let my_node = createNode(i, j);
        row.push(my_node);
      }
      grid.push(row);
    }
    return grid;
  };

  const [grid, setGrid] = useState(createGrid());
  const [mousepressed, setMousePressed] = useState(false);
  const [isVisualized, setIsVisualized] = useState(false);

  const getNewGridWithStartToggled = (x, y) => {
    let new_grid = grid.slice();
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (i == x && j == y) new_grid[i][j].isStart = true;
        else new_grid[i][j].isStart = false;
      }
    }
    return new_grid;
  };
  const getNewGridWithVisitedCleared = (x, y) => {
    let new_grid = grid.slice();
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        new_grid[i][j].isVisited = false;
        new_grid[i][j].distance = Infinity;
        new_grid[i][j].isShortestPath = false;
        new_grid[i][j].parent = null;
        if (i == x && j == y) new_grid[i][j].isStart = true;
        else new_grid[i][j].isStart = false;
      }
    }
    return new_grid;
  };
  const getNewGridWithFinishToggled = (x, y) => {
    let new_grid = grid.slice();
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (i == x && j == y) new_grid[i][j].isEnd = true;
        else new_grid[i][j].isEnd = false;
      }
    }
    return new_grid;
  };

  const handleMouseUp = () => {
    setFinishMode(false);
    setStartMode(false);
    setMousePressed(false);
  };
  //Defining functions here
  const animateShortestPath = (nodesInShortestPath) => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      if (!isVisualized) {
        setTimeout(() => {
          let element = nodesInShortestPath[i];
          let new_grid = grid.slice();
          const newNode = {
            ...element,
            isShortestPath: true,
            isCurrent: true,
          };
          new_grid[element.i][element.j] = newNode;
          setGrid(new_grid);
          new_grid[element.i][element.j].isCurrent = false;
        }, 30 * i);
      } else {
        let element = nodesInShortestPath[i];
        let new_grid = grid.slice();
        const newNode = {
          ...element,
          isShortestPath: true,
        };
        new_grid[element.i][element.j] = newNode;
        setGrid(new_grid);
      }
    }
  };

  const animateDjikstra = (visitedStack, nodesInShortestPath) => {
    for (let i = 0; i <= visitedStack.length; i++) {
      if (!isVisualized) {
        setTimeout(() => {
          if (i === visitedStack.length) {
            animateShortestPath(nodesInShortestPath);
            return;
          }
          let element = visitedStack[i];
          let new_grid = grid.slice();
          const newNode = {
            ...element,
            isVisited: true,
            isCurrent: true,
          };
          console.log("gwrinn");
          new_grid[element.i][element.j] = newNode;
          setGrid(new_grid);
          new_grid[element.i][element.j].isCurrent = false;
        }, 30 * i);
      } else {
        if (i === visitedStack.length) {
          animateShortestPath(nodesInShortestPath);
          return;
        }
        let element = visitedStack[i];
        let new_grid = grid.slice();
        const newNode = {
          ...element,
          isVisited: true,
        };
        console.log("gwrinn");
        new_grid[element.i][element.j] = newNode;
        setGrid(new_grid);
      }
    }
  };

  const visualizeDjikstra = (i = START_NODE_I, j = START_NODE_J) => {
    const startNode = grid[i][j];
    const finishNode = grid[FINISH_NODE_I][FINISH_NODE_J];
    const visitedStack = djikstra(grid, startNode, finishNode);
    const nodesInShortestPath = getNodesInShortestPath(finishNode);
    console.log(nodesInShortestPath);
    animateDjikstra(visitedStack, nodesInShortestPath);
    if (!isVisualized) setIsVisualized(true);
  };

  const handleMouseDown = (i, j) => {
    if (i == START_NODE_I && j == START_NODE_J) {
      setMousePressed(true);
      setStartMode(true);
      return;
    }
    if (i == FINISH_NODE_I && j == FINISH_NODE_J) {
      setMousePressed(true);
      setFinishMode(true);
      return;
    }
    setGrid(getNewGridWithWallToggled(grid, i, j));
    setMousePressed(true);
  };
  const handleMouseEnter = (i, j) => {
    if (startMode) {
      setSTART_NODE_I(i);
      setSTART_NODE_J(j);
      setGrid(getNewGridWithStartToggled(i, j));
      if (isVisualized) {
        setGrid(getNewGridWithVisitedCleared(i, j));
        visualizeDjikstra(i, j);
      }
      return;
    }
    if (finishMode) {
      setFINISH_NODE_I(i);
      setFINISH_NODE_J(j);
      setGrid(getNewGridWithFinishToggled(i, j));
      return;
    }

    if (mousepressed) {
      setGrid(getNewGridWithWallToggled(grid, i, j));
    }
  };
  const animateMaze = (finalWalls) => {
    for (let i = 0; i < finalWalls.length; i++)
      setTimeout(() => {
        let element = finalWalls[i];
        let new_grid = grid.slice();
        const newNode = {
          ...element,
          isWall: true,
        };
        new_grid[element.i][element.j] = newNode;
        setGrid(new_grid);
      }, 30 * i);
  };
  const maze = (left, right, up, down, grid) => {
    let createdwalls = [];
    //setBorders(height, width, grid);
    let finalWalls = divide(left, right, up, down, grid, createdwalls, 1);
    animateMaze(finalWalls);
  };

  const animateDfs = (visitedNodes, finishNode) => {
    let flag = true;
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        let new_grid = grid.slice();
        let element = visitedNodes[i];
        new_grid[element.i][element.j].isCurrent = true;
        if (new_grid[element.i][element.j].isVisited == false && flag) {
          new_grid[element.i][element.j].isVisited = true;
        } else {
          if (flag) {
            new_grid[element.i][element.j].isVisited = false;
            new_grid[element.i][element.j].isBacktracked = true;
          } else {
            new_grid[element.i][element.j].isVisited = false;
            new_grid[element.i][element.j].isShortestPath = true;
          }
        }

        if (element.i == finishNode.i && element.j == finishNode.j)
          flag = false;
        console.log(new_grid[element.i][element.j]);
        setGrid(new_grid);
        new_grid[element.i][element.j].isCurrent = false;
      }, 50 * i);
    }
  };
  const visualizedfs = () => {
    const startNode = grid[START_NODE_I][START_NODE_J];
    const finishNode = grid[FINISH_NODE_I][FINISH_NODE_J];
    console.log(startNode);
    let new_grid = grid.slice();
    const visitedNodes = dfs_main(startNode, finishNode, new_grid)[0];
    new_grid = grid.slice();
    for (let i = 0; i < new_grid.length; i++) {
      for (let j = 0; j < new_grid[i].length; j++)
        new_grid[i][j].isVisited = false;
    }
    animateDfs(visitedNodes, finishNode);
  };

  const animateShortestPathAstar = (nodesInShortestPathAstar) => {
    for (let i = 0; i < nodesInShortestPathAstar.length; i++) {
      setTimeout(() => {
        let element = nodesInShortestPathAstar[i];
        let new_grid = grid.slice();
        const newNode = {
          ...element,
          isShortestPath: true,
          isCurrent: true,
        };
        new_grid[element.i][element.j] = newNode;
        setGrid(new_grid);
        new_grid[element.i][element.j].isCurrent = false;
      }, 30 * i);
    }
  };
  const animateAstar = (visitedStack, nodesInShortestPathAstar) => {
    for (let i = 0; i <= visitedStack.length; i++) {
      setTimeout(() => {
        if (i == visitedStack.length) {
          animateShortestPathAstar(nodesInShortestPathAstar);
          return;
        }
        let element = visitedStack[i];
        let new_grid = grid.slice();
        const newNode = {
          ...element,
          isVisited: true,
          isCurrent: true,
        };
        new_grid[element.i][element.j] = newNode;
        setGrid(new_grid);
        new_grid[element.i][element.j].isCurrent = false;
      }, 30 * i);
    }
  };
  const visualizeAstar = () => {
    const startNode = grid[START_NODE_I][START_NODE_J];
    const finishNode = grid[FINISH_NODE_I][FINISH_NODE_J];
    let new_grid = grid.slice();
    const visitedStack = astar(grid, startNode, finishNode);
    const nodesInShortestPathAstar = getNodesInShortestPathAstar(finishNode);
    animateAstar(visitedStack, nodesInShortestPathAstar);
  };

  ////
  ////
  //rendering
  return (
    <div className="grid">
      <button onClick={() => visualizeDjikstra()} className="">
        Djikstra
      </button>
      <button onClick={() => maze(0, width, 0, height, grid, 1)}>maze</button>
      <button onClick={() => visualizedfs()}>DFS</button>
      <button onClick={() => visualizeAstar()}>Astar</button>

      {grid.map((row, rowId) => {
        return (
          <div key={rowId}>
            {row.map((element, elementId) => (
              <Node
                i={element.i}
                j={element.j}
                key={elementId}
                isShortestPath={element.isShortestPath}
                isStart={element.isStart}
                isEnd={element.isEnd}
                isVisited={element.isVisited}
                isWall={element.isWall}
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                mode={element.mode}
                isBacktracked={element.isBacktracked}
                isCurrent={element.isCurrent}
                g_cost={element.g_cost}
                h_cost={element.h_cost}
                f_cost={element.f_cost}
              ></Node>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default PathfindingVisualizer;
