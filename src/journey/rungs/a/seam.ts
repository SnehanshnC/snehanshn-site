import type { BuildArrivalSeam } from "../../types";

/*
 * Rung A has no arrival seam - it IS the opening (rung-a-raw.md).
 * The file exists to keep the per-rung layout uniform (dress + seam + meta);
 * the driver skips rungs whose builder is null. The A->B seam is owned by
 * rung B (docs/adr/rung-b-kitsch.md), per the "seams belong to the rung
 * being arrived at" rule.
 */
export const buildArrivalSeam: BuildArrivalSeam | null = null;
