#!/usr/bin/env node

/**
 * GraphScope Sandbox API Key Generator
 *
 * Usage:
 * node scripts/generate-api-key.cjs
 * node scripts/generate-api-key.cjs --count 3
 * node scripts/generate-api-key.cjs --prefix custom_prefix
 */

const crypto = require("crypto");

function generateApiKey(prefix = "ai-spider") {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix + "_";

  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function main() {
  const args = process.argv.slice(2);

  let count = 1;
  let prefix = "ai-spider";

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--count" && i + 1 < args.length) {
      count = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === "--prefix" && i + 1 < args.length) {
      prefix = args[i + 1];
      i++;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
GraphScope Sandbox API Key Generator

Usage:
  node scripts/generate-api-key.cjs [options]

Options:
  --count <number>    Number of API Keys to generate (default: 1)
  --prefix <string>   API Key prefix (default: ai-spider)
  --help, -h          Show help

Examples:
  node scripts/generate-api-key.cjs
  node scripts/generate-api-key.cjs --count 3
  node scripts/generate-api-key.cjs --prefix my_app
      `);
      return;
    }
  }

  console.log("🔑 GraphScope Sandbox API Key Generator\n");

  if (count === 1) {
    const apiKey = generateApiKey(prefix);
    console.log(`Generated API Key: ${apiKey}`);
    console.log("\n💡 Usage:");
    console.log(`export SANDBOX_API_KEY="${apiKey}"`);
    console.log(`Or add to your .env file:`);
    console.log(`SANDBOX_API_KEY=${apiKey}`);
  } else {
    const apiKeys = [];
    for (let i = 0; i < count; i++) {
      apiKeys.push(generateApiKey(prefix));
    }

    console.log(`Generated ${count} API Keys:`);
    apiKeys.forEach((key, index) => {
      console.log(`${index + 1}. ${key}`);
    });

    console.log("\n💡 Usage:");
    console.log("Method 1 - Use a single key (pick one):");
    console.log(`export SANDBOX_API_KEY="${apiKeys[0]}"`);

    console.log("\nMethod 2 - Use all keys together:");
    console.log(`export SANDBOX_API_KEYS="${apiKeys.join(",")}"`);

    console.log("\nOr add to your .env file:");
    console.log(`SANDBOX_API_KEYS=${apiKeys.join(",")}`);
  }

  console.log("\n⚠️  Security Tips:");
  console.log("- Keep your API Keys safe");
  console.log("- Do not hardcode API Keys in your code");
  console.log("- Rotate API Keys regularly");
  console.log("- Use different API Keys for different environments");
}

if (require.main === module) {
  main();
}

module.exports = { generateApiKey };
