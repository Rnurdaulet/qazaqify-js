# qazaqify

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Kazakh formatting and localization for JavaScript and TypeScript.

Dates, numbers, currency, relative time, units, and UI formatting.

This is a **0.x** release. The API is not a stable contract yet.

## Installation

```bash
npm install qazaqify
```

## Usage

```ts
import * as qazaqify from "qazaqify";

qazaqify.formatDate(date, { style: "long" });
// "2026 ж. 4 қыркүйек"

qazaqify.formatTime(date, { style: "short" });
// "14:30"

qazaqify.formatDateTime(date);
// "4 қыркүйек 2026, 14:30"

qazaqify.relativeTime(date);
// "5 минут бұрын"

qazaqify.formatInterval(from, to);
// "2026 ж. 4–10 қыркүйек"

qazaqify.number(1234567.89);
// "1 234 567,89"

qazaqify.currency(12500, "KZT");
// "12 500 ₸"

qazaqify.currencyWords(12500);
// "он екі мың бес жүз теңге"

qazaqify.percent(0.75);
// "75%"

qazaqify.unit(1500, "meter");
// "1,5 км"

qazaqify.bytes(1536000);
// "1,5 МБ"

qazaqify.duration(3665);
// "1 сағат 1 минут 5 секунд"

qazaqify.humanDuration(3665);
// "шамамен 1 сағат"

qazaqify.ordinal(21);
// "21-ші"

qazaqify.words(123);
// "жүз жиырма үш"

qazaqify.join(["Алма", "алмұрт", "өрік"]);
// "Алма, алмұрт және өрік"

qazaqify.message("{count} жаңа хабарлама", { count: 5 });
// "5 жаңа хабарлама"
```

## Development

```bash
npm test
npm run build
```

## License

MIT License
