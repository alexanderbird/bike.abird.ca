# bike.abird.ca

## Architecture

### Build

When you run `npm run build`, the following happens:

- The `./www` directory is recreated (empty)
- All files in `./static` are copied verbatim to `./www`
- The `./build.js` script is executed, which compiles `./src` to some HTML pages
  in `./www`

### Deployment

When the `main` branch is pushed to GitHub, it triggers a Netlify build
according to the configuration in `./netlify.toml`. Netlify runs `npm run build`
and then publishes the contents of `./www` to a static website at a
`.netlify.app` domain. Independently, there is an AWS Route53 CNAME record
pointing bike.abird.ca to the Netlify domain behind which the static site is
served.
