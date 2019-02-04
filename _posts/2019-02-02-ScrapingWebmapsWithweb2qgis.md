---
title: "Scraping webmaps with web2qgis"
permalink: /wrote/ScrapingWebmapsWithweb2qgis
twitpic: https://tom.chadw.in/assets/pics/qgis2webLogo.png
description: >
    I wondered if one could write code to do the same thing in reverse--scrape 
    a webpage for webmaps, and import any maps it found into a QGIS project.
---

# Scraping webmaps with web2qgis

<figure class="floatright">
<img src="/assets/pics/qgis2webLogo.png" alt="qgis2web" />
</figure>

qgis2web turns QGIS projects into webmaps. I wondered if one could write 
code to do the same thing in reverse--scrape a webpage for webmaps, and import 
any maps it found into a QGIS project.

## Webscrapers
Though I've never used one myself, I know that webscapers are A Thing. People 
use them to scrape content from third-party websites, allowing them to 
republish it on their own sites. I assume that the fundamental idea is to 
scrape the content without the style.

## A webmap scraper?
When described as such, a webmap scraper sounds rather an esoteric tool. But 
how about allowing a QGIS user to open a webmap in QGIS? They could then amend 
it and republish it elsewhere. Sounds powerful to me, and potentially of great 
use.

## web2qgis
This is what web2qgis does. It's in the earliest of early stages, and needs a 
great deal of work to become a useful tool. However, I think the proof of 
concept is valid, and more work on this QGIS plugin would be valuable.

## Initial development
So how can this work? A QGIS plugin is written in Python, but a webmap is 
written in Javascript. One could try to analyse JS to try to pull out relevant 
information by using regular expressions, but this would be, to all intents 
and purposes, [impossible](https://stackoverflow.com/a/1732454/5613104), and 
the resulting output would still be a bunch of strings, rather than anything 
meaningful.

## Injecting Javascript into a webpage
To do this properly, unless there was an amazing JS parser written in Python 
(an hour or so of auto-[nerdsnipe](https://www.xkcd.com/356/) later, I didn't 
really fancy that), I needed to execute my own JS in the context of the 
webpage. My main eureka moment in the limited development of web2qgis was to 
realize that I had already used a JS parser in Python: QtWebKit.

## What is QtWebkit?
Let's break this question down. Qt is an open-source cross-platform framework 
for building software applications. It is what QGIS itself uses for its GUI 
(among other things). Because QGIS uses it, so do QGIS plugins such as 
qgis2web.

WebKit is an open-source web browser engine. The MacOS/OSX browser Safari uses 
it. QtWebKit is a Qt wrapper for WebKit. In other words, it allows you to 
build fully-featured web browser applications in Qt.

It's worth noting that the recent history of QtWebKit is problematic for 
developers and users. Qt dropped it in favour of QtWebEngine, which uses 
Chromium instead of WebKit. However, QtWebEngine is nowhere near as fully 
featured as QtWebKit. QtWebKit was forked as a community project, and lives 
on. However, this can result in problems for users, and lends a certain 
uncertainty to it as a core dependency. My feeling is that since QGIS itself 
still uses QtWebKit, it's safe to use it in my projects. It's a constant 
nagging concern, though.

## Using QtWebKit to inject JS
qgis2web uses QtWebKit for its preview window. In other words, it includes a 
complete browser implementation, so users can see and interact with their 
webmap within the plugin GUI before exporting.

This is the reason I didn't immediately think of using it in web2qgis. I 
thought of it as a GUI element. However, one can use it to load a webpage 
without rendering it. This is what web2qgis does in PyQt, and then uses a 
simple QtWebKit method to execute JS:

<code>webview = QWebView()
webview.load(QUrl(url_from_GUI))
mainFrame = webview.page().mainFrame()
mainFrame.evaluateJavaScript("L.version")
</code>

This is the programmatic equivalent of loading 
<code class="inline">url_from_GUI</code> in a browser, opening the console, 
and typing <code class="inline">L.version</code>. If a Leaflet version is 
returned, the webpage has a Leaflet map on it.

Note that the code above is simplified. 
<code class="inline">QWebView.load()</code> is asynchronous, so the code above 
would try to run JS against the page before it had finished loading. The real 
code handles this using the <code class="inline">loadFinished</code> signal.

## Simple scraping
Once the above code had confirmed that the target page contained a Leaflet 
map, I could run more JS against the page to start to pull back elements of 
the map to import:

<code>(function (){
  urls = [];
  for(var key in window) {
    var value = window[key];
    if (value instanceof L.Map) {
      for(var lyr in value._layers) {
        if (value._layers[lyr] instanceof L.TileLayer) {
          urls.push(getXYZ(value._layers[lyr]));
        }
      }
    }
  }
  return urls;
}());
</code>

This loops through the DOM to find an <code class="inline">L.Map</code>, loops 
through its <code class="inline">_layers</code>, and builds a list of XYZ 
layers called <code class="inline">xyzs[]</code>. These layers can then be 
added to QGIS:

<code>self.iface.addRasterLayer("type=xyz&url=" + xyzs[0],
                                "XYZ layer",
                                "wms")
</code>

When I first got this to work, my excitement was palpable.

## Expanding functionality: more layer types
Once this minimal version was working, it was reasonably easy to build 
functions to handle other layer types, such as vector [points](https://github.com/tomchadwin/web2qgis/commit/0a86c24a6b2bbc6e6ed468f85b228a1b29449847) 
and [lines](https://github.com/tomchadwin/web2qgis/commit/74b0af0f101e737f2b4cde825e108fba0d7fd71b), 
and to start to bring in other aspects of the map, such as its 
[extent](https://github.com/tomchadwin/web2qgis/commit/d2b3347b678abe8812137fa39de5c92004f049b0).

I then started to build the equivalent functionality for OpenLayers webmaps, 
detecting them with <code class="inline">evaluateJavaScript("ol")</code>, and 
parsing them in the same way.

## Style
This was already a useful tool, pulling in raster and vector layers. However, 
maps live and die on their symbology, so the next task was to try to import 
Leaflet styles.

Webmap styles are complex. For anything but the simplest static style, 
functions are used to style features within a layer according to criteria 
passed in as arguments and processed in JS. Plainly, my approach so far was 
not going to get very far. I needed to be able to convert JS functions into 
something I could then work with in Python to rebuild the styles in QGIS.

Fairly soon, I realized that I needed a full-on JS parser, written in JS. 
[Esprima](http://esprima.org/) is the one I found, and I've been completely 
impressed by it. You pass JS to Esprima, and it parses it into an abstract 
syntax tree (AST). My understanding is that this is how browser JS engines 
themselves work, and I also had some familiarity with ASTs through Nathan 
Woodrow's work on [converting QGIS expressions into 
JS](https://github.com/NathanW2/qgs2js).

The beauty of this is that if you parse a page with Epsrima via a Python 
QtWebKit <code class="inline">evaluateJavaScript()</code> call, the returned 
AST *is a Python list*. In other words, it handles the intelligent conversion 
of a JS type to a Python type. In this case, it means that you can then use 
Python's strong list functions to walk the AST.

I then worked on ways in which to [convert Leaflet style ASTs into QGIS 
renderers](https://github.com/tomchadwin/web2qgis/commit/e58488c7355fca36df9edcd621001b19a0b7363e). 
However, although I got this working to some extent, it could not handle a 
common and fundamental styling technique--calling another function or 
functions within the main layer style function.

## Overwhelming

I got an [initial version](https://github.com/tomchadwin/web2qgis/commit/af9319b63c2ff84eff5010c52b1d2f982e02aab4#diff-e30ae12bc92714646aff60ee1a28d4dbR173) 
of this working. However, I stepped back, and realized I was starting to code 
for specific possible function patterns I knew well (often those exported by 
qgis2web). I knew what was really required was to parse the whole webpage in 
entirety, and then build a stack of more and more granular tests in the Python 
AST walking function to handle everything which was required.

In other words, this needed to become a significantly large subset of the 
functionality of a JS-to-Python converter.

That's when I stopped work on web2qgis. It's not that I can't see where to go 
next. Nathan's walk code has shown me how to build things up from an AST. It's 
just that it feels so fundamental, and perhaps seems a more intimidating 
job than it actually is.

## Where next?
Along with the necessary broadening out of the AST parsing process, and 
building more functions to support more map styles and elements, this could be 
an incredibly powerful QGIS Processing algorithm (hat-tip to Nyall Dawson for 
suggesting this on Twitter). The ability to scrape specific data from webmaps 
as one step in an automated processing pipeline is appealing.

If anyone would like to take a look at web2qgis and perhaps help to expand its 
currently limited functionality, I would, of course, be incredibly grateful. I 
think the idea has sigificant potential, and I do regret that the scale of the 
job intimidated me into putting it on hold.

- [github.com/tomchadwin/web2qgis](https://github.com/tomchadwin/web2qgis)

Thanks are due to James Milner, Vladimir Agafonkin, Per Liedman, and Calvin 
Metcalfe for help on Twitter during all this. Without it I would definitely 
not have got as far as I have.