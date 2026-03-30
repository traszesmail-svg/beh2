# PDF Guides Content

This folder stores the integrated PDF guide catalog used by `beh2`.

Keep these files out of `public/`. The site currently uses guide and bundle pages plus contact CTAs, not open public downloads for every PDF.

Layout:

- `site/guides-site-data.json`: runtime data loaded by `lib/pdf-guides.ts`
- `site/guides-routes.json`: generated route manifest
- `pdf/*.pdf`: internal PDF assets copied from the generator
- `covers/*.svg`: generated cover files
- source markdown folders and `index/guides-index.json`: kept so relative paths inside the generated data stay valid

Refresh flow:

1. Update or regenerate the source module in `C:\Projekt\pdf`.
2. Copy `C:\Projekt\pdf\content\guides\` into `beh2\content\guides\`.
3. Run the repo validation commands before deploy.
