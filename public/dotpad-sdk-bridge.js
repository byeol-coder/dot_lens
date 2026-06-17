/*
 * Dot Pad Web SDK bridge.
 *
 * Loads the Dot Inc Web SDK (DotPadSDK-3.0.0.js, same folder) and registers a
 * device binding with the app via window.registerDotPad(...). The app sends
 * device-ready hex (graphic + braille line); this bridge forwards it to the SDK.
 *
 * Only registers in browsers with Web Bluetooth (Chrome/Edge over HTTPS); on
 * Safari/iOS it stays silent and the app remains an on-screen simulation.
 */
import {
  DotPadSDK,
  DotPadScanner,
  DisplayMode,
  DataCodes,
} from "./DotPadSDK-3.0.0.js";

(function () {
  if (typeof navigator === "undefined" || !navigator.bluetooth) return;

  const sdk = new DotPadSDK();
  const scanner = new DotPadScanner();
  let device = null;

  sdk.setCallBack(
    function (dev, code) {
      if (code === DataCodes.Disconnected) device = null;
    },
    function (dev, key, msg) {
      // Forward physical keys so the app can react later if desired.
      window.dispatchEvent(new CustomEvent("dotpad:key", { detail: { key: key, msg: msg } }));
    }
  );

  const binding = {
    connect: async function () {
      const bt = await scanner.startBleScan(); // opens the OS device chooser
      if (!bt) throw new Error("No device selected");
      device = await sdk.connectBleDevice(bt);
      if (!device) throw new Error("Connection failed");
      return {
        name: (device.connectDevice && device.connectDevice.name) || "Dot Pad",
        graphicCols: device.numberCellColumns || 30,
        graphicRows: device.numberCellRows || 10,
        brailleCells: device.numberBrailleCellColumns || 20,
      };
    },
    disconnect: async function () {
      try {
        sdk.disconnect(device);
      } finally {
        device = null;
      }
    },
    showGraphicHex: function (hex) {
      if (device) sdk.displayGraphicData(hex, device, DisplayMode.GraphicMode);
    },
    showTextHex: function (hex) {
      if (device) sdk.displayTextData(hex, device, DisplayMode.TextMode);
    },
  };

  (function register() {
    if (typeof window.registerDotPad !== "function") return setTimeout(register, 300);
    window.registerDotPad(binding);
    console.info("[dotpad] device bridge registered");
  })();
})();
