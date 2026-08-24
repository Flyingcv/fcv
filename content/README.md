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
| Hotel ka star rating (3★ → 4★ waghera) ek specific package ke liye | `packages.json` | usi package ke andar `quickDetails.Accommodation` aur `hotels` list |
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
| `days`, `nights` | Trip ki duration |
| `price` | Per person price in ₹ |
| `badge` | Card ke upar chhota label — "Bestseller", "Value", "Family" waghera, kuch bhi text daal sakte ho |
| `type` | Filter categories — services page ke filter buttons se match karta hai: `culture`, `beach`, `nature`, `adventure`, `family`, `honeymoon`, `luxury` |
| `blurb` | Card ka description |
| `includes` | Chhoti list jo card ke andar dikhti hai (e.g. "4★ Hotels") |
| `image` | Card photo ka URL |
| `route` | Trip ke stops ki list, order mein — package page pe route strip banta hai |
| `quickDetails` | "Quick details" table — arrival/departure, duration, flights, meals, visa waghera. Left side label, right side value. Jitne chaho utne rows add/remove kar sakte ho |
| `hotels` | Jin hotels mein stay hota hai unki list |
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

### `brochure.json`
Yeh downloadable PDF ka wo content hai jo **sabhi packages mein same** rehta
hai — isliye ek hi jagah rakha hai:

| Field | Kya hai |
|---|---|
| `addons` | Optional add-ons ki table (Visa, insurance, SIM, flights waghera). Har ek `{ service, description, price }` |
| `notes` | "Good to know" section — check-in timing, meals, hotel substitution waghera |
| `paymentMethods` | Kaunse payment modes accept karte ho |
| `paymentTerms` | Payment/booking ki terms |
| `whyUs` | "Why travel with us" section — har ek `{ title, copy }` |

Inme se kuch bhi badloge to **har package ka PDF** update ho jayega.

### `tiers.json`
Price calculator ki 3 stay-tiers (Budget / Premium / Luxury) ka label,
chhota note, aur price multiplier. `mult: 1.45` ka matlab hai iss tier ka
price base rate se 1.45x hai. In teeno keys (`comfort`, `premium`, `luxury`)
ke naam mat badalna — bas andar wali `label`/`note`/`mult` values badal
sakte ho.

### `reviews.json`
Home page ke customer testimonials. Har review ek `{ text, name, meta }`
block hai. Naya review add karna ho to same tarah ek naya block copy-paste
kar do.

### `contact.json`
Phone, email, office address, desk hours — yeh Contact page aur Footer
dono mein automatically use hota hai, sirf ek jagah badalna padega.
`phoneHref` ek special format mein hona chahiye: `"tel:+91XXXXXXXXXX"`
(no spaces, `+` ke baad seedha number).

### `site.json`
Poori website mein jo bhi common/shared text hai — page ka `<title>`,
Google search description, nav ke links, footer ka poora content, 404 page,
har package ki "not included" list, add-on rates, aur chhote UI labels
(jaise "Travellers", "Included:", price card ke messages) — sab yahan hai.

### `home.json`, `about.json`, `services-page.json`, `destinations-page.json`, `contact-page.json`, `package-page.json`
Har ek apne page ka poora content hai — hero heading/paragraph, stats,
section headings, list items, CTA buttons, sab kuch. File ka naam jis page
se match karta hai, wahi uska content hai (e.g. `about.json` = `/about` page).

**`headingHtml` fields:** kuch headings mein `<br />` (line break) aur
`<em>...</em>` (italic highlight) use hota hai — jaise
`"Southeast<br />Asia in full<br /><em>colours</em>"`. Ye tags waise hi
rehne do, bas unke beech ka text badlo.

**`{placeholder}` fields:** kuch text mein `{name}`, `{count}` jaisi cheezein
dikhengi (e.g. `"Filter {count} ready-made itineraries..."`) — yeh
automatically real number/naam se replace ho jaati hain, inhe hataana mat.

### `legal.json`
Privacy Policy aur Cancellation & Refund Policy ka poora legal text.
Har section `blocks` ki list hai — do types honte hain:
- `{ "type": "p", "text": "..." }` — ek paragraph
- `{ "type": "ul", "items": ["...", "..."] }` — bullet list

Text ke andar `**bold text**` likhne se wo bold ban jaata hai, aur
`{{email}}` / `{{phone}}` likhne se wahan `contact.json` ka real email/phone
apne aap clickable link ban ke aa jaata hai — inhe directly type mat karo.

### `pdf.json`
Downloadable itinerary PDF ke saare labels aur headings — "Quick details",
"What you pay", back-cover ka message, waghera. Package-specific data
(prices, itinerary) `packages.json` se aata hai; ye file sirf PDF ke
fixed/repeating text ke liye hai.

### `forms.json`
Contact form ke field labels/placeholders, price calculator ke slider
limits aur labels, aur packages page ke filter chips/labels.

---

## Yeh kaam mat karna (developer ke liye chhod do)

- `lib/data.ts`, koi bhi `.tsx` file, ya `app`/`components` folder ke
  andar kuch bhi — yeh sab website ka actual code hai, content nahi.
- `content/` folder ke andar file ka **naam** ya `.json` extension badalna.

---

## Changes site pe kab dikhenge?

JSON file edit karke save karne ke baad, site ko ek naya build/deploy
chahiye hota hai tabhi changes live dikhenge (kaise hosted hai uske hisaab
se — Vercel/Netlify jaisi services par yeh git push karte hi apne aap ho
jata hai). Agar pata nahi kaise deploy hota hai, developer se ek baar
poochh lena.
