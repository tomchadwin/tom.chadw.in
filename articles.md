---
title: "Articles"
permalink: /articles
---
<ul id="articleList">
{% for post in site.posts %}
  <li>
    <div>{{ page.date | date: "%e %B %Y" }}</div>
    <div><a href="{{ post.url }}">{{ post.title }}</a></div></li>
{% endfor %}
</ul>