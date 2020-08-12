const puppeteer = require('puppeteer');

async function getTimetable(){
    const browser = await puppeteer.launch({ headless: true }); 
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 926 });
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    // desirable format
    let currentTime = year + "-" + month + "-" + date + "T" + hours + "%3A" + minutes + "%3A" + seconds;
    await page.goto("https://www.skg-airport.gr/en/flight-list#flightsandmore/type=departure/"+currentTime,{waitUntil: 'networkidle2'});

   
    /** @type {string[]} */
    var flightInfo = await page.evaluate(()=>{
        var div = document.querySelectorAll( " #fra_flightsandmore > div > div.fra_section_content.fra_section_content__flight > div.container-fluid.fra_js_flight_items_outer_container > div.fra_flight_table__container.fra_js_flight_table__container  > div.fra_table_responsive.fra_table_flights > ul ");
        
        var flights = [] 
        div.forEach(element => { 
            var schTime = element.querySelector("[class='fra_table_td fra_table_td__time']");
            var dest = element.querySelector("[class='fra_table_td fra_table_td__destination']");
            var airline = element.querySelector("[class='fra_table_td fra_table_td__airline']");
            var code = element.querySelector("[class='fra_table_td fra_table_td__flightnr fra_table_mobile_spacer'] > strong");

            if(schTime != null){
                flights.push({
                  scheduledTime:   schTime.textContent,
                  destination: dest.textContent,
                  airline: airline.textContent,
                  flight: code.textContent
                });
            }
        });

        return flights
    })
    var result = flightInfo
    
    
    browser.close()
    return result
}


module.exports = getTimetable;


