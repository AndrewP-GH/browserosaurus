{
  "targets": [
    {
      "target_name": "macos_window_utils",
      "conditions": [
        ["OS=='mac'", {
          "sources": [ "native/macos-window-utils.mm" ],
          "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
          ],
          "dependencies": [
            "<!(node -p \"require('node-addon-api').gyp\")"
          ],
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "MACOSX_DEPLOYMENT_TARGET": "10.13"
          },
          "cflags!": ["-fno-exceptions"],
          "cflags_cc!": ["-fno-exceptions"],
          "link_settings": {
            "libraries": [
              "-framework Cocoa",
              "-framework AppKit"
            ]
          }
        }],
      ]
    }
  ]
}
