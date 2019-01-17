import redis
from flask import Flask, render_template, request, jsonify
from flask_sse import sse
from flask_cors import CORS
import json
import requests
from datetime import datetime, timezone
import dateutil.parser
import numpy
import operator

# Flask
app = Flask(__name__)
app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix="/stream")
CORS(app)

# Redis
redis_host = "localhost"
redis_port = "6379"
redis_password = ""
redis_conn = redis.StrictRedis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True)
redis_conn.set_response_callback('HGET', int)

# LoopBack endpoint
LOOPBACK_ENDPOINT = "http://167.99.240.71:3000/api/entrances"


@app.route("/api", methods=["GET"])
def send_data_structure():
	"""
	This function returns the <counters> structure in a JSON response
	:return: a JSON object
	"""
	# Respond to the request
	return jsonify(redis_conn.hgetall('counters'))


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
	redis_conn.hset('counters', 'maxCommon', request_data['maxCommon'])
	redis_conn.hset('counters', 'maxHandicapped', request_data['maxHandicapped'])

		# Backup and distribute changes
	backup()
	publish()

	# Respond to the request
	return jsonify(success=True)


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
	redis_conn.hset('counters', 'nowCommon', request_data['nowCommon'])
	redis_conn.hset('counters', 'nowHandicapped', request_data['nowHandicapped'])

	# Backup and distribute changes
	backup()
	publish()

	# Respond to the request
	return jsonify(success=True)


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
	now_common = redis_conn.hget('counters', 'nowCommon')
	if 'in' in request_data:
		if now_common > 0:
			redis_conn.hset('counters', 'nowCommon', now_common - 1)
			parking_entrances = redis_conn.hget('counters', 'parkingEntrancesCounter')
			redis_conn.hset('counters', 'parkingEntrancesCounter', parking_entrances + 1)
	elif 'out' in request_data:
		max_common = redis_conn.hget('counters', 'maxCommon')
		if now_common < max_common:
			redis_conn.hset('counters', 'nowCommon', now_common + 1)

	# Backup and distribute changes
	backup()
	publish()

	# Respond to the request
	return jsonify(success=True)


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
	now_handicapped = redis_conn.hget('counters', 'nowHandicapped')
	if 'in' in request_data:
		if now_handicapped > 0:
			redis_conn.hset('counters', 'nowHandicapped', now_handicapped - 1)
	elif 'out' in request_data:
		max_handicapped = redis_conn.hget('counters', 'maxHandicapped')
		if now_handicapped < max_handicapped:
			redis_conn.hset('counters', 'nowHandicapped', now_handicapped + 1)

	# Backup and distribute changes
	backup()
	publish()

	# Respond to the request
	return jsonify(success=True)


@app.route("/restart", methods=["PUT"])
def restart_entrances_counter():
	"""
	This function allows you to reset the parking entrances counter.
	:return: a HTTP code
	"""
	# Update flags
	redis_conn.hset('counters', 'parkingEntrancesCounter', 0)

	# Backup and distribute changes
	backup()
	publish()

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

		data = requests.get(url=LOOPBACK_ENDPOINT, params=params).content

		return calculate_trend(data)
	else:
		return jsonify(success=False)


@app.before_first_request
def prepare_data():
	if redis_conn.exists('counters') == 0:
		# Total spaces at startup
		max_common_spaces_available = 40
		max_handicapped_spaces_available = 10
		# Spaces available during runtime
		common_spaces_available_now = max_common_spaces_available
		handicapped_spaces_available_now = max_handicapped_spaces_available
		# Parking entrances by day
		parking_entrances_counter = 0
		last_data_update_date = datetime.now(timezone.utc).astimezone().isoformat()

		# Prepare data
		counters = {
			'maxCommon': max_common_spaces_available,
			'maxHandicapped': max_handicapped_spaces_available,
			'nowCommon': common_spaces_available_now,
			'nowHandicapped': handicapped_spaces_available_now,
			'parkingEntrancesCounter': parking_entrances_counter,
			'lastDataUpdateDate': last_data_update_date
		}

		redis_conn.hmset('counters', counters)


def backup():
	redis_conn.hset('counters', 'lastDataUpdateDate', datetime.now(timezone.utc).astimezone().isoformat())

	# Backup in JSON file
	with open("backup.json", 'w') as json_backup:
		json_backup.write(json.dumps(redis_conn.hgetall('counters'), sort_keys=True, default=str))


def publish():
	sse.publish(redis_conn.hgetall('counters'), type='message')


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
