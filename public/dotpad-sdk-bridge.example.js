/*
 * Dot Pad Web SDK bridge — EXAMPLE.
 *
 * The app ships no SDK. To drive a real Dot Pad, host this bridge (with the Dot
 * Inc Web SDK) and load it after the app, e.g. add to app/layout.tsx:
 *
 *   <script src="/dotpad-sdk-bridge.js" defer></script>
 *
 * It maps the Dot Inc Web SDK to the app's device binding via the global
 * `window.registerDotPad(...)` (exposed by components/DeviceInit.tsx).
 *
 * Fill in the three SDK calls + the bitmap mapping marked TODO using the Dot Inc
 * Web SDK docs, then rename to dotpad-sdk-bridge.js.
 */
(function () {
  // The app passes a 60×40 grid: grid.cells[y][x] === 1 means the pin is raised.
  // Convert it to whatever the SDK expects for the graphic area.
  function toDotPadBitmap(grid) {
    // TODO(Dot Inc SDK): return the SDK's expected graphic payload.
    // Example shapes a flat row-major 0/1 array; adjust to the real format.
    var flat = [];
    for (var y = 0; y < grid.rows; y++) {
      for (var x = 0; x < grid.cols; x++) {
        flat.push((grid.cells[y] && grid.cells[y][x]) ? 1 : 0);
      }
    }
    return { cols: grid.cols, rows: grid.rows, pins: flat };
  }

  function register() {
    if (typeof window.registerDotPad !== "function") {
      // App not ready yet — retry shortly.
      return setTimeout(register, 300);
    }
    window.registerDotPad({
      connect: async function () {
        // TODO(Dot Inc SDK): open the device connection (e.g. await DotPad.connect()).
        // return the device's display name:
        return { name: "Dot Pad" };
      },
      disconnect: async function () {
        // TODO(Dot Inc SDK): close the connection.
      },
      showGraphic: function (grid) {
        // TODO(Dot Inc SDK): send the 60×40 graphic, e.g. DotPad.displayGraphic(toDotPadBitmap(grid)).
        void toDotPadBitmap(grid);
      },
      showText: function (text) {
        // TODO(Dot Inc SDK): send the braille line, e.g. DotPad.displayBraille(text).
        void text;
      },
    });
    console.info("[dotpad-bridge] registered with the app");
  }

  register();
})();
