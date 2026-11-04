# Employee Management

A standalone Angular 18 employee management application backed by `json-server`.

## Requirements

- Node.js 18 or newer
- npm

## Start the application

Install the dependencies once from the project root:

```bash
npm install
```

Start the mock API in one terminal:

```bash
npm run mock
```

Start the Angular development server in a second terminal:

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The mock API is available at [http://localhost:3000/employees](http://localhost:3000/employees), with its records stored in `db.json`.

## Features

- Browse employees and view individual employee profiles
- Add and edit employee records with form validation
- Delete employees and toggle active status
- Filter by department or status, and search by name or email
- Format salaries as Indian rupee currency
- Display loading states and request error notifications

## Project structure

```text
src/app/
  models/         Employee and API state interfaces
  services/       HTTP access, shared employee state, notifications
  interceptors/   Mock authorization, loading, and error handling
  directives/     Employee row hover highlight
  pipes/          Indian currency formatting
  components/     Employee list, filters, form, and detail views
  app.config.ts   Router and HTTP interceptor registration
  app.routes.ts   Lazy-loaded application routes
db.json           json-server data
```

## Useful scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Run the Angular development server |
| `npm run mock` | Run json-server on port 3000 |
| `npm run build` | Build the application |
| `npm test` | Run the unit tests |

The development environment uses `http://localhost:3000`. The production environment currently points to `https://api.example.com` and should be updated to your production API before deployment.
