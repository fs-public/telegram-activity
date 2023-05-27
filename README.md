# Telegram Activity

NodeJS utility to parse and analyze [Telegram messaging platform](https://telegram.org/) group or channel activity for a breakdown of unique active users.

The application has been utilized in professional settings as a proxy for the intrinsic value of a community, as well as a measure of its real growth. A number of active users gives a much clearer picture than the total number of "joined" accounts.

### Installation

The project is not published on _npm_. Please pull the source to a local directory, then run the following command.

```bash
npm install
```

After dependencies are installed, simply run `npm run build` for a one-time build or `npm run watch` for real-time compilation.

Analysis launches with npm script `npm start`. The configuration such as input/output filenames and the maximum number of threads can be tweaked in `./src/config.ts`.

### Technology

The project runs with `npm` and `node` and is written in Typescript. Primary community libraries used are `node-html-parser` for parsing the Telegram exports and `csv-stringify` for CSV output. The exports are computationally intensive, so it is parallelized with node's native `worker-threads`. Code quality assured by `prettier` and `eslint`.

### Usage

To analyze a specific Telegram group or channel, open it with Telegram Desktop and export everything (_note that some channels might automatically block you for doing so, as this action creates a very large number of requests_). Move the `.html` files of the export to `./data` directory.

To analyze over a specific timeframe, simply include only the `.html` files corresponding to the timeframe as they are exported sequentially. In this case, for best behavior, make sure to fix the file sequence (e.g. `messages2` -> `messages02` so that they follow naturally). No additional curation of the files is needed.

Results of the analysis, i.e. the number of unique active users, are outputted in the console in a table breakdown based on the number of messages sent (as found within the export).

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

-   The functionality may break with a change to Telegram's export format.
-   Forwarded messages are not computed correctly (they are double-counted as if the original sender, possibly from a different chat, sent the message as well)

### Changelog

-   **v0.1.0** (mid-2021): initial version
-   **v0.2.0** (26th May 2023): update and refactor, including concurrency, CSV exports, and `tsdx` library removal due to lack of maintenance
