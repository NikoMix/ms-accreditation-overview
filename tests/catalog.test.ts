import assert from 'node:assert/strict';
import test from 'node:test';
import { getCatalog, parseCatalog, uniqueSpecializations } from '../lib/catalog';

test('loads the maintained catalog', () => {
  const catalog = getCatalog();
  const entryCount = catalog.solutionAreas.reduce(
    (total, area) => total + area.specializations.length,
    0,
  );

  assert.equal(catalog.solutionAreas.length, 4);
  assert.equal(entryCount, 43);
  assert.equal(uniqueSpecializations(catalog.solutionAreas).length, 36);
});

test('tracks the expected solution area sizes', () => {
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
    frontier: 1,
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
  shared[1].readiness = 'planned';
  shared[1].frontierPrerequisite = false;

  assert.throws(
    () => parseCatalog(catalog),
    /must use identical values in every solution area/,
  );
});

test('uses the Microsoft Hackathons resource pairs', () => {
  const resources = Object.fromEntries(
    uniqueSpecializations(getCatalog().solutionAreas).map((specialization) => [
      specialization.id,
      {
        readiness: specialization.readiness,
        accelerator: specialization.accelerator,
        microhack: specialization.microhack,
      },
    ]),
  );

test('marks the Frontier Partner prerequisite specializations', () => {
  const prerequisites = uniqueSpecializations(getCatalog().solutionAreas)
    .filter((specialization) => specialization.frontierPrerequisite)
    .map((specialization) => specialization.title)
    .sort();

  assert.deepEqual(prerequisites, [
    'AI Apps on Microsoft Azure',
    'AI Platform on Microsoft Azure',
    'Data Security',
    'Identity and Access Management',
    'Microsoft 365 Copilot',
  ]);
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
