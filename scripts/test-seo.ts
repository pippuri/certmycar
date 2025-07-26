#!/usr/bin/env node

/**
 * SEO Test Script for Multilingual Site
 * Tests hreflang tags, sitemap, and metadata
 */

import { locales } from "../src/i18n";

const BASE_URL = "https://batterycert.com";

async function testSEO() {
  console.log("🔍 Testing SEO Implementation for Multilingual Site\n");

  // Test 1: Check sitemap generation
  console.log("1. Testing Sitemap Generation...");
  try {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    if (response.ok) {
      const sitemap = await response.text();
      const urlCount = (sitemap.match(/<url>/g) || []).length;
      console.log(`   ✅ Sitemap accessible: ${urlCount} URLs found`);

      // Check if all locales are included
      const missingLocales = locales.filter(
        (locale) => !sitemap.includes(`${BASE_URL}/${locale}`)
      );

      if (missingLocales.length === 0) {
        console.log("   ✅ All locales included in sitemap");
      } else {
        console.log(`   ❌ Missing locales: ${missingLocales.join(", ")}`);
      }
    } else {
      console.log("   ❌ Sitemap not accessible");
    }
  } catch (error) {
    console.log("   ❌ Error testing sitemap:", error);
  }

  // Test 2: Check robots.txt
  console.log("\n2. Testing Robots.txt...");
  try {
    const response = await fetch(`${BASE_URL}/robots.txt`);
    if (response.ok) {
      const robots = await response.text();
      if (robots.includes("sitemap.xml")) {
        console.log("   ✅ Robots.txt includes sitemap reference");
      } else {
        console.log("   ❌ Robots.txt missing sitemap reference");
      }
    } else {
      console.log("   ❌ Robots.txt not accessible");
    }
  } catch (error) {
    console.log("   ❌ Error testing robots.txt:", error);
  }

  // Test 3: Check hreflang tags for a few locales
  console.log("\n3. Testing Hreflang Tags...");
  const testLocales = ["en-US", "de-DE", "fr-FR", "es-ES"];

  for (const locale of testLocales) {
    try {
      const response = await fetch(`${BASE_URL}/${locale}`);
      if (response.ok) {
        const html = await response.text();
        const hreflangCount = (html.match(/hreflang=/g) || []).length;

        if (hreflangCount >= locales.length) {
          console.log(
            `   ✅ ${locale}: Hreflang tags present (${hreflangCount})`
          );
        } else {
          console.log(
            `   ⚠️  ${locale}: Limited hreflang tags (${hreflangCount}/${locales.length})`
          );
        }
      } else {
        console.log(`   ❌ ${locale}: Page not accessible`);
      }
    } catch (error) {
      console.log(`   ❌ ${locale}: Error testing page`);
    }
  }

  // Test 4: Check meta descriptions
  console.log("\n4. Testing Meta Descriptions...");
  for (const locale of testLocales) {
    try {
      const response = await fetch(`${BASE_URL}/${locale}`);
      if (response.ok) {
        const html = await response.text();
        const hasMetaDesc = html.includes('name="description"');
        const hasOGDesc = html.includes('property="og:description"');

        if (hasMetaDesc && hasOGDesc) {
          console.log(`   ✅ ${locale}: Meta descriptions present`);
        } else {
          console.log(`   ❌ ${locale}: Missing meta descriptions`);
        }
      }
    } catch (error) {
      console.log(`   ❌ ${locale}: Error testing meta descriptions`);
    }
  }

  console.log("\n📊 SEO Test Summary:");
  console.log(`   • Total supported locales: ${locales.length}`);
  console.log(`   • Tested locales: ${testLocales.join(", ")}`);
  console.log("\n🎯 Next Steps:");
  console.log("   1. Submit sitemap to Google Search Console");
  console.log("   2. Monitor indexing in Search Console");
  console.log("   3. Track performance by language in Analytics");
  console.log("   4. Set up language-specific keyword tracking");
}

// Run the test
testSEO().catch(console.error);
