""" Live tests. На будущее, ниже код из документации - не рабочий
https://www.django-rest-framework.org/api-guide/testing/#live-tests
"""
from rest_framework.test import CoreAPIClient

# Fetch the API schema
from requests.auth import HTTPBasicAuth

# Fetch the API schema
client = CoreAPIClient()
schema = client.get('http://testserver/schema/')

# Create a new organisation
params = {'name': 'MegaCorp', 'status': 'active'}
client.action(schema, ['organisations', 'create'], params)

# Ensure that the organisation exists in the listing
data = client.action(schema, ['organisations', 'list'])
assert (len(data) == 1)
assert (data == [{'name': 'MegaCorp', 'status': 'active'}])

client = CoreAPIClient()
client.session.auth = HTTPBasicAuth('user', 'pass')
client.session.headers.update({'x-test': 'true'})
