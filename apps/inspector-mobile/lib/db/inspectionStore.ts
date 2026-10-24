import { getCurrentUser, getUserStorageKey } from "./authStore";

export type Inspection = {
  lotId: string;
  supplier: string;
  centre: string;
  quantity: string;
  operator: string;
  grade: string;
  confidence: string;
  gradeAPercentage: string;
  ursPercentage: string;
  otherPercentage: string;
};

let inspections: Inspection[] = [];

function loadInspections() {
  try {
    if (typeof localStorage === "undefined") {
      inspections = [];
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      inspections = [];
      return;
    }

    const storageKey = getUserStorageKey();
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        inspections = parsed;
      } else {
        inspections = [];
      }
    } else {
      /*
       * Migration for the old prototype storage.
       * Existing operator123 inspections are preserved.
       */
      if (user === "operator123") {
        const oldData = localStorage.getItem(
          "oniongrade_inspections"
        );

        if (oldData) {
          const parsedOldData = JSON.parse(oldData);

          if (Array.isArray(parsedOldData)) {
            inspections = parsedOldData;

            localStorage.setItem(
              storageKey,
              JSON.stringify(inspections)
            );

            localStorage.removeItem(
              "oniongrade_inspections"
            );

            return;
          }
        }
      }

      inspections = [];
    }
  } catch (error) {
    console.log(
      "Could not load inspections:",
      error
    );

    inspections = [];
  }
}

function saveInspections() {
  try {
    if (typeof localStorage === "undefined") {
      return;
    }

    const user = getCurrentUser();

    if (!user) {
      return;
    }

    const storageKey = getUserStorageKey();

    localStorage.setItem(
      storageKey,
      JSON.stringify(inspections)
    );
  } catch (error) {
    console.log(
      "Could not save inspections:",
      error
    );
  }
}

export function getInspections(): Inspection[] {
  loadInspections();

  return [...inspections];
}

export function addInspection(
  inspection: Inspection
): Inspection[] {
  loadInspections();

  const existingIndex =
    inspections.findIndex(
      (item) => item.lotId === inspection.lotId
    );

  if (existingIndex >= 0) {
    inspections[existingIndex] = inspection;
  } else {
    inspections.unshift(inspection);
  }

  saveInspections();

  return [...inspections];
}

export function generateNextLotId(): string {
  loadInspections();

  const prefix =
    "PSF-AP-VSKP-2026-";

  let highestNumber = 0;

  for (const inspection of inspections) {
    if (!inspection.lotId) {
      continue;
    }

    if (!inspection.lotId.startsWith(prefix)) {
      continue;
    }

    const numberPart =
      inspection.lotId.replace(prefix, "");

    const number =
      Number.parseInt(numberPart, 10);

    if (!Number.isNaN(number)) {
      highestNumber = Math.max(
        highestNumber,
        number
      );
    }
  }

  const nextNumber =
    highestNumber + 1;

  return (
    prefix +
    String(nextNumber).padStart(4, "0")
  );
}

export function clearInspections() {
  inspections = [];

  try {
    if (typeof localStorage !== "undefined") {
      const user = getCurrentUser();

      if (user) {
        localStorage.removeItem(
          getUserStorageKey()
        );
      }
    }
  } catch (error) {
    console.log(
      "Could not clear inspections:",
      error
    );
  }
}