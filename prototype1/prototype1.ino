#include <WebServer.h>
#include <ESPmDNS.h>
#include <WiFi.h>

#include <SPI.h>
#include <Wire.h>

WebServer server(80);

#include "assets.h"

WiFiClient client;

// motor
int motor1IN = 26;
int motor1OUT = 27;
int motor2IN = 25;
int motor2OUT = 33;


int state = 0;
int dir = 0;

void setup()
{
  // Serial.begin(115200);
//motor pinmode
  // pinMode(enablerPin, OUTPUT);
  pinMode(motor1IN, OUTPUT);
  pinMode(motor1OUT, OUTPUT);
  pinMode(motor2IN, OUTPUT);
  pinMode(motor2OUT, OUTPUT);
  
  // digitalWrite(enablerPin, HIGH);

//servo pinmode
  servo1.attach(32);
  servo1.write(90);

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
  // Serial.print("AP IP address: ");
  // Serial.println(myIP);
#else
  const char *ssid = "Carrot";
  const char *password = "carrot";
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  // Serial.println("");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    // Serial.print(".");
  }
  // Serial.println("");
  // Serial.print("Connected to ");
  // Serial.println(ssid);
  // Serial.print("IP address: ");
  // Serial.println(WiFi.localIP());
#endif

  // hide IP
  if (MDNS.begin("boulder")) // IP：boulder.local
  {
    // Serial.println("MDNS responder started");
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
              // Serial.println("serving css");
    server.sendHeader("content-encoding", "gzip");
    server.send_P(200, "text/css", style_css, sizeof(style_css)); });

  server.on("/script.js", []
            {
              // Serial.println("serving js");
    server.sendHeader("content-encoding", "gzip");
    server.send_P(200, "text/javascript", script_js, sizeof(script_js)); });

  server.on("/mcFavicon.png", []
            {
    server.sendHeader("content-encoding", "gzip");
    server.send_P(200, "img/png", mcFavicon, sizeof(mcFavicon)); });

  server.on("/events", []
            {
    client = server.client();

    server.setContentLength(CONTENT_LENGTH_UNKNOWN);
    server.sendContent_P(
      "HTTP/1.1 200 OK\n"
      "Content-Type: text/event-stream;\n"
      "Connection: keep-alive\n"
      "\n");

      });

  server.onNotFound([]
                    { server.send(404, "text/html", "<h1>Not Found</h1>"); });

  server.begin();
  delay(3000);

  delay(1000); 
}

void loop() {
  server.handleClient();  
  digitalWrite(motor1IN, LOW);
  digitalWrite(motor1OUT, HIGH);
  digitalWrite(motor2IN, HIGH);
  digitalWrite(motor2OUT, LOW);

  // Handle motor control
  if (state == 1) { // Forward
    digitalWrite(motor1IN, LOW);
  digitalWrite(motor1OUT, HIGH);
  digitalWrite(motor2IN, HIGH);
  digitalWrite(motor2OUT, LOW);
  } else if (state == 2) { // Backward
    digitalWrite(motor1IN, LOW);
  digitalWrite(motor1OUT, HIGH);
  digitalWrite(motor2IN, HIGH);
  digitalWrite(motor2OUT, LOW);
  } else if(state == 3){
    digitalWrite
  }else { // Stop motor
    digitalWrite(motor1IN, LOW);
  digitalWrite(motor1OUT, LOW);
  digitalWrite(motor2IN, LOW);
  digitalWrite(motor2OUT, LOW);
  }

}
