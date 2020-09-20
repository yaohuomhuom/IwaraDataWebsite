var path = require("path")
const fs = require("fs");
var replace = function(name, data) {
    var jsonstr = JSON.stringify(data);
    //console.log(jsonstr)
    fs.writeFileSync(path.join(__dirname, "../db/" + name + ".json"), jsonstr, 'utf8', function(err) {
        if (err) {
            console.error(err);
        }
    });
}
var read = function(name) {
    try {
        if (!fs.existsSync(path.join(__dirname, "../db/" + name + ".json"))) {
            replace(name, []);
        }
        var jsonstrfs = fs.readFileSync(path.join(__dirname, "../db/" + name + ".json"), "utf8");
        return JSON.parse(jsonstrfs)
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    read,
    replace
}
