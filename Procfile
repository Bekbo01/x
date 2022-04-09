web: gunicorn xtrade.wsgi:application --preload
worker: celery worker --app=xtrade --loglevel=info -B
release: python3 manage.py migrate
