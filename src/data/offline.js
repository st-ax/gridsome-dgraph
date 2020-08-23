const Dexie = require("dexie").default

const VERSION = 1,
    offDB = new Dexie("DemoDexie")
    .version(VERSION)
    .stores({
        people: "uid,name",
        revisions: "revid,uid,prop",
        friendships: "[s+o],s,o",
    }).db

module.exports = { offDB }