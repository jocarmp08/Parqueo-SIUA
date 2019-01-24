
#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <PubSubClient.h>
#define TRIGGER 2
#define ECHO 3

const char *ssid =  "eralfafo";        //Your Access Point or Personal Hotspot, cannot be longer than 32 characters!
const char *pass =  "ernesto96";    //Your Access Point or Personal Hotspot password
IPAddress server(192,168,1,6);
const uint16_t port = 3000; 
//const int pingPin = 2;          //Ultrasonic connected to GPIO0
//int TRIGGER = 5; //Pin D1 = TRIGGER
//int ECHO = 4; //Pin D2 = ECHO
unsigned long timeout = 1;
void setup() 
{
  //pinMode(0,OUTPUT);            //LED connected to GPIO2
  Serial.begin(115200);         //Recommended speed is 115200
  //pinMode(TRIGGER,OUTPUT);
  //pinMode(ECHO,INPUT);
  connectWifi();
  }

void loop() 
{
  unsigned long duration;
  //, inches, cm;
 
  digitalWrite(TRIGGER, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGGER, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER, LOW);

  // The same pin is used to read the signal from the PING))): a HIGH
  // pulse whose duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.


  duration = pulseIn(ECHO, HIGH);

  Serial.print("prueba: ");
  Serial.println(duration);
  // convert the time into a distance
  //inches = microsecondsToInches(duration);
  //cm = microsecondsToCentimeters(duration);

  //Serial.print(inches);
  //Serial.print("in, ");
  //Serial.print(cm);
  //Serial.print("cm");
  //Serial.println();

  delay(100);

  digitalWrite(2, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);              // wait for a second
  digitalWrite(2, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);              // wait for a second

  sendHeight();
}
void connectWifi()
{ 
  Serial.print("Connecting to "+*ssid);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
  delay(1000);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("Connected");
  Serial.println("");  
}//end connect
long microsecondsToInches(long microseconds) 
{ // According to Parallax's datasheet for the PING))), there are
  // 73.746 microseconds per inch (i.e. sound travels at 1130 feet per
  // second).  This gives the distance travelled by the ping, outbound
  // and return, so we divide by 2 to get the distance of the obstacle.
  // See: http://www.parallax.com/dl/docs/prod/acc/28015-PING-v1.3.pdf
  return microseconds / 74 / 2;
}
long microsecondsToCentimeters(long microseconds) {
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the
  // object we take half of the distance travelled.
  return microseconds / 29 / 2;
}

 void sendHeight()
{  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  if (!client.connect(server  , port)) {
    Serial.println("connection failed");
    delay(5000);
    return;
  }

  // This will send a string to the server
  Serial.println("sending data to server");
  if (client.connected()) {
    client.println("0");
  }
   delay(1000);

   // wait for data to be available
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      delay(60000);
      return;
    }
  }

  // Read all the lines of the reply from server and print them to Serial
  Serial.println("receiving from remote server");
  // not testing 'client.connected()' since we do not need to send data here
  while (client.available()) {
    char ch = static_cast<char>(client.read());
    Serial.print(ch);
  }

  // Close the connection
  Serial.println();
  Serial.println("closing connection");
  client.stop();

  delay(300000);
   
   }//end if

   
