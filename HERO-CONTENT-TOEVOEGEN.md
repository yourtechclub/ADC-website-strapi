# Hero Content Toevoegen

## ⚡ Snelste Methode: Via Strapi Admin (Aanbevolen)

1. **Start Strapi**:
   ```bash
   cd strapi-react-router-7-starter/server
   npm run develop
   ```

2. **Open Strapi Admin**: http://localhost:1337/admin

3. **Navigeer naar Landing Page**:
   - Ga naar **Content Manager** (links in menu)
   - Klik op **Single Types**
   - Klik op **Landing Page**

4. **Voeg Hero Block toe**:
   - Scroll naar beneden naar **Blocks** sectie
   - Klik **Add a component to blocks**
   - Selecteer **Hero**

5. **Vul de gegevens in**:
   - **Heading**: `Leading the most impactful AI transformation`
   - **Subtitle**: Laat leeg
   - **Show Menu Items In Hero**: ✅ **Aanvinken!** (dit is belangrijk)
   - **CTA Buttons**: Klik "Add an entry"
     - **Label**: `Learn more`
     - **Href**: `/contact`
     - **Type**: Selecteer `PRIMARY`
     - **Is Button Link**: ✅ Aanvinken
     - **Is External**: Laat uit
   - **Background Image**: Laat voorlopig leeg (optioneel later)

6. **Opslaan en Publiceren**:
   - Klik rechtsboven op **Save**
   - Klik dan op **Publish**

7. **Start Frontend** (nieuwe terminal):
   ```bash
   cd strapi-react-router-7-starter/client
   npm run dev
   ```

8. **Bekijk resultaat**: http://localhost:5174

---

## 🤖 Automatische Methode: Via API Script

Als je alles automatisch wilt toevoegen:

### Terminal 1 - Start Strapi:
```bash
cd strapi-react-router-7-starter/server
npm run develop
```

Wacht tot je ziet: ✅ `Strapi started successfully`

### Terminal 2 - Run Script:
```bash
cd strapi-react-router-7-starter
node add-hero-content.mjs
```

Het script voegt automatisch de hero content toe!

---

## 📋 Verwacht Resultaat

### Desktop
- ✅ Navbar toont **alleen het logo** (geen menu items rechtsboven)
- ✅ Hero sectie toont:
  - Grote heading: "Leading the most impactful AI transformation" (96px)
  - Menu items **onder de heading** als pills:
    - Industries | Services | Cases | News | Careers | Contact

### Mobile  
- ✅ Hamburger menu met volledige navigatie in sidebar
- ✅ Hero sectie toont:
  - Heading (responsive, kleiner)
  - "Learn more" button (zwart, prominent)

---

## 🛠 Troubleshooting

### Port al in gebruik?
```bash
# Kill Strapi
lsof -ti:1337 | xargs kill -9

# Kill Vite  
lsof -ti:5174 | xargs kill -9
```

### Script geeft "fetch failed"?
- Gebruik de **handmatige methode via Strapi Admin** (makkelijker!)
- Of controleer of Strapi draait: `curl http://localhost:1337/api/landing-page`

### Menu items verschijnen niet onder hero?
- Controleer of **Show Menu Items In Hero** is **aangevinkt** in Strapi
- Klik **Save** en **Publish** opnieuw

---

## 📸 Screenshots Locaties

Als je screenshots nodig hebt:
- Desktop Figma: Node `26528:7179`
- Mobile Figma: Node `26528:7928`
- Figma File: `gZY1nFxYgtLNHedrsGbhjQ`
