

/*
 * Posted on https://randomnerdtutorials.com
 * created by http://playground.arduino.cc/Code/NewPing
*/

#include <NewPing.h>

#define TRIGGER_PIN2 11
#define ECHO_PIN2 12
 
#define TRIGGER_PIN1 3
#define ECHO_PIN1 4

#define MAX_DISTANCE 200

// NewPing setup of pins and maximum distance
NewPing sonar1(TRIGGER_PIN1, ECHO_PIN1, MAX_DISTANCE); 
NewPing sonar2(TRIGGER_PIN2, ECHO_PIN2, MAX_DISTANCE); 
 
void setup() {
   Serial.begin(9600);
   pinMode(13,OUTPUT);
   pinMode(8,OUTPUT);
}
 
void loop() {
   delay(200);
   unsigned int distance1 = sonar1.ping_cm();
   unsigned int distance2 = sonar2.ping_cm();
   bool var1 = false;
   bool var2 = false;

   
   if(distance1<40 && distance1!=0){
    var1 = true;
    }
   if(distance2<40 && distance2!=0){
    var2 = true; 
    }
   prenderLeds(var1,var2); 

}

void prenderLeds(bool variable1, bool variable2){

    if(variable1==true && variable2 == true){
        digitalWrite(8,HIGH);
        digitalWrite(13,HIGH);
        Serial.println("los dos");
      }
  
    else if(variable1==true && variable2 == false){
        digitalWrite(8,HIGH);
        digitalWrite(13,LOW); 
        Serial.println("primero");
      }
    else if(variable1==false && variable2 == true){
        digitalWrite(8,LOW);
        digitalWrite(13,HIGH); 
        Serial.println("segundo");
      }
    else{
        digitalWrite(8,LOW);
        digitalWrite(13,LOW); 
        Serial.println("nunguno");
      }
  }
