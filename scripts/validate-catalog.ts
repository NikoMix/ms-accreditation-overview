import { getCatalog, uniqueSpecializations } from '../lib/catalog';

const catalog = getCatalog();
const entryCount = catalog.solutionAreas.reduce(
  (total, area) => total + area.specializations.length,
  0,
);
const specializationCount = uniqueSpecializations(catalog.solutionAreas).length;

console.log(
  `Catalog is valid: ${specializationCount} specializations (${entryCount} entries) across ${catalog.solutionAreas.length} solution areas.`,
);
