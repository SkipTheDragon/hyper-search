# Introduction

This project is a dynamic and interactive search experience powered by Manticore. It is primarily focused on providing a
superfast search functionality with dynamic categories. I was intending to use this if I was ever accepted to be an
Envato Author, but I shifted my focus to other projects.

# Demo

You can see the demo [here](https://projects.wyverr.com/hyper-search).

## Local

To run the project locally, you need to have [docker](https://docs.docker.com/get-docker/) and [lando](https://lando.dev/download/) installed. Then after you have cloned the project open your terminal and run the following commands:

```bash
cd hyper-search/
lando start # This will start/fetch the docker containers, install the dependencies (yarn and composer) and migrate and seed manticore data
lando php bin/console run:websocket-server # This will start the websocket server
lando yarn watch # This will build the assets in case they are not built already
```

Then access the website at [http://hyper-search.lndo.site](http://hyper-search.lndo.site).

## Website

Or just click the [link](https://projects.wyverr.com/hyper-search) to the website.

# Features

- Superfast search powered by [Manticore](https://manticoresearch.com/)
- Dynamic categories
- Dark mode
- Awesome animations
- Search History
- Suggestions
- Results
- Filter by Category
- Demo panel
- Autocomplete
- No database except manticore.
- Persistent search history
- State management with [Zustand](https://github.com/pmndrs/zustand)
- Autocomplete from manticore
- Cool animations
- Reduced motion support
- Websockets

# Mentions

- The project is focused on the search experience and animations rather than usability. This means some things might not
  make sense.
- Planet positions are not accurate. They are just random.
- The project is not responsive. It's optimized for desktops.
- Planet shadows are not accurate. They take in account the sun position and the planet position, but they are not
  accurate and do not take into consideration another planet between the sun and the current one.
- I made this project for fun. I'm not an astronomer or a scientist. I just like space and wanted to make something
  cool.
- This repository is mirrored from the bitbucket
  repository [by following this tutorial](https://blog.idrsolutions.com/how-to-sync-bitbucket-repo-to-github/)
