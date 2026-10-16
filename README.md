# Weather App

Weather for Georgia's mountain and seaside resorts, built with Angular 16.
Available in Georgian, English and Russian (ngx-translate, texts in `src/assets/i18n/`).

- Resorts (`/`, `/resort/:id`): Open-Meteo forecast and Marine APIs (7-day forecast, snow, water temperature).
- Place search on the main page: Open-Meteo Geocoding API, limited to Georgia. The found place is shown
  on a Leaflet + OpenStreetMap map; "Detailed forecast" opens `/city` (OpenWeatherMap API).

## Project structure

```
src/
├── app/
│   ├── core/                  # Non-UI app logic
│   │   ├── models/            # TypeScript interfaces (weather.model.ts)
│   │   ├── services/          # weather.service (API), weather-state.service (shared data)
│   │   └── utils/             # Formatting and weather-code → translation key helpers
│   ├── data/resorts.ts        # Resort list (names, regions, descriptions in 3 languages)
│   ├── pages/                 # Routed pages
│   │   ├── resort-list/       # /           — resort cards with tabs
│   │   ├── resort-detail/     # /resort/:id — hourly + 7-day forecast
│   │   ├── city/              # /city       — detailed forecast for a searched place
│   │   └── detail/            # /detail     — hourly forecast for one day of a city
│   ├── shared/
│   │   └── components/        # resort-card, location-search, location-map, language-switcher
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── app.component.*
├── assets/i18n/               # ka.json, en.json, ru.json
├── environments/              # API keys and URLs
├── index.html
├── main.ts
└── styles.css
```

## Commands

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `npm start`     | Dev server at `http://localhost:4200/`      |
| `npm run build` | Production build, output in `dist/weather-app/` |
| `npm test`      | Unit tests (Karma)                          |
