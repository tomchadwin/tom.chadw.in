
var styleJSON = {
    "version": 8,
    "name": "qgis2web export",
    "pitch": 0,
    "light": {
        "intensity": 0.2
    },
    "sources": {
        "pipelines_0": {
            "type": "geojson",
            "data": json_pipelines_0
        },
        "tileTest": {
            "type": "raster",
            "url": "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        }
    },
    "sprite": "https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-outdoor/sprites",
    "glyphs": "https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "layout": {},
            "paint": {
                "background-color": "#1f1f1f"
            }
        },
        {
            "id": "lyr_pipelines_0_0",
            "type": "line",
            "source": "pipelines_0",
            "layout": {},
            "paint": {'line-width': 7.5590551182, 'line-opacity': 1.0, 'line-color': '#0000ff'}
        }
],
}