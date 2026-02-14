# Stripe Payment Integration - Setup Guide

## 📦 Installation des Dépendances

Exécute cette commande pour installer les packages Stripe :

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

**Packages installés :**
- `stripe` : SDK Stripe côté serveur (backend)
- `@stripe/stripe-js` : SDK Stripe côté client (frontend)
- `@stripe/react-stripe-js` : Composants React pour Stripe Elements

---

## 🔑 Configuration des Variables d'Environnement

### 1. Créer un fichier `.env.local` à la racine du projet

```env
# Stripe Secret Key (Backend - Ne JAMAIS exposer publiquement)
STRIPE_SECRET_KEY=sk_test_...

# Stripe Publishable Key (Frontend - Peut être exposé)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Obtenir les clés Stripe

1. Va sur [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Active le **mode Test** (toggle en haut à droite)
3. Copie :
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## 🚀 Déploiement sur Vercel

### Ajouter les variables d'environnement :

1. Va dans **Settings → Environment Variables**
2. Ajoute les 2 clés :
   - `STRIPE_SECRET_KEY` (Secret)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Public)

---

## 🧪 Test du Paiement

### Cartes de test Stripe :

| Carte                     | Numéro              | Résultat         |
|---------------------------|---------------------|------------------|
| Visa (succès)             | 4242 4242 4242 4242 | ✅ Paiement réussi |
| Visa (refusée)            | 4000 0000 0000 0002 | ❌ Carte refusée   |
| Visa (3D Secure)          | 4000 0027 6000 3184 | 🔐 Authentification |

**Autres infos :**
- **Date d'expiration** : N'importe quelle date future (ex: 12/25)
- **CVC** : N'importe quel 3 chiffres (ex: 123)
- **Code postal** : N'importe quel code (ex: 75001)

---

## 📁 Fichiers Créés

### Backend
- `src/app/api/create-payment-intent/route.ts` : Crée le PaymentIntent Stripe

### Frontend
- `src/components/CheckoutForm.tsx` : Formulaire de paiement avec Payment Element
- `src/app/checkout/page.tsx` : Page de checkout complète

---

## 🎨 Design Appliqué

- ✅ **iOS Premium Style** : rounded-2xl, shadow-xl, gradient buttons
- ✅ **Stripe Payment Element** : Customisé avec variables CSS (purple theme)
- ✅ **Automatic Payment Methods** : Carte, Apple Pay, Google Pay activés
- ✅ **Loading States** : Spinner pendant le traitement
- ✅ **Error Handling** : Messages d'erreur clairs
- ✅ **Success State** : Confirmation visuelle après paiement

---

## 🔒 Sécurité

- ✅ **PCI Compliance** : Stripe gère les données de carte (pas stockées sur ton serveur)
- ✅ **SSL Required** : HTTPS obligatoire en production
- ✅ **Server-side validation** : Montant vérifié côté backend
- ✅ **Client Secret** : Généré dynamiquement pour chaque transaction

---

## 📊 Workflow de Paiement

1. **User clique "Payer"** sur ProductPage
2. **Redirection** vers `/checkout`
3. **Frontend** appelle `/api/create-payment-intent` avec le montant
4. **Backend** crée un PaymentIntent Stripe et retourne le `clientSecret`
5. **Frontend** affiche le Payment Element avec le `clientSecret`
6. **User remplit** ses infos de carte
7. **Stripe** traite le paiement de manière sécurisée
8. **Confirmation** : Success ou Error affiché à l'utilisateur

---

## 🛠️ Personnalisation

### Modifier le montant :
Dans `src/app/checkout/page.tsx`, ligne 18 :
```typescript
const orderData = {
  amount: 2999, // 29.99 EUR en centimes
  currency: "eur",
  product: "Instagram Followers - Pack 1000",
  quantity: 1000,
};
```

### Modifier l'apparence Stripe :
Dans `src/app/checkout/page.tsx`, ligne 65 :
```typescript
const appearance = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#9333ea", // Change la couleur principale
    borderRadius: "12px",    // Change l'arrondi
  },
};
```

---

## 📞 Support

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Payment Element Guide](https://stripe.com/docs/payments/payment-element)
