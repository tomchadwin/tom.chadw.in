var wms_layers = [];


        var lyr_OSMStandard_0 = new ol.layer.Tile({
            'title': 'OSM Standard',
            'type': 'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
    attributions: ' &middot; <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors, CC-BY-SA</a>',
                url: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var lyr_Ortho_Schnelsen_31467kleiner_1 = new ol.layer.Image({
                            opacity: 1,
                            title: "Ortho_Schnelsen_31467kleiner",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/Ortho_Schnelsen_31467kleiner_1.png",
    attributions: ' ',
                                projection: 'EPSG:3857',
                                alwaysInRange: true,
                                imageExtent: [1102653.203855, 7100963.459295, 1102802.148835, 7101206.846574]
                            })
                        });
var format_flaechen_2 = new ol.format.GeoJSON();
var features_flaechen_2 = format_flaechen_2.readFeatures(json_flaechen_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_flaechen_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_flaechen_2.addFeatures(features_flaechen_2);
var lyr_flaechen_2 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_flaechen_2, 
                style: style_flaechen_2,
                interactive: true,
    title: 'flaechen<br />\
    <img src="styles/legend/flaechen_2_0.png" /> Gebaeude<br />\
    <img src="styles/legend/flaechen_2_1.png" /> Entwaesserung<br />\
    <img src="styles/legend/flaechen_2_2.png" /> Gruenflaeche<br />\
    <img src="styles/legend/flaechen_2_3.png" /> Asphalt<br />\
    <img src="styles/legend/flaechen_2_4.png" /> Kleinpflaster<br />\
    <img src="styles/legend/flaechen_2_5.png" /> Unbefestigt<br />\
    <img src="styles/legend/flaechen_2_6.png" /> Technische Anlage<br />\
    <img src="styles/legend/flaechen_2_7.png" /> Wabenflaster<br />\
    <img src="styles/legend/flaechen_2_8.png" /> Beet<br />\
    <img src="styles/legend/flaechen_2_9.png" /> Gebuesch<br />\
    <img src="styles/legend/flaechen_2_10.png" /> Restmuellbehaelter<br />\
    <img src="styles/legend/flaechen_2_11.png" /> Betonplatten<br />\
    <img src="styles/legend/flaechen_2_12.png" /> Rasengitterstein<br />'
        });
var format_Stellplatzart_3 = new ol.format.GeoJSON();
var features_Stellplatzart_3 = format_Stellplatzart_3.readFeatures(json_Stellplatzart_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Stellplatzart_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Stellplatzart_3.addFeatures(features_Stellplatzart_3);
var lyr_Stellplatzart_3 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_Stellplatzart_3, 
                style: style_Stellplatzart_3,
                interactive: true,
    title: 'Stellplatzart<br />\
    <img src="styles/legend/Stellplatzart_3_0.png" /> Behindertenstellpatz<br />\
    <img src="styles/legend/Stellplatzart_3_1.png" /> Motorrad<br />\
    <img src="styles/legend/Stellplatzart_3_2.png" /> Fahrrad<br />'
        });

lyr_OSMStandard_0.setVisible(true);lyr_Ortho_Schnelsen_31467kleiner_1.setVisible(true);lyr_flaechen_2.setVisible(true);lyr_Stellplatzart_3.setVisible(true);
var layersList = [lyr_OSMStandard_0,lyr_Ortho_Schnelsen_31467kleiner_1,lyr_flaechen_2,lyr_Stellplatzart_3];
lyr_flaechen_2.set('fieldAliases', {'id': 'id', 'nutzung': 'Nutzung', });
lyr_Stellplatzart_3.set('fieldAliases', {'id': 'id', 'Art': 'Art', 'Nutzung': 'Nutzung', });
lyr_flaechen_2.set('fieldImages', {'id': 'TextEdit', 'nutzung': 'ValueMap', });
lyr_Stellplatzart_3.set('fieldImages', {'id': 'TextEdit', 'Art': 'ValueMap', 'Nutzung': 'ValueMap', });
lyr_flaechen_2.set('fieldLabels', {'id': 'no label', 'nutzung': 'inline label', });
lyr_Stellplatzart_3.set('fieldLabels', {'id': 'no label', 'Art': 'header label', 'Nutzung': 'inline label', });
lyr_Stellplatzart_3.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});