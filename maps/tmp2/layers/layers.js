var wms_layers = [];


        var lyr_OpenStreetMap_0 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'type': 'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
    attributions: ' ',
                url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var format_airports_1 = new ol.format.GeoJSON();
var features_airports_1 = format_airports_1.readFeatures(json_airports_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_airports_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_airports_1.addFeatures(features_airports_1);
var lyr_airports_1 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_airports_1, 
                style: style_airports_1,
                interactive: true,
                title: '<img src="styles/legend/airports_1.png" /> airports'
            });

lyr_OpenStreetMap_0.setVisible(true);lyr_airports_1.setVisible(true);
var layersList = [lyr_OpenStreetMap_0,lyr_airports_1];
lyr_airports_1.set('fieldAliases', {'ID': 'ID', 'fk_region': 'fk_region', 'ELEV': 'ELEV', 'NAME': 'NAME', 'USE': 'USE', });
lyr_airports_1.set('fieldImages', {'ID': '', 'fk_region': '', 'ELEV': '', 'NAME': '', 'USE': '', });
lyr_airports_1.set('fieldLabels', {'ID': 'no label', 'fk_region': 'no label', 'ELEV': 'no label', 'NAME': 'no label', 'USE': 'no label', });
lyr_airports_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});