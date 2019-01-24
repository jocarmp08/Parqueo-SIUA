import RPi.GPIO as GPIO
import time
import socket
from interruptingcow import timeout


TRIG1 = 23
ECHO1 = 24

TRIG2 = 20
ECHO2 = 21

step = 0

maxDistance = 20
minDistance = 5

HOST = "167.99.240.71"
PORT = 4096

data = b'in'

def start():
	GPIO.cleanup()
	GPIO.setmode(GPIO.BCM)

	print("distance measruement in progress")

	GPIO.setup(TRIG1,GPIO.OUT)
	GPIO.setup(ECHO1,GPIO.IN)
	
	GPIO.setup(TRIG2,GPIO.OUT)
	GPIO.setup(ECHO2,GPIO.IN)

	GPIO.output(TRIG1,False)
	GPIO.output(TRIG2,False)
	
	print("waiting for sensor to settle")
	
	loop()

def loop():
	global step
	
	while True:
		time.sleep(0.2)
		distance1 = distance(TRIG1,ECHO1)
		distance2 = distance(TRIG2,ECHO2)
		
		sensor1 = validate_distance(distance1)
		sensor2 = validate_distance(distance2)

		movement(sensor1,sensor2)
		print("step: ",step)
		
		if step == 4:
			step = 0
			send_data()
		

def distance(TRIG,ECHO):
	GPIO.output(TRIG,True)
	time.sleep(0.00001)
	GPIO.output(TRIG,False)
	
	
	while GPIO.input(ECHO)==0:	
		pulse_start = time.time()
			
		
	while GPIO.input(ECHO)==1:
		pulse_end = time.time()
		
	
	pulse_duration = pulse_end - pulse_start
	distance = pulse_duration/0.000058
	distance = round(distance,2)
	print("Distance: ", distance,"cm")

	return distance
	
	
	

	
	


def validate_distance(distance):
	if(distance<maxDistance and distance>minDistance):
		return 1
	
	else:
		return 0
	
	
	
def movement(sensor1,sensor2):
	global step

	if(step >= 0 and sensor1==1 and sensor2 == 0):
		step = 1
	
	elif(step >= 1 and sensor1==1 and sensor2 == 1):
		step = 2
	
	elif(step >= 2 and sensor1==0 and sensor2 == 1):
		step = 3
	
	elif(step >= 3 and sensor1==0 and sensor2 == 0):
		step = 4
	

def send_data():
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		s.connect((HOST,PORT))
		s.sendall(data)
		s.close()

start()
