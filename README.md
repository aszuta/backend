# WeatherApp – Backend

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  WeatherApp Backend – REST API do pobierania pogody dla miast w Polsce oraz wysyłania zgłoszeń błędów mailowo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-Backend-ea2845" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Docker-ready-blue" alt="Docker" />
  <img src="https://img.shields.io/badge/testy-przechodzą-brightgreen" alt="Testy" />
</p>

---

## Opis

WeatherApp Backend to aplikacja serwerowa zbudowana w **NestJS + TypeScript**.

Backend udostępnia endpointy do:

- pobierania listy miast,
- filtrowania miast po nazwie,
- pobierania aktualnej pogody z OpenWeather API,
- pobierania pogody dla wielu miast jednocześnie,
- wysyłania zgłoszeń błędów mailowo przez SMTP, np. Mailtrap.

---

## Wymagania

| Narzędzie      | Minimalna wersja |
| -------------- | ---------------- |
| Node.js        | 20+              |
| npm            | 9+               |
| Docker         | opcjonalnie      |
| Docker Compose | opcjonalnie      |

---

## Konfiguracja projektu

### 1. Instalacja zależności

```bash
npm install
```

### 2. Utworzenie pliku `.env`

Utwórz plik `.env` na podstawie `.env.example`:

```bash
cp .env.example .env
```

Przykład `.env`:

```env
PORT=3000

OPENWEATHER_API_KEY=your_openweather_api_key

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_password
REPORT_EMAIL=reports@example.com
```

---

## Uruchomienie aplikacji

```bash
# tryb developerski
npm run start

# tryb watch
npm run start:dev

# build produkcyjny
npm run build

# uruchomienie wersji produkcyjnej
npm run start:prod
```

Aplikacja domyślnie działa pod adresem:

```text
http://localhost:3000
```

Jeżeli w `main.ts` ustawiony jest globalny prefix `api`, endpointy będą dostępne pod adresem:

```text
http://localhost:3000/api
```

---

## Uruchomienie w Dockerze

Zbudowanie i uruchomienie kontenera:

```bash
docker compose up --build
```

Uruchomienie w tle:

```bash
docker compose up -d --build
```

Zatrzymanie kontenerów:

```bash
docker compose down
```

Projekt zawiera pliki konfiguracyjne Dockera:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

---

## Endpointy API

### Miasta

#### Pobranie listy miast

```http
GET /cities
```

Parametry query:

| Parametr | Typ    | Opis                                     |
| -------- | ------ | ---------------------------------------- |
| `q`      | string | Opcjonalne wyszukiwanie po nazwie miasta |
| `limit`  | number | Opcjonalny limit wyników, domyślnie `50` |

Przykład:

```bash
curl "http://localhost:3000/cities?q=war&limit=5"
```

---

### Pogoda

#### Pobranie pogody dla jednego miasta

```http
GET /weather/:cityId
```

Przykład:

```bash
curl http://localhost:3000/weather/warszawa
```

Przykładowa odpowiedź:

```json
{
  "cityId": "warszawa",
  "cityName": "Warszawa",
  "temperature": 12.5,
  "feelsLike": 10.1,
  "tempMin": 9,
  "tempMax": 14.2,
  "humidity": 72,
  "pressure": 1013,
  "windSpeed": 5.2,
  "windDirection": 240,
  "description": "zachmurzenie umiarkowane",
  "icon": "04d",
  "sunrise": 1714277040,
  "sunset": 1714328580,
  "visibility": 10000,
  "updatedAt": "2026-04-28T17:30:00.000Z"
}
```

#### Pobranie pogody dla wielu miast

```http
POST /weather/bulk
```

Body:

```json
{
  "cityIds": ["warszawa", "krakow", "gdansk"]
}
```

Przykład:

```bash
curl -X POST http://localhost:3000/weather/bulk \
  -H "Content-Type: application/json" \
  -d '{"cityIds":["warszawa","krakow","gdansk"]}'
```

Przykładowa odpowiedź:

```json
{
  "data": [
    {
      "cityId": "warszawa",
      "cityName": "Warszawa",
      "temperature": 12.5,
      "description": "zachmurzenie umiarkowane",
      "icon": "04d"
    }
  ]
}
```

---

### Zgłoszenia błędów

#### Wysłanie zgłoszenia błędu

```http
POST /reports
```

Body:

```json
{
  "cityId": "warszawa",
  "description": "Temperatura dla Warszawy wygląda niepoprawnie."
}
```

Przykład:

```bash
curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -d '{"cityId":"warszawa","description":"Temperatura wygląda niepoprawnie."}'
```

Przykładowa odpowiedź:

```json
{
  "success": true,
  "message": "Zgłoszenie zostało przyjęte i wysłane."
}
```

W środowisku developerskim maile można podejrzeć w Mailtrap Email Sandbox.

---

## Testy

Uruchomienie wszystkich testów:

```bash
npm test
```

Alternatywnie:

```bash
npm run test
```

Testy w trybie watch:

```bash
npm run test:watch
```

Pokrycie testami:

```bash
npm run test:cov
```

Uruchomienie wybranego testu:

```bash
npm run test -- weather.service
npm run test -- weather.controller
npm run test -- cities.service
npm run test -- reports.service
```

Projekt zawiera testy dla:

- `CitiesService`
- `CitiesController`
- `WeatherService`
- `WeatherController`
- `ReportsService`
- `ReportsController`

---

## Struktura projektu

```text
src/
├── cities/
│   ├── dto/
│   ├── interfaces/
│   ├── cities.controller.ts
│   ├── cities.controller.spec.ts
│   ├── cities.service.ts
│   ├── cities.service.spec.ts
│   └── cities.module.ts
├── weather/
│   ├── dto/
│   ├── interfaces/
│   ├── weather.controller.ts
│   ├── weather.controller.spec.ts
│   ├── weather.service.ts
│   ├── weather.service.spec.ts
│   └── weather.module.ts
├── reports/
│   ├── dto/
│   ├── reports.controller.ts
│   ├── reports.controller.spec.ts
│   ├── reports.service.ts
│   ├── reports.service.spec.ts
│   └── reports.module.ts
├── app.module.ts
└── main.ts
```

---

## Zmienne środowiskowe

| Zmienna               | Opis                                      |
| --------------------- | ----------------------------------------- |
| `PORT`                | Port aplikacji, domyślnie `3000`          |
| `OPENWEATHER_API_KEY` | Klucz API do OpenWeather                  |
| `SMTP_HOST`           | Host SMTP, np. Mailtrap                   |
| `SMTP_PORT`           | Port SMTP                                 |
| `SMTP_USER`           | Login SMTP                                |
| `SMTP_PASS`           | Hasło SMTP                                |
| `REPORT_EMAIL`        | Adres, na który wysyłane są zgłoszenia    |

---

## Przydatne komendy

```bash
npm run start:dev
npm run build
npm run start:prod
npm test
npm run test
docker compose up --build
docker compose down
```

---
