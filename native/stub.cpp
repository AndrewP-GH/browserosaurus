#include <napi.h>

// Stub implementation for non-macOS platforms
// This prevents build errors on Linux and Windows
void SetWindowProperties(const Napi::CallbackInfo& info) {
    // No-op on non-macOS platforms
    return;
}

// Module initialization
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "setWindowProperties"),
                Napi::Function::New(env, SetWindowProperties));
    return exports;
}

NODE_API_MODULE(macos_window_utils, Init)