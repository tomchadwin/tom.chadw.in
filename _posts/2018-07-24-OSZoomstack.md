---
title: "OS Zoomstack: first impressions"
permalink: /wrote/Zoomstack
blurb: >
    Zoomstack is “a comprehensive vector basemap from a national overview to 
    street level detail”. It comes in various extremely powerful and/or 
    user-friendly formats such as GeoPackage, PostGIS, and vector tiles (both 
    downloadable as an MBTiles file and hosted online and accessible via an 
    API).
---
# OS Zoomstack: first impressions

[Ordnance Survey](https://www.ordnancesurvey.co.uk/) have recently started a 
trial of a new open UK mapping product, [OS Open 
Zoomstack](https://www.ordnancesurvey.co.uk/blog/2018/07/join-os-open-zoomstack-trial/).

Zoomstack is “a comprehensive vector basemap from a national overview to 
street level detail”. It comes in various extremely powerful and/or 
user-friendly formats such as GeoPackage, PostGIS, and vector tiles (both 
downloadable as an MBTiles file and hosted online and accessible via an API).

I’ve started to take a look at Zoomstack, using QGIS. Before reading this 
initial review, do take a look at [Alasdair 
Rae’s](http://www.statsmapsnpix.com/2018/07/a-review-of-os-open-zoomstack.html). 
It’s very much worth looking at Alasdair’s Mapbox GL examples, as I don’t 
cover that usage here, and GL exploits the possibilities of this vector data 
impressively.

## Initial impressions

First off, this is a game-changer for UK mapping. Three factors contribute to 
this:

- it’s vectors
- it’s heavily tailored for different zoom levels
- it’s open

It’s therefore a realistic alternative to OpenStreetMap, assuming that OS 
continue this approach to open licensing for this dataset. We’ll have to see 
what they do with the hosted vector tiles — it’s too much to hope that there 
will be no rate limits.

This won’t be a comprehensive review, as I’m not qualified to comment on many 
aspects of this product. Specifically, I won’t go into the huge advantages of 
the different formats. Suffice it to say that these formats will lend 
themselves to different kinds of user:

- desktop individuals (GeoPackage)
- organizations (PostGIS)
- webmappers (vector tiles)

However, in the spirit of the trial, and of giving feedback (hopefully 
constructive), here are a few details which could maybe use improvement. I’m 
not a great user of spatial *data*, so the majority of this review focuses on 
cartographic style. Who knows what people will achieve by programmatic use of 
the data.

## Read The Formatting Manual

Please consult [the 
docs](https://www.ordnancesurvey.co.uk/business-and-government/products/os-open-zoomstack.html) 
before plunging in. I didn’t, and asked some basic (*fort. leg.* “stupid”) 
questions they already answered, and even gave feedback which is already 
covered in the docs. Sorry, OS.

## Formats

There is some discrepancy in both the layers and styles. There are slightly 
different layers in the GeoPackage and the MBTiles vector layers. I don’t know 
what real difference this will make in practice, so it would be good to know 
which layers will make it into the final product, and hopefully see 
consistency between the formats. Similarly, OS have published stylesheets for 
Zoomstack, including multiple styles in GL JSON format. It would be good to 
have the alternative styles in the other formats (such as QML).

## Performance and functionality

I’m getting some rendering freezes using the GeoPackage in QGIS across a 
network. I don’t know if this is a QGIS issue, or whether any improvements can 
be made to the GPKG itself.

The MBTiles vector tiles work well in QGIS, using the plugin [Vector Tiles 
Reader](https://github.com/geometalab/Vector-Tiles-Reader-QGIS-Plugin/). The 
GL JSON styles don’t import, but you can apply each layer QML individually:

<figure>
    <img src="/assets/pics/Zoomstack/VectorTiles.jpeg"
         alt="Vector tiles in QGIS, thanks to the Vector Tiles Reader 
         plugin" />
    <figcaption>Vector tiles in QGIS, thanks to the Vector Tiles Reader 
    plugin</figcaption>
</figure>

The vector tiles API does not work with QGIS Vector Tiles Reader. This seems 
to be caused by a familiar problem with the interpretation/implementation of 
the MBVT spec regarding TileJSON/metadata. I don’t know the full details, but 
you can see some discussion of it in a [Vector Tiles Reader issue about 
Geoserver vector 
tiles](https://github.com/geometalab/Vector-Tiles-Reader-QGIS-Plugin/issues/112).

**Update**: Charley Glynn has shown me how to get the hosted tiles working via 
the API with QGIS Vector Tiles Reader, so the previous paragraph is incorrect. 
Thanks, Charley!

## Style and cartography

The rest of this review will look at specific cartographic styling issues. 
Three fundamental points must be borne in mind:

- I’m not a cartographer, and you must reach your own conclusions
- these issues are very specific, and solving them in a way which does not 
break other instances might not be possible
- since this is a vector dataset, we can all alter the styles ourselves — the 
following points therefore apply to the default styles supplied by OS (we all 
know how often default styles get used, so improving them as far as possible 
is surely A Good Thing)

## Settlement labels

The labelling of settlements is perhaps too heavy:

<figure>
    <img src="/assets/pics/Zoomstack/HeavyLabels.jpeg"
         alt="Longbenton? In bold? Wrong on so many levels" />
    <figcaption>Longbenton? In bold? Wrong on so many levels</figcaption>
</figure>

Knocking back to a paler grey, and unemboldening non-cities is an improvement, 
together with making a greater size differential:

<figure>
    <img src="/assets/pics/Zoomstack/BetterLabels.jpeg"
         alt="Sunderland still regrettably bold" />
    <figcaption>Sunderland still regrettably bold</figcaption>
</figure>

Perhaps the reduction in legibility is too high a price to pay — opinions 
welcome.

**Update**: I’ve just tried reapplying the QML to the text layer, and this 
time, the text is not bold. I have no explanation, though perhaps the fact 
that first time round, I failed to install the supplied fonts before applying 
the styles might have caused the issue. The main point is that the paragraphs 
above might well be irrelevant.

Some zoom levels seem to fall between label visibility thresholds. This 
becomes apparent in rural areas (my own interest):

<figure>
    <img src="/assets/pics/Zoomstack/NoLabels.jpeg" alt="Dulce domum" />
    <figcaption><em>Dulce domum</em></figcaption>
</figure>

I’m not sure if this can be tweaked without cluttering denser areas. As an 
aside, though, this map really shows off this dataset’s design. It’s simply 
beautiful, and the contours add hugely to the potential for rural maps.

## Waterline labels

Zoomstack has a dedicated Names layer, rather than using features’ properties 
for labels (roads being a notable exception). This is presumably to retain 
some information for OS’s proprietary datasets, but it does makes some things 
difficult.

An example is the labelling of the Waterlines layer:

<figure>
    <img src="/assets/pics/Zoomstack/WaterlinesLabels.jpeg"
         alt="Something of the platform game about these labels" />
    <figcaption>Something of the platform game about these labels</figcaption>
</figure>

The labelling in this image suffers from lack of type differentiation — only 
colour differentiates settlements from forests, landscape features, and 
waterlines. If the latter could be labelled along the watercourse (as the 
roads are), this would improve things no end. I’m not sure we’re likely to see 
that improvement, though.

## Roads

A few issues are apparent at Swan House Roundabout in Newcastle:

<figure>
    <img src="/assets/pics/Zoomstack/RoadIssues.jpeg"
         alt="The subways under Swan House are the one and only time I have 
         actually walked in a circle while trying to find my way" />
    <figcaption>The subways under Swan House are the one and only time I have 
    actually walked in a circle while trying to find my way</figcaption>
</figure>

- the labels for A roads with motorway status have been truncated
- the merging of different classes of road doesn’t quite work (possibly 
fixable by tweaking the stacking order of the symbols, but whether this can be 
achieved generally, rather than in this specific case, I don’t know)
- road line caps should be square, not curved (see the minor white dead end, 
top-right)
- the motorway tunnel would benefit hugely from a dotted case instead of a 
centreline — as it stands, it’s not immediately clear what road layout this 
represents

## Conclusion

You can tell by the minor level of detail I’ve discussed here how successful 
Zoomstack is. I’m incredibly impressed, some views being comparable to some 
well-known OSM-based prerendered raster tilesets. I’ve not even begun to try 
styling things myself, but I can’t wait to see what people build with this.

Amazing work, everyone.
