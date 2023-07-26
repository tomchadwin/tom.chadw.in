{% for post in site.posts %}
  {% if post.next == nil %}
  {{ post.content }}
  {% else %}
<a href="{{post.url}}">[{{post.title}}]({{post.url}})</a>
  {% break %}
  {% endif %}
{% endfor %}
