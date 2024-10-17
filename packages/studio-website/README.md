## GraphScope Portal

## Development

### Perpare

- install node.js : https://nodejs.org/en
- install pnpm : https://pnpm.io/installation#using-npm `npm install -g pnpm`

### install dependencies

```bash
pnpm install
```

- build all sub packages

```bash
npm run build

```

### run portal website

```bash
# goto website dir
cd packages/studio-website

# Add .env file for local dev
# cordinator url is the address of graphscope engine
echo "COORDINATOR_URL= http://127.0.0.1:8080" >> .env

# run website
npm run start
```
