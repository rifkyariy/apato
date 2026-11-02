import { makeUseCases } from "@/application/use-cases";
import { memoryRepository } from "./memory-repository";

// Composition root. "Today" is pinned to the design's date so seed data reads as intended.
export const app = makeUseCases(memoryRepository, () => process.env.APATO_TODAY ?? "2026-11-01");
