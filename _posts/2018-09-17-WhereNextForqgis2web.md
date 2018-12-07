---
title: "Where next for qgis2web?"
permalink: /wrote/WhereNextForqgis2web
blurb: >
    Those of you who follow QGIS closely might have noticed that development of 
    qgis2web has significantly slowed since QGIS 3 was released. Is this of 
    concern? What next for the plugin?
---

# Where next for qgis2web?

<figure class="floatright">
<img src="/assets/pics/qgis2webLogo.png" alt="qgis2web" />
</figure>

Those of you who follow QGIS closely might have noticed that development of 
qgis2web has significantly slowed since QGIS 3 was released. Is this of 
concern? What next for the plugin?

## Slow and steady wins the game?
Perhaps all is well. Perhaps the fact that [not many 
bugs](https://github.com/tomchadwin/qgis2web/labels/bug) are being found 
simply means that less development is required, and we don’t need to worry. 
This does not seem likely. qgis2web is simply middleware which bridges amazing 
software which itself has since developed significantly. A lack of qgis2web 
development suggests that new functionality and better performance is not 
being exploited.

## Longstanding issues
Some bugs and feature requests have been around for a long time. Notable 
among these is the almost non-existent [support for layer 
groups](https://github.com/tomchadwin/qgis2web/issues/175). While the majority 
of people thankfully do not overload their webmaps with layers, a significant 
minority do need this functionality.

## Structural problems
While the GUI code is reasonably elegant, much of the export code is not, in 
three major ways:

- not object-oriented
- poor string handling (lots of concatenation rather than 
templating/formatting)
- output JS fragments insufficiently separated out from Python

These three issues make the code clunky, difficult to understand, and far from 
well conceived or engineered.

## Shiny new features
In addition to poor code and missing basic features, however, there are more 
interesting new areas which could be further developed:

- [export to Mapbox GL JS](https://github.com/tomchadwin/qgis2web/tree/mapbox) 
to bring the power of WebGL to your webmaps, allowing users to create fast, 
smooth vector maps without coding or hosting with Mapbox
- further develop the [work by Paul dos 
Santos](https://github.com/tomchadwin/qgis2web/issues/645) which allows the 
look and feel of the webmap to be customized
- though not qgis2web, take the idea behind 
[web2qgis](https://github.com/tomchadwin/web2qgis/) and develop it into 
something fully realized
- make use of QGIS 3 [task manager](https://github.com/qgis/QGIS/pull/3004) to 
improve performance

## Dependency updates
Two major updates are probably now due:

- [OpenLayers 5](https://github.com/openlayers/openlayers/releases/tag/v5.0.0)
- migrate GUI from 
[QtWebkit to QtWebEngine](https://doc.qt.io/qt-5/qtwebenginewidgets-qtwebkitportingguide.html)

These are fundamental changes, but ones which probably attract less attention. 
The longer both are left, the more qgis2web will be held back from future 
development.

**Update**: migrating to QtWebEngine seems currently [premature at best, and 
at worst impossible](https://lists.osgeo.org/pipermail/qgis-developer/2018-September/054541.html).

**Second update**: [upgrade to OpenLayers 
5](https://github.com/tomchadwin/qgis2web/tree/openlayers5) has started, and 
is perhaps less of a big job than anticipated.

## Documentation, documentation, documentation
“Scant” is a reasonable description of [qgis2web’s 
documentation](https://github.com/tomchadwin/qgis2web/wiki). Thanks to work by 
[Herb Fargus](https://github.com/HerbFargus), what is there is largely correct 
and up-to-date, but so much more could be documented.

## Time and expertise
If you think that you could contribute to any of this, your input would be 
incredibly appreciated. Go to the [qgis2web 
bugtracker](https://github.com/tomchadwin/qgis2web/issues) and see what takes 
your fancy.

<section id="nav">
    <div>
{% if page.next != nil %}
        &lt;&nbsp;<a href="{{page.next.url}}">{{page.next.title}}</a>
{% endif %}
    </div>
    <div>
{% if page.previous != nil %}
        <a href="{{page.previous.url}}">{{page.previous.title}}</a>&nbsp;&gt;
{% endif %}
    </div>
</section>
