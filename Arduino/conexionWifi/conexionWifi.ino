//#include <hcsr04.h>
//#include <NewPing.h>
#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <PubSubClient.h>
#ifndef STASSID
#define STASSID "AlfaroRojas"
#define STAPSK  "Josalfra1234"
#define TRIGGER 2
#define ECHO 3
#endif

const char* ssid     = STASSID;
const char* password = STAPSK;
unsigned long Timeout_Duration = 5000000;

//192.168.1.6 192.168.250.1
IPAddress server(192,168,1,6);      //ip address
//const char* host = "192.168.1.6";
const uint16_t port = 4000;
unsigned long duration;
unsigned long LastPulseTime;

void setup() {
  Serial.begin(115200); //115200
  pinMode(TRIGGER,OUTPUT);
  pinMode(ECHO,INPUT);
  
  
  
  //Serial.println("PinMode Trigger OUT and ECHO IN");
  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
     would try to act as both a client and an access-point and could cause
     network-issues with your other WiFi-devices on your WiFi-network. */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(server);

  digitalWrite(TRIGGER, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGGER, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER, LOW);

 // while ((duration = pulseIn(ECHO, HIGH,Timeout_Duration)) == 0) {
 //   Serial.println("waiting.......");
 // }
//  attachInterrupt(0, EchoPinISR, CHANGE);

  Serial.print("prueba: ");
  Serial.println(duration);
  
}

void loop() {
  
  Serial.print("connecting to ");
  Serial.print(server);
  Serial.print(':');
  Serial.println(port);

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

  delay(300000); // execute once every 5 minutes, don't flood remote service
}


//void EchoPinISR() {
//  static unsigned long startTime;
//
//  if (digitalRead(3)){ // Gone HIGH
//    startTime = micros();
//  }
//  else{  // Gone LOW
//  LastPulseTime = micros() - startTime;
//  }
//}
