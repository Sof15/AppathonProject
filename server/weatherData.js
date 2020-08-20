const httprequest = require('xmlhttprequest').XMLHttpRequest;

function weatherData(deviceId,unixTime){
    var xmlHttp = new httprequest();
    xmlHttp.open( "GET", 'http://feed.opendata.imet.gr:23577/itravel/devices.json/', false );
    xmlHttp.send(); 
    devices_info = xmlHttp.responseText
    var lat = 40.6
    var lon = 22.9
    for(var i = 0; i < devices_info.length; i++) {
        if (devices_info[i].device_id==deviceId){
            lat = devices_info[i].lat
            lon = devices_info[i].lon
        }
    }  

    var xmlHttp2 = new httprequest();
    xmlHttp2.open( "GET", 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=daily&appid=ddb55d4e22587237ae65ac536ce45503', false );
    xmlHttp2.send();
    let temp = xmlHttp2.responseText;
    hourlyData = JSON.parse(temp).hourly
    weather=""
    for (var i in hourlyData){
        //console.log(unixTime/1000)
        if (hourlyData[i].dt==unixTime/1000){
            weather = hourlyData[i].weather[0].description
            
            break
        }
        
    }
    
    if (weather=='light rain' || weather=='fog' || weather=='scattered clouds'){
        minutes = '20'
    }else if (weather=='moderate rain' || weather=='broken clouds'){
        minutes = '25'
    }else if (weather=='heavy intensity rain' || weather=='very heavy rain'){
        minutes = '30'
    }else{
        minutes = '15'
    }          
          
    return minutes
 
}

//console.log(weatherData());
module.exports = weatherData;


