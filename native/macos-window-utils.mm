#import <napi.h>
#import <Cocoa/Cocoa.h>

// Function to set the window level and collection behavior
void SetWindowProperties(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsBuffer()) {
        Napi::TypeError::New(env, "Buffer expected").ThrowAsJavaScriptException();
        return;
    }

    Napi::Buffer<void*> handleBuffer = info[0].As<Napi::Buffer<void*>>();
    NSView* view = *reinterpret_cast<NSView**>(handleBuffer.Data());
    if (!view) return;

    NSWindow* window = [view window];
    if (window) {
        // Set the window to appear on all workspaces and work with fullscreen apps
        [window setCollectionBehavior:NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorFullScreenAuxiliary];
        // Use floating level instead of screen-saver to allow normal interaction
        [window setLevel:kCGFloatingWindowLevel];
        // Ensure window can become key and receive events
        [window setCanHide:NO];
        [window setHasShadow:YES];
    }
}

// Module initialization
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "setWindowProperties"),
                Napi::Function::New(env, SetWindowProperties));
    return exports;
}

NODE_API_MODULE(macos_window_utils, Init)
