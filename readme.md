# Bus ETA Report for Hall 8 lab

This was made because it was annoying to take out phone and check how long until bus arrives and then run up when it was too late. With this, I can be constantly reminded when to leave the lab.

First project by Side project and Yapping sub team.

V1 made by marco lk network and Nicholas did some shit to it

V2 is a from-the-ground-up rewrite of the Javascript component used to update the ETA and clock by Planeson, aimed to increase functionality and efficiency.
Room is left for using slots for non-ETA objects like images and animations, as well as replacing route numbers with actual displays.

The clock is synced automatically every hour from https://www.timeapi.io/api/timezone/zone?timeZone=Asia%2FHong_Kong
The clock is the central time-keeping component used to calculate delta from given ETA timestamp.
If the page is paused, the clock is paused as well. Refresh page to get updated time.

The html probably only works if started in a server due to CORS policies of the GMB ETA server. Optionally use a no-cors proxy to bypass this requirement.

Font used is Open Sans.
Reference: https://fonts.googleapis.com/css?family=Open Sans

Layout is updated every minute. The cycling is done every 3 seconds (const displayTime).

**Screenshot**
![Screenshot](screenshot.jpg)
V1

![Screenshot](ScreenshotV2.jpg)
V2

Meant for 1080p displays.




**API references**

Citybus shit
<https://www.citybus.com.hk/datagovhk/bus_eta_api_specifications.pdf>
<https://www.citybus.com.hk/datagovhk/bus_eta_data_dictionary.pdf>

KMB shit
<https://data.etabus.gov.hk/datagovhk/kmb_eta_api_specification.pdf>
<https://data.etabus.gov.hk/datagovhk/kmb_eta_data_dictionary.pdf>

GMB shit
<https://data.etagmb.gov.hk/static/GMB_ETA_API_Specification.pdf>
