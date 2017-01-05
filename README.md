# bartificer.worldclock.js
A JavaScript API for adding live digital clocks in any timezone to a web page.

Full documentation can be found at [https://bbusschots.github.io/bartificer_worldclock_js/](https://bbusschots.github.io/bartificer_worldclock_js/).

## Requirements
The API depends on jQuery (http://jquery.org), MomentJS (http://momentjs.com),
MomentJS Timezone (http://momentjs.com/timezone/), and the timezone data for
MomentJS Timezone.

These items can all be included from CDNs as follows:

```
<!-- Include 3rd party libraries required by bartificer.worldclock.js -->
<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min.js" integrity="sha256-vvT7Ok9u6GbfnBPXnbM6FVDEO8E1kTdgHOFZOAXrktA=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.js" integrity="sha256-7JLe29sXteSPEQGXqKWbFs+ABl9M50OJEEB7ntZth2k=" crossorigin="anonymous"></script>
```

## Usage

You can use a local copy of the API by uploading a copy of `lib/bartificer.worldclock.js` from this repository to your web server and including it into your pages with a `<script>` tag.

-or-

You can access the latest version of the API directly via the RawGit CDN as follows:

```
<script type="text/javascript" src="https://cdn.rawgit.com/bbusschots/bartificer_worldclock_js/master/lib/bartificer.worldclock.js"></script>
```

### Example
The following complete HTML page shows the API in use. The code assumes the file
`bartificer.worldclock.js` is located in the same folder as the HTML file.

```
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>bartificer.Worldclock Example</title>

  <!-- Include needed 3rd party libraries -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min.js" integrity="sha256-vvT7Ok9u6GbfnBPXnbM6FVDEO8E1kTdgHOFZOAXrktA=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.js" integrity="sha256-7JLe29sXteSPEQGXqKWbFs+ABl9M50OJEEB7ntZth2k=" crossorigin="anonymous"></script>

  <!-- Include the bartificer.WorldClock API from the RawGit CDN -->
  <script src="https://cdn.rawgit.com/bbusschots/bartificer_worldclock_js/master/lib/bartificer.worldclock.js"></script>
</head>
<body>
<h1><code>bartificer.Worldclock</code> Example</h1>

<h2>Your Local Time</h2>
<p class="bartificer-worldclock-auto"></p>

<h2>The Time in Dublin (Ireland)</h2>
<p class="bartificer-worldclock-auto" data-timezone="Europe/Dublin"></p>

<h2>The Time in LA (With Seconds)</h2>
<p class="bartificer-worldclock-auto" data-timezone="America/Los_Angeles" data-show-seconds="true"></p>
</body>
</html>
```

## Development

To edit the API yourself, download the repo, then change to the folder, and run the following command to install all the dev requirements:

```
npm install
```

To generate the public documentation:

```
npm run generate-docs
```

To generate the developer documentation (including private members and functions);

```
npm run generate-docs-dev
```
