
var styleJSON = {
    "version": 8,
    "name": "qgis2web export",
    "pitch": 0,
    "light": {
        "intensity": 0.2
    },
    "sources": {
        "test_0": {
            "type": "image",
            "url": "./data/test_0.png",
            "coordinates": [
                [-2.110902, 54.970565],
                [-2.095262, 54.970565],
                [-2.095262, 54.979568],
                [-2.110902, 54.979568]
            ]
        }},
    "sprite": "",
    "glyphs": "https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "layout": {},
            "paint": {
                "background-color": "#ffffff"
            }
        },
        {
            "id": "lyr_test_0_0",
            "type": "raster",
            "source": "test_0",
            "minzoom": 0,
            "maxzoom": 22
        }],
}