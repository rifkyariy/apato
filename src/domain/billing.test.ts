import { test } from "node:test";
import assert from "node:assert/strict";
import { applyPayment, billRemaining, billStatus, daysLate } from "./billing.ts";
import type { Bill } from "./entities.ts";

const bill: Bill = {
  id: "b", propertyId: "p", tenant: "Rina", room: "204", due: "2026-10-23",
  lines: [{ label: "Sewa", amount: 1_300_000 }, { label: "Listrik", amount: 110_000 }, { label: "Air", amount: 40_000 }],
  paid: 0,
};

test("status and lateness", () => {
  assert.equal(daysLate(bill, "2026-11-01"), 9);
  assert.equal(billStatus(bill, "2026-11-01"), "telat");
  assert.equal(billStatus(bill, "2026-10-20"), "belum");
});

test("partial then full payment", () => {
  const half = applyPayment(bill, 800_000);
  assert.equal(billRemaining(half), 650_000);
  assert.equal(billStatus(applyPayment(half, 650_000), "2026-11-01"), "lunas");
});

test("rejects bad amounts", () => {
  assert.throws(() => applyPayment(bill, 0));
  assert.throws(() => applyPayment(bill, 2_000_000));
});
