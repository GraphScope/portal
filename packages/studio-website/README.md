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

## Add .env file for local dev

```bash
echo "COORDINATOR_URL= http://127.0.0.1:8080" >> .env
```

- cordinator url is the address of graphscope engine

### run portal website

```bash
cd packages/studio-website
npm run start
```
