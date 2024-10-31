var NodeHelper = require("node_helper");
var https = require('https');

function is3xxRedirect(res) {
    if (res.statusCode >= 300 && res.statusCode < 400) {
        if (res.headers.location) {
            return true;
        }
    }
    return false;
}

async function fetchWithRedirects(url) {
    console.log("STICKER> starting fetch:" + url);
    return new Promise((resolve, reject) => {
        let body = '';
        const request = https.get(url, (response) => {
            const { statusCode } = response;

            if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
                // Handle redirects
                fetchWithRedirects(response.headers.location)
                    .then(resolve)
                    .catch(reject);
            } else if (statusCode < 200 || statusCode >= 300) {
                reject(new Error(`HTTP error: ${statusCode}`));
            } else {
                response.on('data', (chunk) => {
                    body += chunk;
                });
                response.on('end', () => {
                    resolve(body);
                });
            }
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end();
    });
}

/* Really dumb CSV parser, doesn't handle escaping, quotes, commas in data, etc. */
function csvParseStickerchartData(body) {
    let lines = body.split('\n');
    let parsed_stickers = [];
    for (let i = 0; i < lines.length; i++) {
        let cols = lines[i].split(',');
        if (cols.length < 3) {
            // skip line, invalid
            continue;
        }
        const [stickerName, str2, str3] = cols;
        const stickerMax = parseInt(str2);
        const stickerCur = parseInt(str3);

        if (isNaN(stickerMax) || isNaN(stickerCur) || !stickerName)
            continue;

        parsed_stickers.push({ name: stickerName, max: stickerMax, value: stickerCur });
    }
    return parsed_stickers;
}

function fetchAndParse(csv_url, payload_listener) {
    fetchWithRedirects(csv_url)
        .then(data => csvParseStickerchartData(data))
        .then(stickerdata => payload_listener(stickerdata));
}


module.exports = NodeHelper.create({

    socketNotificationReceived: function (notification, payload) {
        var self = this;
        console.log("STICKERCHART> rx notification, " + notification + " " + payload);
        if (notification == 'STICKERCHART_LOAD_URL') {
            // load and parse, then send back the payload
            fetchAndParse(payload.sheets_url, function (sticker_state_array) {
                if (!sticker_state_array)
                    return;
                self.sendSocketNotification('STICKERCHART_LOADED', sticker_state_array);
            });
        }
    }

});

module.exports.testonly = {
    is3xxRedirect: is3xxRedirect,
    csvParseStickerchartData: csvParseStickerchartData
}