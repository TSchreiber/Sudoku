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

