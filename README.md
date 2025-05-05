# GitHunter

Hunt the git.

## Pre-requisites

- [Bun](https://bun.sh/docs/installation)

## Setting environment

1. Go to [trigger.dev](trigger.dev) to get the DEVELOPMENT secret key (this is personal) and put it into `TRIGGER_SECRET_KEY`. This should have a format like `tr_dev_....`.
2. Go to neon dashboard to get the DEVELOPMENT database url of your branch and put it into `DATABASE_URL`.
3. Go to github settings to get your `GITHUB_TOKEN`.
4. Replace all variables in a `.env` file.

## Development

1. Run web platform:

```bash
bun install
bun dev
```

2. Run background tasks:

```bash
bun x trigger.dev dev
```

3. Deploy triggers (on updates):

```bash
npx trigger.dev@latest deploy
```

## Important

All triggers must be declared inside of `src/triggers`.
