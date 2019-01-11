# Save parking entrances at midnight
import json
import time
from datetime import datetime, timezone
import requests
import schedule as schedule

"""
This script executes a scheduled service that sends a PUT to the database to store the number of vehicles that entered
the parking lot during the day.
"""

LOOPBACK_ENDPOINT = "http://167.99.240.71:3000/api/entrances"
IN_MEMORY_DATA_ENDPOINT = "http://127.0.0.1:4097/restart"


def start():
    schedule.every().day.at("00:05").do(send_to_db)
    while True:
        schedule.run_pending()
        time.sleep(1)


def send_to_db():
    with open("backup.json", 'r') as json_file:
        parking_entrances = json.load(json_file)['parkingEntrancesCounter']
        date = datetime.now(timezone.utc).astimezone()
        day = date.weekday()

        # Prepare entrance object
        entrance = {
            "quantity": parking_entrances,
            "date": date,
            "day": day,
        }

        post = requests.post(url=LOOPBACK_ENDPOINT, data=entrance)
        print(post)

        # confirmation = requests.put(url=IN_MEMORY_DATA_ENDPOINT)
        # print(confirmation)


if __name__ == "__main__":
    start()
