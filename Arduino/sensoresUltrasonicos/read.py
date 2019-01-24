import serial

ser = serial.Serial(port='/dev/ttyUSB1', baudrate=9600, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, timeout=2)
try:
    ser.isOpen()
    print("Serial port is open")
except:
    print("error")
    exit()

if (ser.isOpen()):
    try:
        while(1):
            print(ser.read())
    except Exception:
        print("error")
else:
    print("cannot open the port")
