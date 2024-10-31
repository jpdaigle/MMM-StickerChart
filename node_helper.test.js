const test = require('node:test');
const assert = require('node:assert');
const moduleAlias = require("module-alias");
moduleAlias.addAliases({ node_helper: "magicmirror/js/node_helper.js", logger: "../js/logger.js" });

var Module = require("./node_helper.js");
var nh = new Module();
nh.setName("MMM-StickerChart");

const { is3xxRedirect, csvParseStickerchartData } = Module.testonly;

function mockResponse(code, headers) {
    return {
        statusCode: code,
        headers: headers
    };
}


test('is3xxRedirectFalseTest', () => {
    assert.equal(is3xxRedirect(mockResponse(200, {})), false);
    assert.equal(is3xxRedirect(mockResponse(301, {})), false);
    assert.equal(is3xxRedirect(mockResponse(404, {location: 'http://example.com'})), false);
});

test('is3xxRedirectTrueTest', () => {
    assert.equal(is3xxRedirect(mockResponse(301, {location: 'http://example.com'})), true);
});


test('parseCsvEmpty', () => {
    assert.deepEqual(
        csvParseStickerchartData('foo bar baz'),
        [],
        'should be empty array'
    );
});