# PhiBean Coffees — Project Brief

## Project overview
PhiBean Coffees is a mobile-first landing page for traceable, single-origin coffee from farms in the Mullayanagiri, Seethalayanagiri and Rudragiri ranges, Karnataka, India. It helps specialty roasters, cafés, importers, wholesalers, and other professional buyers explore the coffees and submit sourcing inquiries.

The site guides buyers from origin and available coffees through processing, people and place, and buying options to a focused inquiry; it also includes a conversational sourcing chatbot and search/social metadata. It is built with HTML, locally compiled Tailwind CSS, and vanilla JavaScript.

## Product goal
Create a refined, mobile-first B2B landing page for a specialty coffee producer that communicates origin, altitude, traceable farm-level sourcing, farm processing, available micro-lots, and a calm premium brand position. Help professional buyers quickly understand where the coffee comes from, how it is processed, which varieties are available, and how to request samples, purchase lots, or discuss forward contracts.

## Brand direction
- Brand name: PhiBean Coffees
- Positioning: premium, traceable, minimal, elevated, and farm-direct
- Visual style: restrained ivory and forest tones, editorial serif headlines, generous whitespace, and minimal ornament
- Message tone: concise, confident, elegant, and B2B-appropriate
- Core promise: traceable micro-lots from the high-altitude Mullayanagiri, Seethalayanagiri, and Rudragiri ranges
- Tagline: Crafted by altitude
- Supporting brand statement: From the hills of India to your roastery
- Avoid excessive repetition of "Arabica"; establish the coffee context naturally

## Customer profile
- Specialty roastery buyers
- Green coffee importers
- Green coffee wholesalers
- Specialty cafés
- Coffee businesses seeking direct-sourcing relationships
- Buyers seeking traceable micro-lots, spot purchases, or annual forward contracts
- Partners prioritizing origin transparency and consistency

## Conversion priorities
1. Establish trust through origin, altitude, traceability, and farm-level processing
2. Clearly present available varieties, processes, and lot information
3. Make sample requests and pre-booking straightforward
4. Provide a streamlined inquiry process and helpful mobile-first sourcing chatbot
5. Guide buyers from discovery to evaluation, sampling or pre-booking, and inquiry

## Coffee offering and lot information

### Origin
PhiBean coffees come from farms in the Mullayanagiri, Seethalayanagiri, and Rudragiri ranges in Karnataka, India. The farms sit at **1,400–1,600 metres above sea level** beneath a natural forest canopy. Describe the role of altitude, shade, and microclimate in the coffees' character, density, and complexity without making unsupported claims about a specific lot.

Coffee is processed at the farm, allowing control over processing from cherry to green bean.

### Available varieties
- Cauvery
- S795
- Selection 9
- Chandragiri

Do not add varieties to the available-lots table unless confirmed as part of the current offering.

### Processing
Available processes are **Washed**, **Natural**, and **Honey**.

- **Washed:** Clean and structured; lets the character of the variety and origin come through.
- **Natural:** Whole-cherry dried; can emphasize sweetness, fruit character, and body.
- **Honey:** Dried with mucilage retained; can balance characteristics associated with washed and natural coffees.

Give process descriptions enough context to explain what happens to the coffee and why a buyer might compare methods. Do not imply specific flavour results for an individual lot unless verified.

### Available lots
| Variety |
| --- |
| Cauvery |
| S795 |
| Selection 9 |
| Chandragiri |

Shared lot reference: **1,400–1,600 masl**, **Mullayanagiri–Seethalayanagiri–Rudragiri, Karnataka**, and **Washed / Natural / Honey** processes. The standard lot size is **30 kg** unless a specific lot is documented otherwise. Confirm the current variety/process combination, availability, lot size, and cup information per lot.

Treat `>84` only as a potential or target characteristic unless an individual lot has been formally cupped and scored above 84. Replace potential cup information with verified lot scores and cup profiles when available. Do not invent flavour notes, scores, certifications, or other quality measurements.

The harvest window is **December–March**. Display it clearly near sourcing and pre-booking information.

## Project structure
```text
/
├── index.html
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   ├── tailwind.input.css
│   │   └── tailwind.min.css
│   ├── js/
│   │   ├── chat.js
│   │   ├── site.js
│   │   └── analytics.js
│   └── images/
│       ├── phibean-coffees-mark.svg
│       ├── logo.jpg
│       ├── farm-hero.svg
│       └── valley.jpg
├── PROJECT_BRIEF.md
├── package.json
├── package-lock.json
└── tailwind.config.js
```

## Local build and preview
- Requirements: Node.js and npm
- Install dependencies with `npm ci`
- Build the production Tailwind stylesheet with `npm run build:css`; output is written to `assets/css/tailwind.min.css`
- Open `index.html` directly in a browser or serve the repository root with a static web server to preview the site

## Recommended deployment stack
- Frontend: HTML5 + locally built Tailwind CSS + vanilla JavaScript
- Hosting: Cloudflare Pages or Netlify
- Form integration: Netlify Forms or Web3Forms
- Asset handling: direct-image logo file for clean brand fidelity and consistent export use

## Grower registration and lead capture
- Publish individual grower or estate profiles only when the details are verified and approved
- Use the shared Web3Forms inquiry form for both grower-to-business sourcing and grower registration
- Registration links select the grower opportunity and adapt the company, volume, and request-detail prompts to collect farm information
- Collect name, farm/estate or roastery/company name, and professional email
- Opportunity types: sample request, spot micro-lot order, annual forward contract, estate visit, or grower registration
- Collect required volume and unit, adapting the prompt to required or available coffee volume
- Collect sourcing requirements or, for grower registration, farm location, varieties, growing practices, and harvest
- Keep traffic source, referrer, landing path, and UTM campaign fields hidden

### Buyer messaging and pre-booking
Position PhiBean as a traceable, farm-level production partner, not a commodity supplier. Give origin, process, farm-story, and buying-option sections useful supporting detail, while avoiding repeated facts and generic sales copy.

Use **"Pre-book a seasonal lot"** for the forward-contract action. Explain that buyers can share their variety, process, quantity, and preferred cup profile, and that PhiBean aims to respond to buyer enquiries within 24 hours. Make it easy to specify variety, processing method, quantity, cup profile, sample and delivery requirements, and interest in a spot purchase or forward contract.

## Chatbot behavior
The chatbot answers commonly high-intent buyer questions such as:
- Micro-lot availability
- Available varieties and processing methods
- Lot size, altitude, origin, and harvest window
- Grower registration and estate visits; share grower stories only when verified and approved
- Sample requests
- Forward contracts
- Origin preferences and lot types
- Pricing and volume guidance
- It can collect inquiry details conversationally, display a review summary, and submit to the shared inquiry form only after the visitor confirms

It should feel consultative, polished, concise, helpful, and B2B-focused, guiding visitors toward inquiry submission without unnecessary friction.

## Website content hierarchy
1. **Hero:** PhiBean Coffees, "Crafted by altitude," a concise brand statement, and links to origin and available coffees
2. **Origin:** Mullayanagiri, Seethalayanagiri, Rudragiri, 1,400–1,600 masl, forest canopy, and farm processing
3. **Coffee and traceability:** One section presenting varieties, lot references, estate/origin/quality traceability, and Washed, Natural, and Honey processing
4. **Farm stories:** A responsive grid of repeatable farm-profile blocks, with a grower-registration invitation and estate-visit enquiry
5. **Buying options:** Separate sample and forward-contract actions that preselect the inquiry type
6. **Wholesale workflow:** Buyer brief, review of currently available options, agreement of terms, and coordination of delivery
7. **Inquiry:** One focused form for buyer requirements, estate visits, and grower registration
8. **Chatbot**
9. **Footer:** Brand, section links, contact, privacy, and social links

Give each section a distinct purpose and destination. Keep the main sourcing CTA in the header, use the hero to direct buyers to origin or coffee discovery, and avoid repeating generic sourcing CTAs or restating the same lot facts across sections.

### Lot-to-origin traceability
- Explain the chain from contributing farm and range to the specific harvest lot and its buyer-facing details.
- Identify a farm or range for a lot only when that attribution is confirmed; otherwise state the broader origin accurately and mark more specific detail as unavailable.
- Keep variety, process, harvest, lot size, availability, and cup information associated with the relevant lot. Do not imply every attribute is available or verified before it is confirmed.
- Share scores and tasting notes only when verified for that individual lot.
- Describe cultivation, harvest, processing, export documentation, moisture readings, or defect screening as lot records or quality checks only when those records are confirmed for the coffee being offered.
- The standard lot reference is **30 kg**, and the harvest window is **December–March**. Do not replace these with unsupported lot sizes or harvest dates.

### Wholesale workflow and buyer value
- Explain the buyer path as share requirements, review available lots, agree order terms, and coordinate delivery.
- Present shipping schedules, export documentation, quality checks, and delivery visibility as order-specific details to confirm with the buyer; do not promise capabilities that have not been verified.
- Buyer-facing benefits should be grounded in the available evidence: origin details, lot-level information, sample requests, seasonal contracts, and responsive direct communication.

### Farm story blocks
- Place published profiles in the `#farmStoryGrid` container in `index.html`. Add one `<article data-farm-story>` per approved farm profile to extend the grid.
- Keep the grower-registration and estate-visit invitation cards separate from published profiles.
- Each profile can include the farm or grower name, approved location, grower-approved story, growing practices, varieties, and confirmed processing details. Add a farm image only when supplied and approved.
- Until profile information is available, describe shared origin facts as applying across PhiBean farms; do not assign an individual farm, grower, practice, or lot to a range without verification.
- Obtain permission before publishing a grower’s name, story, or identifying details.

### Suggested hero copy
**PHIBEAN**

**Crafted by altitude.**

Traceable micro-lots for roasters who care as much about provenance as the cup.

Primary CTA: **Explore the coffees**

Secondary CTA: **Explore the origin**

## Performance and UX guidance
- Maintain a one-page responsive layout with clear CTA visibility above the fold
- Prioritize mobile-first spacing, typography, and tap targets
- Use warm earth tones, organic greens, and premium coffee-brand styling
- Keep the hero visually calm and emphasize trust, origin, and quality without clutter
- Keep available-lot tables horizontally scrollable on small screens if needed
- Make sourcing CTAs easy to reach throughout the page
- Ensure chatbot controls are comfortable to use on mobile
- Keep inquiry forms short and easy to complete
- Use semantic HTML and accessible labels
- Optimize images and SVG assets for fast loading

## Content direction
- Lead with origin, traceability, altitude, processing, and lot characteristics
- Keep headline copy short and premium
- Use understated supporting paragraphs rather than dense sales copy
- Favor clarity over volume in the message hierarchy
- Position the farm as a refined production partner, not a commodity supplier
- Avoid unnecessary repetition of "Arabica" and do not make unsupported claims
- Do not invent cup scores or flavour notes; replace potential cup information with actual cupping results when available
- Keep variety, processing method, and lot as distinct pieces of information
- Keep the buyer journey focused on **Discover → Evaluate → Sample / Pre-book → Inquire**

## SEO and social metadata
Include a descriptive page title, a meta description focused on traceable green coffee and origin, Open Graph title and description, an Open Graph image, Twitter/X card metadata, canonical URL, semantic headings, and descriptive image alt text.

- Suggested page title: **PhiBean Coffees | Traceable Micro-Lots for Roasters**
- Suggested positioning: **Traceable micro-lot coffee from the Mullayanagiri, Seethalayanagiri and Rudragiri ranges, Karnataka. Farm-processed coffees from 1,400–1,600 metres above sea level.**

## Deployment checklist
- Run `npm ci` and `npm run build:css` before deploying the static site
- Add `vbn1.github.io` as the tracked domain in Umami and configure the website ID in the head script to enable page-view, inquiry-submission, and grower-registration event tracking
- For TinyURL attribution, create the short link with a destination URL containing UTM parameters, for example `https://vbn1.github.io/phibeancoffees/?utm_source=tinyurl&utm_medium=shortlink&utm_campaign=campaign-name`
- Disclose analytics collection in the site's privacy notice
- Push to GitHub
- Connect repository to Netlify or Cloudflare Pages
- Enable form notifications (Netlify Forms or Web3Forms)
- Add a custom domain if needed
- Validate the chatbot flow and contact form from the live site

## Success metrics
- Inquiry form completion rate
- Chatbot engagement rate
- CTA click-through to inquiry form
- Seasonal contract conversations generated from landing page traffic
- Quality of lead inquiries from premium B2B buyers
