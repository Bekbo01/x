web: gunicorn xtrade.wsgi --log-file -
worker: celery -A xtrade worker --without-heartbeat --without-gossip --without-mingle
