#include <WebServer.h>
#include <ESPmDNS.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP32Servo.h>
#include <FastLED.h>

WebServer server(80);

#include "assets.h"

WiFiClient client;

// motor
int motor1IN = 14;
int motor1OUT = 27;

// servo
static const int servoPin = 13;
Servo servo1;

// ultrasonic
const int trigPin = 5;
const int echoPin = 18;
long duration;
float distanceCm;
float distanceInch;
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701


// LED
#define LED_TYPE NEOPIXEL 
uint8_t max_bright = 128;
#define LEDPin 19
#define NUM_LED 40
CRGBArray<NUM_LED> LED;


int state = 0;
int dir = 0;

void setup() {
  Serial.begin(115200); 
  pinMode(trigPin, OUTPUT); 
  pinMode(echoPin, INPUT); 
}

void setup()
{
  Serial.begin(115200);

  // initialize led
  FastLED.addLeds<LED_TYPE, LEDPin>(LED, NUM_LED);
  
  // ultrasonic pinmode
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
 
  //motor pinmode
  pinMode(12, OUTPUT);
  pinMode(motor1IN, OUTPUT);
  pinMode(motor1OUT, OUTPUT);

  digitalWrite(12, HIGH);

 // init wifi
#if 1
  const char *ssid = "my board";
  const char *password = "12345679";
  if (!WiFi.softAP(ssid))
  {
    log_e("Soft AP creation failed.");
    while (1)
      ;
  }
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
#else
  const char *ssid = "Carrot";
  const char *password = "carrot";
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
#endif

  // hide IP
  if (MDNS.begin("boulder")) // IP：boulder.local
  {
    Serial.println("MDNS responder started");
  }

  server.on("/", []
            {
    server.sendHeader("content-encoding", "gzip");
    server.send_P(200, "text/html", index_page, sizeof(index_page)); });

  server.on("/front", []
            { 
             server.send(200, "text/plain", "front"); 
             state = 1; //forward
            });

  server.on("/back", []
          { 
            server.send(200, "text/plain", "back"); 
            state = 2; //backward
          });

  server.on("/turnLeft", []
            { 
             server.send(200, "text/plain", "turn left"); 
             dir = 2; //left
             });
    
  server.on("/turnRight", []
            { 
              server.send(200, "text/plain", "turn right"); 
              dir = 1; //right
              });

  // server.on("/add", []
  //           { 
  //             server.send(200, "text/plain", "add 5s"); 
  //             if (startCount == false){
  //               if(countTotal < 180 * 1000){
  //                 countTotal +=5 * 1000;
  //                }else{
  //                 countTotal = 180 * 1000;
  //                }
  //                remain_time = countTotal;
                
  //             } })

  server.on("/style.css", []
            {
    server.sendHeader("content-encoding", "gzip");
    server.send_P(200, "text/css", style_css, sizeof(style_css)); });

  server.on("/script.js", []
            {
    server.sendHeader("content-encoding", "gzip");
    server.send_P(200, "text/javascript", script_js, sizeof(script_js)); });

  server.on("/mcFavicon.png", []
            {
    server.sendHeader("content-encoding", "gzip");
    server.send_P(200, "img/png", mcFavicon, sizeof(mcFavicon)); });

  server.on("/events", []
            {
     Serial.print("event triggered");
    client = server.client();

    server.setContentLength(CONTENT_LENGTH_UNKNOWN);
    server.sendContent_P(
      "HTTP/1.1 200 OK\n"
      "Content-Type: text/event-stream;\n"
      "Connection: keep-alive\n"
      "\n");

    if (client.connected())
      client.printf("event: test\n"
      "data: test data\n"
      "\n"); });

  server.onNotFound([]
                    { server.send(404, "text/html", "<h1>Not Found</h1>"); });

  server.begin();
}

void loop(){
  // --- Ultrasonic sensor: detect obstacles --- //
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate the distance
  distanceCm = duration * SOUND_SPEED/2;
  
  // Convert to inches
  distanceInch = distanceCm * CM_TO_INCH;
  
  // Prints the distance in the Serial Monitor
  Serial.print("Distance (cm): ");
  Serial.println(distanceCm);
  Serial.print("Distance (inch): ");
  Serial.println(distanceInch);
  
  delay(1000);

  server.handleClient();
  Serial.print("ultra: ");
  unsigned long now = millis();
 
  if (state != 0) {
        fill_solid(LED, 6, CRGB::Blue);
        FastLED.show();
        // fill_solid(disinfectionLED, 6, CRGB::Black);
        // FastLED.show();
        // if (client.connected())
        //   client.printf("event: pause\n"
        //                 "data: Please Stay Away\n"
        //                 "\n");
  }
  if(state != 0){
    if(state == 1){
      if(dir == 1){ // right

      }else if(dir == 2){ //left
        
      }
      digitalWrite(motor1IN, LOW);
      digitalWrite(motor1OUT, HIGH);
    } else {
      if(dir == 1){ // right

      }else if(dir == 2){ //left
        
      }
      digitalWrite(motor1IN, HIGH);
      digitalWrite(motor1OUT, LOW);
    } 
  
//     for(int i = 0; i <255; i++ ){
// analogWrite(motorP2, i);
// delay(1000);
// }
//   digitalWrite(motorP1, LOW);
// } 



      // fill_solid(lighterLED, 16, CRGB::OrangeRed);
      // fill_solid(lighterLED2, 12, CRGB::OrangeRed);
      // FastLED.show();
    

  } else{
    analogWrite(motor1IN, 0);
    analogWrite(motor1OUT, 0);
  }
}
