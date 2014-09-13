class Post extends Model
  @title   = String
  @content = String
  @posted  = Date

class Posts extends Controller
  @model = Post

class Blog extends App
  views:
    posts: show: """
    <article>
      <h1>{{title}}</h1>
      <time>{{posted}}</time>
      {{content}}
    </article>
    """

