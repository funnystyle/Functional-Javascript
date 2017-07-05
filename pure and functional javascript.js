var sessions = [{
        title: "funny"
    },
    {
        title: "dhkim"
    }
];

// Data extraction
var titles = [];
var i, len;
for (i = 0, len = sessions.length; i < len; i++) {
    titles.push(sessions[i].title);
}
console.log(titles);

var titles = sessions.map(function(session) {
    return session.title;
});
console.log(titles);

// version 1
var extract = function(property) {
    return function(object) {
        return object[property];
    };
};
var titles = sessions.map(extract("title"));
console.log(titles);

// version 2
var extract = property => function(object) {
    return object[property];
};
var titles = sessions.map(extract("title"));
console.log(titles);

// version 3
var extract = property => object => object[property];
var titles = sessions.map(extract("title"));
console.log(titles);

// Data accumulation

var sessionList = "";
var i, len;
for (i = 0, len = sessions.length; i < len; i++) {
    sessionList += "<li>" + sessions[i].title + "</li>";
}
console.log(sessionList);

// Two things are actually done here:
// 1. Extract each sessions title
// 2. Accumulate result into an HTML-List

var sessionList = sessions
    .map(function(session) {
        return session.title;
    })
    .reduce(function(accumulation, next) {
        return accumulation + "<li>" + next + "</li>";
    }, "");
console.log(sessionList);

var sessionList = sessions
    .map(extract("title"))
    .reduce(function(accumulation, next) {
        return accumulation + "<li>" + next + "</li>";
    }, "");
console.log(sessionList);

var wrapIn = function(element) {
    return function(input) {
        return "<" + element + ">" + input + "</" + element + ">";
    };
};

var sessionList = sessions
    .map(extract("title"))
    .map(wrapIn("li"))
    .reduce(function(accumulation, next) {
        return accumulation + next;
    }, "");
console.log(sessionList);

var concatenate = function(accumulation, next) {
    return accumulation + next;
};

var sessionList = sessions
    .map(extract("title"))
    .map(wrapIn("li"))
    .reduce(concatenate, "");
console.log(sessionList);

// final version
var sessions = [{
        title: "funny"
    },
    {
        title: "dhkim"
    }
];
var extract = property => object => object[property];

var titles = sessions.map(extract("title"));
console.log(titles);

var wrapIn = element => input => "<" + element + ">" + input + "</" + element + ">";
var concatenate = (accumulation, next) => accumulation + next;
var sessionList = sessions.map(extract("title"))
                          .map(wrapIn("li"))
                          .reduce(concatenate, "");
console.log(sessionList);
