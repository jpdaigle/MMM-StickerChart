Module.register("MMM-StickerChart", {

    // Default module config.
    defaults: {
        text: "Hello world"
    },

    drawStickerChart: function(header, curValue, maxValue)
    {
        console.log(">>> stickerchart: " + header);
        var elChart = document.createElement("div");
        var elHdr = document.createElement("span");
        elHdr.innerText = header;
        elHdr.classList.add('bright');
        elChart.appendChild(elHdr);

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
            elChart.appendChild(marker(true, 'face-smile'));
        }
        for(var i = 0; i < curValue; i++) {
            elChart.appendChild(marker(false, 'face-smile'));
        }

        return elChart;
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;

        wrapper.appendChild(this.drawStickerChart("Chloé", 5, 10));

        return wrapper;
    }
});