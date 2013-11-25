var test = require("tape")

var processes = require("../index")

test("processes is a function", function (assert) {
    assert.equal(typeof processes, "function")
    assert.end()
})
