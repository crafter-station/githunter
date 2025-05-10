# GitHunter

Hunt the git.

## Pre-requisites

- [Bun](https://bun.sh/docs/installation)

## Setting environment

1. Go to [trigger.dev](trigger.dev) to get the DEVELOPMENT secret key (this is personal) and put it into `TRIGGER_SECRET_KEY`. This should have a format like `tr_dev_....`.
2. Go to neon dashboard to get the DEVELOPMENT database url of your branch and put it into `DATABASE_URL`.
3. Go to github settings to get your `GITHUB_TOKEN`.
4. Go to [Upstash Vector](https://upstash.com/docs/vector/overall/getstarted) to create a vector index for search functionality.
   - Add the following variables to your `.env`:
     - `UPSTASH_VECTOR_REST_URL`
     - `UPSTASH_VECTOR_REST_TOKEN`
5. Replace all variables in a `.env` file.

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

## User Search Indexing

The application uses Upstash Vector for fast, typo-tolerant search capabilities. To index all users in the database:

```bash
bun index-users
```

This script will:
1. Fetch all users from the database
2. Index both username and fullname for each user
3. Store relevant metadata for search results

For each user, two records are created in the vector database (one for username, one for fullname), making searching by either field efficient.

## Important

All triggers must be declared inside of `src/triggers`.
