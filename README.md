<img src="./docs/icon_squooshed.png" alt="logo" width="100" height="100" align="right" />

# Browserosaurus

Browserosaurus is an open-source (GPLv3 license) browser prompter for macOS. It
works by setting itself as the default browser, and any clicked links in
non-browser apps are now sent to Browserosaurus where you are presented with a
menu of all your installed browsers. You may now decide which app you’d like to
continue opening the link with.

<img src="./docs/screenshot.jpg" alt="screenshot" />

## Installation

Download Browserosaurus from the
[GitHub releases page](https://github.com/will-stone/browserosaurus/releases/latest).
Select **x64** for Intel machines, or **arm64** for Apple Silicon (M1) machines.

Or use [Homebrew](https://formulae.brew.sh/cask/browserosaurus#default). Thank
you very much to [@i0ntempest](https://github.com/i0ntempest) and
[@tk4k](https://github.com/tk4k) for keeping this cask updated 🙏

```sh
brew install --cask browserosaurus
```

> 🚨 **Please note that Browserosaurus only officially supports the version of
> macOS that I currently use, which you can assume to be the latest stable
> version.**

## Help

Found a bug? Please log an
[issue](https://github.com/will-stone/browserosaurus/issues). For anything else,
please see the documentation below or open a
[discussion](https://github.com/will-stone/browserosaurus/discussions).

## Projects inspired by Browserosaurus

Browserosaurus is primarily made for my needs and environment. Therefore, some
feature requests do not make it into the main project, but that's the beauty of
Open Source, you are free to copy the code and make your own tweaks (as long as
it remains open-sourced, of course, please see the license 😉). Here are some
forks of this project that you may like to consider:

- [Browseratops](https://github.com/riotrah/browseratops) by
  [@riotrah](https://github.com/riotrah). Browserosaurus but for **Windows**!
- [Browserino](https://github.com/AlexStrNik/Browserino) by
  [@alexstrnik](https://github.com/AlexStrNik). **Swift UI** port of
  Browserosaurus.

> Please PR your own fork to this list.

## Documentation

- [Changelog](https://github.com/will-stone/browserosaurus/releases)
- [Help](https://github.com/will-stone/browserosaurus/discussions/categories/q-a)
- [Supporting a new browser or app](guide/supporting-a-browser-or-app.md)
- [Setting up for development](guide/setting-up-for-development.md)
- [Privacy policy](guide/privacy.md)

### Local Release Build

To build the application for local release and place it in your `/Applications`
folder, follow these steps:

1.  **Install dependencies** (if you haven't already):

    ```sh
    npm install
    ```

2.  **Build the application**:

    ```sh
    npm run package
    ```

    This command will create optimized builds for both `x64` (Intel) and `arm64`
    (Apple Silicon) architectures in the `out/` directory.

3.  **Remove any existing custom build** (optional, but recommended to ensure
    you're using the latest version):

    ```sh
    rm -rf "/Applications/Browserosaurus-Custom.app"
    ```

    > **Note:** Replace `Browserosaurus-Custom.app` with the actual name of your
    > custom application if it's different.

4.  **Copy the new build to your Applications folder**:

    For Apple Silicon (M1/M2/M3) Macs:

    ```sh
    cp -R out/browserosaurus-darwin-arm64/Browserosaurus.app "/Applications/Browserosaurus-Custom.app"
    ```

    For Intel Macs:

    ```sh
    cp -R out/browserosaurus-darwin-x64/Browserosaurus.app "/Applications/Browserosaurus-Custom.app"
    ```

    > **Note:** You can rename `Browserosaurus-Custom.app` to any desired name
    > for your application.

For the maintainer:

- [Creating app icon](guide/creating-app-icon.md)
- [Publishing](guide/publishing.md)
