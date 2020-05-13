var wms_layers = [];

var format_HospitalType_0 = new ol.format.GeoJSON();
var features_HospitalType_0 = format_HospitalType_0.readFeatures(json_HospitalType_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_HospitalType_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_HospitalType_0.addFeatures(features_HospitalType_0);
var lyr_HospitalType_0 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_HospitalType_0, 
                style: style_HospitalType_0,
                interactive: true,
                title: 'Hospital Type'
            });
var format_BedCapacity_1 = new ol.format.GeoJSON();
var features_BedCapacity_1 = format_BedCapacity_1.readFeatures(json_BedCapacity_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_BedCapacity_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_BedCapacity_1.addFeatures(features_BedCapacity_1);
var lyr_BedCapacity_1 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_BedCapacity_1, 
                style: style_BedCapacity_1,
                interactive: true,
    title: 'Bed Capacity<br />\
    <img src="styles/legend/BedCapacity_1_0.png" /> 0 - 5 <br />\
    <img src="styles/legend/BedCapacity_1_1.png" /> 5 - 15 <br />\
    <img src="styles/legend/BedCapacity_1_2.png" /> 15 - 25 <br />\
    <img src="styles/legend/BedCapacity_1_3.png" /> 25 - 50 <br />\
    <img src="styles/legend/BedCapacity_1_4.png" /> 50 - 100 <br />\
    <img src="styles/legend/BedCapacity_1_5.png" /> 100 - 660 <br />'
        });
var format_Cases_2 = new ol.format.GeoJSON();
var features_Cases_2 = format_Cases_2.readFeatures(json_Cases_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Cases_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Cases_2.addFeatures(features_Cases_2);
var lyr_Cases_2 = new ol.layer.Heatmap({
                declutter: true,
                source:jsonSource_Cases_2, 
                radius: 50 * 2,
                gradient: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
                blur: 15,
                shadow: 250,
    weight: function(feature){
        var weightField = 'weights';
        var featureWeight = feature.get(weightField);
        var maxWeight = 40;
        var calibratedWeight = featureWeight/maxWeight;
        return calibratedWeight;
    },
                title: 'Cases'
            });

lyr_HospitalType_0.setVisible(true);lyr_BedCapacity_1.setVisible(true);lyr_Cases_2.setVisible(true);
var layersList = [lyr_HospitalType_0,lyr_BedCapacity_1,lyr_Cases_2];
lyr_HospitalType_0.set('fieldAliases', {'District': 'District', 'Name of Hospital': 'Name of Hospital', 'Latitude': 'Latitude', 'Longitude': 'Longitude', 'Type': 'Type', 'Bed Capacity': 'Bed Capacity', 'Number of Medical Personnel/ Staff': 'Number of Medical Personnel/ Staff', 'Number of Administrative, Utility and Security Personnel': 'Number of Administrative, Utility and Security Personnel', 'Hospital Equipment': 'Hospital Equipment', 'Established COVID-19 guidelines': 'Established COVID-19 guidelines', 'List of Medical Supplies': 'List of Medical Supplies', 'Number of Isolation/ Quarantine Rooms for suspected cases': 'Number of Isolation/ Quarantine Rooms for suspected cases', 'Contact Number': 'Contact Number', 'Contact Person': 'Contact Person', 'Note/Comment': 'Note/Comment', });
lyr_BedCapacity_1.set('fieldAliases', {'District': 'District', 'Name of Hospital': 'Name of Hospital', 'Latitude': 'Latitude', 'Longitude': 'Longitude', 'Type': 'Type', 'Bed Capacity': 'Bed Capacity', 'Number of Medical Personnel/ Staff': 'Number of Medical Personnel/ Staff', 'Number of Administrative, Utility and Security Personnel': 'Number of Administrative, Utility and Security Personnel', 'Hospital Equipment': 'Hospital Equipment', 'Established COVID-19 guidelines': 'Established COVID-19 guidelines', 'List of Medical Supplies': 'List of Medical Supplies', 'Number of Isolation/ Quarantine Rooms for suspected cases': 'Number of Isolation/ Quarantine Rooms for suspected cases', 'Contact Number': 'Contact Number', 'Contact Person': 'Contact Person', 'Note/Comment': 'Note/Comment', });
lyr_HospitalType_0.set('fieldImages', {'District': '', 'Name of Hospital': '', 'Latitude': '', 'Longitude': '', 'Type': '', 'Bed Capacity': '', 'Number of Medical Personnel/ Staff': '', 'Number of Administrative, Utility and Security Personnel': '', 'Hospital Equipment': '', 'Established COVID-19 guidelines': '', 'List of Medical Supplies': '', 'Number of Isolation/ Quarantine Rooms for suspected cases': '', 'Contact Number': '', 'Contact Person': '', 'Note/Comment': '', });
lyr_BedCapacity_1.set('fieldImages', {'District': '', 'Name of Hospital': '', 'Latitude': '', 'Longitude': '', 'Type': '', 'Bed Capacity': '', 'Number of Medical Personnel/ Staff': '', 'Number of Administrative, Utility and Security Personnel': '', 'Hospital Equipment': '', 'Established COVID-19 guidelines': '', 'List of Medical Supplies': '', 'Number of Isolation/ Quarantine Rooms for suspected cases': '', 'Contact Number': '', 'Contact Person': '', 'Note/Comment': '', });
lyr_HospitalType_0.set('fieldLabels', {'District': 'no label', 'Name of Hospital': 'no label', 'Latitude': 'no label', 'Longitude': 'no label', 'Type': 'no label', 'Bed Capacity': 'no label', 'Number of Medical Personnel/ Staff': 'no label', 'Number of Administrative, Utility and Security Personnel': 'no label', 'Hospital Equipment': 'no label', 'Established COVID-19 guidelines': 'no label', 'List of Medical Supplies': 'no label', 'Number of Isolation/ Quarantine Rooms for suspected cases': 'no label', 'Contact Number': 'no label', 'Contact Person': 'no label', 'Note/Comment': 'no label', });
lyr_BedCapacity_1.set('fieldLabels', {'District': 'no label', 'Name of Hospital': 'no label', 'Latitude': 'no label', 'Longitude': 'no label', 'Type': 'no label', 'Bed Capacity': 'no label', 'Number of Medical Personnel/ Staff': 'no label', 'Number of Administrative, Utility and Security Personnel': 'no label', 'Hospital Equipment': 'no label', 'Established COVID-19 guidelines': 'no label', 'List of Medical Supplies': 'no label', 'Number of Isolation/ Quarantine Rooms for suspected cases': 'no label', 'Contact Number': 'no label', 'Contact Person': 'no label', 'Note/Comment': 'no label', });
lyr_BedCapacity_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});