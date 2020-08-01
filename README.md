# Sudoku
# Sudoku
A web application for playing Sudoku
## Installation
This app was designed to be run from a node server, but if you don't have node installed there is a way to run it without using node as well.

If you have node, then all you need to do is run server.js from the top level directory.
```C:\...path-to-folder...\Sudoku> node server```

If you do not want to use node, then you will have to edit the `puzzles.json` and `index.html` files. 
1.  First you need to change the `puzzles.json` file into a javascript file, so simply assign the entire object to a variable (e.g. `var puzzles={...}`) 
2. Change the file extension to `.js`
3. Now in `index.html` add a script tag for the js file
`<script src="puzzles.js"></script>`
4. Find the line that has,
`require("puzzles.json")`
remove this line and the brackets that go with it.
5. In the block of code following the `require`, replace `JSON.parse(res)` with the variable you used in the `.js` file

The app should now run locally in the browser.

## Making Your Own Puzzle
The process of adding a puzzle is simple. Open up the `puzzles.json` file and add a new entry in the array with the values for the puzzle. The values appear in row then column order (i.e. the first nine values are the first row; the next nine are the second row etc). Use `.` for an empty square. White-space is ignored, so feel free to format it however you like. 