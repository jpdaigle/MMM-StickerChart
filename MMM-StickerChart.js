Module.register("MMM-StickerChart", {

    // Default module config.
    defaults: {
        charts: []
    },

    drawStickerChart: function(header, curValue, maxValue)
    {
        console.log(">>> stickerchart: " + header);
        var elChart = document.createElement("tr");
        var elHdr = document.createElement("td");
        elHdr.innerText = header;
        elHdr.classList.add('bright');
        const elTdStickers = document.createElement("td");
        elChart.appendChild(elHdr);
        elChart.appendChild(elTdStickers);

        function marker(bFilled, sMarker) {
            var chk = document.createElement("i");
            chk.style.textShadow = '0px 0px 8px #000000';
            chk.classList.add('fa-fw');
            if (bFilled) {
                chk.classList.add(`fa-${sMarker}`, 'bright');
                chk.classList.add('fa-solid');
                chk.style.color = 'green';
            } else {
                chk.classList.add(`fa-circle`, 'fa-regular');
            }
            return chk;
        }

        for(var i = 0; i < curValue; i++) {
            elTdStickers.appendChild(marker(true, 'face-smile'));
        }
        for(var i = curValue; i < maxValue; i++) {
            elTdStickers.appendChild(marker(false, 'face-smile'));
        }

        return elChart;
    },

    // Override dom generator.
    getDom: function() {
        console.log(this.config);
        const _this = this;

        var wrapper = document.createElement("div");
        const tblElement = document.createElement("table");
        wrapper.appendChild(tblElement);
        this.chartData.forEach(function(chartState){
            console.log(chartState, chartState.name);
            wrapper.appendChild(_this.drawStickerChart(chartState.name, chartState.value, chartState.max));
        });
        return wrapper;
    },

    start: function start() {
        requestData();
        this.refreshtimer = setInterval(requestData, 10000);
    },

    requestData: function requestData() {
        // we have a google sheets URL in config.sheets_url, let's send it to the backend to fetch + parse
        this.sendSocketNotification("STICKERCHART_LOAD_URL", {sheets_url: this.config.sheets_url});
    },

    socketNotificationReceived: function(notification, payload) {
        console.log("RX>", notification, payload);
        this.chartData = payload;
        this.updateDom();
    },

});