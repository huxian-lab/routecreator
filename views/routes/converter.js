var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {

  var waypoints = [];

  var url = req.body.url;
  var tmp = url.split('!1d');
  
  //loop

  var n = 0;
  tmp.forEach(function(t){
  
    //second split "!2d"
    var buf = t.split('!2d');
    if(buf.length == 2){
      var lon = buf[0].split("!")[0];
      var lat = buf[1].split("!")[0];

      //forth calc lat and lon
      var label = "";
      var clat = Math.round(lat * 60 * 60 * 1000);
      var clon = Math.round(lon * 60 * 60 * 1000);
      console.log(tmp.length);
      if(n == 0){
        label = "Departure:";
      }else if(n == tmp.length - 2){
        label = "Destination:";
      }else{
        label = "Waypoint" + n + ":";
      }
      n++;
      var p = {
        lat: clat,
        lon: clon,
        name: "",
        label: label
      };
      waypoints.push(p);
    }
  });  

  
  //preview
  res.render('preview', { waypoints: waypoints });

});
router.post('/xml', function(req, res, next) {

  //create xml
  console.log(req.body);
  var tmp = req.body.wp;
  console.log(tmp);
  var wpnames = req.body.routename;

  var sb = require('string-builder');
  sb.clear();
  sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
  sb.append("<routing_points>\n");
  sb.append("  <set>\n");
  sb.append("    <name>");
  sb.append(wpnames);
  sb.append("</name>\n");
  var n = 0;
  var m = false;
  if(tmp !== undefined){
    tmp.forEach(function(t){
  
      if(!m){
        sb.append("    <departure>\n");
      }else if(n === tmp.length - 1){
        sb.append("    <destination>\n");
      }else{
        sb.append("    <waypoint>\n");
      }

      sb.append("      <name>");sb.append(t.name);sb.append("</name>\n");
      sb.append("      <lat>");sb.append(t.lat);sb.append("</lat>\n");
      sb.append("      <lon>");sb.append(t.lon);sb.append("</lon>\n");

      if(!m){
        sb.append("    </departure>\n");
        m = true;
      }else if(n === tmp.length - 1){
        sb.append("    </destination>\n");
      }else{
        sb.append("    </waypoint>\n");
      }
      n ++;
    });  
  }
  sb.append("  </set>\n");
  sb.append("</routing_points>\n");

  var xmldata = sb.toString();
  res.render('convert', { xmldata: xmldata});
});

module.exports = router;
