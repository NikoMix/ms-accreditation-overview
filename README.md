# Microsoft Specialization Readiness

A partner-ready, single-page dashboard for Microsoft specialization
accelerators and Microhacks. The catalog is grouped by Microsoft solution area,
uses clear readiness indicators, and highlights specializations that contribute
to the Frontier Partner specialization path.

All catalog content is maintained in
[`data/specializations.yaml`](data/specializations.yaml). The application reads
and validates that file at build time, then produces a fully static site in
`out/`.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Maintain the catalog

Edit `data/specializations.yaml`; no component change is needed for routine
catalog updates.

```yaml
solutionAreas:
  - id: "cloud-ai-platform"
    name: "Cloud & AI Platforms"
    description: "Short description shown above the table."
    icon: "cloud"
    specializations:
      - id: "ai-apps"
        title: "AI Apps on Microsoft Azure"
        readiness: "ready"
        frontierEligible: true
        frontierRequirement: "Why this path counts toward Frontier."
        accelerator: "https://github.com/owner/accelerator"
        microhack: "https://github.com/owner/microhack"
```

Solution areas and their specializations mirror the tabs on the
[Microsoft specialization page](https://partner.microsoft.com/en-us/partnership/specialization),
including every solution path behind each tab.

### Shared specializations

Microsoft lists some specializations under more than one solution area. Repeat
the entry in each area it belongs to, using the same `id` and identical values
throughout. The build fails when two copies of the same `id` disagree.

### Readiness values

| Value | Indicator | Use when |
| --- | --- | --- |
| `ready` | Green | Both the accelerator and Microhack are published. |
| `in-progress` | Yellow | The accelerator is published but companion content is still underway. |
| `planned` | Red | The resource is not yet ready for partner use. |

The build enforces these rules. A `ready` entry must contain both links, and any
entry beyond `planned` must contain an accelerator.

Readiness describes content completeness, not repository visibility. The
current Microhack repositories require authorized GitHub access, which is also
called out in the catalog UI.

### Frontier badge

Set `frontierEligible: true` only when the specialization counts toward a
published Frontier Partner specialization prerequisite. Add
`frontierRequirement` to explain the path. The current catalog marks
**Microsoft 365 Copilot**, **Data Security**, and **Identity and Access
Management**, plus **AI Apps on Microsoft Azure** and **AI Platform on
Microsoft Azure** as the two alternatives for the fourth prerequisite.

Frontier program criteria are evolving. Confirm changes against
[Microsoft guidance](https://partner.microsoft.com/en-us/blog/article/engineering-frontier-partner-practice)
before updating the badge.

### Supported solution-area icons

`cloud`, `shield`, and `sparkle`

## Quality checks

```bash
npm run validate
npm run lint
npm run test
npm run typecheck
npm run build
```

`npm run build` creates a static export in `out/`.

## Deploy to GitHub Pages

The repository includes
[`deploy-pages.yml`](.github/workflows/deploy-pages.yml), which validates,
builds, and publishes the static export whenever `main` changes.

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually.

The build automatically applies the repository base path required by GitHub
Pages project sites.

## Project structure

```text
app/                         Page, metadata, and Fluent-inspired styling
components/                  Header, theme control, icons, and catalog view
data/specializations.yaml    Maintainer-owned catalog
lib/catalog.ts               YAML schema, validation, and loader
scripts/validate-catalog.ts  Standalone catalog validation
.github/workflows/           Pull-request quality gate and Pages deployment
```
