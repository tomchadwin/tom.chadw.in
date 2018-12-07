---
title: "Articles"
permalink: /articles
---
<ul id="articleList">
{% for post in site.posts %}
  <li>
    <div>{{ post.date | date: "%e %B %Y" }}</div>
    <div><a href="{{ post.url }}">{{ post.title }}</a></div>
    <div>{{ post.blurb }}</div>
  </li>
{% endfor %}
</ul>