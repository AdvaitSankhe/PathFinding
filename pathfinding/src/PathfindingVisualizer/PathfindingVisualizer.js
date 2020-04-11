import React, { useState } from "react";
import "./PathfindingVisualizer.css";
import Node from "./Node/Node";
import { djikstra, getNodesInShortestPath } from "../algorithms/djikstra";

const getNewGridWithWallToggled = (grid, i, j) => {
  const new_grid = grid.slice();
  const my_node = new_grid[i][j];
  const new_node = {
    ...my_node,
    isWall: !my_node.isWall
  };
  new_grid[i][j] = new_node;
  return new_grid;
};

const PathfindingVisualizer = props => {
  const [START_NODE_I, setSTART_NODE_I] = useState(5);
  const [START_NODE_J, setSTART_NODE_J] = useState(7);
  const [FINISH_NODE_I, setFINISH_NODE_I] = useState(10);
  const [FINISH_NODE_J, setFINISH_NODE_J] = useState(9);

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
      mode: "wall"
    };
    return my_node;
  };
  let createGrid = () => {
    let grid = [];
    for (let i = 0; i < 15; i++) {
      let row = [];
      for (let j = 0; j < 20; j++) {
        let my_node = createNode(i, j);
        row.push(my_node);
      }
      grid.push(row);
    }
    return grid;
  };

  const [grid, setGrid] = useState(createGrid());
  const [mousepressed, setMousePressed] = useState(false);

  const getNewGridWithWStartToggled = (x, y) => {
    let new_grid = [];
    for (let i = 0; i < 15; i++) {
      let row = [];
      for (let j = 0; j < 20; j++) {
        let my_node = createNode(i, j);
        //if (i == x && j == y) my_node.isStart = true;
        my_node.mode = "start";
        row.push(my_node);
      }
      new_grid.push(row);
    }
    setGrid(new_grid);
  };
  const getNewGridWithWallModeToggled = () => {
    let new_grid = grid.slice();
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 20; j++) {
        new_grid[i][j].mode = "wall";
      }
    }
    setGrid(new_grid);
  };
  const onStartHandler = (i, j) => {
    setSTART_NODE_I(i);
    setSTART_NODE_J(j);
    getNewGridWithWStartToggled();
  };
  //let grid = createGrid();
  const handleMouseDown = (i, j) => {
    setGrid(getNewGridWithWallToggled(grid, i, j));
    setMousePressed(true);
  };
  const handleMouseEnter = (i, j) => {
    if (mousepressed) {
      setGrid(getNewGridWithWallToggled(grid, i, j));
    }
  };

  const handleMouseUp = () => {
    setMousePressed(false);
  };
  //Defining functions here
  const animateShortestPath = nodesInShortestPath => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        let element = nodesInShortestPath[i];
        let new_grid = grid.slice();
        console.log(element);
        const newNode = {
          ...element,
          isShortestPath: true
        };
        console.log(element);
        console.log("gwrinn");
        new_grid[element.i][element.j] = newNode;

        setGrid(new_grid);
        console.log("rerenders");
      }, 20 * i);
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
        console.log(element);
        const newNode = {
          ...element,
          isVisited: true
        };
        console.log(element);
        console.log("gwrinn");
        new_grid[element.i][element.j] = newNode;

        setGrid(new_grid);
        console.log("rerenders");
      }, 20 * i);
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
      <button onClick={() => visualizeDjikstra()}> Djikstra</button>
      <button onClick={() => getNewGridWithWStartToggled()}>START</button>
      <button onClick={() => getNewGridWithWallModeToggled()}>WALL</button>
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
                onStart={onStartHandler}
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
