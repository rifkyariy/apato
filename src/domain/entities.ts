// Core business types. No framework imports in this layer.

export type Property = { id: string; name: string; city: string; floors: number; perFloor: number; price: number };

export type RoomStatus = "lunas" | "belum" | "telat" | "kosong" | "perbaikan";
export type Room = { no: string; propertyId: string; floor: number; tenant?: string; repair?: boolean };

export type BillLine = { label: string; amount: number };
export type Bill = {
  id: string;
  propertyId: string;
  tenant: string;
  room: string;
  due: string; // ISO date
  lines: BillLine[];
  paid: number;
};

export type PaymentMethod = "transfer" | "tunai" | "qris";

export type Transaction = {
  id: string;
  propertyId: string;
  kind: "in" | "out";
  title: string;
  category: string;
  method?: PaymentMethod;
  date: string; // ISO date
  amount: number;
};

export type Role = "owner" | "manager" | "keeper";
export type Member = { id: string; name: string; email: string; role: Role; propertyIds: string[]; pending?: boolean };

export interface Repository {
  properties(): Promise<Property[]>;
  property(id: string): Promise<Property | undefined>;
  addProperty(p: Omit<Property, "id">): Promise<Property>;
  rooms(propertyId: string): Promise<Room[]>;
  bills(propertyId?: string): Promise<Bill[]>;
  bill(id: string): Promise<Bill | undefined>;
  saveBill(b: Bill): Promise<void>;
  transactions(propertyId?: string): Promise<Transaction[]>;
  addTransaction(t: Omit<Transaction, "id">): Promise<void>;
  members(): Promise<Member[]>;
  addMember(m: Omit<Member, "id">): Promise<void>;
}
