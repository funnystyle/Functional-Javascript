var sessions = [{
        title: "title1",
        speaker: "kim dong hwan",
        description: "Functional JavaScript"
    },
    {
        title: "title2",
        speaker: "dong hwan kim",
        description: "HTML5 Future is out there"
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

var wrapIn = element => input => `<${element}>${input}</${element}>`;
var concatenate = (accumulation, next) => accumulation + next;
var sessionList = sessions.map(extract("title"))
    .map(wrapIn("li"))
    .reduce(concatenate, "");
console.log(sessionList);


// Next Mission
// 1. Extract title, speaker and description for display
// 2. Preprocess the data according to certain rules
//     > Uppercase names
//     > Highlight certain buzzwords
//     > Limit descriptions to a maximal length
// 3. Finally accumulate everything as HTML

var sessions = [{
        title: "title1",
        speaker: "kim dong hwan",
        description: "JavaScript Session"
    },
    {
        title: "title2",
        speaker: "dong hwan kim",
        description: "HTML5 Future HTML5"
    }
];

var extract = property => object => object[property];
var wrapIn = element => input => `<${element}>${input}</${element}>`;
var concatenate = (accumulation, next) => accumulation + next;
var uppercaseEveryFirst = () => input => input.split(" ").map(uppercaseFirst()).join(" ");
var uppercaseFirst = () => input => input.charAt(0).toUpperCase() + input.substring(1);
var prefix = prefix => input => prefix + input;
var ellipsis = maxLength => input => input.length <= maxLength ? input : input.substring(0, maxLength - 1) + "...";
var arraymacher = array => new RegExp(`(\\b${array.join("\\b|\\b")}\\b)`, "g");
var highlight = function(/* args... */) {
    return input => input.replace(arraymacher(Array.from(arguments)), "<em>$1</em>");
};

var titles = sessions
    .map(extract("title"))
    .map(wrapIn("h2"));

console.log(titles);

var speakers = sessions
    .map(extract("speaker"))
    .map(uppercaseEveryFirst())
    .map(prefix("Speaker: "))
    .map(wrapIn("h3"));

console.log(speakers);

var descriptions = sessions
    .map(extract("description"))
    .map(ellipsis(160))
    .map(highlight("JavaScript", "HTML5"))
    .map(wrapIn("p"));

console.log(descriptions);
