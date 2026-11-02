"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { app } from "@/infrastructure/container";
import type { PaymentMethod, Role } from "@/domain/entities";

const num = (v: FormDataEntryValue | null) => Number(String(v ?? "").replace(/\D/g, ""));

export async function recordPayment(_: string | null, form: FormData) {
  try {
    await app.recordPayment(String(form.get("billId")), num(form.get("amount")), form.get("method") as PaymentMethod);
  } catch (e) {
    return (e as Error).message;
  }
  revalidatePath("/", "layout");
  return null;
}

export async function addProperty(_: string | null, form: FormData) {
  let id: string;
  try {
    ({ id } = await app.addProperty({ name: String(form.get("name")), city: String(form.get("city")),
      floors: num(form.get("floors")), perFloor: num(form.get("perFloor")), price: num(form.get("price")) }));
  } catch (e) {
    return (e as Error).message;
  }
  redirect(`/p/${id}`);
}

export async function inviteMember(_: string | null, form: FormData) {
  try {
    await app.inviteMember(String(form.get("email")), form.get("role") as Exclude<Role, "owner">, form.getAll("props").map(String));
  } catch (e) {
    return (e as Error).message;
  }
  revalidatePath("/tim");
  return null;
}
