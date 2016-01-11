var intersect = function(a, b) {
    return a.filter(function(x) {
        return b.indexOf(x) >= 0;
    });
};

module.exports = function(groupSize, intersectionSize, getTable, callback) {
    if (groupSize < 2) return callback(new Error("groupSize must be at least 2"));
    if (intersectionSize < 1) return callback(new Error("intersectionSize must be at least 1"));

    var group = [];
    var intersections = [];

    function asyncLoop() {
        getTable(function(err, table) {
            if (err) return callback(err);
            var i = 0;

            // find initial seed
            while (group.length === 0) {
                var initial = table[i++];
                // if initial has enough things
                if (initial.data.length >= intersectionSize) {
                    intersections = initial.data;
                    group.push(initial.id);
                } else {
                    if (i >= table.length) {
                        return setImmediate(asyncLoop);
                    }
                }
            }

            // loop through available table
            while (i < table.length) {
                var next = table[i++];
                if (group.indexOf(next.id) < 0) {
                    var nextIntersections = intersect(intersections, next.data);
                    // if we have a good intersection
                    if (nextIntersections.length >= intersectionSize) {
                        intersections = nextIntersections;
                        group.push(next.id);
                        // if we have enough group
                        if (group.length >= groupSize) {
                            return callback(null, group, intersections);
                        }
                    }
                }
            }

            return setImmediate(asyncLoop);
        });
    }

    setImmediate(asyncLoop);
};
