
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
                [-2, 54],
                [-2, 54],
                [-2, 54],
                [-2, 54]
            ]
        }},
    "sprite": "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/sprites",
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
            "id": "test_0",
            "type": "raster",
            "source": "test_0",
            "minzoom": 0,
            "maxzoom": 22
        }],
}