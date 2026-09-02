import assert from 'node:assert/strict';
import test from 'node:test';
import { getCatalog, parseCatalog, uniqueSpecializations } from '../lib/catalog';

test('loads the maintained catalog', () => {
  const catalog = getCatalog();
  const entryCount = catalog.solutionAreas.reduce(
    (total, area) => total + area.specializations.length,
    0,
  );

  assert.equal(catalog.solutionAreas.length, 3);
  assert.equal(entryCount, 42);
  assert.equal(uniqueSpecializations(catalog.solutionAreas).length, 35);
});
test('mirrors the published solution area sizes', () => {
  const sizes = Object.fromEntries(
    getCatalog().solutionAreas.map((area) => [
      area.id,
      area.specializations.length,
    ]),
  );

  assert.deepEqual(sizes, {
    'cloud-ai-platform': 19,
    security: 6,
    'ai-business-solutions': 17,
  });
});

test('requires identical values for a shared specialization', () => {
  const catalog = structuredClone(getCatalog());
  const shared = catalog.solutionAreas
    .flatMap((area) => area.specializations)
    .filter(
      (specialization) => specialization.id === 'microsoft-365-copilot',
    );

  assert.equal(shared.length, 2);
  shared[1].readiness = 'planned';
  shared[1].frontierEligible = false;
  shared[1].frontierRequirement = null;

  assert.throws(
    () => parseCatalog(catalog),
    /must use identical values in every solution area/,
  );
});

test('publishes the cross-solution area Frontier specialization', () => {
  const catalog = getCatalog();
  const { frontierSpecialization, solutionAreas } = catalog;

  assert.equal(
    frontierSpecialization.title,
    'Microsoft Frontier Partner Specialization',
  );
  assert.equal(frontierSpecialization.readiness, 'planned');
  assert.equal(frontierSpecialization.accelerator, null);
  assert.equal(frontierSpecialization.microhack, null);
  // It is the Frontier destination, not a prerequisite, so it carries no badge.
  assert.equal(frontierSpecialization.frontierEligible, false);
  assert.ok(frontierSpecialization.status.length > 0);
  assert.ok(frontierSpecialization.summary.length > 0);

  const listedInsideAnArea = solutionAreas
    .flatMap((area) => area.specializations)
    .some(
      (specialization) => specialization.id === frontierSpecialization.id,
    );
  assert.equal(listedInsideAnArea, false);
});

test('rejects the Frontier specialization inside a solution area', () => {
  const catalog = structuredClone(getCatalog());
  catalog.solutionAreas[0].specializations.push({
    ...catalog.frontierSpecialization,
  });

  assert.throws(
    () => parseCatalog(catalog),
    /is cross-solution area and must not be listed inside/,
  );
});

test('rejects impossible calendar dates', () => {
  const catalog = structuredClone(getCatalog());
  catalog.site.lastUpdated = '2026-02-31';

  assert.throws(
    () => parseCatalog(catalog),
    /lastUpdated must be a valid calendar date/,
  );
});

test('requires a complete resource pair for ready entries', () => {
  const catalog = structuredClone(getCatalog());
  const readySpecialization = catalog.solutionAreas
    .flatMap((area) => area.specializations)
    .find((specialization) => specialization.readiness === 'ready');

  assert.ok(readySpecialization);
  readySpecialization.microhack = null;

  assert.throws(
    () => parseCatalog(catalog),
    /marked ready but is missing an accelerator or Microhack/,
  );
});
