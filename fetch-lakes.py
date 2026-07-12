import urllib.request
import json
import urllib.parse

query = '[out:json];(relation["name"="Van Gölü"];relation["name"="Tuz Gölü"];);out geom;'
url = 'https://overpass-api.de/api/interpreter?data=' + urllib.parse.quote(query)

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = response.read()
        with open('src/data/raw-lakes.json', 'wb') as f:
            f.write(data)
        print("Success")
except Exception as e:
    print("Error:", e)
