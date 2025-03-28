station_list = {

    "11Y": {
        "name": "11Y",
        "gate": "N",
        "route-id": "2004791",
        "route-seq": "2",
        "stop-seq": "10",
        "type": "gmb"
    },

    "11Z": {
        "name": "11Z",
        "gate": "S",
        "route-id": "2004791",
        "route-seq": "1",
        "stop-seq": "7",
        "type": "gmb"
    },

    "11MZ": {
        "name": "11MZ",
        "gate": "N",
        "route-id": "2004825",
        "route-seq": "1",
        "stop-seq": "3",
        "type": "gmb"
    },


    "11SY": {
        "name": "11SY",
        "gate": "N",
        "route-id": "2004826",
        "route-seq": "2",
        "stop-seq": "10",
        "type": "gmb"
    },

    "11SZ": {
        "name": "11SZ",
        "gate": "S",
        "route-id": "2004826",
        "route-seq": "1",
        "stop-seq": "8",
        "type": "gmb"
    },

    "91Z": {
        "name": "91Z",
        "gate": "S",
        "route-id": "91",
        "route-seq": "1",
        "stop-id": "B002CEF0DBC568F5",
        "type": "kmb"

    },

    "91MY": {
        "name": "91MY",
        "gate": "N",
        "route-id": "91M",
        "route-seq": "2",
        "stop-id": "B3E60EE895DBBF06",
        "type": "kmb"

    },

    "91MZ": {
        "name": "91MZ",
        "gate": "S",
        "route-id": "91M",
        "route-seq": "1",
        "stop-id": "B002CEF0DBC568F5",
        "type": "kmb"

    },

    "91PZ": {
        "name": "91PZ",
        "gate": "S",
        "route-id": "91P",
        "route-seq": "1",
        "stop-id": "E9018F8A7E096544",
        "type": "kmb"

    },

    "291PY": {
        "name": "291PY",
        "gate": "S",
        "route-id": "291P",
        "route-seq": "1",
        "stop-id": "E9018F8A7E096544",
        "type": "kmb"

    },

    "792MZ": {
        "name": "792MZ",
        "gate": "N",
        "route-id": "792M",
        "route-seq": "17",
        "stop-id": "003130",
        "type": "ctb"

    }
};

content = {
    "11Y": {
        url: "",
        type: "gmb",
        content: "",
    },

    "11Z": {
        url: "",
        type: "gmb",
        content: "",
    },

    "11MZ": {
        url: "",
        type: "gmb",
        content: "",
    },


    "11SY": {
        url: "",
        type: "gmb",
        content: "",
    },

    "11SZ": {
        url: "",
        type: "gmb",
        content: "",
    },

    "91Z": {
        url: "",
        type: "kmb",
        content: "",
    },

    "91MY": {
        url: "",
        type: "kmb",
        content: "",
    },

    "91MZ": {
        url: "",
        type: "kmb",
        content: "",
    },

    "91PZ": {
        url: "",
        type: "kmb",
        content: "",
    },

    "291PY": {
        url: "",
        type: "kmb",
        content: "",
    },

    "792MZ": {
        url: "",
        type: "ctb",
        content: "",
    }
};

function precalStation(stnList) {
    // consider moving this out such that each route calls precal once
    for (const [stnKey, stnAtt] of Object.entries(stnList)) {
        switch (stnAtt.type) {
            case "gmb":
                content[stnKey].url = `https://data.etagmb.gov.hk/eta/route-stop/${stnAtt["route-id"]}/${stnAtt["route-seq"]}/${stnAtt["stop-seq"]}`;
                break;
            case "kmb":
                content[stnKey].url = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${stnAtt["stop-id"]}/${stnAtt["route-id"]}/${stnAtt["route-seq"]}`;
                break;
            case "ctb":
                content[stnKey].url = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${stnAtt["stop-id"]}/${stnAtt["route-id"]}`;
                break;
        }
    }
}


layoutList = {
    // works on overriding, first element overrides second and so on elements
    // dow 0 Sun, 1 Mon

    // midnight 2 for 11S -> CHH 0000 dept
    // midnight 1 for 11S -> HAH 0030 dept
    midnight2: {},
    midnight1: {},
    // return peak -> 91P
    peak: {},
    // default + fallback
    normal: {
        dow: [-1, 0, 1, 2, 3, 4, 5, 6],
        startTime: [0, 0],
        endTime: [23, 59],
        layout: {
            S1: "91MZ",
            S2: "91Z",
            S3: "11Z",
            N1: "792MZ",
            N2: "91MY",
            N3: "11MZ" //"11Y"], 
        }
    }



}



function updateLayout() {

    for (const [layoutKey, rtNum] of Object.entries(layoutList.normal.layout)) {
        updateStation(rtNum);
        document.getElementById(layoutKey).innerText = content[rtNum].content;
        document.getElementById(layoutKey+"Num").innerText = rtNum;
    }
    //document.getElementById(this).innerText = content.,)
}

async function updateStation(routeNum) {
    try {
        const response = await fetch(content[routeNum].url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        let data = await response.json();
        var eta = "--";
        if (content[routeNum]["type"] == "gmb") {
            eta_str = data["data"]["eta"][0]["timestamp"]
            time_diff = Date.parse(eta_str) - new Date()

            if (time_diff <= 0) {

                eta_str = data["data"]["eta"][1]["timestamp"]
                time_diff = Date.parse(eta_str) - new Date()
            }

            eta = Math.floor(time_diff / 60000)

        }

        else if (content[routeNum]["type"] == "kmb") {
            eta_str = data["data"][0]["eta"]
            time_diff = Date.parse(eta_str) - new Date()

            if (time_diff <= 0) {

                eta_str = data["data"][1]["eta"]
                time_diff = Date.parse(eta_str) - new Date()
            }

            eta = Math.floor(time_diff / 60000)

        }
        else if (content[routeNum]["type"] == "ctb") {
            eta_str = data["data"][0]["eta"]
            time_diff = Date.parse(eta_str) - new Date()

            if (time_diff <= 0) {

                eta_str = data["data"][1]["eta"]
                time_diff = Date.parse(eta_str) - new Date()
            }

            eta = Math.floor(time_diff / 60000)

        }
        content[routeNum].content = eta;
    }
    catch (error) {
        console.error(error.message);
    }
}

function oldupdateStation() {
    $.get({
        url: url,
        success: (data) => {
            eta = "--";

            if (curr["type"] == "gmb") {
                eta_str = data["data"]["eta"][0]["timestamp"]
                time_diff = Date.parse(eta_str) - new Date()

                if (time_diff <= 0) {

                    eta_str = data["data"]["eta"][1]["timestamp"]
                    time_diff = Date.parse(eta_str) - new Date()
                }

                eta = Math.floor(time_diff / 60000)

            }

            else if (curr["type"] == "kmb") {
                eta_str = data["data"][0]["eta"]
                time_diff = Date.parse(eta_str) - new Date()

                if (time_diff <= 0) {

                    eta_str = data["data"][1]["eta"]
                    time_diff = Date.parse(eta_str) - new Date()
                }

                eta = Math.floor(time_diff / 60000)

            }
            else if (curr["type"] == "ctb") {
                eta_str = data["data"][0]["eta"]
                time_diff = Date.parse(eta_str) - new Date()

                if (time_diff <= 0) {

                    eta_str = data["data"][1]["eta"]
                    time_diff = Date.parse(eta_str) - new Date()
                }

                eta = Math.floor(time_diff / 60000)

            }

            $(`#${i}`).html(eta)
            // without async, it complains CORS (cross site data transfer not same domain shit)
        }
    })
    //}, async: false}) 
}


async function fetchTime(retries = 30, delay = 200) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Hong_Kong', { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            let data = await response.json();
            return new Date(data.utc_datetime); // Successfully fetched time
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
            } else {
                console.error("All retry attempts failed.");
                return new Date(); // Return local time as fallback
            }
        }
    }
}

dateDoW = -1;
dateHour = -1;
dateMinute = -1;

async function startClock() {
    let currentTime = await fetchTime();
    document.getElementById('timeSynced').innerText = "Last synced: " + currentTime.toLocaleTimeString();
    console.log("Time synced successfully at: " + currentTime.toLocaleTimeString());

    function updateClock() {
        currentTime = new Date(currentTime.getTime() + 1000);
        document.getElementById('time').innerText = currentTime.toLocaleTimeString();

        // update global Day of Week, Hour, and Minute
        dateDoW = currentTime.getDay();
        dateHour = currentTime.getHours();
        dateMinute = currentTime.getMinutes();
    }

    // Align first update with the next full second
    let msToNextSecond = 1000 - (currentTime.getMilliseconds());
    setTimeout(() => {
        updateClock(); // First update precisely at the next full second
        setInterval(updateClock, 1000);
    }, msToNextSecond);

    // Resync every hour
    setInterval(async () => {
        console.log("Resyncing clock...");
        currentTime = await fetchTime();
        document.getElementById('timeSynced').innerText = "Last synced: " + currentTime.toLocaleTimeString();
        console.log("Synced successfully at: " + currentTime.toLocaleTimeString());
    }, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 ms
}


$(document).ready(() => {
    //precalStation(station_list);
    //setInterval(precalStation(station_list),18000000);
    //updateStation();
    precalStation(station_list);
    setInterval(updateLayout, 5000);
    //startClock();
})