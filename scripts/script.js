/**
 * Creates a grid of input elements with some key listeners to validate input.
 * Each input element will have an id in the form "rc" (r is the row; c is the column).
 */
function createGrid() {
    let grid = document.createElement("div");
    grid.classList.add("grid");
    document.body.appendChild(grid);
  
    for (let i=0; i<9; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        grid.appendChild(square);
        for (let j=0; j<9; j++) {
            let el = document.createElement("input");
            el.classList.add("box");
            // Use number type so mobile keyboards will show the number input format
            el.type = "number";

            r = Math.floor(j/3) + (Math.floor(i/3) * 3);
            c = j%3 + (i%3 * 3);
            el.id = r+""+c;

            el.onkeydown = function() {
                // Remove the old value and store it in a temp variable
                el.currentValue = el.value
                el.value = "";
                el.setAttribute("error",false);
            }
            el.onkeyup = function() {
                // If the new value is not a number, then replace it with the old value
                if (isNaN(el.value))
                    el.value = el.currentValue;
                else
                    el.currentValue = el.value
            }

            square.appendChild(el);
        }
    }
}

/**
 * Sets the value of the input with id="rc" to v. (i.e. the element at (r,c) in the grid)
 * Also disables the input so the user can't change it
 */
function setBox(r, c, v) {
    let el = document.getElementById(r+""+c);
    el.contentEditable = false;
    el.disabled = true;
    el.innerText = v;
    el.value = v;
}

function getBox(r, c) {
    return document.getElementById(r+""+c).value;
}

async function test() {
    let res = JSON.parse(await require("test-grids.json"));
    var output = "";
    res.forEach((test_data) => {
        let data = test_data.data.replace(/\n/g, "");
        for (let r=0; r<9; r++) {
            for (let c=0; c<9; c++) {
                let v = data.charAt(r*9 + c);
                if (v.trim() !== "") {
                    setBox(r,c,v);
                }
            }
        }
        output += (((validate() === true) === test_data.expected)? "\u2705" : "\u274C") + " " + test_data.message + "\n";
    });
    return output;
}

/**
 * Checks the grid for a valid solution.
 * Returns either true or an object with the coordinates that are causing issues and a message describing the issue.
 */
function validate() {
    // Each row should have exactly one of each number [1-9]
    for (let r=0; r<9; r++) {
        let numbers = [];
        for (let c=0; c<9; c++) {
            let v = getBox(r,c);
            if (v.trim() === "") {
                numbers.push(""); // push an object to keep the indexOf call accurate
                continue;
            }
            let i = numbers.indexOf(v);
            if (i >= 0)
                return {"squares": [`${r}${i}`, `${r}${c}`], "message":"Duplicate numbers in row."};
            numbers.push(v);
        }
    }
    // Check columns in the same way
    for (let c=0; c<9; c++) {
        let numbers = [];
        for (let r=0; r<9; r++) {
            let v = getBox(r,c);
            if (v.trim() === "") {
                numbers.push(""); // push an object to keep the indexOf call accurate
                continue;
            }
            let i = numbers.indexOf(v);
            if (i >= 0)
                return {"squares": [`${i}${c}`, `${r}${c}`], "message":"Duplicate numbers in column."};
            numbers.push(v);
        }
    }
    // Check squares
    for (let s=0; s<9; s++) {
        let r_start = s%3 * 3;
        let c_start = Math.floor(s/3) * 3;
        let numbers = [];
        for (let r = r_start; r < r_start+3; r++) {
            for (let c = c_start; c < c_start+3; c++) {
                let v = getBox(r,c);
                if (v.trim() === "") {
                    numbers.push(""); // push an object to keep the indexOf call accurate
                    continue;
                }
                let i = numbers.indexOf(v);
                if (i >= 0) {
                    r_err = r_start + Math.floor(i/3);
                    c_err = c_start + i%3;
                    return {"squares": [`${r_err}${c_err}`, `${r}${c}`], "message":"Duplicate numbers in square."};
                }
                numbers.push(v);
            }
        }
    }
    // Check for empty squares
    // This is done at the end to have better error priority 
    // (i.e. empty squares should be the last issue to be reported)
    let empty = []
    for (let r=0; r<9; r++)
        for (let c=0; c<9; c++)
            if (getBox(r,c) === "")
                empty.push(`${r}${c}`);
    if (empty.length > 0) 
        return {"squares": empty, "message":"Empty squares."};
    // If no errors are thrown up to this point, then it's good to go!
    return true; // Grid is valid.
}

/**
 * 
 * @param {int} puzzleId The id of the puzzle to open. This is the id found in puzzles.json
 */
function loadPuzzle(puzzleId) {
    require("puzzles.json").then((res) => {
        let data = JSON.parse(res)[puzzleId].replace(/\s/g,"").split("");
        let i=0; 
        for (let r=0; r<9; r++) {
            for (let c=0; c<9; c++) {
                if (data[i] !== ".") {
                    setBox(r, c, data[i]);
                }
                i++;
            }
        }
    });
}

function check_button_on_click() {
    // remove any existing errors
    for (let r = 0; r < 9; r++)
        for (let c = 0; c < 9; c++)
            document.getElementById(`${r}${c}`).setAttribute("error", false);
    let res = validate();
    if (res !== true) {
        res.squares.forEach((id) =>
            document.getElementById(id).setAttribute("error", true)
        );
        document.getElementsByClassName("grid")[0].setAttribute("validated", false);
    }
    else {
        document.getElementsByClassName("grid")[0].setAttribute("validated", true);
    }
}