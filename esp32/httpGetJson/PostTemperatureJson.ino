#include <WiFi.h>;
#include <HTTPClient.h>;
#include <ArduinoJson.h>;
#include <Arduino_JSON.h>;
// JSON examples: https://github.com/arduino-libraries/Arduino_JSON/blob/master/examples/JSONObject/JSONObject.ino

const int tempPin = 33;  //analog input pin constant
int tempVal;             // temperature sensor raw readings
float volts;             // variable for storing voltage
float tempC;             // actual temperature variable

void connectToWifi() {
  const char* ssid = "";
  const char* password = "";
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected");
  Serial.print("ip address: ");
  Serial.println(WiFi.localIP());
}

void get() {
  long rnd = random(1, 10);
  HTTPClient client;
  client.begin("http://192.168.68.142:3000/?rnd=" + String(rnd));
  int httpCode = client.GET();

  if (httpCode > 0) {
    String payload = client.getString();
    Serial.println("\nhttpCode: " + String(httpCode));
    Serial.println(payload);

    // parse JSON
    JSONVar parsed = JSON.parse(payload);

    // JSON.typeof(jsonVar) can be used to get the type of the variable
    if (JSON.typeof(parsed) == "undefined") {
      Serial.println("Parsing payload failed!");
      return;
    }

    // JSONVars can be printed using print or println
    Serial.println(parsed);

    if (parsed.hasOwnProperty("serverName")) {
      Serial.print("parsed[\"serverName\"] = ");
      Serial.println((const char*)parsed["serverName"]);
    }

    if (parsed.hasOwnProperty("rnd")) {
      Serial.print("parsed[\"rnd\"] = ");
      // Serial.println((int)parsed["rnd"]); // [QUESTION]: what is int, why did it always print 0 ?
      // Serial.println((double)parsed["rnd"]); // printed nan ?
      Serial.println((const char*)parsed["rnd"]);
    }

  } else {
    Serial.println("Error on HTTP request!");
  }
}

void get2() {
  WiFiClient client;  // or WiFiClientSecure for HTTPS
  HTTPClient http;
  long rnd = random(1, 10);

  // Send request
  http.begin(client, "http://192.168.68.142:3000/?rnd=" + String(rnd));
  http.GET();

  // Print the response
  Serial.print(http.getString());

  // Disconnect
  http.end();
}

void post() {
  // Prepare JSON document
  DynamicJsonDocument doc(2048);
  doc["clientName"] = "esp32";

  // Serialize JSON document
  String json;
  serializeJson(doc, json);

  WiFiClient client;  // or WiFiClientSecure for HTTPS
  HTTPClient http;

  // Send request
  http.begin(client, "http://192.168.68.142:3000/api/temperature");
  http.addHeader("Content-Type", "application/json");
  http.POST(json);

  // Read response
  Serial.println(http.getString());

  // Disconnect
  http.end();
}

float average(int* array, int len) {  // assuming array is int.
  long sum = 0L;                      // sum will be larger than an item, long for safety.
  for (int i = 0; i < len; i++)
    sum += array[i];
  return ((float)sum) / len;  // average will be fractional, so float may be appropriate.
}

int getTemperature(int pin) {
  tempVal = analogRead(pin);
  Serial.println("GPIO" + String(pin) + ": " + String(tempVal));

  int reads = 1000;
  int tempVals[reads];
  for (int i = 0; i < reads; i++) {
    tempVal = analogRead(pin);
    // Serial.println("GPIO" + String(pin) + ": " + String(tempVal));
    tempVals[i] = tempVal;
    // delay(10);
  }

  // Serial.print("GPIO" + String(pin) + ": [ ");
  // for (int i = 0; i < reads; i++) {
  //   Serial.print(String(tempVals[i]) + ", ");
  // }
  // Serial.println(" ]");

  float avgTemp = average(tempVals, reads);
  Serial.println("avgTemp: " + String(avgTemp));

  volts = tempVal / 1023.0;                  // normalize by the maximum temperature raw reading range
  tempC = (volts - 0.5) * 100;               // calculate temperature celsius from voltage as per the equation found on the sensor spec sheet.
  float tempF = (tempC * 9.0 / 5.0) + 32.0;  // convert to Fahrenheit
  // Serial.println("Temperature F: " + String(tempF));

  return (int)tempF;
}

void httpPost(int tempF) {
  // JSON
  // Prepare JSON document
  DynamicJsonDocument doc(2048);
  doc["clientName"] = "esp32";
  doc["tempF"] = tempF;

  // Serialize JSON document
  String json;
  serializeJson(doc, json);

  // HTTP
  WiFiClient client;  // or WiFiClientSecure for HTTPS
  HTTPClient http;

  // Send request
  http.begin(client, "http://192.168.68.142:3000/api/temperature");
  http.addHeader("Content-Type", "application/json");
  http.POST(json);

  // Read response
  Serial.println(http.getString());

  // Disconnect
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectToWifi();
}

void loop() {
  if ((WiFi.status() == WL_CONNECTED)) {
    // get();
    // get2();
    // post();
    int tempF = getTemperature(tempPin);
    Serial.println("TempF : " + String(tempF));

    httpPost(tempF);
  } else {
    Serial.println("onffline");
  }

  delay(1000);
  Serial.println("---");
}
