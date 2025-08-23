from config.settings import *
import sys
from datetime import timedelta

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}
#nu detalii pt ce nu fct
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
}
# ca sa nu trimita mesajele
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

from datetime import timedelta
#limita pt token
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=1),
}

