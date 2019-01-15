#!/usr/bin/env python3

import socket
import json

HOST = '192.168.1.2'  # Standard loopback interface address (localhost)
PORT = 3000        # Port to listen on (non-privileged ports are > 1023)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    conn, addr = s.accept()
    with conn:
        print('Connected by', addr)

        #while True:
        data = conn.recv(1024)
        #stringdata = data.decode('utf-8')   #byte to string
        #if not data:
        #    break

        if data== b'1':
            with open('data.json', 'r') as outfile:
                data1 = json.load(outfile)
                outfile.close()

                data1["generales"] += 1
                data1["ingresos"] += 1
                outfile = open("data.json", "w+")
                outfile.write(json.dumps(data1))
                outfile.close()
        else:
            with open('data.json', 'r') as outfile:
                data1 = json.load(outfile)
                outfile.close()

                data1["generales"] -= 1
                outfile = open("data.json", "w+")
                outfile.write(json.dumps(data1))
                outfile.close()


        print(data)
        conn.sendall(data)
