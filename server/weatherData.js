const httprequest = require('xmlhttprequest').XMLHttpRequest;

function weatherData(deviceId,unixTime){
    /* var xmlHttp = new httprequest();
    xmlHttp.open( "GET", 'http://147.102.16.56:8080/services/getDeviceCoords/'+deviceId, false );
    xmlHttp.send(); */
   
    var lat = 40.6
    var lon = 22.9     

    var xmlHttp2 = new httprequest();
    xmlHttp2.open( "GET", 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=daily&appid=ddb55d4e22587237ae65ac536ce45503', false );
    xmlHttp2.send();
    //console.log('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=daily&appid=ddb55d4e22587237ae65ac536ce45503')
    let temp = xmlHttp2.responseText;

    hourlyData = JSON.parse(temp).hourly
    weather=""
    for (var i in hourlyData){
        console.log(unixTime/1000)
        if (hourlyData[i].dt==unixTime/1000){
            weather = hourlyData[i].weather[0].description
            console.log(weather)
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

console.log(weatherData());
module.exports = weatherData;


