import React, { useState } from "react";
import "./PathfindingVisualizer.css";
import Node from "./Node/Node";
import { djikstra, getNodesInShortestPath } from "../algorithms/djikstra";

const height = 25;
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
    console.log("entered ", i, j);
    if (startMode) {
      setSTART_NODE_I(i);
      setSTART_NODE_J(j);
      setGrid(getNewGridWithStartToggled(i, j));
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

  const handleMouseUp = () => {
    setFinishMode(false);
    setStartMode(false);
    setMousePressed(false);
  };
  //Defining functions here
  const animateShortestPath = (nodesInShortestPath) => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        let element = nodesInShortestPath[i];
        let new_grid = grid.slice();
        const newNode = {
          ...element,
          isShortestPath: true,
        };
        new_grid[element.i][element.j] = newNode;
        setGrid(new_grid);
      }, 30 * i);
    }
  };
  const animateDjikstra = (visitedStack, nodesInShortestPath) => {
    for (let i = 0; i <= visitedStack.length; i++) {
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
        };
        console.log("gwrinn");
        new_grid[element.i][element.j] = newNode;
        setGrid(new_grid);
      }, 30 * i);
    }
  };

  const visualizeDjikstra = () => {
    const startNode = grid[START_NODE_I][START_NODE_J];
    const finishNode = grid[FINISH_NODE_I][FINISH_NODE_J];
    const visitedStack = djikstra(grid, startNode, finishNode);
    const nodesInShortestPath = getNodesInShortestPath(finishNode);
    console.log(nodesInShortestPath);
    animateDjikstra(visitedStack, nodesInShortestPath);
  };
  ////
  ////
  //rendering
  return (
    <div className="grid">
      <button onClick={() => visualizeDjikstra()} className="button-djikstra">
        Djikstra
      </button>

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
              ></Node>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default PathfindingVisualizer;
