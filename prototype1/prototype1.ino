#include <WebServer.h>
#include <ESPmDNS.h>
#include <ESP32Servo.h>
#include <WiFi.h>

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

WebServer server(80);

#include "assets.h"

WiFiClient client;

// motor
int motor1IN = 26;
int motor1OUT = 27;
int enablerPin = 14;

//button
int yesPin = 19;
int noPin = 18;
int ifyes = 0;
int ifno = 0;

// servo
static const int servoPin = 32;
Servo servo1;

int state = 0;
int dir = 0;

void setup()
{
  Serial.begin(115200);
//motor pinmode
  pinMode(enablerPin, OUTPUT);
  pinMode(motor1IN, OUTPUT);
  pinMode(motor1OUT, OUTPUT);
  digitalWrite(enablerPin, HIGH);

//servo pinmode
  servo1.attach(32);
  servo1.write(90);
  
// OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Default is 0x3C
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

//button pinmode
  pinMode(yesPin, INPUT);
  pinMode(noPin, INPUT);

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

  server.on("/stop", []
            { 
             server.send(200, "text/plain", "front"); 
             state = 0; //stop
            });

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
  server.on("/goStraight", []
            { 
             server.send(200, "text/plain", "turn left"); 
             dir = 0; //straight
             });

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

  display.clearDisplay();
  display.setTextSize(1.5);             
  display.setTextColor(WHITE);        
  display.setCursor(5,10);             
  display.println("Hello!");
  display.println(" ");
  display.println("Do you want to meet");
  display.println(" ");
  display.println("a new friend?");
  display.display();
  delay(1000); 
}

void loop() {
  server.handleClient();  
  if(digitalRead(yesPin) != 0){
    ifyes = 1;
  }else if(digitalRead(noPin) != 0){
    ifyes = -1;
  }
  if(ifyes == 1){
    display.clearDisplay();            
    display.setTextColor(WHITE);        
    display.setCursor(5,10);             
    display.println("Please wait ");
    display.println(" ");
    display.println("for a moment");
    display.display();
    delay(1000); 
  }else if(ifyes == -1){
    display.clearDisplay();  
    display.setTextColor(WHITE);        
    display.setCursor(5,20);             
    display.println("Okay! Bye!");
    display.display();
    delay(1000); 
  }else{
    display.clearDisplay();            
    display.setTextColor(WHITE);        
    display.setCursor(5,10);             
    display.println("Hello!");
    display.println(" ");
    display.println("Do you want to meet");
    display.println(" ");
  display.println("a new friend?");
    display.display();
    delay(1000); 
  }
  // Handle motor control
  if (state == 1) { // Forward
    digitalWrite(motor1IN, LOW);
    digitalWrite(motor1OUT, HIGH);
    Serial.print(state);
    Serial.print(", ");
    Serial.println(dir);
  } else if (state == 2) { // Backward
    digitalWrite(motor1IN, HIGH);
    digitalWrite(motor1OUT, LOW);
    Serial.print(state);
    Serial.print(", ");
    Serial.println(dir);
  } else { // Stop motor
    digitalWrite(motor1IN, LOW);
    digitalWrite(motor1OUT, LOW);
    Serial.print(state);
    Serial.print(", ");
    Serial.println(dir);
  }

  // Handle servo control independently
  if (dir == 1) { // Right
    servo1.write(180);
  } else if (dir == 2) { // Left
    servo1.write(0);
  } else { // Straight (no direction command)
    servo1.write(90);
    Serial.println("now should be straight");
  }
}
