var size = 0;
var placement = 'point';
function categories_flaechen_2(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, bufferWidth,
                       placement) {
                switch(value.toString()) {case 'Gebaeude':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(251,103,103,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Wasser':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(94,156,230,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Gruenflaeche':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(186,221,105,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Asphalt':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(81,98,110,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Kleinpflaster':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(221,221,221,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Unbefestigt':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(180,136,33,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Tec':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(229,133,180,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Sechskant':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(127,89,124,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Beet':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(52,221,105,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Gebuesch':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(5,72,16,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Restmuell':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(169,12,251,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Betonplatten':
                    return [ new ol.style.Style({
        fill: new ol.style.Fill({color: 'rgba(116,115,110,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Rasengitter':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(128,152,72,0.553)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0}),fill: new ol.style.Fill({color: 'rgba(186,221,105,0.553)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;}};

var style_flaechen_2 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    var value = feature.get("nutzung");
    var labelText = "";
    size = 0;
    var labelFont = "10px, sans-serif";
    var labelFill = "#000000";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 8;
    var offsetY = 3;
    var placement = 'point';
    if ("" !== null) {
        labelText = String("");
    }
    
var style = categories_flaechen_2(feature, value, size, resolution, labelText,
                          labelFont, labelFill, bufferColor,
                          bufferWidth, placement);

    return style;
};
