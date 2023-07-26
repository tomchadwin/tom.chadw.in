{% for post in site.posts %}
  {% if post.next == nil %}
  {{ post.content }}
  {% else %}
    {{post.url}}">[{{post.title}}]({{post.url}})
  {% break %}
  {% endif %}
{% endfor %}
