This project uses Changesets to manage version releases. The release process is as follows:

1. Complete the relevant development work.
2. Create a branch from `main` (name it as you like).
3. Run `pnpm changeset` and follow the prompts to provide the required information.
4. Run `pnpm run version` to generate the version number.
5. Open a pull request on GitHub to merge your branch into `main`, and add the `publish` tag.
6. Once the branch is merged, GitHub Actions will automatically trigger and publish the package to npm.
