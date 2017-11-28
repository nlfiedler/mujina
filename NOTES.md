# Notes

## JavaScript snippets

Function currying in JavaScript looks like this:

```
myfunc = (param1) => (param2) => (param2) => {
  // body of function
}
```

## Architecture

* UI framework
    - React
    - https://facebook.github.io/react/
    - MIT
    - virtual DOM
* State management
    - http://redux.js.org
    - inspired in part by Elm
    - consider using [deep-freeze](https://www.npmjs.com/package/deep-freeze)
      to strictly enforce immutability of the state objects
    - probably easier to just use [immutable.js](https://github.com/facebook/immutable-js)
      along with Object.freeze()
* Using React and Redux together
    - [react-redux](https://github.com/reactjs/react-redux)
* Look into [react-router](https://reacttraining.com/react-router/)
    - dynamic routing for React components
* There are lots of helpful react and redux npms
    - redux-promise
    - redux-logger
    - redux-thunk
* See how Dan Abramov uses thunks and redux to handle "loading" status
    - https://egghead.io/courses/building-react-applications-with-idiomatic-redux #21 to #24
* Background throttling
    - Chromium throttles JS when window is not focused
    - in BrowserWindow constructor, pass `webPreferences: { backgroundThrottling: false }`

## Internal Design

### Routing

* Do we want routing, or is Electron SPA sufficient?
* Do we want static (a la express) or dynamic routing (a la react-router)?
* There are no nav buttons in Electron
    - all pages have to have buttons/links to get back to other pages
* Possible routes:
    - `/`
        + landing page with latest assets already shown
        + links to filter assets
        + small area to drop files
    - `/upload`
        + large drop area / file selector for importing assets
    - `/asset/:id`
        + shows asset details / edit page

### Reliability

* Write an append-only log that captures important details (JSON format?)
    - original file name
    - date/time of import
    - SHA256
    - tags, location
* Have CouchDB routinely make a backup of the database
    - Daily, keep several copies

## Implementation Details

* With app/daemon combination, large files can be "uploaded" directly to final location on disk
    - App settings will include path to assets on local disk
* With daemon on separate machine...
    - Large files can be imported via special directory feature
    - Or mount remote disk and add to app settings as the asset path
    - If local path is unset, warn user that large files cannot be "uploaded"
* Meta data: support XMP, IPTC, and EXIF
    - Need to be able to read and write

## Technology

* Use async/await rather than callbacks
    - async/await are sugar for promises, just looks nicer
* Use HTML imports to bring in snippets
* Build tool: http://brunch.io/docs/why-brunch
    - brunch and webpack are both declarative
    - other tools are task runners (e.g. grunt, gulp)
    - brunch still seems like the better tool
* Testing: https://github.com/facebook/jest
    - uses `expect` library
    - handles React apps
* https://github.com/electron/spectron
    - Test Electron apps using ChromeDriver
* https://github.com/hardchor/electron-redux
    - Use redux in the main and browser processes
* https://github.com/electron/devtron
    - Official DevTools extension
* https://www.npmjs.com/package/fluent-ffmpeg
    - wraps ffmpeg with JavaScript
* https://github.com/rhysd/electron-about-window
    - a fancier about window

## Behavior

* Downloads and installs the backend (or include somehow)
    - include ERTS and dependencies
    - version-compatible with desktop app
    - probably platform-specific
* Ensures the backend is running (no need to shutdown)
* Have a first-start wizard to walk the user through the setup
* Maybe interface with CouchDB directly for complex queries
* Somehow get ImageMagick static binaries installed
* Somehow get ffmpeg installed
    - https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg
    - https://github.com/eugeneware/ffmpeg-static

> Use the npm package ffmpeg-static that provides static binaries for
> Windows, Mac and Linux Avoid packaging the package into the asar file Use
> require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked') to
> find the ffmpeg binary for the platform you are running in any scenario
> (whether or not the app is bundled or you are in development).

## Design ideas

* When viewing an asset, keep the other assets in a marquee across the top/bottom (a la Lyn)
* Free, easily customizable icons: http://fontawesome.io
* Mini styling "framework": http://bulma.io
    - not sure how this works with React, maybe React is sufficient
* Drag and drop assets onto the window to import
    - with React: https://react-dnd.github.io/react-dnd/
    - Stephen Grider's "convert" app has drag-n-drop with React
    - w/o React: https://github.com/electron-utils/electron-drag-drop
    - it is pretty easy, just use standard HTML/JS event listeners
* All of the "admin" tasks become menu items
* Can scan a directory of assets without having to upload or create documents
    - allow user to edit details before submitting everything
* Use CSS custom properties rather than less, sass
    - although bulma/fontawesome may have its own system
* Use bulma CSS for keeping side/top/bottom panels visible

## Storage

* Electron has a "session" for storing key/value pairs
* Electron has cookies, too
* On the renderer side, the standard JSON: WebApi has a local storage thing

## Packaging

* Research how `NODE_ENV` typically gets set (it is not automatic)
* To make icons: iconvert icons
* Ray Viljoen recommends electron-packager (installed globally)
    - apparently electron-forge uses electron-packager
* Paul Betts recommends electron-forge
    - invokes electron-packager internally
* Combine the CouchDB ERTS and the one for tanuki
* Building each app on the target platforms seems sensible
* Use a code obfuscator as the JS code is part of the app bundle
* Use asar as the output format for additional obfuscation
* Look for "authenticode certificate", pay no more than $100/year for a cert
* Need to register with Apple for $100/year to use app store
    - Need a Developer ID certificate for signing apps
        + Need to save this file securely and permanently
    - Application/Installer certicate is for the app store only
* Can host package files on S3 or similar
* Squirrel updater can do deltas efficiently

## Features

* Albums
* Categories
* Browsing by timeline
* Rating
* Keyboard shortcuts
* Task automation (i.e. batch processing)
    - editing (EXIF, IPTC, XMP) metadata
    - resize, rotate, format conversion
    - watermarks
* Hierarchical locations (e.g. USA -> California -> Los Angeles)
* Hierarchical categories (e.g. People -> Friends -> School)
* Store metadata in image (XMP, IPTC, EXIF)
* Display photos by location on a map
* Spell checking
* Some basic photo touchups seem like a good idea
    - Red-eye reduction
    - Sharpen, sepia, etc
    - Strip GPS data
* Multi-user
* Network support
* Browse photos by groups taken around the same date
* A button/link to "quick edit" an asset on the thumbnails page
    - pops up a modal for editing the asset details
* When browsing, might be nice to show number of assets
    - e.g. number in a year, month, tags, etc
* When attributes are selected (e.g. tags or years), dim those that do not apply
    - i.e. if "2014" is selected, and only certain locations pertain to that year,
      then dim the other locations so it is obvious what is available
* Read location data from images
* Groups and subgroups of assets
    - Turkey > Gallipoli Peninsula > Gali Winery
    - Winery > vinification > fermentation tanks
    - Architecture > Buildings > underground cellar
* Custom metadata fields
    - Keep a list of field definitions in CouchDB
    - e.g.
      {
        "formLabel": "Location" (on HTML forms)
        "fieldName": "location" (in database record)
        "type": string|number|set
      }
* Version control of asset changes
* Import/Export
    - Import from similar products
    - Export to some XML/JSON file format for easy dump/load or archival
* Export selected assets to a directory (or zip file)
    - Embed the metadata into the images at that time
* Upload multiple assets in a single operation
    - Maybe select a directory of assets
* Face recognition (see OpenCV below)
    - To support rapid import of existing images
* Share assets online (e.g. Flickr, Smugmug, email)
* Script support (a la HyperScript)
    - can probably use JavaScript for this
    - can leverage ImageMagick to perform alterations on images
* Preview PDF documents
* Grouping assets
    - e.g. assets owned by particular user
* Authentication and authorization
    - Username/password
    - Access control to certain assets, groups
    - Password protect the admin page, like CouchDB
* Automatic backups to Google Cloud or Amazon Glacier
    - Yeah, we have the software, so why not?
    - Configuration for credentials, when to run, how often, how many old copies to retain
    - Probably should make recovery of individual assets easier
        + OTOH, the purpose is largely about disaster recovery
        + After all, tanuki does not make deleting assets remotely easy
* Printing an image or PDF
* Converting videos to animated GIFs
* Extracting a frame from a video
* Creating a calendar
* OCR of images, PDFs
* Slideshow of matching assets
* Download queried assets as a zip file
* Make phone wallpaper
    - Select an asset, then define the region to use -> produces an image to save to the phone

## OpenCV

### Training

* How is OpenCV trained for facial recognition?
    - What are the inputs and outputs

### Binding

* Ascertain feasibility of running `rust-bindgen` on OpenCV
* Write a small binding in Rust for the functions we need
    - see https://crates.io/crates/opencv
    - a year old, probably needs updating
* Write a small binding in Erlang for the Rust library
