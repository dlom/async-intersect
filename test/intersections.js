var NUMBER_OF_SHOWS = 100;
var AVERAGE_PTW_SIZE = 30;
var BATCH_SIZE = 128;

var HYPOTHETICAL_USERS_IN_DB = 30000;

var GROUP_SIZE = 8;
var SEASON_SIZE = 7;

var tape = require("tape");
var findIntersections = require("../index");
var fakedb = require("./fakedb")(NUMBER_OF_SHOWS, AVERAGE_PTW_SIZE, HYPOTHETICAL_USERS_IN_DB);

tape("findIntersections", function(t) {
    t.plan(1);
    findIntersections([fakedb.createSeed()], GROUP_SIZE, SEASON_SIZE, fakedb(BATCH_SIZE), function(err, group, intersections, isIncomplete) {
        if (err) throw err;
        console.log(group);
        console.log(intersections);
        if (isIncomplete) {
            console.log("not enough valid intersections found");
        }
        t.assert(intersections.length <= SEASON_SIZE);
    });
});
