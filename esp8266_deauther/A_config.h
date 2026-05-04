/* This software is licensed under the MIT License: https://github.com/spacehuhntech/esp8266_deauther */

#pragma once

// =========================================
// DEAUTHER NANO — Single hardware profile
// Wemos D1 Mini + SSD1306 I2C OLED + WS2812B + 3 buttons
// Schematic: hardware/Schematic_deauther_nano.pdf
// =========================================

#define ENABLE_DEBUG
#define DEBUG_PORT Serial
#define DEBUG_BAUD 115200

// Uncomment to force format SPIFFS/EEPROM at startup
// #define FORMAT_SPIFFS
// #define FORMAT_EEPROM

// Uncomment to reset all settings at startup
// #define RESET_SETTINGS

// ===== SSD1306 I2C OLED (0.96", 128x64) ===== //
#define SSD1306_I2C
#define I2C_ADDR   0x3C
#define I2C_SDA    5    // D1 = GPIO5
#define I2C_SCL    4    // D2 = GPIO4

// ===== WS2812B RGB LED ===== //
#define LED_NEOPIXEL_GRB
#define LED_NUM             1
#define LED_NEOPIXEL_PIN    15  // D8 = GPIO15
#define LED_MODE_BRIGHTNESS 50

// ===== Buttons (active-low, internal pullup) ===== //
#define BUTTON_UP   14  // LEFT   button — D5 = GPIO14
#define BUTTON_DOWN 12  // RIGHT  button — D6 = GPIO12
#define BUTTON_A    13  // CENTER button — D7 = GPIO13

// ========= FALLBACK DEFAULTS ========= //
// These apply when not overridden above.

// ===== AUTOSAVE ===== //
#ifndef AUTOSAVE_ENABLED
  #define AUTOSAVE_ENABLED true
#endif

#ifndef AUTOSAVE_TIME
  #define AUTOSAVE_TIME 60
#endif

// ===== ATTACK ===== //
#ifndef ATTACK_ALL_CH
  #define ATTACK_ALL_CH false
#endif

#ifndef RANDOM_TX
  #define RANDOM_TX false
#endif

#ifndef ATTACK_TIMEOUT
  #define ATTACK_TIMEOUT 600
#endif

#ifndef DEAUTHS_PER_TARGET
  #define DEAUTHS_PER_TARGET 25
#endif

#ifndef DEAUTH_REASON
  #define DEAUTH_REASON 1
#endif

#ifndef BEACON_INTERVAL_100MS
  #define BEACON_INTERVAL_100MS true
#endif

#ifndef PROBE_FRAMES_PER_SSID
  #define PROBE_FRAMES_PER_SSID 1
#endif

// ===== SNIFFER ===== //
#ifndef CH_TIME
  #define CH_TIME 200
#endif

#ifndef MIN_DEAUTH_FRAMES
  #define MIN_DEAUTH_FRAMES 3
#endif

// ===== ACCESS POINT ===== //
#ifndef AP_SSID
  #define AP_SSID "pwned"
#endif

#ifndef AP_PASSWD
  #define AP_PASSWD "deauther"
#endif

#ifndef AP_HIDDEN
  #define AP_HIDDEN false
#endif

#ifndef AP_IP_ADDR
  #define AP_IP_ADDR { 192, 168, 4, 1 }
#endif

// ===== WEB INTERFACE ===== //
#ifndef WEB_ENABLED
  #define WEB_ENABLED true
#endif

#ifndef WEB_CAPTIVE_PORTAL
  #define WEB_CAPTIVE_PORTAL false
#endif

#ifndef WEB_USE_SPIFFS
  #define WEB_USE_SPIFFS false
#endif

#ifndef DEFAULT_LANG
  #define DEFAULT_LANG "en"
#endif

// ===== CLI ===== //
#ifndef CLI_ENABLED
  #define CLI_ENABLED true
#endif

#ifndef CLI_ECHO
  #define CLI_ECHO true
#endif

// =============== LED =============== //
#if defined(LED_NEOPIXEL_RGB) || defined(LED_NEOPIXEL_GRB)
  #define LED_NEOPIXEL
#endif

#if !defined(LED_DIGITAL) && !defined(LED_RGB) && !defined(LED_NEOPIXEL) && !defined(LED_MY92) && !defined(LED_DOTSTAR)
  #define LED_DIGITAL
  #define USE_LED false
#else
  #define USE_LED true
#endif

#ifndef LED_PIN_R
  #define LED_PIN_R 255
#endif

#ifndef LED_PIN_G
  #define LED_PIN_G 255
#endif

#ifndef LED_PIN_B
  #define LED_PIN_B 255
#endif

#ifndef LED_ANODE
  #define LED_ANODE false
#endif

#ifndef LED_MODE_OFF
  #define LED_MODE_OFF 0, 0, 0
#endif

#ifndef LED_MODE_SCAN
  #define LED_MODE_SCAN 0, 0, 255
#endif

#ifndef LED_MODE_ATTACK
  #define LED_MODE_ATTACK 255, 0, 0
#endif

#ifndef LED_MODE_IDLE
  #define LED_MODE_IDLE 0, 255, 0
#endif

#ifndef LED_MODE_BRIGHTNESS
  #define LED_MODE_BRIGHTNESS 10
#endif

// =============== DISPLAY =============== //

#ifndef DISPLAY_TIMEOUT
  #define DISPLAY_TIMEOUT 600
#endif

#ifndef DISPLAY_TEXT
  #define DISPLAY_TEXT ""
#endif

#ifndef FLIP_DIPLAY
  #define FLIP_DIPLAY false
#endif

#if !defined(SSD1306_I2C) && !defined(SSD1306_SPI) && !defined(SH1106_I2C) && !defined(SH1106_SPI)
  #define SSD1306_I2C
  #define USE_DISPLAY false
#else
  #define USE_DISPLAY true
#endif

#ifndef I2C_ADDR
  #define I2C_ADDR 0x3C
#endif

#ifndef I2C_SDA
  #define I2C_SDA 5
#endif

#ifndef I2C_SCL
  #define I2C_SCL 4
#endif

#ifndef SPI_RES
  #define SPI_RES 5
#endif

#ifndef SPI_DC
  #define SPI_DC 4
#endif

#ifndef SPI_CS
  #define SPI_CS 15
#endif

// =============== BUTTONS =============== //
#ifndef BUTTON_UP
  #define BUTTON_UP 255
#endif

#ifndef BUTTON_DOWN
  #define BUTTON_DOWN 255
#endif

#ifndef BUTTON_A
  #define BUTTON_A 255
#endif

#ifndef BUTTON_B
  #define BUTTON_B 255
#endif

// ===== Reset ====== //
#ifndef RESET_BUTTON
  #if BUTTON_UP != 0 && BUTTON_DOWN != 0 && BUTTON_A != 0 && BUTTON_B != 0
    #define RESET_BUTTON 0
  #else
    #define RESET_BUTTON 255
  #endif
#endif

// ===== Web ===== //
#ifndef WEB_IP_ADDR
  #define WEB_IP_ADDR (192, 168, 4, 1)
#endif

#ifndef WEB_URL
  #define WEB_URL "deauth.me"
#endif

// ======== CONSTANTS ========== //
#define DEAUTHER_VERSION "2.6.1"
#define DEAUTHER_VERSION_MAJOR 2
#define DEAUTHER_VERSION_MINOR 6
#define DEAUTHER_VERSION_REVISION 1

#define EEPROM_SIZE 4095
#define BOOT_COUNTER_ADDR 1
#define SETTINGS_ADDR 100

// ========== ERROR CHECKS ========== //
#if LED_MODE_BRIGHTNESS == 0
#error LED_MODE_BRIGHTNESS must not be zero!
#endif
