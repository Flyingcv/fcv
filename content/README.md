# Website content — edit guide (no coding needed)

Sabhi jagah dikhne wala content — destinations, packages, prices, reviews,
office/contact details, har page ka text — ab is `content/` folder ki JSON
files mein hai. Website ka code (`lib/`, `components/`, `app/`) alag hai aur
usse chhedne ki zaroorat nahi. Bas neeche di gayi files edit karo, save
karo, aur site apne aap update ho jayegi (agla deploy hone par).

**In short:** yeh saari files "fill in the blanks" jaisi hain. Sirf `"quotes"`
ke andar wali cheez badlo — structure (colons `:`, commas `,`, curly/square
brackets `{ } [ ]`) waisa hi rehne do.

**Is file ko kaise use karo:** neeche pehle "kya kahan hai" ka ek quick
lookup table hai — jo cheez badalni hai wo dhundo aur seedha uss file/section
pe jao. Uske baad har file ka poora field-by-field breakdown hai, agar
detail chahiye ho.

---

## The 3 golden rules — inko follow karo, kabhi kuch nahi tootega

1. **Har text `"double quotes"` ke andar hona chahiye.** Agar quote hata
   diya ya adhoora chhod diya, poori file khatam ho jayegi.
2. **Har line ke end mein comma `,` hona chahiye — SIVAAY last line ke.**
   List/object ki aakhri cheez ke baad comma mat lagao.
   ```json
   "name": "Vietnam",
   "iata": "SGN"
   ```
   (upar wali `"name"` line ke end mein comma hai kyunki uske baad aur
   cheezein hain; `"iata"` last hai isliye comma nahi.)
3. **Save karne se pehle check kar lo file "valid JSON" hai.** Sabse aasan
   tarika: pura file content copy karke [jsonlint.com](https://jsonlint.com)
   pe paste karo aur "Validate JSON" dabao. Ya agar developer se poochh sakte
   ho, wo `npm run build` chala ke turant bata denge kuch galat hai ya nahi.

Agar in teeno ka khayal rakha, to koi bhi non-technical person safely edit
kar sakta hai.

---

## Quick lookup — "mujhe yeh change karna hai, kaha jau?"

| Kya change karna hai | File | Kaha |
|---|---|---|
| Kisi ek specific package ka price, title, itinerary, hotel, includes | `packages.json` | wo package apne `id` se dhundo (Ctrl+F) |
| Sab packages mein ek saath koi wording (jaise "Travellers" → "Persons") | `site.json` (`ui.priceCard`), `forms.json` | neeche in dono files ke section dekho |
| Hotel ka star rating (3★ → 4★ waghera) ek specific package ke liye | `packages.json` | usi package ke andar `quickDetails.Accommodation` aur `hotels` list (chip ke andar `includes` mein bhi agar likha ho) |
| Kisi ek package ka "Style" (jaise "Beach, Cable car, Safari") baaki packages se alag rakhna ho | `packages.json` | usi package ka `style` field — na ho to poore destination ka common tagline dikhta hai |
| Kisi ek package ka "Not included" list baaki se alag rakhna ho | `packages.json` | usi package ka `exclusions` field — na ho to `site.json` ka common `packageExcludes` dikhta hai |
| Kisi ek package ka "Optional add-ons" (Visa/SIM/Hotel upgrade waghera) baaki se alag rakhna ho, ya section hi hide karna ho | `packages.json` | usi package ka `addons` field (`"addons": []` de to section webpage aur PDF dono se hide ho jaata hai) — na ho to `brochure.json` ka common list dikhta hai |
| Price calculator ke Budget/Premium/Luxury tier ka naam ya multiplier | `tiers.json` | poori file chhoti si hai |
| Phone number, email, office address, desk hours | `contact.json` | poori file |
| Company ka naam, logo text, meta title/description (Google search), nav links, footer, "not included" list, add-on rates (guide/visa/flight rate) | `site.json` | neeche section dekho |
| Home page ka hero text, stats, "why us", testimonials heading | `home.json` | neeche section dekho |
| About page ka story, mission/vision, team, values | `about.json` | neeche section dekho |
| Customer reviews/testimonials (home page pe) | `reviews.json` | naya block copy-paste karo |
| Contact page ke FAQs, form headings | `contact-page.json` | neeche section dekho |
| Destinations listing page (`/destinations`) ka hero/CTA text | `destinations-page.json` | neeche section dekho |
| Ek destination (Vietnam/Bali/Thailand/Malaysia) ka apna data — tagline, itinerary, gallery, price | `destinations.json` | uss destination ka block dhundo |
| Services page (`/services`) ka hero, "how it works" steps | `services-page.json` | neeche section dekho |
| Package detail page (`/services/[package]`) ke section headings jaise "Quick details", "Hotels on this route" | `package-page.json` | neeche section dekho |
| Downloadable PDF ke labels/headings ("Quick details", "What you pay" waghera) | `pdf.json` | neeche section dekho |
| PDF mein sab packages ke liye common content — addons table, notes, payment info, "why us" | `brochure.json` | poori file |
| Contact form ke field labels, price calculator slider limits, filter chips | `forms.json` | neeche section dekho |
| Privacy Policy / Cancellation & Refund Policy ka text | `legal.json` | neeche section dekho |

---

## Common patterns — inko samajh lo to har file aasan lagegi

Zyadatar page-content files (`home.json`, `about.json`, `services-page.json`,
`destinations-page.json`, `contact-page.json`, `package-page.json`) ek jaisi
building blocks se bani hain, bar-bar:

| Field naam | Kya hai |
|---|---|
| `tag` / `eyebrowTag` | Section ke upar chhota label (e.g. "Our story") |
| `heading`, `headingHtml`, `titleHtml` | Main heading. `Html` wale mein `<br />` (line break) aur `<em>...</em>` (italic highlight) use ho sakta hai — tags waise hi rehne do, bas beech ka text badlo |
| `paragraph`, `paragraphs`, `blurb`, `copy` | Body text |
| `ctaLabel` / `ctaHref`, `primaryLabel` / `primaryHref`, `secondaryLabel` / `secondaryHref` | Button ka text aur wo kaha jaata hai (URL). Href mat badalna jab tak pata na ho wo page exist karta hai |
| `items`, `stats`, `bullets` | Chhote cards/points ki list — har ek me aam taur pe `title`/`label` + `copy`/`value` |
| `...Template` (jaise `overviewHeadingTemplate`) | Inke andar `{name}`, `{count}` jaisi cheezein hongi — yeh automatically real value se replace ho jaati hain, curly-brace wale word ko hataana mat, bas aas-paas ka text badal sakte ho |

Yeh pattern samajhne ke baad neeche diye gaye per-file section-lists sirf
"kaunsa top-level key kis section ko control karta hai" bata rahe hain — andar
ki fields upar wale pattern se hi samajh aa jayengi.

---

## Files — kya kahan hai

### `destinations.json`
Har destination (Vietnam / Bali / Thailand / Malaysia) ka poora data —
naam, tagline, description, prices, highlights, day-by-day itinerary aur
gallery photos. Fields:

| Field | Kya hai |
|---|---|
| `name` | Destination ka naam jo dikhta hai (e.g. "Vietnam") |
| `iata` | Airport code (e.g. "SGN") — boarding-pass style UI mein use hota hai |
| `tagline` | Chhoti si ek-line tagline |
| `blurb` | Destination page ka main paragraph |
| `cover`, `hero` | Photo URLs — kisi bhi image ka direct link daal sakte ho |
| `cities` | List of city names — chips ki tarah dikhte hain |
| `facts` | Flight time / best season / currency / visa — jitne chaho utne add/remove kar sakte ho |
| `perDay` | Per person, per day land-cost in ₹ (yehi price calculator ka base hai) |
| `flight` | Indicative return flight cost per person |
| `fromPrice` | "Starting from ₹..." wala number jo cards pe dikhta hai |
| `highlights` | `[title, description]` pairs ki list — jitne chaho utne rakh sakte ho |
| `itinerary` | Day-by-day plan — har entry `["Day title", "Day description"]` |
| `gallery` | Photo URLs ki list — jitni chaho utni rakh sakte ho |

**Photo URL badalna ho to:** koi bhi public image link `"cover"`, `"hero"`
ya `"gallery"` ke andar paste kar do — .jpg/.png/.webp sab chalega.

### `packages.json`
Yeh `/services` page ke saare ready-made package cards hain (Vietnam ke
4 packages, Bali ke 4, waise hi Thailand aur Malaysia). Fields:

| Field | Kya hai |
|---|---|
| `id` | Unique internal name — kabhi do packages ka same `id` mat rakhna |
| `dest` | Kaunse destination ka hai — sirf `"vietnam"`, `"bali"`, `"thailand"` ya `"malaysia"` in charo mein se ek |
| `title` | Card ka heading |
| `where` | Card ke title ke upar chhota sa region/route text |
| `style` *(optional)* | Package page aur price-card pe "Style" row (jaise "Beach, Cable car, Safari"). Na do to us destination ka common `tagline` (`destinations.json` se) dikhta hai |
| `days`, `nights` | Trip ki duration |
| `price` | Per person price in ₹ |
| `badge` | Card ke upar chhota label — "Bestseller", "Value", "Family" waghera, kuch bhi text daal sakte ho |
| `type` | Filter categories — services page ke filter buttons se match karta hai: `culture`, `beach`, `nature`, `adventure`, `family`, `honeymoon`, `luxury` |
| `blurb` | Card ka description |
| `includes` | Chhoti list jo card ke andar dikhti hai (e.g. "4 Star Hotel") |
| `image` | Card photo ka URL |
| `route` | Trip ke stops ki list, order mein — package page pe route strip banta hai |
| `quickDetails` | "Quick details" table — arrival/departure, duration, flights, meals, visa waghera. Left side label, right side value. Jitne chaho utne rows add/remove kar sakte ho. **Yehi wo jagah hai jaha `"Accommodation"` row hoti hai — hotel ka star rating (e.g. `"4 Star hotels"`) yahan se badalta hai** |
| `hotels` | Jin hotels mein stay hota hai unki list — har entry mein bhi star rating likhi hoti hai, jaise `"...or similar (4 Star)"` — **star rating badalte waqt `quickDetails.Accommodation` aur is list, dono jagah badalna** |
| `inclusions` *(optional)* | Package page ke "Included" list aur PDF ke liye detailed, poori sentence wali list (e.g. `"4 Nights stay with breakfast in 3 star hotel"`). Na do to `includes` (chhoti chips) hi is jagah bhi dikh jaati hain |
| `exclusions` *(optional)* | Isi package ka apna "Not included" list. Na do to `site.json` ka common `packageExcludes` fallback ki tarah dikhta hai |
| `addons` *(optional)* | Isi package ke "Optional add-ons" (webpage aur PDF dono mein) — list of `{ service, description, price }`. Na do to `brochure.json` ka common `addons` list dikhta hai; `"addons": []` (khaali list) do to section hi hide ho jaata hai |
| `priceVariants` | Alag-alag duration/flight options ke prices. Har ek `{ label, note, price }` — pehla wala highlight hota hai |
| `itinerary` | Din-ba-din plan (neeche detail mein) |

**`itinerary` ka har din** ek block hota hai:

| Field | Kya hai |
|---|---|
| `title` | Us din ka naam (e.g. "Halong Bay cruise") |
| `summary` | Ek line ka overview |
| `activities` | Us din ki specific cheezon ki list (bullet points) |
| `included` | "X + Y + Z" format mein us din kya included hai |
| `type` | `"Half day"` ya `"Full day"` — badge banta hai |
| `meals` | e.g. `"Breakfast + Lunch"` ya `"No meals"` |
| `stay` | Us raat kis city mein stay — last din pe `"-"` |
| `timings` | Ghante-wise schedule ki list — PDF ke timing sheet mein jaata hai |

**Zaroori:** `itinerary` mein jitne din honge, `days` field mein bhi utna hi
number hona chahiye. 6 din ka trip = `"days": 6` aur `itinerary` mein 6 blocks.

**Naya package add karna ho to:** list mein ek naya `{ ... }` block copy-paste
karke uske fields badal do, aur uske pehle wale block ke end mein comma
lagana mat bhoolna (kyunki ab wo last nahi raha).

**Kisi ek package ko dhundna ho to:** editor mein Ctrl+F/Cmd+F se uska `id`
(jaise `"vn-phu-quoc"`) ya `title` search karo — file bahut badi hai, sab
packages ek hi list mein hain.

### `brochure.json`
Yeh downloadable PDF (aur package page ke "Optional add-ons" section) ka wo
content hai jo **default/common** rehta hai — jab tak koi package apna khud
ka `addons` na de (dekho `packages.json` ke `addons` field ki row upar):

| Field | Kya hai |
|---|---|
| `addons` | Default optional add-ons ki table (Visa, insurance, SIM, flights waghera) — webpage ke package page pe aur PDF mein, un packages ke liye jinka apna `addons` field nahi hai. Har ek `{ service, description, price }` |
| `notes` | "Good to know" section — check-in timing, meals, hotel substitution waghera (PDF-only) |
| `paymentMethods` | Kaunse payment modes accept karte ho (PDF-only) |
| `paymentTerms` | Payment/booking ki terms (PDF-only) |
| `whyUs` | "Why travel with us" section — har ek `{ title, copy }` (PDF-only) |

`addons` badloge to **har package** (jiska apna `addons` na ho) ka PDF +
webpage dono update ho jayenge. Baaki 4 fields (`notes`/`paymentMethods`/
`paymentTerms`/`whyUs`) sirf PDF mein hain, in per-package override nahi.

### `tiers.json`
Price calculator ki 3 stay-tiers (Budget / Premium / Luxury) ka label,
chhota note, aur price multiplier:

```json
"comfort": { "label": "Budget", "note": "3★", "mult": 1.0 },
"premium": { "label": "Premium", "note": "4★", "mult": 1.45 },
"luxury":  { "label": "Luxury",  "note": "5★", "mult": 2.1 }
```

`mult: 1.45` ka matlab hai iss tier ka price base rate (`destinations.json`
ke `perDay`) se 1.45x hai. In teeno keys (`comfort`, `premium`, `luxury`)
ke naam mat badalna — bas andar wali `label`/`note`/`mult` values badal
sakte ho.

### `reviews.json`
Home page ke customer testimonials. Har review ek `{ text, name, meta }`
block hai. Naya review add karna ho to same tarah ek naya block copy-paste
kar do.

### `contact.json`
Phone, email, office address, desk hours — yeh Contact page aur Footer
dono mein automatically use hota hai, sirf ek jagah badalna padega.

| Field | Kya hai |
|---|---|
| `phone` | Display hone wala number |
| `phoneHref` | Click-to-call link — special format: `"tel:+91XXXXXXXXXX"` (no spaces, `+` ke baad seedha number) |
| `email` | Contact email |
| `address` | Office address |
| `hours` | Desk hours (jaise "Mon – Sat · 10:00 – 19:00 IST") |
| `emergency` | 24/7 on-trip support wali line |

### `site.json`
Poori website mein jo bhi common/shared text hai:

| Section | Kya hai |
|---|---|
| `brandName`, `boardingPassDefaultTitle`, `glimpseAltText` | Chhote brand-level text snippets |
| `meta` | Google search title/description, keywords, social-share (OG) text |
| `origin` | Boarding-pass UI mein "from" city/airport code (default: Delhi) |
| `nav` | Top navbar ke links, "Plan my trip" CTA, dropdown text |
| `footer` | Footer ka poora content — tagline, social links, company/destination columns, copyright line, credit line |
| `notFound` | 404 ("page not found") page ka text |
| `packageExcludes` | Har package ki default "Not included" list (jab tak package apna khud ka na de) |
| `addons` | Price calculator ke add-on rates — flights, visa (`rate`), private guide (`rate`), experiences pack (`rate`). `rate` badalne se price calculator ka number turant badal jayega |
| `siteUrl` | Website ka full URL (SEO ke liye) |
| `ui.priceCard` | Price-calculator wale "boarding pass" card ke sab labels — **yehi wo jagah hai jaha `"Travellers"` wala label hai (`travellersLabel`, `travellerSingular`, `travellerPlural`, WhatsApp message ka `travellersLine`)** |
| `ui.packageCard` | Package listing card ke chhote labels ("Per person from", "View") |
| `ui.itineraryAccordion` | Itinerary ke "Day" prefix aur "Included:" label |
| `ui.legalToc` | Privacy/Cancellation page ke sidebar ka "On this page" title |

### `home.json`
Home page (`/`) ka poora content, section-wise:

| Section | Kya hai |
|---|---|
| `hero` | Sabse upar wala heading, blurb, dono buttons, "NOW BOARDING" ticker (destination codes + starting price) |
| `marqueeItems` | Scrolling marquee ke words (jinke aage `*` hai wo alag style mein dikhte hain) |
| `horizontalDestinations` | "Where we fly" wali horizontal-scroll section ka tag/heading |
| `whyUs` | "We don't sell packages, we plan journeys" section — paragraphs + stats (years/travellers/rating) |
| `pricingExplainer` | Price calculator ka preview section — bullets + ek sample "demo" boarding pass ke fields |
| `services` | "What we handle" 4 items (icons wale) |
| `testimonials` | Reviews section ka heading (actual reviews `reviews.json` se aate hain) |
| `glimpses` | "Glimpses from the road" photo section ka heading |
| `cta` | Sabse neeche ka final call-to-action |

### `about.json`
About page (`/about`) ka poora content — `hero` (stats ke saath), `story`
(company history paragraphs), `marqueeItems`, `missionVision`, `values`
(4 value cards), `perks` (6 "why choose us" cards), `glimpses`, `team`,
`cta`. Har section ka pattern upar "Common patterns" mein explain kiya
gaya hai.

### `services-page.json`
Services page (`/services`) ka content — `hero`, `services` (6 cards jo
hum handle karte hain), `pricing` (calculator section ka intro),
`steps` (4-step "how it works"), `packages` (package-listing section ka
heading), `cta` (custom-trip CTA).

### `destinations-page.json`
Destinations listing page (`/destinations`) ka content — `hero` (stats
ke saath), `marqueeItems`, `cta`, aur `slug` (yeh har individual
destination page — jaise `/destinations/vietnam` — ke reusable headings/
templates hain, jinme `{name}` aur `{count}` placeholders hote hain).

### `contact-page.json`
Contact page (`/contact`) ka content:

| Section | Kya hai |
|---|---|
| `meta` | Page title/description |
| `hero` | Top heading |
| `cardsSection` | 4 chhote cards — Call, Email, Office, Desk hours |
| `formSection` | Enquiry form ke upar ka heading |
| `faqSection` | FAQ section ka heading + 2 buttons |
| `faqs` | FAQ list — har entry `["Question", "Answer"]` pair hai. Naya FAQ add karna ho to same format mein ek naya pair jodo |

### `package-page.json`
Har package detail page (`/services/[package]`) ke section headings —
`tripRouteTag`, `quickDetails`, `itinerary`, `hotels`, `breakdown`
(Included/Not included labels), `costing`, `about`, `highlights`,
`gallery`, `morePackages`, `cta`, aur `waMessage` (jab user "Enquire on
WhatsApp" dabata hai to jo message pre-filled hota hai uska text).
Package-specific data (price, itinerary, hotels) yaha nahi — wo
`packages.json` se aata hai; yeh file sirf **fixed section labels** ke
liye hai jo har package page pe repeat hote hain.

### `pdf.json`
Downloadable itinerary PDF ke saare labels aur headings — cover page,
"Quick details", "Where you stay", "Day-by-day itinerary", "Inclusions
& exclusions", "What you pay", "Optional add-ons", "Good to know",
"Payment & booking", "Why travel with us", back-cover ka message, aur
download button ke label. Package-specific data (prices, itinerary)
`packages.json` se aata hai, aur common add-ons/notes/payment-terms
`brochure.json` se; ye file sirf PDF ke **fixed/repeating text** ke
liye hai.

### `forms.json`
| Section | Kya hai |
|---|---|
| `contactForm` | Contact page ke form fields — har field ka `label` + `placeholder`, submit button text, success/disclaimer messages |
| `priceConfigurator` | Price calculator (boarding-pass) ke slider limits (`minDays`/`maxDays`/`minPax`/`maxPax`), default values, aur uske labels — **yaha bhi ek `"travellers": "Travellers"` label hai** |
| `packageFilter` | Services page ke filter chips — trip-length options, budget range (`minBudget`/`maxBudget`), sort options, "no results" empty-state text |

### `legal.json`
Privacy Policy aur Cancellation & Refund Policy ka poora legal text.
Dono (`privacy` aur `cancellation`) ka structure same hai — `meta`,
`heroTag`/`heroHeading`, `lastUpdated`, `intro`, aur `sections` (list of
`{ id, label, heading, blocks }`). Har section ke `blocks` ki list do
types ki ho sakti hai:
- `{ "type": "p", "text": "..." }` — ek paragraph
- `{ "type": "ul", "items": ["...", "..."] }` — bullet list

Text ke andar `**bold text**` likhne se wo bold ban jaata hai, aur
`{{email}}` / `{{phone}}` likhne se wahan `contact.json` ka real email/phone
apne aap clickable link ban ke aa jaata hai — inhe directly type mat karo.

Naya legal section add karna ho to `sections` list mein ek naya block
copy-paste karo — `id` unique rakhna (wo sidebar navigation ke liye use
hota hai).

---

## Yeh kaam mat karna (developer ke liye chhod do)

- `lib/data.ts`, koi bhi `.tsx` file, ya `app`/`components` folder ke
  andar kuch bhi — yeh sab website ka actual code hai, content nahi.
- `content/` folder ke andar file ka **naam** ya `.json` extension badalna.
- Kisi field ka **naam** (colon `:` ke bayi taraf wala word) badalna —
  sirf uski **value** (colon ke dayi taraf, quotes ke andar) badalo.

---

## Changes site pe kab dikhenge?

JSON file edit karke save karne ke baad, site ko ek naya build/deploy
chahiye hota hai tabhi changes live dikhenge (kaise hosted hai uske hisaab
se — Vercel/Netlify jaisi services par yeh git push karte hi apne aap ho
jata hai). Agar pata nahi kaise deploy hota hai, developer se ek baar
poochh lena.
