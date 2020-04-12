const divide = (left, right, up, down, grid, createdwalls, flag) => {
  //console.log(createdwalls);
  //let flag = Math.floor(Math.random() * 2);
  if (right - left < 2 && down - up < 2) return createdwalls;
  //console.log(grid);
  if (right - left < 2 && down - up >= 2) flag = 0;
  else if (right - left >= 2 && down - up < 2) flag = 1;

  if (flag === 1) {
    const division_line =
      Math.floor(Math.random() * (right - left - 1)) + left + 1;
    const gap = Math.floor(Math.random() * (down - up - 1)) + up;
    console.log(gap);
    //console.log(division_line);
    for (let i = up; i < down; i++) {
      //console.log(grid[i][division_line]);
      if (
        i != gap &&
        !grid[i][division_line].isStart &&
        !grid[i][division_line].isEnd
      ) {
        //grid[i][division_line].isWall = true;
        createdwalls.push(grid[i][division_line]);
        //console.log(createdwalls);
      }
    }
    divide(left, division_line - 1, up, down, grid, createdwalls, 0);
    divide(division_line + 1, right, up, down, grid, createdwalls, 0);
  } else {
    const division_line = Math.floor(Math.random() * (down - up - 1)) + up + 1;
    const gap = Math.floor(Math.random() * (right - left - 1)) + left;
    //console.log(gap);
    // console.log(division_line);
    for (let i = left; i < right; i++) {
      //console.log(grid[division_line][i]);
      if (
        i != gap &&
        !grid[division_line][i].isStart &&
        !grid[division_line][i].isEnd
      ) {
        // grid[division_line][i].isWall = true;
        createdwalls.push(grid[division_line][i]);
      }
    }
    divide(left, right, up, division_line - 1, grid, createdwalls, 1);
    divide(left, right, division_line + 1, down, grid, createdwalls, 1);
  }
  return createdwalls;
};
const setBorders = (height, width, grid) => {
  for (let i = 0; i < height; i++) {
    grid[i][0].isWall = true;
    grid[i][width - 1].isWall = true;
  }
  for (let i = 0; i < width; i++) {
    grid[0][i].isWall = true;
    grid[height - 1][i].isWall = true;
  }
};
export { divide, setBorders };
