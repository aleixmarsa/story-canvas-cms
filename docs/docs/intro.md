# Benvingut a StoryCanvas

**StoryCanvas** és un CMS capçalera (headless CMS) pensat per crear històries digitals riques i interactives. Està optimitzat per periodisme visual, storytelling corporatiu i projectes educatius, amb suport per seccions modulars, animacions i gràfiques.

---

## ✨ Característiques principals

- ✅ Editor de seccions modular
- ✍️ Contingut amb estats de *draft* i *publicat*
- 📊 Suport per gràfiques i imatges
- 🎞️ Animacions amb GSAP
- 🔐 Autenticació per rols
- ⚙️ API REST pública per accedir al contingut publicat

---

## 🚀 Com començar

1. **Accedeix al dashboard:**  
   Entra a `/admin/dashboard` amb les teves credencials.

2. **Crea una nova història:**  
   A la sidebar, prem `Nova història` i omple els camps bàsics.

3. **Afegeix seccions:**  
   Un cop creada, pots afegir seccions visuals: text, imatges, gràfiques, vídeos, etc.

4. **Previsualitza en temps real:**  
   Fes clic a "Preview" per veure com es veurà la història abans de publicar-la.

5. **Publica la història:**  
   Quan estigui llesta, publica-la perquè sigui visible a la part pública.

---

## 📚 Exemples de dades

```json
{
  "title": "L'escalfament global des de 1980",
  "sections": [
    {
      "type": "chart",
      "data": [
        { "year": 1980, "temperature": 24.1 },
        { "year": 1990, "temperature": 25.0 },
        { "year": 2000, "temperature": 26.3 }
      ]
    }
  ]
}
