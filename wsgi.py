from flask import Flask, render_template, request, abort
from flask_compress import Compress
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import json
from youtube import Video, YOUTUBE_RE

CACHE_TTL = int(os.getenv('CACHE_TTL', 3600))
SITE_REQUESTS_LIMIT = os.getenv('SITE_REQUESTS_LIMIT', '5/minute, 10/hour')

app = Flask(__name__)
Compress(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=[SITE_REQUESTS_LIMIT],
    headers_enabled=True
)


@cache.cached(timeout=CACHE_TTL)
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/_v')
def video_info():
    request_url = request.args.get('url', 0, type=str)
    if YOUTUBE_RE.match(request_url):
        video = Video(request_url)
        if video.info:
            return json.dumps(video.info)
    abort(400)


if __name__ == '__main__':
    app.run()
