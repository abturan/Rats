# Kozmik Çöp — Browser MVP

Tek dosyalık React komponenti **dosyalara bölündü** ve Vite + Tailwind ile koşacak hale getirildi.
Tutorial (serseri üslup), self-test paneli ve oyun mekaniği bire bir korunmuştur.

## Kurulum
```bash
npm install
npm run dev
```

- Varsayılan: http://localhost:5173
- Derleme: `npm run build`, sonra `npm run preview`

## Testler
Basit yardımcı ve sabitler için **Vitest**:
```bash
npm run test
```

## Proje Yapısı
```text
cosmic-trash-game/
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ index.css
   ├─ App.jsx
   ├─ game/
   │  ├─ utils.js
   │  └─ constants.js
   └─ __tests__/
      └─ utils.test.js
```
