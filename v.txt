web: gunicorn xtrade.wsgi:application --preload
main_worker: python manage.py celery worker --beat --loglevel=info
release: python3 manage.py migrate
