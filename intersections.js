var intersect = function(a, b) {
    if (a.length === 0) return b;
    return a.filter(function(x) {
        return b.indexOf(x) >= 0;
    });
};

module.exports = function(initialGroup, groupSize, intersectionsSize, getTable, callback) {
    if (initialGroup.length < 1) return callback(new Error("initialGroup must have at least 1 set of data"));
    if (groupSize < 2) return callback(new Error("groupSize must be at least 2"));
    if (intersectionsSize < 1) return callback(new Error("intersectionsSize must be at least 1"));

    var group = [];
    var intersections = [];

    initialGroup.forEach(function(initial) {
        group.push(initial.id);
        intersections = intersect(intersections, initial.data);
    });

    if (intersections.length < intersectionsSize) return callback(new Error("initialGroup does not have enough intersections"));

    if (group.length >= groupSize) {
        // TODO shuffle intersections first
        return callback(null, group, intersections.slice(0, intersectionsSize));
    }

    function asyncLoop() {
        getTable(function(err, table) {
            if (err) return callback(err);
            if (table.length == 0) return callback("no valid intersections found", group, intersections);
            var i = 0;

            while (i < table.length) {
                var next = table[i++];

                if (group.indexOf(next.id) < 0) {
                    var nextIntersections = intersect(intersections, next.data);

                    if (nextIntersections.length >= intersectionsSize) {
                        intersections = nextIntersections;
                        group.push(next.id);

                        if (group.length >= groupSize) {
                            return callback(null, group, intersections);
                        }
                    }
                }
            }

            return setImmediate(asyncLoop);
        });
    }

    asyncLoop();
};
