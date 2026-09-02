import { getCatalog, uniqueSpecializations } from '../lib/catalog';

const catalog = getCatalog();
const entryCount = catalog.solutionAreas.reduce(
  (total, area) => total + area.specializations.length,
  0,
);
// The cross-solution area Frontier specialization is counted once, on top of
// the specializations listed inside the solution areas.
const specializationCount =
  uniqueSpecializations(catalog.solutionAreas).length + 1;

console.log(
  `Catalog is valid: ${specializationCount} specializations (${entryCount} solution area entries plus ${catalog.frontierSpecialization.title}) across ${catalog.solutionAreas.length} solution areas.`,
);
