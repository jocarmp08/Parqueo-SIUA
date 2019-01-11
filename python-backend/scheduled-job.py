# Save parking entrances at midnight
import json
import time

import requests
import schedule as schedule

"""
This script executes a scheduled service that sends a PUT to the database to store the number of vehicles that entered
the parking lot during the day.
"""

IN_MEMORY_DATA_ENDPOINT = "http://127.0.0.1:4097/restart"


def start():
    schedule.every(1).minutes.do(send_to_db)
    while True:
        schedule.run_pending()
        time.sleep(60)


def send_to_db():
    with open("backup.json", 'r') as json_file:
        data = json.load(json_file)
        print(data['parkingEntrancesCounter'])

        # confirmation = requests.put(url=IN_MEMORY_DATA_ENDPOINT)
        # print(confirmation)


if __name__ == "__main__":
    start()
