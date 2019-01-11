from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify
from flask_sse import sse
import json
import requests
import dateutil.parser
import numpy
import operator

# Flask
app = Flask(__name__)
app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix="/stream")

# Counter system flags
counters = {}

# LoopBack endpoint
loop_back = "http://167.99.240.71:3000/api/entrances"


@app.route("/api", methods=["GET"])
def send_data_structure():
    """
    This function returns the <counters> structure in a JSON response
    :return: a JSON object
    """
    # Respond to the request
    return jsonify(counters)


@app.route("/max", methods=["PUT"])
def modify_max_flags():
    """
    This function receives a parameter that indicates the new values ​​for the MAX flags.
    Make a backup and return an HTTP code
    :return: a HTTP code
    """
    # Get request data
    request_data = request.get_json()
    # Update flags
    global counters
    counters['maxCommon'] = request_data['maxCommon']
    counters['maxHandicapped'] = request_data['maxHandicapped']

    # Backup
    backup()

    # Respond to the request
    return request_data


@app.route("/now", methods=["PUT"])
def modify_now_flags():
    """
       This function receives a parameter that indicates the new values ​​for the NOW flags.
       Make a backup and return an HTTP code
       :return: a HTTP code
       """
    # Get request data
    request_data = request.get_json()
    # Update flags
    global counters
    counters['nowCommon'] = request_data['nowCommon']
    counters['nowHandicapped'] = request_data['nowHandicapped']

    # Backup
    backup()

    # Respond to the request
    return request_data


@app.route("/common", methods=["PUT"])
def modify_common_counter():
    """
    This function receives a parameter that indicates the type of modification (increase / decrease) that must be
    done in the nowCommon flag. It also makes a backup and publishes an SSE.
    :return: a HTTP code
    """
    # Get request data
    request_data = request.get_json()['event']
    # Modify counter
    global counters
    if 'in' in request_data:
        if counters['nowCommon'] > 0:
            counters['nowCommon'] -= 1
            counters['parkingEntrancesCounter'] += 1
    elif 'out' in request_data:
        if counters['nowCommon'] < counters['maxCommon']:
            counters['nowCommon'] += 1

    # Backup and distribute changes
    backup()
    publish()

    # Respond to the request
    return request_data


@app.route("/handicapped", methods=["PUT"])
def modify_handicapped_counter():
    """
       This function receives a parameter that indicates the type of modification (increase / decrease) that must be
       done in the nowHandicapped flag. It also makes a backup and publishes an SSE.
       :return: a HTTP code
       """
    # Get request data
    request_data = request.get_json()['event']
    # Modify counter
    global counters
    if 'in' in request_data:
        if counters['nowHandicapped'] > 0:
            counters['nowHandicapped'] -= 1
            counters['parkingEntrancesCounter'] += 1
    elif 'out' in request_data:
        if counters['nowHandicapped'] < counters['maxHandicapped']:
            counters['nowHandicapped'] += 1

    # Backup and distribute changes
    backup()

    # Respond to the request
    return request_data


@app.route("/restart", methods=["PUT"])
def restart_entrances_counter():
    """
    This function allows you to reset the parking entrances counter.
    :return: a HTTP code
    """
    # Update flags
    global counters
    counters['parkingEntrancesCounter'] = 0

    # Backup
    backup()

    # Respond to the request
    return jsonify(success=True)


@app.route("/forecast", methods=["GET"])
def send_forecast():
    # Get request data
    request_data = request.args['date']
    if request_data:
        # Day of the week and the number of records to request
        day = dateutil.parser.parse(request_data).weekday()  # Monday 0 - Sunday 6
        number_of_days = 10

        # Request body
        params = {
            'filter[limit]': number_of_days,
            'filter[where][date][lt]': datetime.now(timezone.utc).astimezone(),
            'filter[where][day]': day
        }

        data = requests.get(url=loop_back, params=params).content

        return calculate_trend(data)
    else:
        return jsonify(success=False)


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
    last_data_update_date = datetime.now(timezone.utc).astimezone()

    global counters
    # Prepare data
    counters = {
        'maxCommon': max_common_spaces_available,
        'maxHandicapped': max_handicapped_spaces_available,
        'nowCommon': common_spaces_available_now,
        'nowHandicapped': handicapped_spaces_available_now,
        'parkingEntrancesCounter': parking_entrances_counter,
        'lastDataUpdateDate': last_data_update_date
    }


def backup():
    global counters
    counters['lastDataUpdateDate'] = datetime.now(timezone.utc).astimezone()

    # Backup in JSON file
    with open("backup.json", 'w') as json_backup:
        json_backup.write(json.dumps(counters, sort_keys=True, default=str))


def publish():
    sse.publish(counters, type='message')


def calculate_trend(data):
    array = json.loads(data.decode('utf8'))
    n = len(array)
    if n > 1:
        x = [i + 1 for i in range(n)]
        y = [i['quantity'] for i in array]
        avg_x = numpy.average(x)
        avg_y = numpy.average(y)
        sum_xy = sum(list(map(operator.mul, x, y)))
        sum_xx = sum(list(map(operator.mul, x, x)))

        # liner trend
        b = (sum_xy - n * avg_x * avg_y) / (sum_xx - n * avg_x ** 2)
        a = avg_y - b * avg_x
        prediction = a + b * (n + 1)
        print(prediction)

        return jsonify(success=True, quantity=prediction)
    elif n == 1:
        return jsonify(success=True, quantity=array[0]['quantity'])
    else:
        return jsonify(success=True, quantity=-1)


@app.route("/")
def index():
    return render_template("index.html")
