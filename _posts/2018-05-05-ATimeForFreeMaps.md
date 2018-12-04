---
title: "A time for free maps"
permalink: /wrote/ATimeForFreeMaps
---
# A time for free maps

Perhaps I’m mistaken, but it seems to me that enthusiasm for 
[Leaflet](https://leafletjs.com/) and [OpenLayers](https://openlayers.org/) 
web mapping libraries has cooled over recent times. After several years of 
real excitement, many seem to have drifted away to proprietary platforms such 
as [Mapbox](https://www.mapbox.com/) or [Carto](https://carto.com/). Or 
Google Maps.

Then this week, [Google announced changes to their mapping 
platform](https://cloud.google.com/maps-platform/user-guide/). At this 
early stage, I make absolutely no claim to have digested the changes from 
Google. I <em>believe</em> that they have reduced their free usage allowance 
significantly, upped their usage charges by some degree, and now require 
credit card details for all use of their API (even free tier), but I 
absolutely could be wrong. It is possible that everyone has overreacted, and 
we will all get used to the new normal fairly quickly. However, a significant 
proportion of the online mapping developer community is [up in 
arms](http://geoawesomeness.com/developers-up-in-arms-over-google-maps-api-insane-price-hike/). 

Regardless of the details, this is a glaring instance of the perils of 
reliance on a single commercial service provider, even if the service on which 
you rely is free. If the provider is commercial, there is zero guarantee that 
the service will <em>remain</em> free.

The result of this change could mean that millions of sites 
([ours](https://www.northumberlandnationalpark.org.uk/) included) will now 
start to cost their owners additional usage fees, and thousands of developers 
will have to investigate alternatives for online maps on their clients’ sites.

Everyone must understand that, while Google is often portrayed as a malefactor 
among those in the open-source community, and while I have the utmost respect 
for other commercial mapping providers, the same could happen with Mapbox, 
Carto, or whoever else you sign up to for data and mapping services. That’s 
the deal: you sign up with a commercial provider, and you pay what they 
charge. That figure can increase. It’s not evil — it’s commercial.

This is now the time both for open-source mapping software providers to shout 
about their products from the rooftops, and for 
[OpenStreetMap](https://www.openstreetmap.org/) and other open data providers 
to prove their inestimable importance to us all. To make this crystal clear: 
if we had all used Leaflet/OpenLayers and OpenStreetMap instead of Google 
Maps, we would have known from the start that such a change could never 
legally catch us off-balance.

<figure>
    <img src="/assets/pics/LaughOutLoudCats_2074.jpeg" alt="I upgraded teh maps." />
    <figcaption>
    <a href="https://www.flickr.com/photos/apelad/8008327113">Laugh-Out-Loud Cats #2074</a> 
    by <a href="https://www.flickr.com/photos/apelad/">Ape-Lad> (licensed under 
    <a href="https://creativecommons.org/licenses/by-nd/2.0/">CC BY-NC-ND 2.0</a>)
    </figcaption>
</figure>

This is my call to the amazing developers of Leaflet and OpenLayers, and to 
the astonishing force that is OpenStreetMap, to step in right now. Shout about 
what you are, and seize this once-in-a-lifetime opportunity to explain to 
people why arguments over open versus proprietary are not tribal or academic 
zealotry. You now have a concrete compelling argument to those who have always 
asked: “Why not just use Google Maps?”

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
