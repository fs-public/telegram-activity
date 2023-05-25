# Telegram Activity

NodeJS utility to parse and analyze Telegram group or channel activity for a breakdown of unique active users.

### Installation

The project is not published on npmjs. Please pull the source to a local directory, then run the following command.

```bash
npm install
```

After dependencies are installed, simply run `npm run build` for a one-time build or `npm run watch` for real-time compilation.

Analysis launches with simple `node .` or an npm script `npm start`.

### Technology

Project runs with `npm` and `node` and has been initialized as a Typescript project with `tsdx`. Primary required library to parse Telegram exports is `node-html-parser`. Code quality assured by `prettier`, and `eslint`.

### Usage

To analyze a specific Telegram group or channel, open it with Telegram Desktop and export everything (_note that some channels might automatically block you for doing so, as this action creates a very large number of requests_). Move the `.html` files of the export to `./data` directory.

To analyze over specific timeframe, simply include only the `.html` files corresponding to the timeframe as they are exported sequentially. In this case, for best behavior, make sure to fix the file sequence (e.g. `messages2` -> `messages02` so that they follow naturally). No additional curation of the files is needed.

Results of the analysis, i.e. number of unique active users, are outputted in the console in a table breakdown based on the number of messages sent (as found within the export).

An example output follows. This can be read as "there are 32 unique users that sent between 6-9 messages". Custom brackets for this output can be configured in `./src/config.ts`.

```
|-------------------------|
│ (messages)  │  Values   │
|-------------------------|
│      1      │   221     │
│     2-5     │   169     │
│     6-9     │    24     │
│    10-19    │    25     │
│    20-49    │    14     │
│    50-99    │    19     │
│    100+     │     3     │
|-------------------------|
```

### Limitations

-   The functionality may break with a change to Telegram export format.
-   Forwarded messages are not computed correctly (they are double-counted as if the original sender, possibly from a different chat, sent the message as well)
