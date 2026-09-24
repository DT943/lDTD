# FlyCham Loyalty

A customer-facing airline loyalty concept: **Tap Into Your World**.

Built with React, TypeScript, Tailwind CSS, Framer Motion, and Lucide. Vite serves and builds the static app. All interactions use local React state; refreshing resets the experience. There are no API calls, backend services, authentication, database connections, or NFC hardware integrations. Images, fonts, and map geometry are bundled locally.

## Run

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
```

Open `http://127.0.0.1:5188` to go directly to Alaa Shammout's customer home.

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4188 --strictPort
```

The production files are generated in `dist/` and can be served by any static host. Hash navigation supports direct links and browser back/forward without server rewrites.

## Experience

| Route       | Experience                                                           |
| ----------- | -------------------------------------------------------------------- |
| `#home`     | Alaa Shammout's Platinum membership, points, upcoming trip, benefits |
| `#journey`  | Interactive tier history and Platinum privileges                     |
| `#benefits` | Five privileges, category filters, unlockable member passes          |
| `#passport` | Geographic world map, destination details, zoom, travel totals       |
| `#trip`     | Beirut departure, flight details, hotel, itinerary, lounge access    |
| `#reward`   | Gift reveal and 500 bonus points, credited once per session          |
| `#final`    | Cinematic closing brand moment                                       |

The brief gives Beirut–Dubai as the upcoming route and Beirut as the destination-page example. The trip screen treats Beirut as the departure city; the flight details, hotel, and itinerary follow the Dubai journey. Home statistics describe the current membership period; passport statistics describe the lifetime travel story, with four featured destinations.

Alaa holds Platinum, the highest membership tier. The displayed points are the available reward balance, independent of attained membership status. Every screen carries a subtle footer signature: “Thoughtfully crafted by Julian.”

## Project structure

- `src/components/`: individual screens and shared brand, card, navigation, modal, and animation components.
- `src/data/mockData.ts`: static member, destination, tier, and benefit data.
- `src/data/world.ts`: bundled map paths; no map service or runtime requests.
- `src/styles.css`: Tailwind theme, shared visual styles, responsive layouts, and reduced-motion support.
- `public/images/`: locally bundled imagery.

The light visual system pairs soft ivory (`#f8f7f3`), white surfaces, slate text (`#23313e`), and warm gold (`#87652e`) with DM Sans and Cormorant Garamond. The membership card uses a silver platinum finish; travel photography keeps contrasting light text. Buttons, labels, membership cards, and map controls are real accessible UI. The map supports keyboard selection; dialogs trap focus, close with Escape, and restore focus to their trigger. Motion respects the system's reduced-motion setting.

The sun/moon button beside the profile switches every screen between light and midnight navy themes. Light is the default; the choice is saved locally and restored before the first paint. Theme styles live in `src/styles.css` and `src/dark-theme.css`.

## Image and data sources

Clouds, Dubai, lounge, and luggage visuals were generated specifically for this concept. Other illustrative photography was sourced from:

- [Paris](https://images.unsplash.com/photo-1502602898657-3e91760cbb34), [Istanbul](https://images.unsplash.com/photo-1524231757912-21f4fe3a7200), [Dining](https://images.unsplash.com/photo-1414235077428-338989a2e8c0), [Airplane wing](https://images.unsplash.com/photo-1436491865332-7a61a109cc05), [Coffee](https://images.unsplash.com/photo-1442512595331-e89e73853f31), and [Hotel](https://images.unsplash.com/photo-1566073771259-6a8506099945) on Unsplash.
- [Beirut's Pigeon Rocks](https://www.geo.de/reisen/reise-inspiration/die-spektakulaersten-felsformationen-der-erde-35606932.html), photograph by Hein Van Tonder / GEO.
- [Business class cabin](https://www.businessclass.com/en-us/airlines/reviews/sas-business-class), Businessclass.
- [World map geometry](https://github.com/holtzy/D3-graph-gallery/blob/master/DATA/world.geojson), projected into local SVG paths.

All travel arrangements, eligibility, member passes, and point balances are fictional presentation data. No booking, redemption, or real-world access occurs.
