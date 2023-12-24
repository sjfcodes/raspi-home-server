// #include <ESP.h>;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:
  // esp_chip_info_t chip_info;
  // esp_chip_info(&chip_info);

  // Serial.println("Hardware info");
  // Serial.printf("%d cores Wifi %s%s\n", chip_info.cores, (chip_info.features & CHIP_FEATURE_BT) ? "/BT" : "",
  //               (chip_info.features & CHIP_FEATURE_BLE) ? "/BLE" : "");
  // Serial.printf("Silicon revision: %d\n", chip_info.revision);
  // Serial.printf("%dMB %s flash\n", spi_flash_get_chip_size() / (1024 * 1024),
  //               (chip_info.features & CHIP_FEATURE_EMB_FLASH) ? "embeded" : "external");

  //get chip id
  String chipId = String((uint32_t)ESP.getEfuseMac(), HEX);
  // chipId.toUpperCase();

  Serial.printf("Chip id: %s\n", chipId.c_str());
  delay(1000);
}
