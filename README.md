# RendezVous UI - Frontend React/Next.js

Interface utilisateur moderne pour un système de planification de rendez-vous type Calendly, construite avec Next.js 14, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

### ✅ Authentification

-   Connexion et inscription utilisateur
-   Gestion des sessions avec Zustand
-   Protection des routes privées

### 📅 Gestion des événements

-   Création et modification d'événements
-   Paramétrage des durées et disponibilités
-   Activation/désactivation des événements

### ⏰ Système de réservation

-   Interface publique de réservation
-   Sélection de créneaux disponibles
-   Formulaire de réservation client
-   Confirmations par email

### 📊 Dashboard administrateur

-   Statistiques en temps réel
-   Gestion des réservations
-   Calendrier des rendez-vous
-   Configuration des disponibilités

## 🛠️ Technologies utilisées

-   **Framework**: Next.js 14 (App Router)
-   **Langage**: TypeScript
-   **Styling**: Tailwind CSS
-   **Gestion d'état**: Zustand
-   **Formulaires**: React Hook Form + Zod
-   **HTTP Client**: Axios
-   **Calendrier**: React Calendar + FullCalendar
-   **Notifications**: Sonner
-   **Icons**: Lucide React

## 📦 Installation

### Prérequis

-   Node.js 18+
-   npm ou yarn
-   Backend Laravel API fonctionnel

### Étapes d'installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd rendezvous-ui
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
```

3. **Configuration de l'environnement**

```bash
cp .env.example .env.local
```

Modifier les variables dans `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=RendezVous
NEXT_PUBLIC_COMPANY_NAME=VotreEntreprise
```

4. **Démarrer le serveur de développement**

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à `http://localhost:3000`

## 📁 Structure du projet

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Interface administrateur
│   ├── booking/           # Pages de réservation publique
│   └── layout.tsx         # Layout principal
├── components/
│   ├── ui/                # Composants UI réutilisables
│   ├── forms/             # Formulaires spécialisés
│   ├── calendar/          # Composants calendrier
│   └── layout/            # Composants de mise en page
├── services/              # Services API
├── stores/                # Stores Zustand
├── types/                 # Définitions TypeScript
├── lib/                   # Utilitaires et configuration
└── utils/                 # Fonctions utilitaires
```

## 🔗 API Backend

Ce frontend est conçu pour fonctionner avec l'API Laravel `rendezvous-api`.

### Endpoints utilisés

-   `POST /api/auth/login` - Connexion
-   `POST /api/auth/register` - Inscription
-   `GET /api/events` - Liste des événements
-   `POST /api/events` - Créer un événement
-   `GET /api/bookings` - Liste des réservations
-   `POST /api/events/{id}/book` - Créer une réservation
-   `GET /api/availability/{user}/{date}` - Créneaux disponibles

## 🎨 Customisation

### Thème et couleurs

Les couleurs sont définies dans `tailwind.config.js` et peuvent être modifiées:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... autres nuances
    900: '#1e3a8a',
  },
}
```

### Composants UI

Tous les composants sont dans `src/components/ui/` et peuvent être customisés selon vos besoins.

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
# Déployer le dossier .next
```

### Build statique

```bash
npm run build
npm start
```

## 📱 Responsive Design

L'interface est entièrement responsive et optimisée pour:

-   📱 Mobile (320px+)
-   📱 Tablet (768px+)
-   💻 Desktop (1024px+)
-   🖥️ Large screens (1280px+)

## ⚡ Performance

-   **Bundle optimisé** avec Next.js
-   **Images optimisées** avec next/image
-   **Code splitting** automatique
-   **Cache** des requêtes API avec SWR
-   **Lazy loading** des composants

## 🔧 Scripts disponibles

```bash
npm run dev          # Démarrer en développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint
npm run type-check   # Vérification TypeScript
```

## 🧪 Tests

Pour ajouter des tests:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## 📝 Variables d'environnement

| Variable                   | Description          | Défaut                  |
| -------------------------- | -------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`      | URL de l'API backend | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_URL`      | URL de l'application | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME`     | Nom de l'application | `RendezVous`            |
| `NEXT_PUBLIC_COMPANY_NAME` | Nom de l'entreprise  | `VotreEntreprise`       |

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

-   **Documentation**: [Next.js Docs](https://nextjs.org/docs)
-   **Issues**: Ouvrir un issue sur GitHub
-   **Discussions**: Utiliser les discussions GitHub

---

Développé avec ❤️ par [Votre Nom]
