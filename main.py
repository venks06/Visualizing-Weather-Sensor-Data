import os
from base64 import b64encode
import urllib2

from flask import Flask, render_template

project_root = os.path.dirname(__file__)
template_path = os.path.join(project_root, 'templates')
static_path = os.path.join(project_root, 'static')
app = Flask(__name__, template_folder=template_path, static_folder=static_path)
wsgi_app = app.wsgi_app

@app.route('/')
def d3():
    return render_template('d3.html')

@app.route('/render')
def render():
    event_data = ""
    try:
        endpoint = "https://e0u82m.internetofthings.ibmcloud.com/api/v0002/historian/types/ESP8266/devices/DHT11-1"
        base64string = b64encode(b"a-e0u82m-gnf2vqkjhh:CPZV9(T(Aj*BFC2bBp").decode("ascii")
        request = urllib2.Request(endpoint)
        request.add_header("Authorization", "Basic %s" % base64string)
        result = urllib2.urlopen(request)
        event_data = result.read()
        print event_data
    except Exception as e:
        print e
    return event_data

if __name__ == "__main__":
    app.run('0.0.0.0', '5555')