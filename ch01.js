// include underscore-min.js in node.js
if (typeof require !== "undefined") {
    var _ = require("./underscore-min");
}

// p.11
_.times(4, function() { console.log("Major"); });

// p.24
[1, 2, 3].forEach(console.log);

function splat(fun) {
    return function(array) {
        return fun.apply(null, array);
    };
}

var addArrayElements = splat(function(x, y) { return x + y; });
addArrayElements([1, 2]);
//=> 3

// p.25
function unsplat(fun) {
    return function () {
        return fun.call(null, _.toArray(arguments));
    };
}

var joinElements = unsplat(function(array) { return array.join(' '); });

joinElements(1, 2);
//=> "1 2"

joinElements('-', '$', '/', '!', ':');
//=> "- $ / ! :"

// p.35
var letters = ['a', 'b', 'c'];

console.log(letters[1]); // b

function naiveNth(a, index) {
    return a[index];
}

console.log(naiveNth(letters, 1));
console.log(naiveNth({}, 1));
