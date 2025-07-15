# REACT2025Q3

# Rick & Morty Character Search

A React + TypeScript application that searches for Rick and Morty characters using the [Rick and Morty API](https://rickandmortyapi.com/), with pagination, error handling, and linting configured.

## 🚀 Features

- Search for characters by name
- Paginate through results
- Loader while fetching data
- Error handling (404, 503, etc.)
- LocalStorage to save last query
- ErrorBoundary for graceful error fallback
- Husky pre-commit hook and ESLint integration

## 📦 Installation

```bash
git clone https://github.com/barmenski/REACT2025Q3.git
cd rs-react-app
npm install
```

## 🖥️ Development

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🧹 Linting

To run lint and check code style before commit:

```bash
cd ./rs-react-app
npm run lint
```

## 📝 Committing changes

Husky is configured to run linting automatically on commit.

You must commit from the repository root folder, **not from `rs-react-app` subfolder**.

Example:

```bash
cd ..
git add .
git commit -m "Your commit message"
```
