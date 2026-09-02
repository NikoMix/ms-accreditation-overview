import { CatalogView } from '@/components/CatalogView';
import { Header } from '@/components/Header';
import { getCatalog, uniqueSpecializations, type Readiness } from '@/lib/catalog';

const READINESS_LABELS: Record<Readiness, string> = {
  ready: 'Ready',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export default function Home() {
  const { site, solutionAreas, frontierSpecialization } = getCatalog();
  // The Frontier specialization spans every area, so it is counted once here
  // instead of inside a solution area.
  const specializations = [
    frontierSpecialization,
    ...uniqueSpecializations(solutionAreas),
  ];
  const readyCount = specializations.filter(
    (specialization) => specialization.readiness === 'ready',
  ).length;
  const frontierCount = specializations.filter(
    (specialization) => specialization.frontierEligible,
  ).length;
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${site.lastUpdated}T00:00:00Z`));

  return (
    <div className="page">
      <Header
        brand={site.brand}
        repositoryUrl={site.repositoryUrl}
        solutionAreas={solutionAreas}
      />

      <main>
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orb hero-orb-one" aria-hidden="true" />
          <div className="hero-orb hero-orb-two" aria-hidden="true" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <h1>{site.title}</h1>
              <p>{site.subtitle}</p>
              <span className="updated-note">Updated {formattedDate}</span>
            </div>

            <div className="hero-summary" aria-label="Catalog summary">
              <div className="summary-card summary-card-primary">
                <span>Catalog coverage</span>
                <strong>{specializations.length}</strong>
                <small>specialization paths</small>
              </div>
              <div className="summary-card">
                <span>Ready now</span>
                <strong>{readyCount}</strong>
                <small>complete resource pairs</small>
              </div>
              <div className="summary-card">
                <span>Frontier eligible</span>
                <strong>{frontierCount}</strong>
                <small>Frontier prerequisites</small>
              </div>
            </div>
          </div>
        </section>

        <section className="readiness-legend" aria-label="Readiness key">
          <div className="shell legend-inner">
            <div className="legend-items">
              {(Object.keys(READINESS_LABELS) as Readiness[]).map(
                (readiness) => (
                  <div className="legend-item" key={readiness}>
                    <span
                      className={`legend-dot legend-${readiness}`}
                      aria-hidden="true"
                    />
                    <span>
                      <strong>{READINESS_LABELS[readiness]}</strong>
                      <small>
                        {readiness === 'ready'
                          ? 'Accelerator + Microhack'
                          : readiness === 'in-progress'
                            ? 'Companion content underway'
                            : 'Not yet partner-ready'}
                      </small>
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <CatalogView
          solutionAreas={solutionAreas}
          frontierSpecialization={frontierSpecialization}
          frontierSourceUrl={site.frontierSourceUrl}
          microhackAccessNote={site.microhackAccessNote}
        />
      </main>

      <footer className="footer">
        <div className="shell footer-inner">
          <div className="footer-brand">
            <span className="ms-logo" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              <strong>{site.brand}</strong>
              <small>{site.footerNote}</small>
            </span>
          </div>
          <div className="footer-links">
            <a href={site.catalogUrl} target="_blank" rel="noreferrer">
              Catalog YAML
            </a>
            <a href={site.repositoryUrl} target="_blank" rel="noreferrer">
              Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
