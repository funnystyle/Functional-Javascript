//-- start of chapter.1
var l = console.log;
var t = console.table;
l('Welcome to Functional Javascript World!');

//-- p1
// [1, 2, 3].forEach(alert);

function splat(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
}

var addArrayElements = splat(function(x, y) {
  return x + y;
});

addArrayElements([1, 2]);

l(addArrayElements([1, 2]));

//-- p2
function unsplat(fun) {
  return function() {
    return fun.call(null, _.toArray(arguments));
  };
}

var joinElements = unsplat(function(array) {
  return array.join(' ');
});

l(joinElements(1, 2));

l(joinElements('-', '$', '/', '!', ':'));

//-- p32-33
// function parseAge(age) {
//   if (!_.isString(age)) throw new Error("Expecting a string");
//   var a;
//
//   console.log("Attempting to parse an age");
//
//   a = parseInt(age, 10);
//
//   if (_.isNaN(a)) {
//     console.log(["Could not parse age:", age].join(' '));
//     a = 0;
//   }
//
//   return a;
// }

// l(parseAge("42"));
// l(parseAge(42));
// l(parseAge("frob"));

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(["WARNING:", thing].join(' '));
}

function note(thing) {
  console.log(["NOTE:", thing].join(' '));
}

function parseAge(age) {
  if (!_.isString(age)) fail("Expecting a string");
  var a;

  note("Attempting to parse an age");

  a = parseInt(age, 10);

  if (_.isNaN(a)) {
    warn(["Could not parse age:", age].join(' '));
    a = 0;
  }

  return a;
}

l(parseAge("frob"));

// function note() {}
//
// function warn(str) {
//   alert("That doesn't look like a valid age");
// }

//-- p35
var letters = ['a', 'b', 'c'];

l(letters[1]);

function naiveNth(a, index) {
  return a[index];
}

l(naiveNth(letters, 1));

l(naiveNth({}, 1)); // undefined

function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

function nth(a, index) {
  if (!_.isNumber(index)) fail("Expected a number as the index");
  if (!isIndexed(a)) fail("Not supported on non-indexed type");
  if ((index < 0) || (index > a.length - 1))
   fail("Index value is out of bounds");

   return a[index];
}

l(nth(letters, 1));
l(nth("abc", 0));
// l(nth({}, 2)); // Error
// l(nth(letters, 4000)); // Error
// l(nth(letters, 'aaaaa')); // Error

function second(a) {
  return nth(a, 1);
}

l(second(['a', 'b']));
l(second("fogus"));
// l(second({})); // Error

//-- p37-40
l([2, 3, -6, 0, -108, 42].sort());

l([0, -1, -2].sort()); // problem

l([2, 3, -1, -6, 0, -108, 42, 10].sort()); // problem

l([2, 3, -1, -6, 0, -108, 42, 10].sort(function(x, y) {
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
}));

function compareLessThanOrEqual(x, y) {
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
}

l([2, 3, -1, -6, 0, -108, 42, 10].sort(compareLessThanOrEqual));

if (compareLessThanOrEqual(1, 1)) l("less or equal"); // do nothing
if(_.contains([0, -1], compareLessThanOrEqual(1, 1))) l("less or equal");

function lessOrEqual(x, y) {
  return x <= y;
}

l([100, 1, 0, 10, -1, -2, -1].sort(lessOrEqual));

function comparator(pred) {
  return function(x, y) {
    if (truthy(pred(x, y))) return -1;
    else if (truthy(pred(y, x))) return 1;
    else return 0;
  };
}

l([100, 1, 0, 10, -1, -2, -1].sort(comparator(lessOrEqual)));

l([100, 1, 0, 10, -1, -2, -1].sort(comparator(_.isEqual)));

//-- p41
function lameCSV(str) {
  return _.reduce(str.split("\n"), function(table, row) {
    table.push(_.map(row.split(","), function(c) { return c.trim() }));
    return table;
  }, []);
}

var peopleTable = lameCSV("name,age,hair\nMerble,35,red\nBob,64,blonde");

t(peopleTable);

t(_.rest(peopleTable).sort());

function selectNames(table) {
  return _.rest(_.map(table, _.first));
}

function selectAges(table) {
  return _.rest(_.map(table, second));
}

function selectHairColor(table) {
  return _.rest(_.map(table, function(row) {
    return nth(row, 2);
  }));
}

var mergeResults = _.zip;

l(selectNames(peopleTable));

l(selectAges(peopleTable));

l(selectHairColor(peopleTable));

t(mergeResults(selectNames(peopleTable), selectAges(peopleTable)));

//-- p44
function existy(x) {
  return x != null;
}

l(existy(null));
l(existy(undefined));
l(existy({}.notHere));
l(existy((function(){})()));
l(existy(0));
l(existy(false));

function truthy(x) {
  return (x !== false) && existy(x);
}

l(truthy(false));
l(truthy(undefined));
l(truthy(0));
l(truthy(''));

// {
//   if(condition)
//     return _.isFunction(doSomething) ? doSomething() : doSomething;
//   else
//     return undefined;
// }

function doWhen(cond, action) {
  if (truthy(cond))
    return action();
  else
    return undefined;
}

function executeIfHasField(target, name) {
  return doWhen(existy(target[name]), function() {
    var result = _.result(target, name);
    console.log(['The result is', result].join(' '));
    return result;
  });
}

executeIfHasField([1, 2, 3], 'reverse');
executeIfHasField({foo: 42}, 'foo');
executeIfHasField([1, 2, 3], 'notHere');

l([null, undefined, 1, 2, false].map(existy));
l([null, undefined, 1, 2, false].map(truthy));

//-- end of chapter.1

//-- start of chapter.2

//-- p55
_.each(['whiskey', 'tango', 'foxxtrot'], function(word) {
  console.log(word.charAt(0).toUpperCase() + word.substr(1));
});

var lyrics = [];

for (var bottles = 99; bottles > 0; bottles--) {
  lyrics.push(bottles + " bottles of beer on the wall");
  lyrics.push(bottles + " bottles of beer");
  lyrics.push("Take one down, pass it around");

  if (bottles > 1) {
    lyrics.push((bottles - 1) + " bottles of beer on the wall.");
  } else {
    lyrics.push("No more bottles of the beer on the wall!");
  }
}
// t(lyrics);

function lyricSegment(n) {
  return _.chain([])
    .push(n + " bottles of beer on the wall")
    .push(n + " bottles of beer")
    .push("Take one down, pass it around")
    .tap(function(lyrics) {
      if (n > 1) {
        lyrics.push((n - 1) + " bottles of beer on the wall.");
      } else {
        lyrics.push("No more bottles of the beer on the wall!");
      }
    })
    .value();
}

// t(lyricSegment(9));

function song(start, end, lyricGen) {
  return _.reduce(_.range(start, end, -1), function(acc, n) {
    return acc.concat(lyricGen(n));
  }, []);
}

// t(song(99, 0, lyricSegment));

//-- p61
var nums = [1, 2, 3, 4, 5];

function doubleAll(array) {
  return _.map(array, function(n) { return n * 2; });
}

l(doubleAll(nums));

function average(array) {
  var sum = _.reduce(array, function(a, b) { return a + b; });
  return sum / _.size(array);
}

l(average(nums));

function onlyEven(array) {
  return _.filter(array, function(n) {
    return (n % 2) === 0;
  });
}

l(onlyEven(nums));

//-- p62
l(_.map({a: 1, b: 2}, _.identity));

t(_.map({a: 1, b: 2}, function(v, k) {
  return [k, v];
}));

t(_.map({a: 1, b: 2}, function(v, k, coll) {
  return [k, v, _.keys(coll)];
}));

var nums = [100, 2, 25];

function div(x, y) {
  return x / y;
}

l(_.reduce(nums, div));
l(_.reduceRight(nums, div));

function allOf(/* funs */) {
  return _.reduceRight(arguments, function(truth, f) {
    return truth && f();
  }, true);
}

function anyOf(/* funs */) {
  return _.reduceRight(arguments, function(truth, f) {
    return truth || f();
  }, false);
}

function T() { return true; }
function F() { return false; }

l(allOf());
l(allOf(T, T));
l(allOf(T, T, T, T, F));
l(anyOf(T, T, F));
l(anyOf(F, F, F, F));
l(anyOf());

//-- p65
l(_.find(['a', 'b', 3, 'd'], _.isNumber));

l(_.reject(['a', 'b', 3, 'd'], _.isNumber));

function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments));
  }
}

l(_.filter(['a', 'b', 3, 'd'], complement(_.isNumber)));

l(_.all([1, 2, 3, 4], _.isNumber));

l(_.any([1, 2, 'c', 4], _.isString));

var people = [{name: "Rick", age: 30}, {name: "Jaka", age: 24}];

t(_.sortBy(people, function(p) {
  return p.age;
}));

var albums = [
  {title: "Sabbath Bloody Sabbath", genre: "Metal"},
  {title: "Scientist", genre: "Dub"},
  {title: "Undertow", genre: "Metal"}
];

t(_.groupBy(albums, function(a) {
  return a.genre;
}));

l(_.countBy(albums, function(a) {
  return a.genre;
}));

function cat() {
  var head = _.first(arguments);
  if (existy(head))
    return head.concat.apply(head, _.rest(arguments));
  else
    return [];
}

l(cat([1, 2, 3], [4, 5], [6, 7, 8]));

function construct(head, tail) {
  return cat([head], _.toArray(tail));
}

l(construct(42, [1, 2, 3]));

function mapcat(fun, coll) {
  return cat.apply(null, _.map(coll, fun));
}

l(mapcat(function(e) {
  return construct(e, [","]);
}, [1, 2, 3]));

function butLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

function interpose(inter, coll) {
  return butLast(mapcat(function(e) {
    return construct(e, [inter]);
  }, coll));
}

l(interpose(",", [1, 2, 3]));

//-- p70

var zombie = {name: "Bub", film: "Day of the Dead"};

l(_.keys(zombie));

l(_.values(zombie));

l(_.pluck([
  {title: "Chthon", author: "Anthony"},
  {title: "Grendel", author: "Gardner"},
  {title: "After Dart"}
], 'author'));

t(_.pairs(zombie));

l(_.object(_.map(_.pairs(zombie), function(pair) {
  return [pair[0].toUpperCase(), pair[1]];
})));

l(_.invert(zombie));

l(_.keys(_.invert({a: 138, b: 9})));

l(_.pluck(_.map([
  {title: "Chthon", author: "Anthony"},
  {title: "Grendel", author: "Gardner"},
  {title: "After Dart"}
], function(obj) {
  return _.defaults(obj, {author: "Unknown"});
}), 'author'));

var person = {name: "Romy", token: "j3983ij", password: "tigress"};

var info = _.omit(person, 'token', 'password');
l(info);

var creds = _.pick(person, 'token', 'password');
l(creds);

var library = [
  {title: "SICP", isbn: "0262010771", ed: 1},
  {title: "SICP", isbn: "0262510871", ed: 2},
  {title: "Joy of Clojure", isbn: "1935182641", ed: 1},
];

l(_.findWhere(library, {title: "SICP", ed: 2}));

t(_.where(library, {title: "SICP"}));

l(_.pluck(library, 'title'));

function project(table, keys) {
  return _.map(table, function(obj) {
    return _.pick.apply(null, construct(obj, keys));
  });
}

var editionResults = project(library, ['title', 'isbn']);

t(editionResults);

var isbnResults = project(editionResults, ['isbn']);

t(isbnResults);

l(_.pluck(isbnResults, 'isbn'));

function rename(obj, newNames) {
  return _.reduce(newNames, function(o, nu, old) {
    l(obj, o, nu, old)
    if (_.has(obj, old)) {
      o[nu] = obj[old];
      return o;
    } else
      return o;
  }, _.omit.apply(null, construct(obj, _.keys(newNames))));
}

// l(construct({a: 1, b: 2}, {'a': 'AAA'}));
// l(_.omit.apply(null, construct({a: 1, b: 2}, _.keys({'a': 'AAA'}))));
l(rename({a: 1, b: 2}, {'a': 'AAA'}));

function as(table, newNames) {
  return _.map(table, function(obj) {
    return rename(obj, newNames);
  });
}

t(as(library, {ed: 'edition'}));

t(project(as(library, {ed: 'edition'}), ['edition']));

function restrict(table, pred) {
  return _.reduce(table, function(newTable, obj) {
    if (truthy(pred(obj)))
      return newTable;
    else {
        return _.without(newTable, obj);
    }
  }, table);
}

t(restrict(library, function(book) {
  return book.ed > 1;
}));

t(restrict(
    project(
      as(library, {ed: 'edition'}),
      ['title', 'isbn', 'edition']
    ), function(book) {
      return book.edition > 1;
    }
  )
);

// SELECT title, isbn, edition FROM (
//   SELECT ed AS edition FROM library
// ) EDS
// WHERE edition > 1;

//-- end of chapter.2

//-- start of chapter.3

//-- p80
aGlobalVariable = 'linin la vida global';

l(_.map(_.range(2), function() { return aGlobalVariable; }));

aGlobalVariable = 'i drink you milkshake';

l(aGlobalVariable);

function makeEmptyObject() {
  return new Object();
}

aVariable = 'Outer';

function afun() {
  var aVariable = 'Middele';

  return _.map([1, 2, 3], function(e) {
    var aVariable = 'In';

    return [aVariable, e].join(' ');
  });
}

l(afun());

//-- p83

var globals = {};

function makeBindFun(resolver) {
  return function(k, v) {
    var stack = globals[k] || [];
    globals[k] = resolver(stack, v);
    return globals;
  };
}

var stackBinder = makeBindFun(function(stack, v) {
  stack.push(v);
  return stack;
});

var stackUnbinder = makeBindFun(function(stack, v) {
  stack.pop();
  return stack;
});

var dynamicLookup = function(k) {
  var slot = globals[k] || [];
  return _.last(slot);
};

stackBinder('a', 1);
stackBinder('b', 100);

l(dynamicLookup('a'));

t(globals);

stackBinder('a', '*');

l(dynamicLookup('a'));

t(globals);

stackUnbinder('a');

l(dynamicLookup('a'));

function f() { return dynamicLookup('a'); }
function g() { stackBinder('a', 'g'); return f(); }

l(f());

l(g());

t(globals);

//-- p86

function globalThis() { return this; }

l(globalThis());

l(globalThis.call('barnabas'));

l(globalThis.apply('orsulak', []));

var nopeThis = _.bind(globalThis, 'nope');

l(nopeThis.call('wat'));

var target = {
  name: 'the right value',
  aux: function() { return this.name; },
  act: function() { return this.aux(); }
};

// l(target.act.call('wat'))

_.bindAll(target, 'aux', 'act');

l(target.act.call('wat'));

//-- p88

function strangeIdentity(n) {
  for (var i = 0; i < n; i++);
  return i;
}

l(strangeIdentity(138));

function strangeIdentity(n) {
  for(this['i'] = 0; this['i'] < n; this['i']++);
  return this['i'];
}

l(strangeIdentity(108));

l(i);

l(strangeIdentity.call({}, 10000));

l(i);

function f() {
  this['a'] = 200;
  return this['a'] + this['b'];
}

var globals = {'b': 2};

l(f.call(_.clone(globals)));

l(globals);

//-- p91

function whatWasTheLocal() {
  var CAPTURED = 'Oh hai';

  return function() {
    return 'The local was: ' + CAPTURED;
  };
}

var reportLocal = whatWasTheLocal();

l(reportLocal());

function createScaleFunction(FACTOR) {
  return function(v) {
    return _.map(v, function(n) {
      return (n * FACTOR);
    });
  };
}

var scale10 = createScaleFunction(10);

l(scale10([1, 2, 3]));

function  createWeirdScaleFunction(FACTOR) {
  return function(v) {
    this['FACTOR'] = FACTOR;
    var captures = this;

    return _.map(v, _.bind(function(n) {
      return (n * this['FACTOR']);
    }, captures));
  };
}

var scale10 = createWeirdScaleFunction(10);

l(scale10.call({}, [5, 6, 7]));

function makeAdder(CAPTURED) {
  return function(free) {
    return free + CAPTURED;
  };
}

var add10 = makeAdder(10);

l(add10(32));

var add1024 = makeAdder(1024);

l(add1024(11));

l(add10(98));

function averageDamp(FUN) {
  return function(n) {
    return average([n, FUN(n)]);
  };
}

var averageSq = averageDamp(function(n) { return n * n });

l(averageSq(10));

//-- p95

var name = "Fogus";
var name = "Renamed";

l(name);

var shadowed = 0;

function argShadow(shadowed) {
  return ['Value is', shadowed].join(' ');
}

l(argShadow(108));
l(argShadow());

var shadowed = 0;

function varShadow(shadowed) {
  var shadowed = 4320000;
  return ['Value is', shadowed].join(' ');
}

l(varShadow(108));

function capturedShadow(SHADOWED) {
  return function(SHADOWED) {
    return SHADOWED + 1;
  };
}

var closureShadow = capturedShadow(108);
l(closureShadow(2));

//-- p97

function complement(PRED) {
  return function() {
    return !PRED.apply(null, _.toArray(arguments));
  };
}

function isEven(n) { return (n % 2) === 0; }

var isOdd = complement(isEven);

l(isOdd(2));
l(isOdd(413));

// function isEven(n) { return false; } // 함수 선언식으로 하면 hoisting 이 일어나므로 위의 isOdd 선언에 영향을 줌
var isEven = function(n) { return false; } // 함수 표현식으로 하면 괜찮음 (hoisting 이 일어나지 않음)

l(isEven(10));

l(isOdd(13));
l(isOdd(12)); // false 가 나와야 정상임

function showObject(OBJ) {
  return function() {
    return OBJ;
  };
}

var o = {a: 42};
var show0 = showObject(o);

l(show0());

o.newField = 108;

l(show0());

var pingpong = (function() {
  var PRIVATE = 0;

  return {
    inc: function(n) {
      return PRIVATE += n;
    },
    dec: function(n) {
      return PRIVATE -= n;
    }
  };
})();

l(pingpong.inc(10));

l(pingpong.dec(7));

pingpong.div = function(n) { return PRIVATE / n; };

// l(pingpong.div(3)); // error

function plucker(FIELD) {
  return function(obj) {
    return (obj && obj[FIELD]);
  };
}

var best = {title: 'Infinite Jest', author: 'DEW'};

var getTitle = plucker('title');

l(getTitle(best));

var books = [{title: 'Chthon'}, {stars: 5}, {title: 'Botchan'}];

var third = plucker(2);

l(third(books));
t(_.filter(books, getTitle));

//-- end of chapter.3

//-- start of chapter.4

l(_.max([1, 2, 3, 4, 5]));
l(_.max([1, 2, 3, 4.75, 4.5]));

var people = [{name: 'Fred', age: 65}, {name: 'Lucy', age: 36}];

l(_.max(people, function(p) { return p.age; }));

function finder(valueFun, bestFun, coll) {
  return _.reduce(coll, function(best, current) {
    var bestValue = valueFun(best);
    var currentValue = valueFun(current);

    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
}

l(finder(_.identity, Math.max, [1, 2, 3, 4, 5]));

l(finder(plucker('age'), Math.max, people));

l(finder(plucker('name'),
  function(x, y) { return x.charAt(0) === 'L' ? x : y; },
  people));

var best = function(fun, coll) {
  return _.reduce(coll, function(x, y) {
    return fun(x, y) ? x : y;
  });
}

l(best(function(x, y) { return x > y; }, [1, 2, 3, 4, 5]));

function repeat(times, VALUE) {
  return _.map(_.range(times), function() { return VALUE; });
}

l(repeat(4, "Major"));

function repeatedly(times, fun) {
  return _.map(_.range(times), fun);
}

l(repeatedly(3, function() {
  return Math.floor((Math.random() * 10) + 1);
}));

l(repeatedly(3, function() { return 'Odelay!'; }));

repeatedly(3, function(n) {
  var id = 'id' + n;
  $('body').append($('<p>Odelay!</p>').attr('id', id));
  return id;
});

function iterateUntil(fun, check, init) {
  var ret = [];
  var result = fun(init);

  while(check(result)) {
    ret.push(result);
    result = fun(result);
  }

  return ret;
}

l(iterateUntil(function(n) { return n + n; }, function(n) { return n <= 1024; }, 1));

l(repeatedly(10, function(exp) { return Math.pow(2, exp + 1); }));

l(repeatedly(3, function() { return 'Odelay!'; }));

function always(VALUE) {
  return function() {
    return VALUE;
  };
}

var f = always(function() {});

l(f() === f());

var g = always(function() {});

l(f() === g());

l(repeatedly(3, always('Odelay!')));

function invoker(NAME, METHOD) {
  return function(target /* arguments */) {
    if (!existy(target)) fail('Must provide a target');

    var targetMethod = target[NAME];
    var args = _.rest(arguments);

    return doWhen(existy(targetMethod) && METHOD === targetMethod, function() {
      return targetMethod.apply(target, args);
    });
  };
}

var rev = invoker('reverse', Array.prototype.reverse);

t(_.map([[1, 2, 3]], rev));

var add100 = makeAdder(100);

l(add100(38));

//-- p113

function uniqueString(len) {
  return Math.random().toString(36).substr(2, len);
}

l(uniqueString(10));

var uniqueString = function(prefix) {
  return [prefix, new Date().getTime()].join('');
}

l(uniqueString('argento'));

function makeUniqueStringFUnction(start) {
  var COUNTER = start;

  return function(prefix) {
    return [prefix, COUNTER++].join('');
  };
}

var uniqueString = makeUniqueStringFUnction(0);

l(uniqueString('dari'));
l(uniqueString('dari'));

var generator = {
  count: 0,
  uniqueString: function(prefix) {
    return [prefix, this.count++].join('');
  }
};

l(generator.uniqueString('bohr'));
l(generator.uniqueString('bohr'));

generator.count = 'gotcha';
l(generator.uniqueString('bohr'));

l(generator.uniqueString.call({count: 1337}, 'bohr'));

var omgenerator = (function(init) {
  var COUNTER = init;

  return {
    uniqueString: function(prefix) {
      return [prefix, COUNTER++].join('')
    }
  };
})(0);

l(omgenerator.uniqueString('lichking-'));

//-- p116
var nums = [1, 2, 3, null, 5];

l(_.reduce(nums, function(total, n) { return total * n; }));

function doSomething(config) {
  var lookup = defaults({critical: 108});

  return lookup(config, 'critical');
}

// function defaults(d) {
//   return function(o, k) {
//     var val = o[k] || d[k];
//     return o && val;
//   };
// }

l(doSomething({whoCares: 42, critical: null}));

function fnull(fun /*, defaults */) {
  var defaults = _.rest(arguments)

  return function(/* args */) {
    var args = _.map(arguments, function(e, i) {
      return existy(e) ? e : defaults[i];
    });

    return fun.apply(null, args);
  };
}

var safeMult = fnull(function(total, n) { return total * n; }, 1, 1);

l(_.reduce(nums, safeMult));

function defaults(d) {
  return function(o, k) {
    var val = fnull(_.identity, d[k]);
    return o && val(o[k]);
  };
}

function doSomething(config) {
  var lookup = defaults({critical: 108});

  return lookup(config, 'critical');
}

l(doSomething({critical: 9}));

l(doSomething({}));

//-- p108

function checker(/* validators */) {
  var validators = _.toArray(arguments);

  return function(obj) {
    return _.reduce(validators, function(errs, check) {
      if (check(obj))
        return errs;
      else
        return _.chain(errs).push(check.message).value();
    }, []);
  };
}

var alwaysPasses = checker(always(true), always(true));
l(alwaysPasses({}));

var fails = always(false);
fails.message = 'a failure in life';
var alwaysFails = checker(fails);

l(alwaysFails({}));

function validator(message, fun) {
  var f = function(/* arguments */) {
    return fun.apply(fun, arguments);
  };

  f['message'] = message;
  return f;
}

var gonnaFail = checker(validator("ZOMG!", always(false)));

l(gonnaFail(100));

function aMap(obj) {
  return _.isObject(obj);
}

var checkCommand = checker(validator("must be a map", aMap));

l(checkCommand({}));

l(checkCommand(42));

function hasKeys() {
  var KEYS = _.toArray(arguments);

  var fun = function(obj) {
    return _.every(KEYS, function(k) {
      return _.has(obj, k);
    });
  };

  fun.message = cat(['Must have values for keys:'], KEYS).join(' ');
  return fun;
}

var checkCommand = checker(validator('must be a map', aMap), hasKeys('msg', 'type'));

l(checkCommand({msg: 'blah', type: 'display'}));

l(checkCommand(32));

l(checkCommand({}));

//-- end of chapter.4

//-- start of chapter.5

//-- p123

function dispatch(/* funs */) {
  var funs = _.toArray(arguments);
  var size = funs.length;

  return function(target /*, args */) {
    var ret = undefined;
    var args = _.rest(arguments);
    for (var funIndex = 0; funIndex < size; funIndex++) {
      var fun = funs[funIndex];
      ret = fun.apply(fun, construct(target, args));

      if (existy(ret)) return ret;
    }

    return ret;
  };
}

var str = dispatch(invoker('toString', Array.prototype.toString), invoker('toString', String.prototype.toString));
l(str('a'));
l(str(_.range(10)));

function stringReverse(s) {
  if (!_.isString(s)) return undefined;
  return s.split('').reverse().join('');
}

l(stringReverse('abc'));

l(stringReverse(1));

var rev = dispatch(invoker('reverse', Array.prototype.reverse), stringReverse);

l(rev([1, 2, 3]));
l(rev('abc'));

var sillyReverse = dispatch(rev, always(42));

l(rev([1, 2, 3]));
l(rev('abc'));
l(sillyReverse(100000));

function performCommandHardcoded(command) {
  var result;

  switch(command.type) {
  case 'notify':
    result = notify(command.message);
    break;
  case 'join':
    result = changeView(command.target);
    break;
  default:
    // alert(command.type);
    console.log('alert', command.type);
  }

  return result;
}

function notify(message) {
  console.log('notify', message);
  return true;
}

function changeView(target) {
  console.log('join', target);
  return true;
}

function shutdown(hostname) {
  console.log('kill', hostname);
  return true;
}

l(performCommandHardcoded({type: 'notify', message: 'hi!'}));
l(performCommandHardcoded({type: 'join', target: 'waiting-room'}));
l(performCommandHardcoded({type: 'wat'})); // alert

function isa(type, action) {
  return function(obj) {
    if (type === obj.type)
      return action(obj);
  };
}

var performCommand = dispatch(
  isa('notify', function(obj) { return notify(obj.message); }),
  isa('join', function(obj) { return changeView(obj.target); }),
  // function(obj) { alert(obj.type); }
  function(obj) { console.log('alert', obj.type); }
);

var performAdminCommand = dispatch(
  isa('kill', function(obj) { return shutdown(obj.hostname); }),
  performCommand
);

l(performAdminCommand({type: 'kill', hostname: 'localhost'}));
l(performAdminCommand({type: 'flail'}));

var performTrialUserCommand = dispatch(
  isa('join', function(obj) { console.log('Cannot join until approved'); return true; }),
  performCommand
);

l(performTrialUserCommand({type: 'join', target: 'foo'}));
l(performTrialUserCommand({type: 'notify', message: 'Hi new user'}));

function rightAwayInvoker() {
  var args = _.toArray(arguments);
  var method = args.shift();
  var target = args.shift();

  return method.apply(target, args);
}

l(rightAwayInvoker(Array.prototype.reverse, [1, 2, 3]));
l(invoker('reverse', Array.prototype.reverse)([1, 2, 3]));

//-- p130

function leftCurryDiv(n) {
  return function(d) {
    return n/d;
  };
}

function rightCurryDiv(d) {
  return function(n) {
    return n/d;
  };
}

var divide10By = leftCurryDiv(10);
l(divide10By(2));

var divideBy10 = rightCurryDiv(10);
l(divideBy10(2));

function curry(fun) {
  return function(arg) {
    return fun(arg);
  };
}

l(['11', '11', '11', '11'].map(parseInt));
l(['11', '11', '11', '11'].map(curry(parseInt)));

function curry2(fun) {
  return function(secondArg) {
    return function(firstArg) {
      return fun(firstArg, secondArg);
    };
  };
}

function div(n, d) { return n / d; }

var div10 = curry2(div)(10);

l(div10(50));

var parseBinaryString = curry2(parseInt)(2);

l(parseBinaryString('111'));
l(parseBinaryString('10'));

var plays = [
  {artist: 'Burial', track: 'Archangel'},
  {artist: 'Ben Frost', track: 'Stomp'},
  {artist: 'Ben Frost', track: 'Stomp'},
  {artist: 'Burial', track: 'Archangel'},
  {artist: 'Emeralds', track: 'Snores'},
  {artist: 'Burial', track: 'Archangel'}
];

l(_.countBy(plays, function(song) {
  return [song.artist, song.track].join(' - ');
}));

function songToString(song) {
  return [song.artist, song.track].join(' - ');
}

var songCount = curry2(_.countBy)(songToString);

l(songCount(plays));

function curry3(fun) {
  return function(last) {
    return function(middle) {
      return function(first) {
        return fun(first, middle, last);
      };
    };
  };
}

var songsPlayed = curry3(_.uniq)(false)(songToString);

t(songsPlayed(plays));

t(_.uniq(plays, false, songToString));
t(_.uniq(plays, songToString, false));

function toHex(n) {
  var hex = n.toString(16);
  return (hex.length < 2) ? [0, hex].join('') : hex;
}

function rgbToHexString(r, g, b) {
  return ['#', toHex(r), toHex(g), toHex(b)].join('');
}

l(rgbToHexString(255, 255, 255));

var blueGreenish = curry3(rgbToHexString)(255)(200);

l(blueGreenish(0));

var greaterThen = curry2(function (lhs, rhs) { return lhs > rhs; });
var lessThen = curry2(function (lhs, rhs) { return lhs < rhs; });

var withinRange = checker(
  validator('arg must be greater than 10', greaterThen(10)),
  validator('arg must be less than 20', lessThen(20)),
);

l(withinRange(15));
l(withinRange(1));
l(withinRange(100));

//-- p139

function divPart(n) {
  return function(d) {
    return n / d;
  };
}

var over10Part = divPart(10);

l(over10Part(2));

//-- p140

function partial1(fun, arg1) {
  return function(/* args */) {
    var args = construct(arg1, arguments);
    return fun.apply(fun, args);
  };
}

var over10Part1 = partial1(div, 10);

l(over10Part1(5));

function partial2(fun, arg1, arg2) {
  return function(/* args */) {
    var args = cat([arg1, arg2], arguments);
    return fun.apply(fun, args);
  };
}

var div10By2 = partial2(div, 10, 2);

l(div10By2());

function partial(fun /*, pargs */) {
  var pargs = _.rest(arguments);

  return function(/* arguments */) {
    var args = cat(pargs, _.toArray(arguments));
    return fun.apply(fun, args);
  };
}
var over10Partial = partial(div, 10);

l(over10Partial(2));

var div10By2By4By5000Partial = partial(div, 10, 2, 4, 5000);

l(div10By2By4By5000Partial());

l(validator('arg must be a map', aMap)(42));

var zero = validator('cannot be zero', function(n) { return 0 === n; });
var number = validator('arg must be a number', _.isNumber);

function sqr(n) {
  if (!number(n)) throw new Error(number.message);
  if (zero(n)) throw new Error(zero.message);

  return n * n;
}

l(sqr(10));
// l(sqr(0)); // error
// l(sqr('')); // error

function condition1(/* validators */) {
  var validators = _.toArray(arguments);

  return function(fun, arg) {
    var errors = mapcat(function(isValid) {
      return isValid(arg) ? [] : [isValid.message];
    }, validators);

    if (!_.isEmpty(errors))
      throw new Error(errors.join(', '));

    return fun(arg);
  };
}

var sqrPre = condition1(
  validator('arg must not be zero', complement(zero)),
  validator('arg must be a number', _.isNumber),
);

l(sqrPre(_.identity, 10));
// l(sqrPre(_.identity, '')); // error
// l(sqrPre(_.identity, 0)); // error

function uncheckedSqr(n) { return n * n; }

l(uncheckedSqr(''));

var checkedSqr = partial1(sqrPre, uncheckedSqr);

l(checkedSqr(10));
// l(checkedSqr('')); // error
// l(checkedSqr(0)); // error

var isEven = function(n) { return (n % 2) === 0; }

var sillySquare = partial1(
  condition1(validator('should be even', isEven)),
  checkedSqr
);

l(sillySquare(10));
// l(sillySquare(11)); // error
// l(sillySquare('')); // error
// l(sillySquare(0)); // error

var validateCommand = condition1(
  validator('arg must be a map', _.isObject),
  validator('arg must have the correct keys', hasKeys('msg', 'type'))
);

var createCommand = partial(validateCommand, _.identity);

// l(createCommand({})); // error
// l(createCommand(21)); // error
l(createCommand({msg: '', type: ''}));

var createLaunchCommand = partial1(
  condition1(
    validator('arg must have the count down', hasKeys('countDown'))
  ),
  createCommand
);

// l(createLaunchCommand({msg: '', type: ''})); // error
l(createLaunchCommand({msg: '', type: '', countDown: 10}));

//-- p147
function isntString(str) {
  return !_.isString(str);
}

l(isntString(1));

var isntString = _.compose(function(x) { return !x; }, _.isString);

l(isntString(1));

function not(x) { return !x; }

var isntString = _.compose(not, _.isString);

var composedMapcat = _.compose(splat(cat), _.map);

l(composedMapcat([[1, 2], [3, 4], [5]], _.identity));

var sqrPost = condition1(
  validator('result should be a number', _.isNumber),
  validator('result should not be a zero', complement(zero)),
  validator('result should be positive', greaterThen(0))
)

// l(sqrPost(_.identity, 0)); // error
// l(sqrPost(_.identity, -1)); // error
// l(sqrPost(_.identity, '')); // error
l(sqrPost(_.identity, 100)); // error

var megaCheckedSqr = _.compose(partial(sqrPost, _.identity), checkedSqr);

l(megaCheckedSqr(10));
// l(megaCheckedSqr(0)); // error
// l(megaCheckedSqr(NaN)); // error

//-- end of chapter.5

//-- start of chapter.6

//-- p152

function myLength(ary) {
  if (_.isEmpty(ary))
    return 0;
  else
    return 1 + myLength(_.rest(ary));
}

l(myLength(_.range(10)));

l(myLength([]));

l(myLength(_.range(1000)));

var a = _.range(10);

l(myLength(a));

l(a);

function cycle(time, ary) {
  if (time <= 0)
    return [];
  else
    return cat(ary, cycle(time - 1, ary));
}

l(cycle(2, [1, 2, 3]));

l(_.take(cycle(20, [1, 2, 3]), 11));

t(_.zip(['a', 'b', 'c'], [1, 2, 3]));

var zipped1 = [['a', 1]];

function constructPair(pair, rests) {
  return [construct(_.first(pair), _.first(rests)), construct(second(pair), second(rests))];
}

t(constructPair(['a', 1], [[], []]));

t(_.zip(['a'], [1]));

t(_.zip.apply(null, constructPair(['a', 1], [[], []])));

t(constructPair(['a', 1],
    constructPair(['b', 2],
      constructPair(['c', 3], [[], []]))));

function unzip(pairs) {
  if (_.isEmpty(pairs)) return [[], []];

  return constructPair(_.first(pairs), unzip(_.rest(pairs)));
}

t(unzip(_.zip([1, 2, 3], [4, 5, 6])));

// p157
var influences = [
  ['Lisp', 'Smalltalk'],
  ['Lisp', 'Scheme'],
  ['Smalltalk', 'Self'],
  ['Scheme', 'JavaScript'],
  ['Scheme', 'Lua'],
  ['Self', 'Lua'],
  ['Self', 'JavaScript']
];

function nexts(graph, node) {
  if (_.isEmpty(graph)) return [];

  var pair = _.first(graph);
  var from = _.first(pair);
  var to = second(pair);
  var more = _.rest(graph);

  if (_.isEqual(node, from))
    return construct(to, nexts(more, node));
  else {
      return nexts(more, node);
  }
}

l(nexts(influences, 'Lisp'));

// p159

function depthSearch(graph, nodes, seen) {
    if (_.isEmpty(nodes)) return rev(seen);

    var node = _.first(nodes);
    var more = _.rest(nodes);

    if (_.contains(seen, node))
      return depthSearch(graph, more, seen);
    else
      return depthSearch(graph, cat(nexts(graph, node), more), construct(node, seen));
}

l(depthSearch(influences, ['Lisp'], []));
l(depthSearch(construct(['Lua', 'Io'], influences), ['Lisp'], []));

// p161

function tcLength(ary, n) {
  var l = n ? n : 0;

  if (_.isEmpty(ary))
    return l;
  else
    return tcLength(_.rest(ary), l + 1);
}

l(tcLength(_.range(10)));

// p161
function andify(/* preds */) {
  var preds = _.toArray(arguments);

  return function(/* args */) {
    var args = _.toArray(arguments);

    var everything = function(ps, truth) {
      if (_.isEmpty(ps))
        return truth;
      else
        return _.every(args, _.first(ps)) && everything(_.rest(ps), truth);
    };

    return everything(preds, true);
  }
}

var evenNums = andify(_.isNumber, isEven);

l(evenNums(1, 2));
l(evenNums(2, 4, 6, 8));
l(evenNums(2, 4, 6, 8, 9));

function orify(/* preds */) {
  var preds = _.toArray(arguments);

  return function(/* args */) {
    var args = _.toArray(arguments);

    var everything = function(ps, truth) {
      if (_.isEmpty(ps))
        return truth;
      else
        return _.some(args, _.first(ps)) || everything(_.rest(ps), truth);
    };

    return everything(preds, false);
  }
}

var zeroOrOdd = orify(isOdd, zero);

l(zeroOrOdd());
l(zeroOrOdd(0, 2, 4, 6));
l(zeroOrOdd(2, 4, 6));

// p163
function evenSteven(n) {
  if (n === 0)
    return true;
  else
    return oddJohn(Math.abs(n) - 1);
}

function oddJohn(n) {
  if (n === 0)
    return false;
  else
    return evenSteven(Math.abs(n) - 1);
}

l(evenSteven(4));
l(oddJohn(11));

function flat(array) {
  if (_.isArray(array))
    return cat.apply(cat, _.map(array, flat));
  else
    return [array];
}

l(flat([[1, 2], [3, 4]]));

l(flat([[1, 2,], [3, 4, [5, 6, [[[7]]], 8]]]));

// p165
var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];
var y = _.clone(x);

t(y);
x[1]['c']['d'] = 100000;
t(y);

function deepClone(obj) {
  if (!existy(obj) || !_.isObject(obj))
    return obj;

  var temp = new obj.constructor();
  for (var key in obj)
    if (obj.hasOwnProperty(key))
      temp[key] = deepClone(obj[key]);

  return temp;
}

var x = [{a: [1, 2, 3], b: 42}, {c: {d: []}}];
var y = deepClone(x);

l(_.isEqual(x, y));

y[1]['c']['d'] = 42;

l(_.isEqual(x, y));

// p166
function visit(mapFun, resultFun, array) {
  if (_.isArray(array))
    return resultFun(_.map(array, mapFun));
  else
    return resultFun(array);
}

l(visit(_.identity, _.isNumber, 42));

l(visit(_.isNumber, _.identity, [1, 2, null, 3]));

l(visit(function(n) { return n * 2; }, rev, _.range(10)));

function postDepth(fun, ary) {
  return visit(partial1(postDepth, fun), fun, ary);
}

function preDepth(fun, ary) {
  return visit(partial1(preDepth, fun), fun, fun(ary));
}

l(postDepth(_.identity, influences));

l(postDepth(function(x) {
  if (x === "Lisp")
    return "LISP";
  else
    return x;
}, influences));

function influencedWithStrategy(strategy, lang, graph) {
  var results = [];

  strategy(function(x) {
    if (_.isArray(x) && _.first(x) === lang)
      results.push(second(x));

    return x;
  }, graph);

  return results;
}

l(influencedWithStrategy(postDepth, "Lisp", influences));

// l(evenSteven(100000)); // Uncaught RangeError: Maximum call stack size exceeded

// p170

function evenOline(n) {
  if (n === 0)
    return true;
  else
    return partial1(oddOline, Math.abs(n) - 1);
}

function oddOline(n) {
  if (n === 0)
    return false;
  else
    return partial1(evenOline, Math.abs(n) - 1);
}

l(evenOline(0));
l(oddOline(0));

l(oddOline(3));
l(oddOline(3)());
l(oddOline(3)()());
l(oddOline(3)()()());

function trampoline(fun /*, args */) {
  var result = fun.apply(fun, _.rest(arguments));

  while (_.isFunction(result)) {
    result = result();
  }

  return result;
}

l(trampoline(oddOline, 3));
l(trampoline(evenOline, 200000));
l(trampoline(oddOline, 300000));
// l(trampoline(evenOline, 200000000)); // too much time

function isEvenSafe(n) {
  if (n === 0)
    return true;
  else
    return trampoline(partial1(oddOline, Math.abs(n) - 1));
}

function isOddSafe(n) {
  if (n === 0)
    return false;
  else
    return trampoline(partial1(evenOline, Math.abs(n) - 1));
}

l(isOddSafe(200001));
l(isEvenSafe(200001));

// p172

l(_.take(cycle(20, [1, 2, 3]), 11));

function generater(seed, current, step) {
  return {
    head: current(seed),
    tail: function() {
      console.log("forced");
      return generater(step(seed), current, step);
    }
  };
}

function genHead(gen) { return gen.head; }
function genTail(gen) { return gen.tail(); }

var ints = generater(0, _.identity, function(n) { return n + 1; });

l(genHead(ints));
l(genTail(ints));

l(genTail(genTail(ints)));

function genTake(n, gen) {
  var doTake = function(x, g, ret) {
    if (x === 0)
      return ret;
    else
      return partial(doTake, x - 1, genTail(g), cat(ret, genHead(g)));
  };

  return trampoline(doTake, n, gen, []);
}

l(genTake(10, ints));
l(genTake(100, ints));
// l(genTake(1000, ints));
// l(genTake(10000, ints));
// l(genTake(100000, ints));
// l(genTake(1000000, ints));

// p178

var groupFrom = curry2(_.groupBy)(_.first);
var groupTo = curry2(_.groupBy)(second);

l(groupFrom(influences));
l(groupTo(influences));

function influenced(graph, node) {
  return _.map(groupFrom(graph)[node], second);
}

l(influencedWithStrategy(preDepth, 'Lisp', influences));

l(influenced(influences, 'Lisp'));

//-- end of chapter.6

//-- start of chapter.7

var rand = partial1(_.random, 1);

l(rand(10));

l(repeatedly(10, partial1(rand, 10)));

l(_.take(repeatedly(100, partial1(rand, 10)), 5));

function randString(len) {
  var ascii = repeatedly(len, partial1(rand, 26));
  return _.map(ascii, function(n) {
    return n.toString(36);
    // return String.fromCharCode(97 + n);
  }).join('');
}

l(randString(0));

l(randString(1));

l(randString(10));

// describe("_.map", function() {
//   it("should return an array made from...", function() {
//     expect(_.map([1, 2, 3], sqr)).toEqual([1, 4, 8]);
//   });
// });

// p185

function generateRandomCharacter() {
  return rand(26).toString(36);
}

function generateString(charGen, len) {
  return repeatedly(len, charGen).join('');
}

l(generateString(generateRandomCharacter, 20));

var composedRandomString = partial1(generateString, generateRandomCharacter);

l(composedRandomString(10));
