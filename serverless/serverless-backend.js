 const fetch = require('node-fetch');
 exports.helloWorld = async (req, res) => {
   res.set('Access-Control-Allow-Origin', "*")
   res.set('Access-Control-Allow-Methods', 'GET, POST');
 
   if (req.method === "OPTIONS") {
     // stop preflight requests here
     res.status(204).send('');
     return;
   }
   if(req.method != "GET" || req.path !="/") return res.status(400).send(JSON.stringify({"error":"unsupported method/route"}));
 
   function getdatestrnow() {
       const today = new Date()
       var s = new Date(today - (today.getTimezoneOffset() * 60000)).toJSON()
       return s.split('.')[0];
   }
 
   const link = "https://api.data.gov.sg/v1/environment/rainfall?" +new URLSearchParams({ date_time: getdatestrnow(), }).toString()
   const result = await fetch(link).then(res => res.json()).then((json) => {
       // Create mapping of station_ids to name
       m = {}
       for(const e of json["metadata"]["stations"]) m[e['id']] = e['name']
       var readings = json["items"][0]["readings"]
       for(const e of readings) e['name'] = m[e['station_id']]
 
       // Remove meaningless entries and return
       return readings.filter(e => e['station_id'] != e['name'])
   })
 
 
   // handle full requests
   res.status(200).send(JSON.stringify(result));
 
 };
 