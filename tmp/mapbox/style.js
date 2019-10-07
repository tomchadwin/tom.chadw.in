
var styleJSON = {
    "version": 8,
    "name": "OS Outdoor",

    "center": [
        -1.445462913521851,
        50.924985957591986
    ],
    "pitch": 0,
    "light": {
        "intensity": 0.2
    },
    "sources": {
        "test_0": {
            "type": "image",
            "url": "./data/test_0.png",
            "coordinates": [
                [-2.1109019480555116, 54.9795677650124688],
                [-2.0952682828989335, 54.9795677650124688],
                [-2.0952682828989335, 54.9705596140216741],
                [-2.1109019480555116, 54.9705596140216741]
            ]
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
                "background-color": "#ffffff"
            }
        },
        {
            "id": "simple-tiles",
            "type": "raster",
            "source": "test_0",
            "minzoom": 0,
            "maxzoom": 22
        }
    ],
    "created": "2018-05-11T11:38:48.884Z",
    "id": "cjh1w236f0tj22sl87sm547vt",
    "modified": "2018-05-26T21:01:47.000Z",
    "owner": "Ordnance Survey",
    "visibility": "public",
    "draft": false
}