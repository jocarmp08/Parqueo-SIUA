import arrow
from flask import Flask, render_template, request, jsonify
from flask_sse import sse
import json

# Flask
app = Flask(__name__)
app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix="/stream")

# Counter system flags
data = {}


@app.route("/max", methods=["PUT"])
def maximum():
    # Get request data
    request_data = request.get_json()
    # Update flags
    global data
    data['maxCommon'] = request_data['maxCommon']
    data['maxHandicapped'] = request_data['maxHandicapped']

    # Backup
    backup()

    # Respond to the request
    return request_data


@app.route("/now", methods=["PUT"])
def now():
    # Get request data
    request_data = request.get_json()
    # Update flags
    global data
    data['nowCommon'] = request_data['nowCommon']
    data['nowHandicapped'] = request_data['nowHandicapped']

    # Backup
    backup()

    # Respond to the request
    return request_data


@app.route("/common", methods=["PUT"])
def modify_common_counter():
    # Get request data
    request_data = request.get_json()['event']
    # Modify counter
    global data
    if 'in' in request_data:
        if data['nowCommon'] > 0:
            data['nowCommon'] -= 1
            data['parkingEntrancesCounter'] += 1
    elif 'out' in request_data:
        if data['nowCommon'] < data['maxCommon']:
            data['nowCommon'] += 1

    # Backup and distribute changes
    backup()
    publish()

    # Respond to the request
    return request_data


@app.route("/handicapped", methods=["PUT"])
def modify_handicapped_counter():
    # Get request data
    request_data = request.get_json()['event']
    # Modify counter
    global data
    if 'in' in request_data:
        if data['nowHandicapped'] > 0:
            data['nowHandicapped'] -= 1
            data['parkingEntrancesCounter'] += 1
    elif 'out' in request_data:
        if data['nowHandicapped'] < data['maxHandicapped']:
            data['nowHandicapped'] += 1

    # Backup and distribute changes
    backup()

    # Respond to the request
    return request_data


@app.route("/restart", methods=["PUT"])
def restart_entrances_counter():
    # Update flags
    global data
    data['parkingEntrancesCounter'] = 0

    # Backup
    backup()

    # Respond to the request
    return jsonify(success=True)


@app.before_first_request
def prepare_data():
    # Total spaces at startup
    max_common_spaces_available = 40
    max_handicapped_spaces_available = 10
    # Spaces available during runtime
    common_spaces_available_now = max_common_spaces_available
    handicapped_spaces_available_now = max_handicapped_spaces_available
    # Parking entrances by day
    parking_entrances_counter = 0
    last_data_update_date = None

    global data
    # Prepare data
    data = {
        'maxCommon': max_common_spaces_available,
        'maxHandicapped': max_handicapped_spaces_available,
        'nowCommon': common_spaces_available_now,
        'nowHandicapped': handicapped_spaces_available_now,
        'parkingEntrancesCounter': parking_entrances_counter,
        'lastDataUpdateDate': last_data_update_date
    }


def backup():
    global data
    data['lastDataUpdateDate'] = arrow.utcnow().format("YYYY-MM-DD HH:mm:ss ZZ")

    # Backup in JSON file
    with open("backup.json", 'w') as json_backup:
        json_backup.write(json.dumps(data))


def publish():
    sse.publish(data, type='greeting')


@app.route("/")
def index():
    return render_template("index.html")
