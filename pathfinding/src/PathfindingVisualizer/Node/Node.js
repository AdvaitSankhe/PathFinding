import React from "react";
import "./Node.css";
const Node = (props) => {
  return (
    <div
      className={`node ${props.isStart ? "node-start" : ""} ${
        props.isEnd ? "node-end" : ""
      } ${props.isVisited ? "node-visited" : ""} ${
        props.isWall ? "node-wall" : ""
      } ${props.isShortestPath ? "node-shortestpath" : ""} ${
        props.isBacktracked ? "node-backtracked" : ""
      } ${props.isCurrent ? "node-current" : ""}`}
      onMouseDown={() => {
        if (props.mode == "wall") props.onMouseDown(props.i, props.j);
      }}
      onMouseUp={() => {
        props.onMouseUp();
      }}
      onMouseEnter={() => {
        props.onMouseEnter(props.i, props.j);
      }}
    ></div>
  );
};

export default Node;
