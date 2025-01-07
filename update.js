station_list = {

    "11-S":{
        "name": "11",
        "gate": "S",
        "route-id": 2004791,
        "route-seq": 1,
        "stop-seq": 7,
        "type": "minibus"
    },

    "11-M":{
        "name": "11M",
        "gate": "N",
        "route-id": 2004825,
        "route-seq": 1,
        "stop-seq": 3,
        "type": "minibus"
    },

    "91":{
        "name": "91",
        "gate": "S",
        "route-id": "91",
        "route-seq": 1,
        "stop-id": "B002CEF0DBC568F5",
        "type": "9bus",

    },

    "91M":{
        "name": "91M",
        "gate": "S",
        "route-id": "91M",
        "route-seq": 1,
        "stop-id": "B002CEF0DBC568F5",
        "type": "9bus",

    },

    "792M":{
        "name": "792M",
        "gate": "N",
        "route-id": "792M",
        "route-seq": 17,
        "stop-id": "003130",
        "type": "ctb",

    }

    }
    
    /**3592A0182BF020C7
     * 
     * 
     */


function updateStation(){
 //https://data.etagmb.gov.hk/eta/route-stop/2004791/1/7
    for(i in station_list){
        curr = station_list[i]


        url = "";

        if(curr["type"] == "minibus"){
            url = `https://data.etagmb.gov.hk/eta/route-stop/${curr["route-id"]}/${curr["route-seq"]}/${curr["stop-seq"]}`
        }
        else if(curr["type"] == "9bus"){
            url = `https://data.etabus.gov.hk/v1/transport/kmb/eta/${curr["stop-id"]}/${curr["route-id"]}/${curr["route-seq"]}`
        }
        else if(curr["type"] == "ctb"){
            url = `https://rt.data.gov.hk/v2/transport/citybus/eta/ctb/${curr["stop-id"]}/${curr["route-id"]}`
        }


        $.get({url: url, 
            success: (data) =>{
            eta = -1
            
            if(curr["type"] == "minibus"){
                eta = data["data"]["eta"][0]["diff"]
                if(eta == 0)
                    eta = data["data"]["eta"][1]["diff"]
            }
            else if(curr["type"] == "9bus"){
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
        }, async: false})
    }
}


$(document).ready( () =>{
    updateStation();
    setInterval(updateStation,5000);
})