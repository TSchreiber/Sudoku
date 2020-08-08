var tests = [
    empty_grid_is_not_valid,
    rows_should_be_filled,
];

function test() {
    let pass = true;

    for (let i=0; i<tests.length; i++) 
        pass &= tests[i]();

    if (pass)
        console.log("\n\u2705 All tests passed");
    else
        console.log("\n\u274C Some tests failed");
    return pass === 1;
}

function pass(message) {
    console.log("\u2705 "+message);
    return true;
}

function fail(message) {
    console.log("\u274C "+message);
    return false;
}

function assert(expected, actual, message) {
    if (expected === actual) 
        return pass(message);
    else 
        return fail(message);
}

function empty_grid_is_not_valid () {
    fillGrid(`
    ... ... ...
    ... ... ...
    ... ... ...

    ... ... ...
    ... ... ...
    ... ... ...
    
    ... ... ...
    ... ... ...
    ... ... ...
    `);
    return assert("object", typeof validate(), "Empty grid should be invalid");
}

function rows_should_be_filled () {
    fillGrid(`
    ... 269 781
    682 571 493
    197 834 562

    826 195 347
    374 682 915
    951 743 628

    519 326 874
    248 957 136
    111 111 111
    `);
    return assert("object", typeof validate(), "Rows should be filled");
}