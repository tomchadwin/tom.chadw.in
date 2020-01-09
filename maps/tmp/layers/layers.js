var wms_layers = [];

var format_airports_0 = new ol.format.GeoJSON();
var features_airports_0 = format_airports_0.readFeatures(json_airports_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_airports_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_airports_0.addFeatures(features_airports_0);
var lyr_airports_0 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_airports_0, 
                style: style_airports_0,
                interactive: true,
    title: 'airports<br />\
    <img src="styles/legend/airports_0_0.png" /> Civilian/Public<br />\
    <img src="styles/legend/airports_0_1.png" /> Joint Military/Civilian<br />\
    <img src="styles/legend/airports_0_2.png" /> Military<br />\
    <img src="styles/legend/airports_0_3.png" /> Other<br />\
    <img src="styles/legend/airports_0_4.png" /> <br />'
        });

lyr_airports_0.setVisible(true);
var layersList = [lyr_airports_0];
lyr_airports_0.set('fieldAliases', {'ID': 'ID', 'fk_region': 'fk_region', 'ELEV': 'ELEV', 'NAME': 'NAME', 'USE': 'USE', 'tmplink': 'tmplink', });
lyr_airports_0.set('fieldImages', {'ID': 'TextEdit', 'fk_region': 'TextEdit', 'ELEV': 'TextEdit', 'NAME': 'TextEdit', 'USE': 'TextEdit', 'tmplink': 'Range', });
lyr_airports_0.set('fieldLabels', {'ID': 'inline label', 'fk_region': 'inline label', 'ELEV': 'inline label', 'NAME': 'inline label', 'USE': 'inline label', 'tmplink': 'inline label', });
lyr_airports_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});