import { CatalogView } from '@/components/CatalogView';
import { Header } from '@/components/Header';
import { Icon } from '@/components/Icon';
import { getCatalog, type Readiness } from '@/lib/catalog';

const READINESS_LABELS: Record<Readiness, string> = {
  ready: 'Ready',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export default function Home() {
  const { site, solutionAreas } = getCatalog();
  const specializations = solutionAreas.flatMap(
    (area) => area.specializations,
  );
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
              <span className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                {site.eyebrow}
              </span>
              <h1>{site.title}</h1>
              <p>{site.subtitle}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#catalog">
                  Explore the catalog
                  <Icon name="arrow" />
                </a>
                <a
                  className="button button-secondary"
                  href={site.catalogUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Edit the YAML
                  <Icon name="external" />
                </a>
              </div>
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
                <small>Foundry-aligned options</small>
              </div>
            </div>
          </div>
        </section>

        <section className="readiness-legend" aria-labelledby="legend-title">
          <div className="shell legend-inner">
            <div>
              <span className="section-kicker">At a glance</span>
              <h2 id="legend-title">Readiness key</h2>
            </div>
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
