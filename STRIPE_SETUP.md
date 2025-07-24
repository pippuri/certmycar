# Stripe Products Database Setup

This guide explains how to set up the Stripe products database table for multi-language pricing in the Tesla Battery Certificate platform.

## Overview

The system uses a hybrid approach:

- **Database**: Stores Stripe Product IDs, Price IDs, and localized product names/descriptions
- **Stripe API**: Fetches actual pricing information (amount, currency) from Stripe
- **Checkout**: Uses Stripe Price IDs directly in checkout sessions

This approach ensures:

- ✅ Single source of truth for pricing (Stripe)
- ✅ Multi-language product names and descriptions
- ✅ Easy price updates through Stripe Dashboard
- ✅ No data duplication or sync issues

## Database Schema

The `stripe_products` table stores:

| Column        | Type    | Description                            |
| ------------- | ------- | -------------------------------------- |
| `id`          | UUID    | Primary key                            |
| `product_id`  | TEXT    | Stripe Product ID                      |
| `name`        | TEXT    | Product name in the locale             |
| `description` | TEXT    | Product description in the locale      |
| `locale`      | TEXT    | Language code (en, es, de, etc.)       |
| `price_id`    | TEXT    | **Stripe Price ID** (used in checkout) |
| `active`      | BOOLEAN | Whether this product/price is active   |

**Key Points:**

- No `unit_amount` or `currency` fields (these come from Stripe API)
- `price_id` is the critical field used in checkout sessions
- Unique constraint on `(product_id, locale)` allows same product in multiple languages

## Setup Steps

### 1. Create Database Table

Run the SQL script in your Supabase SQL Editor:

```sql
-- Run setup-stripe-products.sql in Supabase SQL Editor
```

### 2. Create Products in Stripe Dashboard

For each locale, create a product in your Stripe Dashboard:

1. Go to **Products** → **Add product**
2. Set **Name**: "Tesla Battery Certificate" (in the locale language)
3. Set **Description**: "Official PDF certificate with QR verification" (in the locale language)
4. Set **Price**:
   - **Amount**: 999 (for $9.99 USD)
   - **Currency**: USD (or appropriate currency for locale)
5. Click **Add product**

**Important**: Copy the **Product ID** and **Price ID** from the created product.

### 3. Update Database with Real Stripe IDs

Replace the placeholder data with your actual Stripe IDs:

```sql
-- Example: Update English product with real Stripe IDs
UPDATE public.stripe_products
SET
  product_id = 'prod_1234567890abcdef',  -- Your actual Stripe Product ID
  price_id = 'price_1234567890abcdef'    -- Your actual Stripe Price ID
WHERE locale = 'en';

-- Repeat for other locales...
```

### 4. Create Products for All Locales

Create separate products in Stripe for each locale with appropriate pricing:

| Locale | Currency | Amount | Example Price ID       |
| ------ | -------- | ------ | ---------------------- |
| en     | USD      | 999    | price_1234567890abcdef |
| es     | EUR      | 949    | price_abcdef1234567890 |
| de     | EUR      | 949    | price_9876543210fedcba |
| fi     | EUR      | 949    | price_fedcba0987654321 |
| sv     | SEK      | 10900  | price_1111111111111111 |
| no     | NOK      | 10900  | price_2222222222222222 |
| da     | DKK      | 6900   | price_3333333333333333 |

## API Endpoints

### Get Product and Pricing

```
GET /api/stripe-products?locale=en
```

**Response:**

```json
{
  "product": {
    "id": "uuid",
    "product_id": "prod_1234567890abcdef",
    "name": "Tesla Battery Certificate",
    "description": "Official PDF certificate...",
    "locale": "en",
    "price_id": "price_1234567890abcdef",
    "active": true
  },
  "pricing": {
    "price": 999,
    "currency": "usd",
    "formattedPrice": "$9.99",
    "productName": "Tesla Battery Certificate",
    "description": "Official PDF certificate...",
    "priceId": "price_1234567890abcdef"
  }
}
```

## Code Usage

### Server-Side (API Routes)

```typescript
import { getPricingForLocale } from "@/lib/stripe-products";

// Get pricing for locale
const pricing = await getPricingForLocale("en");
if (pricing) {
  console.log(`Price: ${pricing.formattedPrice}`);
  console.log(`Stripe Price ID: ${pricing.priceId}`);
}
```

### Client-Side (Components)

```typescript
import { getPricingForLocale } from "@/lib/stripe-products-client";

// Get pricing for locale
const pricing = await getPricingForLocale("en");
if (pricing) {
  console.log(`Price: ${pricing.formattedPrice}`);
}
```

### Checkout Integration

```typescript
// Create checkout session using Price ID
const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price: pricing.priceId, // Use Stripe Price ID directly
      quantity: 1,
    },
  ],
  mode: "payment",
  // ... other options
});
```

## Management

### Adding New Locales

1. Create product in Stripe Dashboard
2. Insert record in database:

```sql
INSERT INTO public.stripe_products (product_id, name, description, locale, price_id)
VALUES (
  'prod_new_locale_id',
  'Product Name in New Language',
  'Description in new language',
  'new_locale',
  'price_new_locale_id'
);
```

### Updating Prices

**Do NOT update prices in the database.** Instead:

1. Go to Stripe Dashboard → Products
2. Find your product
3. Click "Edit" on the price
4. Update the amount
5. Save changes

The system will automatically fetch the new price from Stripe API.

### Deactivating Products

```sql
-- Deactivate a product
UPDATE public.stripe_products
SET active = false
WHERE locale = 'en';
```

## Benefits

✅ **Single Source of Truth**: All pricing managed in Stripe Dashboard
✅ **No Sync Issues**: No duplicate pricing data to keep in sync
✅ **Easy Updates**: Change prices without code deployments
✅ **Multi-Currency**: Support for different currencies per locale
✅ **Stripe Integration**: Leverages Stripe's built-in pricing features
✅ **Audit Trail**: Stripe maintains pricing history

## Troubleshooting

### "Pricing not available" Error

1. Check if product exists in database for the locale
2. Verify the `price_id` is correct
3. Ensure the Stripe Price is active in Stripe Dashboard
4. Check Stripe API key permissions

### "Invalid price data" Error

1. Verify the `price_id` exists in Stripe
2. Check if the price has `unit_amount` and `currency` set
3. Ensure the price is not archived in Stripe

### Price Not Updating

1. Clear any caching in your application
2. Verify the price was updated in Stripe Dashboard
3. Check that you're using the correct `price_id`

## Security

- Database only stores public Product IDs and Price IDs
- No sensitive pricing data stored locally
- All pricing validation happens through Stripe API
- Row Level Security (RLS) enabled on the table
