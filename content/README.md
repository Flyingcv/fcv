# Website content — edit guide (no coding needed)

Sabhi jagah dikhne wala content — destinations, packages, prices, reviews,
office/contact details — ab is `content/` folder ki JSON files mein hai.
Website ka code (`lib/`, `components/`, `app/`) alag hai aur usse chhedne
ki zaroorat nahi. Bas neeche di gayi files edit karo, save karo, aur site
apne aap update ho jayegi (agla deploy hone par).

**In short:** yeh saari files "fill in the blanks" jaisi hain. Sirf `"quotes"`
ke andar wali cheez badlo — structure (colons `:`, commas `,`, curly/square
brackets `{ } [ ]`) waisa hi rehne do.

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

**Naya package add karna ho to:** list mein ek naya `{ ... }` block copy-paste
karke uske fields badal do, aur uske pehle wale block ke end mein comma
lagana mat bhoolna (kyunki ab wo last nahi raha).

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
