{% for post in site.posts %}
  {% if post.next == nil %}
  {{ post.content }}
  {% else %}
<nav><div></div><div><a href="{{post.url}}">{{post.title}}</a></div></nav>
  {% break %}
  {% endif %}
{% endfor %}
