---
title: "Articles"
permalink: /articles
twitpic: https://tom.chadw.in/assets/pics/TomSquare.jpg
---
<ul id="articleList">
{% for post in site.posts %}
  <li>
    <article>
      <div>{{ post.date | date: "%e %B %Y" }}</div>
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <p>{{ post.description }}</p>
    </article>
  </li>
{% endfor %}
</ul>