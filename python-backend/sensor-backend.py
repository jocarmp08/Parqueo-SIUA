#!/usr/bin/env python3
import socket
import types
import selectors
import threading
import requests
import datetime

"""
This script executes a service that listens to requests sent by the sensor.
These requests occur when the sensor detects the entry or exit of a vehicle.
"""

# HOST AND PORT FOR THIS SERVICE
HOST = "0.0.0.0"
PORT = 4096

IN_MEMORY_DATA_ENDPOINT = "http://127.0.0.1:4097/common"

# Use select method
selector = selectors.DefaultSelector()


def start():
    # Create socket, bind it and set to listen
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind((HOST, PORT))
        sock.listen()
        sock.setblocking(False)
        selector.register(sock, selectors.EVENT_READ, accept_connection)
        # Wait forever
        while True:
            print("Waiting for connections in {}:{}...".format(HOST, PORT))
            # Wait for changes in FD
            events = selector.select(timeout=0.5)
            for key, mask in events:
                handler = key.data
                handler(key.fileobj, mask)


def accept_connection(sock):
    connection, address = sock.accept()
    print("Connected by", address)
    connection.setblocking(False)
    #data = types.SimpleNamespace(add=address, inb=b'', outb=b'')
    selector.register(connection, selectors.EVENT_READ, process_incoming_connection)


def process_incoming_connection(connection, mask):
    try:
        data = connection.recv(1024)
        data = data.decode("utf-8")

              # Modify counters and system flags (using threads so the HW doesn't wait)
        # A vehicle entered
        if 'in' in data:
            threading.Thread(target=modify_counter_by_event, args=['in']).start()
        # A vehicle leaved
        elif 'out' in data:
            threading.Thread(target=modify_counter_by_event, args=['out']).start()

        selector.unregister(sock)
        sock.close()


def modify_counter_by_event(event):
    confirmation = requests.put(url=IN_MEMORY_DATA_ENDPOINT, json={'event': event})
    print("{} sent by in-memory data script at {}".format(confirmation, datetime.datetime.now()))


if __name__ == "__main__":
    start()
