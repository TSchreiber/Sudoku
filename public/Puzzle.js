function bitCount (n) {
  n = n - ((n >> 1) & 0x55555555)
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}

const pickRand = list => list[Math.floor(Math.random() * list.length)];

const getSetBits = n => {
    let out = [];
    let i = 1;
    while (n !== 0) {
        if (n & 1) {
            out.push(i);
        }
        n = n >>> 1;
        i = i + 1;
    }
    return out;
}

const cartesian = (...a) => 
    a.reduce((a, b) => 
        a.flatMap(d => 
            b.map(e => [d, e].flat())));

const range = (n) => [...Array(n).keys()];

const puzzleToString = (puzzle) => 
    puzzle.map(row => 
        row.map(value => value || " "))
        .map(row => row.join(" ")).join("\n");

const emptyPuzzle = () =>
    [...Array(9)].map(() =>
        [...Array(9)].map(() => 0))

const puzzleIsUnique = (puzzle) => {
    // Check that the puzzle 
    return true;
}

const genRandPuzzle = () => {
    let puzzle = genCompleteRandPuzzle();
    //let original = JSON.parse(JSON.stringify(puzzle));
    let options = cartesian(range(9),range(9));
    const nextPoint = () => {
        let choice = pickRand(options);
        options.splice(options.indexOf(choice), 1);
        return choice;
    }
    let removedCount = 0;
    while (removedCount < 60) {
        let [x,y] = nextPoint();
        let v = puzzle[x][y];
        puzzle[x][y] = 0;
        if (puzzleIsUnique()) 
            removedCount++;
        else 
            puzzle[x][y] = v;
    }
    return puzzle;
}

const genCompleteRandPuzzle = () => {
    let puzzle = emptyPuzzle();

    let sets = {
        rows: [...Array(9)].fill(0),
        cols: [...Array(9)].fill(0),
        sqrs: [...Array(9)].fill(0),
    }

    let boxOf = (x,y) => 
        Math.floor(y / 3) * 3 + Math.floor(x / 3);

    let getOptions = (x,y) => {
        let union = 
            sets.rows[x] | 
            sets.cols[y] | 
            sets.sqrs[boxOf(x,y)];
        let inverseUnion = ~union & ((1<<9)-1);
        return inverseUnion;
    }

    let bitmap = {
        1: 1,
        2: 2,
        3: 4,
        4: 8,
        5: 16,
        6: 32,
        7: 64,
        8: 128,
        9: 256
    }

    let stack = [];

    let set = (x,y,v) => {
        let b = bitmap[v];
        // assert that this is a valid insertion and that 
        // no other value is already placed there
        if ((getOptions(x,y) & b) == 0 || puzzle[x][y] != 0)
            throw `Invalid parameter, (${x},${y},${v}) for puzzle,\n${puzzleToString(puzzle)}`
        sets.rows[x] |= b;
        sets.cols[y] |= b;
        sets.sqrs[boxOf(x,y)] |= b;
        puzzle[x][y] = v;
    }

    let undo = () => {
        let [x,y,options] = stack.pop();
        let v = puzzle[x][y];
        let b = bitmap[v];
        puzzle[x][y] = 0;
        sets.rows[x] &= ~b;
        sets.cols[y] &= ~b;
        sets.sqrs[boxOf(x,y)] &= ~b;
        return [x,y,options];
    }

    // Pick the (x,y) pair with the fewest options.
    // Choose randomly when there are multiple
    // choices.
    let pickSquare = () => {
        let len = 10;
        let options = [];
        for (let x=0; x<9; x++) {
            for (let y=0; y<9; y++) {
                let c = bitCount(getOptions(x,y));
                if (puzzle[x][y] != 0) continue;
                if (c < len) {
                    len = c;
                    options = [[x,y]];
                } else if (c == len) {
                    options.push([x,y]);
                }
            }
        }
        return pickRand(options);
    }

    while (true) {
        let [x,y] = pickSquare() || [];
        if (x == undefined || y == undefined) break;
        options = getOptions(x,y);
        // If the given square has no valid options 
        // then we must backtrack until we find a
        // square with an unattempted option
        while (!options) {
            [x,y,options] = undo();
        }
        let choice = pickRand(getSetBits(options));
        set(x,y,choice);
        // after setting a value, remove it as an option so
        // that if the state is backtracked to, then it won't 
        // attempt that option again
        options &= ~bitmap[choice];
        stack.push([x,y,options]);
    }
    return puzzle;
}

const serializePuzzle = (puzzle) => 
    // The number of bits in the input needs to be divisible by 64
    // We have 81*4=324bits = 324%16=4 remainder bits. So we need to 
    // add one spacer element
    Buffer.from(
        puzzle.flatMap(x => x).join("") + "0","hex")
        .toString("base64")

const deserializePuzzle = (puzzle) => {
    let out = []
    Buffer.from(puzzle, "base64")
        .toString("hex")
        .split("")
        .map(c => parseInt(c))
        .forEach((x, i) => {
            // There will be a spacer element at the end
            // so don't read too many numbers
            if (i >= 81) return;
            if (i % 9 == 0) out.push([]);
            out[Math.floor(i/9)].push(x);
        })
    return out;
}

const puzzle = genRandPuzzle();
console.log(puzzleToString(puzzle));
console.log(puzzle.flatMap(x => x).map(x => x || ".").join(""));
/*
const base64 = serializePuzzle(puzzle);
console.log(btoa(puzzle));
console.log(base64);
console.log(puzzleToString(deserializePuzzle(base64)));
*/
