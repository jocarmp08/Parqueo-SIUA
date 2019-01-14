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
        selector.register(sock, selectors.EVENT_READ, data=None)
        # Wait forever
        while True:
            print("Waiting for connections in {}:{}...".format(HOST, PORT))
            # Wait for changes in FD
            events = selector.select(timeout=None)
            for key, mask in events:
                if key.data is None:
                    accept_connection(key.fileobj)
                else:
                    process_incoming_connection(key, mask)


def accept_connection(sock):
    connection, address = sock.accept()
    print("Connected by", address)
    connection.setblocking(False)
    data = types.SimpleNamespace(add=address, inb=b'', outb=b'')
    events = selectors.EVENT_READ | selectors.EVENT_WRITE
    selector.register(connection, events, data=data)


def process_incoming_connection(key, mask):
    sock = key.fileobj
    data = key.data
    if mask and selectors.EVENT_READ:
        # Receive data
        recv_data = sock.recv(1024)
        recv_data = recv_data.decode("utf-8")
        
        # Modify counters and system flags (using threads so the HW doesn't wait)
        # A vehicle entered
        if 'in' in recv_data:
            threading.Thread(target=modify_counter_by_event, args=['in']).start()
        # A vehicle leaved
        elif 'out' in recv_data:
            threading.Thread(target=modify_counter_by_event, args=['out']).start()

        selector.unregister(sock)
        sock.close()


def modify_counter_by_event(event):
    confirmation = requests.put(url=IN_MEMORY_DATA_ENDPOINT, json={'event': event})
    print("{} sent by in-memory data script at {}".format(confirmation, datetime.datetime.now()))


if __name__ == "__main__":
    start()
