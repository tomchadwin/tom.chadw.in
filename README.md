{% for post in site.posts %}
  {{ post.content }}
  {% break %}
{% endfor %}
{% if page.next != nil or page.previous != nil %}
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
{% endif %}
