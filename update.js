station_list = {

    "11Z":{
        "name": "11Z",
        "gate": "S",
        "route-id": "2004791",
        "route-seq": "1",
        "stop-seq": "7",
        "type": "gmb"
    },

    "11MZ":{
        "name": "11MZ",
        "gate": "N",
        "route-id": "2004825",
        "route-seq": "1",
        "stop-seq": "3",
        "type": "gmb"
	},
	

    "11SY":{
        "name": "11SY",
        "gate": "N",
        "route-id": "2004826",
        "route-seq": "2",
        "stop-seq": "10",
        "type": "gmb"
    },

    "11SZ":{
        "name": "11SZ",
        "gate": "S",
        "route-id": "2004826",
        "route-seq": "1",
        "stop-seq": "8",
        "type": "gmb"
    },

    "91Z":{
        "name": "91Z",
        "gate": "S",
        "route-id": "91",
        "route-seq": "1",
        "stop-id": "B002CEF0DBC568F5",
        "type": "kmb"

    },

    "91MY":{
        "name": "91MY",
        "gate": "N",
        "route-id": "91M",
        "route-seq": "2",
        "stop-id": "B3E60EE895DBBF06",
        "type": "kmb"
	
    },

    "91MZ":{
        "name": "91MZ",
        "gate": "S",
        "route-id": "91M",
        "route-seq": "1",
        "stop-id": "B002CEF0DBC568F5",
        "type": "kmb"

    },

    "91PZ":{
        "name": "91PZ",
        "gate": "S",
        "route-id": "91P",
        "route-seq": "1",
        "stop-id": "E9018F8A7E096544",
        "type": "kmb"

    },

    "792MZ":{
        "name": "792MZ",
        "gate": "N",
        "route-id": "792M",
        "route-seq": "17",
        "stop-id": "003130",
        "type": "ctb"

    }
};

precalStationList = [];

function precalStation(stnList){
	// consider moving this out such that each route calls precal once
    stnList.forEach((curr, i) => {
        switch (curr.type){
		case "gmb":
            precalStationList.push({"name": curr.name,
                                    "url": `https://data.etagmb.gov.hk/eta/route-stop/${curr["route-id"]}/${curr["route-seq"]}/${curr["stop-seq"]}`}
                                    );
			break;
        case "kmb":
			precalStationList.push({"name": curr.name,
                                    "url": `https://data.etabus.gov.hk/v1/transport/kmb/eta/${curr["stop-id"]}/${curr["route-id"]}/${curr["route-seq"]}`}
                                    );
			break;
        case "ctb":
			precalStationList.push({"name": curr.name,
                                    "url": `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${curr["stop-id"]}/${curr["route-id"]}`}
                                    );
			break;
        }
	});
}


layoutList = {
    // works on overriding, first element overrides second and so on elements
    // midnight 2 for 11S -> CHH 0000 dept
    // midnight 1 for 11S -> HAH 0030 dept
	midnight2: {},
	midnight1: {},
    // return peak -> 91P
	peak: {},
	normal:{
	    dow: [1, 2, 3, 4, 5],
	    startTime: [0, 0],
	    endTime: [23, 59],
	    layout: {
	        S1: "792MZ",
	        S2: "91MY",
	        S3: "11MZ", 
	        
	    }
	}
	


}

function checkTime(){
	const now = new Date();
	
}
    


function updateStation(){
        $.get({url: url, 
            success: (data) =>{
            eta = "--";
            
            if(curr["type"] == "gmb"){
                eta_str = data["data"]["eta"][0]["timestamp"]
                time_diff = Date.parse(eta_str) - new Date()

                if(time_diff <= 0){

                    eta_str = data["data"]["eta"][1]["timestamp"]
                    time_diff = Date.parse(eta_str) - new Date()
                }

                eta =  Math.floor(time_diff / 60000)

            }

            else if(curr["type"] == "kmb"){
                eta_str = data["data"][0]["eta"]
                time_diff = Date.parse(eta_str) - new Date()

                if(time_diff <= 0){
                        
                    eta_str = data["data"][1]["eta"]
                    time_diff = Date.parse(eta_str) - new Date()
                }

                eta =  Math.floor(time_diff / 60000)

            }
            else if(curr["type"] == "ctb"){
                eta_str = data["data"][0]["eta"]
                time_diff = Date.parse(eta_str) - new Date()

                if(time_diff <= 0){
                        
                    eta_str = data["data"][1]["eta"]
                    time_diff = Date.parse(eta_str) - new Date()
                }

                eta =  Math.floor(time_diff / 60000)

            }

            $(`#${i}`).html(eta)
		// without async, it complains CORS (cross site data transfer not same domain shit)
        }})
        //}, async: false}) 
}


$(document).ready( () =>{
	//precalStation(station_list);
	//setInterval(precalStation(station_list),18000000);
    //updateStation();
    //setInterval(updateStation, 5000);
	startClock();
})

async function fetchTime(retries = 10, delay = 1000) {
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

async function startClock() {
    let currentTime = await fetchTime();
	document.getElementById('timeSynced').innerText = "Last synced: "+currentTime.toLocaleTimeString();

    function updateClock() {
        currentTime = new Date(currentTime.getTime() + 1000);
        document.getElementById('time').innerText = currentTime.toLocaleTimeString();
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
        currentTime = await fetchHKTime();
    }, 5 * 60 * 1000); // 60 minutes * 60 seconds * 1000 ms
}

// Update the time immediately
//updateTime();
// Optionally, update the time every minute
//setInterval(updateTime, 60000);