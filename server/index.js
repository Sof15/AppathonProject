const express = require('express');
const axios = require('axios');
const httprequest = require('xmlhttprequest').XMLHttpRequest;


const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

const scrapSteam = require("./scrapeFlights");
const weatherData = require('./weatherData');

app.get('/routes',async (req, res) => {
  res.send(await scrapSteam());
  return res;
});  

//create dictionaries with key: destination_device_ids value: array of path ids
//create dictionaries with key: path_ids value: array of origin_device_ids

async function createDicts() {

  let res = await axios.get('http://feed.opendata.imet.gr:23577/itravel/paths.json');

  let temp = res.data
  
  destDict = {}
  pathDict = {}
  for(var i = 0; i < temp.length; i++) {
      path = temp[i]
      if (!(path.Path_destination_device_id in destDict)){
        destDict[path.Path_destination_device_id]=[path.Path_id]
      }
      else{
        destDict[path.Path_destination_device_id].push(path.Path_id)
      }
      
      pathDict[path.Path_id]=path.Path_origin_device_id
      
  }
  return [destDict, pathDict] 
}

//efedriko gt eleos pia me ton server 
async function getDuration() {

  let res = await axios.get('http://feed.opendata.imet.gr:23577/itravel/traveltimes.json');

  let temp = res.data
  
  pathDurDict = {}

  for(var i = 0; i < temp.length; i++) {
      path = temp[i]      
      pathDurDict[path.Path_id]=path.Duration
  }
  return pathDurDict
}

function calculateTime(destId, transits, sum ,parent) {
  
  if (parent.includes(destId) && transits!=-1)
  {
    return [[],[[]]]
  }
  else if (transits == -1){
    parent=parent.reverse()
    return [[sum],[parent]]
  }
  else{
  
    //https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
    var durations = [], parents = []
    var tempList = destDict[destId];
    var questions = []
    
    /*var xmlHttp = new httprequest();
     for (var i = 0; i< destDict[destId].length ; i++ ){
      console.log(1)
      xmlHttp.open( "GET", 'http://147.102.16.156:8080/services/getPathDuration/'+destDict[destId][i], false );
      console.log(2)
      xmlHttp.send();
      console.log(xmlHttp.status)
      questions.push(xmlHttp.responseText)
      //console.log('response:',xmlHttp.responseText,'status:', xmlHttp.status)//,'http://147.102.16.156:8080/services/getPathDuration/'+destDict[destId][i]);
    } */
      for (var i = 0; i< destDict[destId].length ; i++ ){
        if (!(destDict[destId][i] in pathDurDict)){ 
          questions.push('The id you entered matches no known path id. Please try again.')
        }else{
          questions.push(pathDurDict[destDict[destId][i]])
        }
      }
      //console.log(questions)
      var parents = []
      var prevParent = destId
      for(var idx=0; idx<questions.length; idx++){
        if (questions[idx]!='The id you entered matches no known path id. Please try again.'){ 

          destId = pathDict[tempList[idx]]
  
            if (transits-1==-1){
              rec = calculateTime(destId, transits-1, sum,parent.concat(prevParent))
            }else{
              rec = calculateTime(destId, transits-1, sum+parseInt(questions[idx]), parent.concat(prevParent))
            }
            
            if (rec[1].length==0){continue}
            for (var j=0; j<parents.length; j++){
              if (rec[1][0].length==0){break}
              if (parents[j].toString()==rec[1][0].toString()){break;}              
            }
            
            if (j==parents.length && rec[1][0].length>0){
              durations = durations.concat(rec[0])
              parents = parents.concat(rec[1])
            }
        }
      }  
    return [durations,parents]
  }
 
}

app.get('/duration/:transit',async (req, res) => {
  myDicts = await createDicts()
  pathDict = myDicts[1]
  destDict = myDicts[0]
  pathDurDict = await getDuration()
  
  transits = parseInt(req.params.transit) +1
  result = calculateTime('49', transits , 0,[],[])
  resultJSON=[]

  for (var j=0; j<result[0].length; j++){
    resultJSON.push({'duration': result[0][j], 'path':result[1][j]})
  }
  
  res.send(resultJSON);
  return res;
}); 

app.get('/weather',async (req, res) => {
  mins = await weatherData(req.query.deviceId, req.query.unixTime)
  res.send(mins)
  return res
});


const corsConfig = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
}

app.use(corsConfig);

app.listen(port, () => console.log(`Server listening on port ${port}!`));