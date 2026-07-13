'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import type {
  AreaIcon,
  Readiness,
  SolutionArea,
  Specialization,
} from '@/lib/catalog';
import { Icon } from './Icon';

type ReadinessFilter = 'all' | Readiness;
type AreaStyle = CSSProperties & {
  '--area-accent': string;
  '--area-soft': string;
};

const READINESS: Record<
  Readiness,
  { label: string; description: string }
> = {
  ready: {
    label: 'Ready',
    description: 'Accelerator and Microhack published',
  },
  'in-progress': {
    label: 'In progress',
    description: 'Accelerator published; companion content is in progress',
  },
  planned: {
    label: 'Planned',
    description: 'Not yet ready for partner use',
  },
};

const AREA_COLORS: Record<AreaIcon, { accent: string; soft: string }> = {
  cloud: { accent: '#0078d4', soft: 'rgba(0, 120, 212, 0.1)' },
  shield: { accent: '#5c2d91', soft: 'rgba(92, 45, 145, 0.1)' },
  sparkle: { accent: '#008272', soft: 'rgba(0, 130, 114, 0.1)' },
};

function ReadinessIndicator({ readiness }: { readiness: Readiness }) {
  return (
    <span className={`readiness readiness-${readiness}`}>
      <span className="readiness-dot" aria-hidden="true" />
      {READINESS[readiness].label}
    </span>
  );
}

function ResourceLink({
  href,
  label,
  specialization,
}: {
  href: string | null;
  label: string;
  specialization: string;
}) {
  if (!href) {
    return <span className="not-available">Not available</span>;
  }

  return (
    <a
      className="resource-link"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label} for ${specialization}`}
    >
      <Icon name="github" />
      <span>{label}</span>
      <Icon name="external" className="external-icon" />
    </a>
  );
}

function SpecializationRow({
  specialization,
}: {
  specialization: Specialization;
}) {
  return (
    <tr>
      <td data-label="Readiness">
        <ReadinessIndicator readiness={specialization.readiness} />
      </td>
      <td className="specialization-cell" data-label="Specialization">
        <div className="specialization-title">
          <span>{specialization.title}</span>
          {specialization.frontierEligible ? (
            <span
              className="frontier-badge"
              title={specialization.frontierRequirement ?? undefined}
              aria-label={`Frontier path: ${specialization.frontierRequirement}`}
            >
              <Icon name="frontier" />
              Frontier eligible
            </span>
          ) : null}
        </div>
      </td>
      <td data-label="Accelerator">
        <ResourceLink
          href={specialization.accelerator}
          label="Open accelerator"
          specialization={specialization.title}
        />
      </td>
      <td data-label="Microhack">
        <ResourceLink
          href={specialization.microhack}
          label="Open Microhack"
          specialization={specialization.title}
        />
      </td>
    </tr>
  );
}

function AreaSection({
  area,
  total,
  filtersActive,
}: {
  area: SolutionArea;
  total: number;
  filtersActive: boolean;
}) {
  const colors = AREA_COLORS[area.icon];
  const style: AreaStyle = {
    '--area-accent': colors.accent,
    '--area-soft': colors.soft,
  };

  return (
    <section className="area-section" id={area.id} style={style}>
      <div className="area-heading">
        <span className="area-icon" aria-hidden="true">
          <Icon name={area.icon} />
        </span>
        <div>
          <div className="area-title-line">
            <h2>{area.name}</h2>
            <span className="area-count">
              {filtersActive ? `${area.specializations.length} of ${total}` : total}
            </span>
          </div>
          <p>{area.description}</p>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-area">
          <span className="empty-area-icon" aria-hidden="true">
            <Icon name={area.icon} />
          </span>
          <div>
            <h3>Ready for the next accelerator</h3>
            <p>No resources are cataloged for this solution area yet.</p>
          </div>
        </div>
      ) : area.specializations.length === 0 ? (
        <div className="empty-area compact">
          <div>
            <h3>No matching specializations</h3>
            <p>Adjust the search or filters to bring this area back into view.</p>
          </div>
        </div>
      ) : (
        <div className="table-frame">
          <table>
            <caption className="sr-only">
              {area.name} specialization readiness and resources
            </caption>
            <thead>
              <tr>
                <th scope="col">Readiness</th>
                <th scope="col">Specialization</th>
                <th scope="col">Accelerator</th>
                <th scope="col">Microhack</th>
              </tr>
            </thead>
            <tbody>
              {area.specializations.map((specialization) => (
                <SpecializationRow
                  key={specialization.id}
                  specialization={specialization}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function CatalogView({
  solutionAreas,
  frontierSourceUrl,
  microhackAccessNote,
}: {
  solutionAreas: SolutionArea[];
  frontierSourceUrl: string;
  microhackAccessNote: string;
}) {
  const [query, setQuery] = useState('');
  const [readiness, setReadiness] = useState<ReadinessFilter>('all');
  const [frontierOnly, setFrontierOnly] = useState(false);
  const filtersActive =
    query.trim() !== '' || readiness !== 'all' || frontierOnly;

  const filteredAreas = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return solutionAreas.map((area) => ({
      ...area,
      specializations: area.specializations.filter((specialization) => {
        const matchesQuery =
          normalizedQuery === '' ||
          specialization.title.toLocaleLowerCase().includes(normalizedQuery);
        const matchesReadiness =
          readiness === 'all' || specialization.readiness === readiness;
        const matchesFrontier =
          !frontierOnly || specialization.frontierEligible;

        return matchesQuery && matchesReadiness && matchesFrontier;
      }),
    }));
  }, [frontierOnly, query, readiness, solutionAreas]);

  const resultCount = filteredAreas.reduce(
    (total, area) => total + area.specializations.length,
    0,
  );
  const totalCount = solutionAreas.reduce(
    (total, area) => total + area.specializations.length,
    0,
  );

  function resetFilters() {
    setQuery('');
    setReadiness('all');
    setFrontierOnly(false);
  }

  return (
    <div className="catalog-content" id="catalog">
      <div className="shell">
        <section className="catalog-toolbar" aria-labelledby="catalog-heading">
          <div className="toolbar-copy">
            <span className="section-kicker">Resource catalog</span>
            <h2 id="catalog-heading">Find your specialization path</h2>
            <p>
              Search the catalog, check current readiness, and open the partner
              resources you need.
            </p>
          </div>

          <div className="filters" role="search">
            <label className="search-field">
              <span className="sr-only">Search specializations</span>
              <Icon name="search" />
              <input
                type="search"
                value={query}
                placeholder="Search specializations"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <label className="select-field">
              <span className="sr-only">Filter by readiness</span>
              <select
                value={readiness}
                onChange={(event) =>
                  setReadiness(event.target.value as ReadinessFilter)
                }
              >
                <option value="all">All readiness</option>
                <option value="ready">Ready</option>
                <option value="in-progress">In progress</option>
                <option value="planned">Planned</option>
              </select>
            </label>

            <label className="frontier-toggle">
              <input
                type="checkbox"
                checked={frontierOnly}
                onChange={(event) => setFrontierOnly(event.target.checked)}
              />
              <span className="toggle-track" aria-hidden="true">
                <span />
              </span>
              <span>Frontier eligible only</span>
            </label>
          </div>

          <div className="results-line" aria-live="polite">
            <span>
              Showing <strong>{resultCount}</strong> of {totalCount}{' '}
              specializations
            </span>
            {filtersActive ? (
              <button type="button" onClick={resetFilters}>
                Clear filters
              </button>
            ) : null}
          </div>
          <p className="access-note">
            <Icon name="github" />
            <span>{microhackAccessNote}</span>
          </p>
        </section>

        <div className="area-list">
          {filteredAreas.map((area, index) => (
            <AreaSection
              key={area.id}
              area={area}
              total={solutionAreas[index].specializations.length}
              filtersActive={filtersActive}
            />
          ))}
        </div>

        <aside className="frontier-note">
          <span className="frontier-note-icon" aria-hidden="true">
            <Icon name="frontier" />
          </span>
          <div>
            <h2>About the Frontier eligibility badge</h2>
            <p>
              It identifies catalog entries that can contribute to the
              Microsoft Foundry specialization prerequisite for the Frontier
              Partner specialization. AI Apps or AI Platform can satisfy that
              path; current requirements remain subject to Microsoft program
              guidance.
            </p>
          </div>
          <a href={frontierSourceUrl} target="_blank" rel="noreferrer">
            Read Microsoft guidance
            <Icon name="external" />
          </a>
        </aside>
      </div>
    </div>
  );
}
