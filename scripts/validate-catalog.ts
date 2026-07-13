import { getCatalog } from '../lib/catalog';

const catalog = getCatalog();
const specializationCount = catalog.solutionAreas.reduce(
  (total, area) => total + area.specializations.length,
  0,
);

console.log(
  `Catalog is valid: ${specializationCount} specializations across ${catalog.solutionAreas.length} solution areas.`,
);
