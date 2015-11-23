var map = null;
var cross_control = null;
var markers = null;

function init(){
  console.log("preview");
  map = new OpenLayers.Map("canvas");
  var mapnik = new OpenLayers.Layer.OSM();
  map.addLayer(mapnik);
         
  

  //add all marker
  var pform = document.getElementById("pform");
  var flon = 139.76;
  var flat = 35.68;
  
  if(pform.elements["wp[0][lon]"] !== undefined){
    flon = pform.elements["wp[0][lon]"].value / 60.0 / 60.0 / 1000.0;
    flat = pform.elements["wp[0][lat]"].value / 60.0 / 60.0 / 1000.0;
  }

  var lonLat = new OpenLayers.LonLat(flon, flat)
    .transform(
      new OpenLayers.Projection("EPSG:4326"), 
      new OpenLayers.Projection("EPSG:900913")
    );
  map.setCenter(lonLat, 12);

  markers = new OpenLayers.Layer.Markers("Markers");
  map.addLayer(markers);
  create_marker();
  create_cross_control();
}
// 十字架の生成
  function create_cross_control(){    
     
     cross_control = new OpenLayers.Control();          
     cross_control.draw=  function(){
           
        // アイコンのサイズ
        var iconsize = new OpenLayers.Size(32, 32);
        
        // マップの中央座標の算出                       
        var point = new OpenLayers.Pixel(map.getCurrentSize().w / 2 - (iconsize.w / 2),
                                         map.getCurrentSize().h / 2 - (iconsize.h / 2));
        
        // ユニークIDの生成
        var uniqid = OpenLayers.Util.createUniqueID("petitmonte.com");
        
        // イメージの生成
        cross_control.div = OpenLayers.Util.createAlphaImageDiv(
          uniqid,       // ユニークID
          point ,       // マップの中央座標
          iconsize,     // アイコンのサイズ
          "/images/openlayers_map_example5.gif",   // アイコンファイル名
          "absolute"    // 絶対位置
        );
        return cross_control.div;
     };
    
     map.addControl(cross_control);
  }
  
  // 十字架の削除
  function remove_cross_control(){ 
    
    if (cross_control){
      map.removeControl(cross_control);
    }    
    cross_control = null;
    
  }
  
  // onresizeイベント    
  window.onresize = function(){
    
    // 十字架の再生成 
    remove_cross_control();
    create_cross_control();
    
  }
 
function create_marker(){
  var pform = document.getElementById("pform");
  for(i = 0;i < 99;i++){
    if(pform.elements["wp["+i+"][lon]"] === undefined){
      break;
    }
    var tmpx = pform.elements["wp["+i+"][lon]"].value / 60.0 / 60.0 / 1000.0;
    var tmpy = pform.elements["wp["+i+"][lat]"].value / 60.0 / 60.0 / 1000.0;
    var marker = new OpenLayers.Marker(
    new OpenLayers.LonLat(tmpx, tmpy)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), 
            new OpenLayers.Projection("EPSG:900913")
        )
    ); 
    markers.addMarker(marker);  
  }


}
function remove_marker(){
  markers.clearMarkers();
}

function updatepoint(num){
  console.log(num);

  var lonLat = map.getCenter().transform(
    new OpenLayers.Projection("EPSG:900913"), 
    new OpenLayers.Projection("EPSG:4326")
  );

  var pform = document.getElementById("pform");
  pform.elements["wp["+num+"][lon]"].value = Math.round(lonLat.lon * 60.0 * 60.0 * 1000.0);
  pform.elements["wp["+num+"][lat]"].value = Math.round(lonLat.lat * 60.0 * 60.0 * 1000.0);  

  remove_marker();
  create_marker();

  return false;
}
