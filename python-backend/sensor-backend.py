#!/usr/bin/env python3
import socket
import threading
import requests
import datetime

"""
This script executes a service that listens to requests sent by the sensor.
These requests occur when the sensor detects the entry or exit of a vehicle.
"""

# HOST AND PORT FOR THIS SERVICE
HOST = "127.0.0.1"
PORT = 4096

IN_MEMORY_DATA_ENDPOINT = "http://127.0.0.1:4097/common"


def start():
    # Create socket, bind it and set to listen
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind((HOST, PORT))
        sock.listen()
        # Wait forever
        while True:
            print("Waiting for connections in {}:{}...".format(HOST, PORT))
            # Block socket and wait for incoming connection
            connection, address = sock.accept()
            # Process connection
            process_incoming_connection(connection, address)


def process_incoming_connection(connection, address):
    with connection:
        print("Connected by", address)
        # Receive data
        data = connection.recv(1024).decode("utf-8")

        # Modify counters and system flags (using threads so the HW doesn't wait)
        # A vehicle entered
        if 'in' in data:
            threading.Thread(target=modify_counter_by_event, args=['in']).start()
        # A vehicle leaved
        elif 'out' in data:
            threading.Thread(target=modify_counter_by_event, args=['out']).start()


def modify_counter_by_event(event):
    confirmation = requests.put(url=IN_MEMORY_DATA_ENDPOINT, json={'event': event})
    print("{} sent by in-memory data script at {}".format(confirmation, datetime.datetime.now()))


if __name__ == "__main__":
    start()
