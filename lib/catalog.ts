import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'js-yaml';

export const READINESS_VALUES = ['ready', 'in-progress', 'planned'] as const;
export const AREA_ICON_VALUES = ['cloud', 'shield', 'sparkle'] as const;

export type Readiness = (typeof READINESS_VALUES)[number];
export type AreaIcon = (typeof AREA_ICON_VALUES)[number];

export interface SiteMeta {
  brand: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  microhackAccessNote: string;
  footerNote: string;
  repositoryUrl: string;
  catalogUrl: string;
  frontierSourceUrl: string;
  lastUpdated: string;
}

export interface Specialization {
  id: string;
  title: string;
  readiness: Readiness;
  frontierEligible: boolean;
  frontierRequirement: string | null;
  accelerator: string | null;
  microhack: string | null;
}

export interface SolutionArea {
  id: string;
  name: string;
  description: string;
  icon: AreaIcon;
  specializations: Specialization[];
}

export interface Catalog {
  site: SiteMeta;
  solutionAreas: SolutionArea[];
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, path: string): UnknownRecord {
  if (!isRecord(value)) {
    throw new Error(`${path} must be an object.`);
  }

  return value;
}

function expectString(
  record: UnknownRecord,
  key: string,
  path: string,
): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${path}.${key} must be a non-empty string.`);
  }

  return value.trim();
}

function expectBoolean(
  record: UnknownRecord,
  key: string,
  path: string,
): boolean {
  const value = record[key];
  if (typeof value !== 'boolean') {
    throw new Error(`${path}.${key} must be true or false.`);
  }

  return value;
}

function expectOptionalString(
  record: UnknownRecord,
  key: string,
  path: string,
): string | null {
  const value = record[key];
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${path}.${key} must be a non-empty string or null.`);
  }

  return value.trim();
}

function expectUrl(
  record: UnknownRecord,
  key: string,
  path: string,
  optional = false,
): string | null {
  const value = record[key];
  if (optional && (value === null || value === undefined)) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error(`${path}.${key} must be an HTTPS URL${optional ? ' or null' : ''}.`);
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${path}.${key} must be a valid URL.`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error(`${path}.${key} must use HTTPS.`);
  }

  return parsed.toString().replace(/\/$/, '');
}

function expectSlug(record: UnknownRecord, key: string, path: string): string {
  const value = expectString(record, key, path);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${path}.${key} must be a lowercase kebab-case slug.`);
  }

  return value;
}

function parseSite(value: unknown): SiteMeta {
  const record = expectRecord(value, 'site');
  const lastUpdated = expectString(record, 'lastUpdated', 'site');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastUpdated)) {
    throw new Error('site.lastUpdated must use YYYY-MM-DD format.');
  }

  const parsedDate = new Date(`${lastUpdated}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== lastUpdated
  ) {
    throw new Error('site.lastUpdated must be a valid calendar date.');
  }

  return {
    brand: expectString(record, 'brand', 'site'),
    eyebrow: expectString(record, 'eyebrow', 'site'),
    title: expectString(record, 'title', 'site'),
    subtitle: expectString(record, 'subtitle', 'site'),
    microhackAccessNote: expectString(record, 'microhackAccessNote', 'site'),
    footerNote: expectString(record, 'footerNote', 'site'),
    repositoryUrl: expectUrl(record, 'repositoryUrl', 'site')!,
    catalogUrl: expectUrl(record, 'catalogUrl', 'site')!,
    frontierSourceUrl: expectUrl(record, 'frontierSourceUrl', 'site')!,
    lastUpdated,
  };
}

function parseSpecialization(value: unknown, path: string): Specialization {
  const record = expectRecord(value, path);
  const readinessValue = expectString(record, 'readiness', path);
  if (!READINESS_VALUES.some((value) => value === readinessValue)) {
    throw new Error(
      `${path}.readiness must be one of: ${READINESS_VALUES.join(', ')}.`,
    );
  }

  const readiness = readinessValue as Readiness;
  const accelerator = expectUrl(record, 'accelerator', path, true);
  const microhack = expectUrl(record, 'microhack', path, true);
  const frontierEligible = expectBoolean(record, 'frontierEligible', path);
  const frontierRequirement = expectOptionalString(
    record,
    'frontierRequirement',
    path,
  );

  if (readiness === 'ready' && (!accelerator || !microhack)) {
    throw new Error(
      `${path} is marked ready but is missing an accelerator or Microhack.`,
    );
  }

  if (readiness !== 'planned' && !accelerator) {
    throw new Error(`${path} must publish an accelerator before work starts.`);
  }

  if (frontierEligible && !frontierRequirement) {
    throw new Error(
      `${path}.frontierRequirement is required for a Frontier-eligible entry.`,
    );
  }

  return {
    id: expectSlug(record, 'id', path),
    title: expectString(record, 'title', path),
    readiness,
    frontierEligible,
    frontierRequirement,
    accelerator,
    microhack,
  };
}

function parseSolutionArea(value: unknown, index: number): SolutionArea {
  const path = `solutionAreas[${index}]`;
  const record = expectRecord(value, path);
  const iconValue = expectString(record, 'icon', path);

  if (!AREA_ICON_VALUES.some((value) => value === iconValue)) {
    throw new Error(
      `${path}.icon must be one of: ${AREA_ICON_VALUES.join(', ')}.`,
    );
  }

  const rawSpecializations = record.specializations;
  if (!Array.isArray(rawSpecializations)) {
    throw new Error(`${path}.specializations must be an array.`);
  }

  const specializations = rawSpecializations.map((specialization, itemIndex) =>
    parseSpecialization(specialization, `${path}.specializations[${itemIndex}]`),
  );

  const specializationIds = new Set<string>();
  for (const specialization of specializations) {
    if (specializationIds.has(specialization.id)) {
      throw new Error(
        `${path} contains duplicate specialization id "${specialization.id}".`,
      );
    }
    specializationIds.add(specialization.id);
  }

  return {
    id: expectSlug(record, 'id', path),
    name: expectString(record, 'name', path),
    description: expectString(record, 'description', path),
    icon: iconValue as AreaIcon,
    specializations,
  };
}

export function parseCatalog(value: unknown): Catalog {
  const root = expectRecord(value, 'catalog');
  if (!Array.isArray(root.solutionAreas)) {
    throw new Error('solutionAreas must be an array.');
  }

  const solutionAreas = root.solutionAreas.map(parseSolutionArea);
  if (solutionAreas.length === 0) {
    throw new Error('At least one solution area is required.');
  }

  const areaIds = new Set<string>();
  const allSpecializationIds = new Set<string>();
  for (const area of solutionAreas) {
    if (areaIds.has(area.id)) {
      throw new Error(`Duplicate solution area id "${area.id}".`);
    }
    areaIds.add(area.id);

    for (const specialization of area.specializations) {
      if (allSpecializationIds.has(specialization.id)) {
        throw new Error(
          `Duplicate specialization id "${specialization.id}" across solution areas.`,
        );
      }
      allSpecializationIds.add(specialization.id);
    }
  }

  return {
    site: parseSite(root.site),
    solutionAreas,
  };
}

export function getCatalog(): Catalog {
  const filePath = join(process.cwd(), 'data', 'specializations.yaml');
  const source = readFileSync(filePath, 'utf8');
  return parseCatalog(load(source));
}
