---
title: "qgis2web: The Story So Far"
permalink: /wrote/qgis2webTheStorySoFar
twitpic: https://tom.chadw.in/assets/pics/qgis2webLogo.png
description: >
    On qgis2web's 500,000th download, it seems a fitting time to look back at 
    how qgis2web got where it is today.
---

# qgis2web: The Story So Far

<figure class="floatright">
    <img src="/assets/pics/qgis2webLogo.png" alt="qgis2web" />
</figure>

qgis2web has now been downloaded from the official QGIS plugins repository 
over half a million times. It's the sixth most downloaded QGIS plugin of all 
time. This is a short piece about its history.

## qgis2leaf and qgis-ol3

In 2014, Riccardo Klinger created qgis2leaf, which exported QGIS projects to 
Leaflet webmaps. Around the same time, Victor Olaya created qgis-ol3, which 
did the same, but exported to OpenLayers webmaps. I got involved with 
qgis2leaf, as we needed it for work (adding support for WFS, as I recall). 
I'd never coded in Python or used Qt before, nor used git, but as languages 
and source control systems go, they're easier than many.

Riccardo and I continued to work on qgis2leaf intensively, adding considerably 
to its functionality. It was a really exciting time for me. Learning to code 
in Python (albeit not at all well) was fine, but what I'd never really 
experienced before, as an amateur coder, was having the public use code I had 
written. It was a big step, but a good one, having to deal with issues 
reported by users I had never met, and never would.

## qgis2web is born

In 2015, Paolo Cavallini, now chair of the QGIS Project Steering Committee, 
got in touch with Victor, Riccardo, and me to suggest that it would help users 
if qgis2leaf and qgi-ol3 were merged. Both did essentially the same thing, but 
using a different Javascript webmapping library. We all agreed, and work 
started on qgis2web. Huge thanks are due to Paolo for the suggestion and 
support.

qgis-ol3 had a GUI with more functionality than qgis2leaf. Specifically, it 
had a preview window. This was important, as there was a huge benefit in 
migrating qgis2leaf to the same GUI. It meant that the proposed merge had 
advantages for qgis2leaf (as was), as well as for end users. This certainly 
motivated me, as did Victor's elegant Python in qgis-ol3.

I lifted all the qgis2leaf code, placed it alongside the qgis-ol3 code, and 
slightly altered the GUI to allow users to switch between the two. It worked, 
but really was in essence two plugins side-by-side, with all the duplication 
that implies.

## Improvements and tests

Over time, common functions from the two original plugins were deduplicated, 
and the code became a little less unwieldy. However, I worried about releasing 
buggy versions--it did happen once or twice. I had become aware of automated 
testing, via a service called Travis, hooked into Github. The idea is that, 
every time a change is made to the source code, a suite of tests is run to 
ensure that no regressions have been caused.

I thought for some time that this would be an incredibly useful service for 
qgis2web. With so many variables (layer types, renderers, styles, options), 
it was already impossible to be rigorous in checking manually that nothing was 
broken.

With a lot of help from Akbar Gumbira, we finally got it all up and running. 
It fundamentally changed the reliability of qgis2web across versions, even 
though wrangling code and reference output files can sometimes be frustrating.

## Collaboration and support

Paolo remained a big supporter of qgis2web. As part of a Faunalia contract, he 
commissioned Nyall Dawson to work on the plugin. This was brilliant news, but 
the idea of a QGIS core dev looking at my code was also somewhat daunting. 
Sure enough, Nyall fundamentally refactored the entire plugin, decoupling the 
GUI from the export process. His work remains to this day, and the plugin is 
the stronger for it. I must also give credit to both Jürgen Fischer and Matteo 
Ghetta for their help during this period of development.

It must be said that this work did expose some inherent limitations of 
qgis2web for some projects. At the end of the day, QGIS, Leaflet, and 
OpenLayers are very different pieces of software, and the area of functional 
overlap between the three is significantly smaller than the functionality of 
each individually. If there were one constant frustration in working on a 
piece of software used widely by strangers, it would be the struggle to manage 
expectations, especially given that many users have strong GIS knowledge, but 
less strong knowledge of the web and its inherent performance limitations.

## QGIS3

The changes from QGIS2 to QGIS3 were enormous. Python was upgraded from v2 to 
v3, and Qt from v4 to v5. In addition, so many things in the QGIS API changed. 
It was a massive job to produce a compatible version of qgis2web, and it would 
have been basically impossible for me without the Travis testing environment. 
However, it all got done, and the concomitant tidying and refactoring of the 
source code was a massive collateral benefit.

There have been two major version upgrades to OpenLayers and one to Leaflet 
during qgis2web's life, and another OpenLayers one is imminent. The work never 
stops.

## Burnout

After the big push to make a QGIS3-compatible version, I did slow down. The 
eighty-twenty rule kicked in, with remaining issues being either less 
significant or harder to solve. My attention was also elsewhere (but still 
using QGIS!). As a result, development slowed down significantly.

Things have picked up again, but I doubt I'll work as intensively on it again. 
It's frustrating, but we're all human.

## Significant help

Many other people have contributed to qgis2web. I specifically want to mention 
a few here, and apologies to those I miss out through forgetfulness.

Luca Casagrande coauthored qgis-ol3 with Victor. He has continued to support 
qgis2web, including fixing some problems which totally had me stumped. He also 
worked on qgis2web with Paolo at a QGIS developer's meeting.

Nathan Woodrow wrote a module from scratch to convert QGIS expressions into 
Javascript, and hence make them available in qgis2web. It's a beautiful bit of 
code, all the more impressive since I get the impression that Nathan doesn't 
really work with Javascript.

Thomas Gratier wrote an OpenLayers plugin from scratch to allow searching by 
layer attributes. Handling the diversity of possible search sources was a 
challenge, which he overcame effortlessly.

Per Liedman wrote a Leaflet plugin from scratch to support multiple symbol 
layers. He also helped a great deal in implementing Leaflet.VectorGrid to 
support vector tiles.

Iván Sánchez Ortega has been a huge help also in Leaflet.VectorGrid and more 
generally in Leaflet and vector tile matters.

Ola Kovalev made significant contributions including developing OpenLayers 
clustering from scratch. Ola is notable in being happy to learn and then 
implement tests alongside her work, going through the same occasionally 
frustrating learning process that I had.

Paul Dos Santos implemented overall map styling from scratch. One of my 
frustrations is not having taken his work further--a fairly simple task, but 
one which never seems to get to the top of the list.

Martin Boos wrote and maintains the QGIS plugin Vector Tiles Reader, without 
which none of the vector-tile functionality of qgis2web would be possible.

Ed Boesenberg developed multi-unit measurement in OpenLayers, and also 
deserves massive thanks for his constant help in answering queries on the 
qgis2web repo.

## New maps

For the first time since it was created, qgis2web has a new output format. 
Mapbox GL JS excels at rendering vector tiles, and has many other key 
advantages over Leaflet and OpenLayers. However, it should not be used 
indiscrimiately, as the other two libraries still have their advantages. In 
addition, the currently implemented feature-set for Mapbox GL JS in qgis2web 
is much, much smaller than that implemented for Leaflet or OpenLayers. This 
will improve over time, but is unlikely to be quick. I hope to write a 
separate piece investigating the core differences between the three libraries, 
but that's a job for another day.

Huge thanks are due once again to Victor Olaya, who has developed bridge-style 
at GeoCat. It does all the style conversion work, and I can see qgis2web 
offloading its OpenLayers and Leaflet style conversion code to it in the 
future. Other projects will then be able to make use of the routines.

A quick note, by way of clarification. Mapbox, the company, provide many 
services. Mapbox GL JS is one of their products, and is completely open 
source. qgis2web only exports standalone Mapbox GL JS maps. It doesn't use any 
Mapbox services--no hosting, no styles, no data. It's key to refer to the 
export format as Mapbox GL JS, to keep it distinct from Mapbox the company and 
its ecosystem of hosted services. Many thanks to Vladimir Agafonkin for 
putting me in touch with Kathleen Lu at Mapbox, to ensure that Mapbox are 
happy with the approach.

## Where next?

Developing more functionality for the new Mapbox GL JS exporter is top of the 
list for me, as qgis2web has reached some level of maturity with its Leaflet 
and OpenLayers exports (though *one day* we might get layer groups working 
properly). There will no doubt be many issues with Mapbox GL JS exports, so 
handling those will probably also take priority.

More important than these, however, is making qgis2web's capabilities more 
readily transparent to the user. We need massively improved error reporting, 
with an emphasis on feedback on unsupported QGIS features in an export. 
Alongside this, a compatibility table would also help users decide which 
export format to choose. With the launch of the new Mapbox GL JS exporter, 
this has now become much more critical.

And documentation, obviously.

## Bellwether

Beyond the code itself, I'm extremely proud of qgis2web for a couple of other 
reasons. One is having turned code into software--in other words, supporting 
users, implementing testing, and also promotion, which is a big part of the 
project. Documentation still lags horribly, but that's a badge of honour for 
an open-source project.

Above all, though, I'm proud that qgis2web represents consistent growth in a 
sector I love--open-source, provider-agnostic software. To my delight, there 
has been no real plateau in growth:

<figure>
    <img src="/assets/pics/qgis2webDownloads.png"
         alt="qgis2web downloads over time" />
    <figcaption>qgis2web downloads over time</figcaption>
</figure>

Despite the recent Google Maps price hike, the trend away from 
non-provider-based webmaps sadly continues. qgis2web tries its best to help 
those who want to remain truly independent and in control.