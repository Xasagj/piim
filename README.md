# СЭЗ Беларуси — Neon Quiz с общей таблицей лидеров

Структура:
- `public/index.html` — страница теста
- `netlify/functions/leaderboard.mjs` — API (`/api/leaderboard`), хранит рейтинг в Netlify Blobs
- `netlify.toml`, `package.json` — настройки

## Деплой через Netlify CLI
```
npm install -g netlify-cli
cd sez-quiz
npm install
netlify login
netlify deploy --prod
```
При первом запуске выберите «Create & configure a new project».

## Деплой через GitHub
Загрузите папку в репозиторий, на app.netlify.com выберите Add new project → Import an existing project и укажите репозиторий. Настройки подхватятся из `netlify.toml`.

Перетаскивание в Netlify Drop для этой версии не подходит: функция не соберётся.
