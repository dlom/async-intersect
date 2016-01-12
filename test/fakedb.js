// kill it with fire

module.exports = function(DISTINCT_THINGS, DATA_COUNT, MAX_SIZE) {
    var things = [];
    for (var i = 1; i <= DISTINCT_THINGS; i++) {
        things.push(i);
    }

    var randInt = function(f, c, i) {
        if (c == null) {
            c = f;
            f = 0;
        }
        if (i) {
            c++;
        }
        return Math.ceil(Math.random() * (c - f)) + f - 1;
    };

    var randSlice = function(l) {
        var a = [];
        if (l > things.length) throw new Error("die");
        while (a.length < l) {
            var thing = things[randInt(things.length)];
            if (a.indexOf(thing) < 0) {
                a.push(thing);
            }
        }
        return a;
    };

    var globalCounter = 1;
    var asyncGetThingsBatch = function(x, callback) {
        var manyThings = [];
        for (var i = 0; i < x; i++) {
            if (globalCounter >= MAX_SIZE) return callback(null, manyThings);
            var numThings = randInt(DATA_COUNT - 5, DATA_COUNT + 5, true);
            manyThings.push({
                "id": globalCounter++,
                "data": randSlice(numThings)
            });
        }
        callback(null, manyThings);
    };

    var getData = function(x) {
        return asyncGetThingsBatch.bind(null, x);
    };

    getData.createSeed = function() {
        return {
            "id": 0,
            "data": randSlice(DATA_COUNT)
        };
    };

    return getData;
};
