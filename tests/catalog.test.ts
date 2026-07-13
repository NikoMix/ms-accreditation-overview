import assert from 'node:assert/strict';
import test from 'node:test';
import { getCatalog, parseCatalog } from '../lib/catalog';

test('loads the maintained catalog', () => {
  const catalog = getCatalog();
  const specializationCount = catalog.solutionAreas.reduce(
    (total, area) => total + area.specializations.length,
    0,
  );

  assert.equal(catalog.solutionAreas.length, 3);
  assert.equal(specializationCount, 12);
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
