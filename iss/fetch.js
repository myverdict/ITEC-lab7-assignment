let url = "https://api.wheretheiss.at/v1/satellites/25544"          // ISS API URL

// Get the reference id's for the latitude & longitude from the .html file
let issLat = document.querySelector("#iss-lat")
let issLong = document.querySelector("#iss-long")
let timeIssLocationFetched = document.querySelector("#time")

let update = 10000                         // 10000 milliseconds = 10 seconds
let maxFailedAttempts = 3

let issMarker
let issIcon = L.icon({
    iconUrl: "iss_icon.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})

let map = L.map("iss-map").setView([0,0], 1)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

iss(maxFailedAttempts)                                      // call function one time to start
// setInterval(iss, update)                   // 10 seconds wait

function iss(attempts) {
    if(attempts <= 0)
    {
        alert("Failed to contact ISS server after several attempts.")
        return                               // stop processing
    }

    // fetch returns promise
    fetch(url).then( (res) => {
        // process response into JSON, whatever is returned from here goes into issData
        return res.json()                   // res.json also returns a promise
    }).then( (issData) => {
        console.log(issData)                // display data on webpage
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long

        // create marker if it does not exist
        // move marker if it does exist
        if(!issMarker)
        {
            // Create the marker
            issMarker = L.marker([lat, long], {icon: issIcon}).addTo(map)
        }
        else
        {
            issMarker.setLatLng([lat, long])
        }

        // Print the fetched date and time
        let now = Date()
        timeIssLocationFetched.innerHTML = `This data was fetched at ${now}.`
    }).catch( (err) => {
        attempts = attempts - 1         // subtract 1 from no. of attempts, attempts--
        console.log("ERROR", err)
    }).finally( () => {
        setTimeout(iss, update, attempts)
    })
}









/*
// Writing the fetch in a more concise way
fetch(url)
    .then( (res) => res.json())                     // process response into JSON
    .then( (issData) => console.log(issData))       // display data on webpage
    .catch( (err) => console.log("ERROR", err) )
*/