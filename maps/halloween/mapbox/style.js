
var styleJSON = {
    "version": 8,
    "name": "qgis2web export",
    "pitch": 0,
    "light": {
        "intensity": 0.2
    },
    "sources": {
        "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211": {
            "url": "https://api.maptiler.com/tiles/v3/tiles.json?key=dqqigsTMgVQt82L8d0a3",
            "type": "vector"
        }},
    "sprite": "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/sprites",
    "glyphs": "https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "layout": {},
            "paint": {
                "background-color": "#a2a2a2"
            }
        },
        {
            "id": "lyr_landuse_0_0",
            "type": "fill",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "landuse",
            "layout": {},
            "paint": {'fill-opacity': 1.0, 'fill-color': '#e18761'}
        },
        {
            "id": "lyr_landcover_1_0",
            "type": "fill",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "landcover",
            "layout": {},
            "paint": {'fill-opacity': 1.0, 'fill-color': '#ee9271'}
        },
        {
            "id": "lyr_waterway_2_0",
            "type": "line",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "waterway",
            "layout": {},
            "paint": {'line-width': 0.982677165366, 'line-opacity': 1.0, 'line-color': '#333333'}
        },
        {
            "id": "lyr_water_3_0",
            "type": "fill",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "water",
            "layout": {},
            "paint": {'fill-opacity': 1.0, 'fill-color': '#333333'}
        },
        {
            "id": "lyr_building_4_0",
            "type": "fill",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "building",
            "layout": {},
            "paint": {'fill-opacity': 1.0, 'fill-color': '#e5510c'}
        },
        {
            "id": "lyr_transportation_6_0",
            "type": "line",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "transportation",
            "layout": {},
            "paint": {'line-width': 0.982677165366, 'line-opacity': 1.0, 'line-color': '#666666'}
        },
        {
            "id": "lyr_transportation_name_8_0",
            "type": "symbol",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "transportation_name",
            "layout": {'text-offset': [0.0, 0.0], 'text-field': ['get', 'name_en'], 'text-size': 10.0, 'text-font': ['Open Sans Regular']},
            "paint": {'text-color': '#000000'}
        },
        {
            "id": "lyr_water_name_9_0",
            "type": "symbol",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "water_name",
            "layout": {'text-offset': [0.0, 0.0], 'text-field': ['get', 'name'], 'text-size': 10.0, 'text-font': ['Open Sans Regular']},
            "paint": {'text-color': '#000000'}
        },
        {
            "id": "lyr_place_11_0",
            "type": "symbol",
            "source": "httpsapimaptilercomtilesv3tilesjsonkey6irhAXGgsi8TrIDL0211",
            "source-layer": "place",
            "layout": {'text-offset': [0.0, 0.0], 'text-field': ['get', 'name'], 'text-size': 10.0, 'text-font': ['Open Sans Regular']},
            "paint": {'text-halo-width': 1.0, 'text-halo-color': '#d5d5d5', 'text-color': '#000000'}
        }],
}