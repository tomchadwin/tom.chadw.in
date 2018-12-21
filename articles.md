---
title: "Articles"
permalink: /articles
---
<ul id="articleList">
{% for post in site.posts %}
  <li>
    <div>{{ post.date | date: "%e %B %Y" }}</div>
    <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <p>{{ post.description }}</p>
  </li>
{% endfor %}
</ul>