# api-sandbox-MoMo

Ce projet est un bac à sable (sandbox) pour tester l'intégration de l'API MTN Mobile Money (MoMo). Il permet d'initier des demandes de paiement et de vérifier leur statut.

## Fonctionnalités

- **Obtention de token** : Récupération automatique du jeton d'accès via les identifiants MoMo Developer.
- **Demande de paiement (Debit)** : Envoi d'une requête `requesttopay` à l'API sandbox de MTN.
- **Vérification de statut** : Consultation de l'état d'une transaction via son `referenceId`.

## Prérequis

- Node.js (v14+)
- Un compte sur le portail [MTN MoMo Developer](https://momodeveloper.mtn.com/)
- Un fichier `.env` configuré avec vos accès sandbox.

## Installation

1. Clonez le dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` à la racine avec les variables suivantes :
   ```env
   PORT=3000
   MOMO_API_USER=votre_api_user
   MOMO_API_KEY=votre_api_key
   MOMO_SUBSCRIPTION_KEY=votre_subscription_key
   MOMO_ENV=sandbox
   ```

## Lancement

```bash
npm start
```

## Endpoints API

### 1. Initier un débit
- **URL** : `POST /debit`
- **Description** : Initie une demande de paiement de 1000 EUR (montant statique pour test).
- **Réponse** : Retourne l'objet de statut de la transaction.

### 2. Vérifier l'état d'un paiement
- **URL** : `GET /verifEtat/:referenceId`
- **Description** : Récupère les détails et le statut d'une transaction existante.
