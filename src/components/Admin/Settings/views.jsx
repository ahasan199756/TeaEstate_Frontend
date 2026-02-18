import React, { useEffect, useMemo, useState } from "react";
import { Save, RotateCcw, Plus, Trash2, ShieldAlert } from "lucide-react";
import { can, loadConfig, saveConfig, loadUsers, saveUsers } from "./store";

// Pretend current admin logged in.
// Later you can connect real auth.
const CURRENT_USER = { id: "u1", role: "admin" };

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">
      {label}
    </label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none ${props.className || ""}`}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none resize-none ${props.className || ""}`}
  />
);

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`h-10 w-16 rounded-full border transition-all relative
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      ${checked ? "bg-emerald-500/20 border-emerald-500/40" : "bg-white/5 border-white/10"}
    `}
  >
    <span
      className={`absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full transition-all
        ${checked ? "left-8 bg-emerald-500" : "left-1 bg-white/30"}
      `}
    />
  </button>
);

const TopActions = ({ dirty, onSave, onReset, disabled }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      disabled={!dirty || disabled}
      onClick={onSave}
      className="px-5 py-3 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
    >
      <Save size={14} /> Save
    </button>
    <button
      type="button"
      disabled={!dirty}
      onClick={onReset}
      className="px-5 py-3 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
    >
      <RotateCcw size={14} /> Reset
    </button>
  </div>
);

/* ---------------- PROFILE ---------------- */
export const ProfileView = () => {
  const [config, setConfig] = useState(loadConfig());
  const [draft, setDraft] = useState(config);
  const dirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(draft),
    [config, draft],
  );

  const canEdit = can(CURRENT_USER.role, "profile:edit");

  const onSave = () => {
    const next = saveConfig(draft);
    setConfig(next);
  };

  const onReset = () => setDraft(config);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic">
            Store Profile
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
            Brand + contact info shown on your storefront and invoices
          </p>
        </div>
        <TopActions
          dirty={dirty}
          onSave={onSave}
          onReset={onReset}
          disabled={!canEdit}
        />
      </div>

      {!canEdit && (
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest">
          You have view-only access.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Store Name">
          <Input
            disabled={!canEdit}
            value={draft.store.storeName}
            onChange={(e) =>
              setDraft({
                ...draft,
                store: { ...draft.store, storeName: e.target.value },
              })
            }
          />
        </Field>

        <Field label="Currency">
          <Input
            disabled={!canEdit}
            value={draft.store.currency}
            onChange={(e) =>
              setDraft({
                ...draft,
                store: { ...draft.store, currency: e.target.value },
              })
            }
          />
        </Field>

        <Field label="Support Email">
          <Input
            disabled={!canEdit}
            value={draft.store.supportEmail}
            onChange={(e) =>
              setDraft({
                ...draft,
                store: { ...draft.store, supportEmail: e.target.value },
              })
            }
          />
        </Field>

        <Field label="Phone">
          <Input
            disabled={!canEdit}
            value={draft.store.phone}
            onChange={(e) =>
              setDraft({
                ...draft,
                store: { ...draft.store, phone: e.target.value },
              })
            }
          />
        </Field>
      </div>
    </div>
  );
};

/* ---------------- USERS & ROLES ---------------- */
export const UsersView = () => {
  const [users, setUsers] = useState(loadUsers());
  const [draft, setDraft] = useState(users);

  useEffect(() => setDraft(users), [users]);

  const dirty = useMemo(
    () => JSON.stringify(users) !== JSON.stringify(draft),
    [users, draft],
  );
  const canEdit = can(CURRENT_USER.role, "users:edit");

  const onSave = () => {
    // basic validation
    for (const u of draft) {
      if (!u.name?.trim()) return alert("User name required");
      if (!u.email?.includes("@")) return alert("Valid email required");
    }
    const next = saveUsers(draft);
    setUsers(next);
  };

  const onReset = () => setDraft(users);

  const addUser = () => {
    const id = `u_${Date.now()}`;
    setDraft([
      ...draft,
      {
        id,
        name: "New User",
        email: "user@teaestate.com",
        role: "staff",
        status: "active",
      },
    ]);
  };

  const removeUser = (id) => {
    if (!confirm("Remove this user?")) return;
    setDraft(draft.filter((u) => u.id !== id));
  };

  const updateUser = (id, patch) => {
    setDraft(draft.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic">
            Users & Roles
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
            Admin can edit everything, Manager can manage ops, Staff limited,
            Viewer read-only
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addUser}
            disabled={!canEdit}
            className="px-5 py-3 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <Plus size={14} /> Add
          </button>
          <TopActions
            dirty={dirty}
            onSave={onSave}
            onReset={onReset}
            disabled={!canEdit}
          />
        </div>
      </div>

      {!canEdit && (
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest">
          You have view-only access.
        </div>
      )}

      <div className="space-y-4">
        {draft.map((u) => (
          <div
            key={u.id}
            className="p-6 bg-[#111] rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center gap-4 justify-between"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <Input
                disabled={!canEdit}
                value={u.name}
                onChange={(e) => updateUser(u.id, { name: e.target.value })}
              />
              <Input
                disabled={!canEdit}
                value={u.email}
                onChange={(e) => updateUser(u.id, { email: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  disabled={!canEdit}
                  value={u.role}
                  onChange={(e) => updateUser(u.id, { role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none text-[11px] font-black uppercase tracking-wider"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="viewer">Viewer</option>
                </select>

                <select
                  disabled={!canEdit}
                  value={u.status}
                  onChange={(e) => updateUser(u.id, { status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none text-[11px] font-black uppercase tracking-wider"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeUser(u.id)}
              disabled={!canEdit || u.id === CURRENT_USER.id}
              className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
              title={
                u.id === CURRENT_USER.id
                  ? "You can't delete yourself"
                  : "Remove user"
              }
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- SHIPPING ---------------- */
export const ShippingView = () => {
  const [config, setConfig] = useState(loadConfig());
  const [draft, setDraft] = useState(config);
  const dirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(draft),
    [config, draft],
  );
  const canEdit = can(CURRENT_USER.role, "shipping:edit");

  const onSave = () => {
    const next = saveConfig(draft);
    setConfig(next);
  };

  const onReset = () => setDraft(config);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic">
            Shipping
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
            Delivery windows + fees used on checkout
          </p>
        </div>
        <TopActions
          dirty={dirty}
          onSave={onSave}
          onReset={onReset}
          disabled={!canEdit}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Inside Dhaka (days)">
          <Input
            disabled={!canEdit}
            type="number"
            value={draft.shipping.insideDhakaDays}
            onChange={(e) =>
              setDraft({
                ...draft,
                shipping: {
                  ...draft.shipping,
                  insideDhakaDays: Number(e.target.value),
                },
              })
            }
          />
        </Field>

        <Field label="Outside Dhaka (max days)">
          <Input
            disabled={!canEdit}
            type="number"
            value={draft.shipping.outsideDhakaMaxDays}
            onChange={(e) =>
              setDraft({
                ...draft,
                shipping: {
                  ...draft.shipping,
                  outsideDhakaMaxDays: Number(e.target.value),
                },
              })
            }
          />
        </Field>

        <Field label="Flat Shipping Fee (BDT)">
          <Input
            disabled={!canEdit}
            type="number"
            value={draft.shipping.flatFee}
            onChange={(e) =>
              setDraft({
                ...draft,
                shipping: {
                  ...draft.shipping,
                  flatFee: Number(e.target.value),
                },
              })
            }
          />
        </Field>

        <Field label="Free Shipping Over (BDT)">
          <Input
            disabled={!canEdit}
            type="number"
            value={draft.shipping.freeShippingOver}
            onChange={(e) =>
              setDraft({
                ...draft,
                shipping: {
                  ...draft.shipping,
                  freeShippingOver: Number(e.target.value),
                },
              })
            }
          />
        </Field>
      </div>
    </div>
  );
};

/* ---------------- PAYMENTS ---------------- */
export const PaymentsView = () => {
  const [config, setConfig] = useState(loadConfig());
  const [draft, setDraft] = useState(config);
  const dirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(draft),
    [config, draft],
  );
  const canEdit = can(CURRENT_USER.role, "payments:edit");

  const onSave = () => {
    const next = saveConfig(draft);
    setConfig(next);
  };

  const onReset = () => setDraft(config);

  const P = draft.payments;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic">
            Payments
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
            Enable methods & configure merchant info
          </p>
        </div>
        <TopActions
          dirty={dirty}
          onSave={onSave}
          onReset={onReset}
          disabled={!canEdit}
        />
      </div>

      {/* COD */}
      <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white text-[11px] font-black uppercase tracking-widest block">
              Cash on Delivery (COD)
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Local standard method
            </span>
          </div>
          <Toggle
            disabled={!canEdit}
            checked={P.cod.enabled}
            onChange={(v) =>
              setDraft({
                ...draft,
                payments: { ...P, cod: { ...P.cod, enabled: v } },
              })
            }
          />
        </div>
        <Field label="Note (shown to customer)">
          <Textarea
            disabled={!canEdit}
            rows={2}
            value={P.cod.note}
            onChange={(e) =>
              setDraft({
                ...draft,
                payments: { ...P, cod: { ...P.cod, note: e.target.value } },
              })
            }
          />
        </Field>
      </div>

      {/* bKash */}
      <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white text-[11px] font-black uppercase tracking-widest block">
              bKash Manual Payment
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Customer sends money & provides trx ID
            </span>
          </div>
          <Toggle
            disabled={!canEdit}
            checked={P.bkash.enabled}
            onChange={(v) =>
              setDraft({
                ...draft,
                payments: { ...P, bkash: { ...P.bkash, enabled: v } },
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Merchant Number">
            <Input
              disabled={!canEdit}
              value={P.bkash.merchantNumber}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    bkash: { ...P.bkash, merchantNumber: e.target.value },
                  },
                })
              }
            />
          </Field>

          <Field label="Merchant Type">
            <Input
              disabled={!canEdit}
              value={P.bkash.merchantType}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    bkash: { ...P.bkash, merchantType: e.target.value },
                  },
                })
              }
            />
          </Field>

          <Field label="Instructions (shown at checkout)">
            <Textarea
              disabled={!canEdit}
              rows={2}
              value={P.bkash.instructions}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    bkash: { ...P.bkash, instructions: e.target.value },
                  },
                })
              }
            />
          </Field>
        </div>
      </div>

      {/* Nagad */}
      <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white text-[11px] font-black uppercase tracking-widest block">
              Nagad Manual Payment
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Customer sends money & provides trx ID
            </span>
          </div>
          <Toggle
            disabled={!canEdit}
            checked={P.nagad.enabled}
            onChange={(v) =>
              setDraft({
                ...draft,
                payments: { ...P, nagad: { ...P.nagad, enabled: v } },
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Merchant Number">
            <Input
              disabled={!canEdit}
              value={P.nagad.merchantNumber}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    nagad: { ...P.nagad, merchantNumber: e.target.value },
                  },
                })
              }
            />
          </Field>

          <Field label="Instructions (shown at checkout)">
            <Textarea
              disabled={!canEdit}
              rows={2}
              value={P.nagad.instructions}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    nagad: { ...P.nagad, instructions: e.target.value },
                  },
                })
              }
            />
          </Field>
        </div>
      </div>

      {/* Stripe (real-ish config fields) */}
      <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white text-[11px] font-black uppercase tracking-widest block">
              Card Payments (Stripe)
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Needs backend + webhook to be truly live
            </span>
          </div>
          <Toggle
            disabled={!canEdit}
            checked={P.stripe.enabled}
            onChange={(v) =>
              setDraft({
                ...draft,
                payments: { ...P, stripe: { ...P.stripe, enabled: v } },
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Publishable Key">
            <Input
              disabled={!canEdit}
              value={P.stripe.publishableKey}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    stripe: { ...P.stripe, publishableKey: e.target.value },
                  },
                })
              }
            />
          </Field>

          <Field label="Webhook Secret">
            <Input
              disabled={!canEdit}
              value={P.stripe.webhookSecret}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    stripe: { ...P.stripe, webhookSecret: e.target.value },
                  },
                })
              }
            />
          </Field>

          <Field label="Note">
            <Textarea
              disabled={!canEdit}
              rows={2}
              value={P.stripe.note}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  payments: {
                    ...P,
                    stripe: { ...P.stripe, note: e.target.value },
                  },
                })
              }
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

/* ---------------- SECURITY ---------------- */
export const SecurityView = () => {
  const [config, setConfig] = useState(loadConfig());
  const [draft, setDraft] = useState(config);
  const dirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(draft),
    [config, draft],
  );
  const canEdit = can(CURRENT_USER.role, "security:edit");

  const onSave = () => {
    const next = saveConfig(draft);
    setConfig(next);
  };

  const onReset = () => setDraft(config);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic">
            Security
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-wider mt-1">
            Session and password rules
          </p>
        </div>
        <TopActions
          dirty={dirty}
          onSave={onSave}
          onReset={onReset}
          disabled={!canEdit}
        />
      </div>

      <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-[11px] font-black uppercase tracking-widest">
              Require Strong Passwords
            </p>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Enforce length + complexity
            </p>
          </div>
          <Toggle
            disabled={!canEdit}
            checked={draft.security.requireStrongPassword}
            onChange={(v) =>
              setDraft({
                ...draft,
                security: { ...draft.security, requireStrongPassword: v },
              })
            }
          />
        </div>

        <Field label="Session Timeout (minutes)">
          <Input
            disabled={!canEdit}
            type="number"
            value={draft.security.sessionTimeoutMins}
            onChange={(e) =>
              setDraft({
                ...draft,
                security: {
                  ...draft.security,
                  sessionTimeoutMins: Number(e.target.value),
                },
              })
            }
          />
        </Field>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-[11px] font-black uppercase tracking-widest">
              Two-Factor Authentication (2FA)
            </p>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Extra protection for admins
            </p>
          </div>
          <Toggle
            disabled={!canEdit}
            checked={draft.security.twoFactor}
            onChange={(v) =>
              setDraft({
                ...draft,
                security: { ...draft.security, twoFactor: v },
              })
            }
          />
        </div>
      </div>

      <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl">
        <p className="text-red-400 text-[10px] font-black uppercase mb-2 inline-flex items-center gap-2">
          <ShieldAlert size={14} /> Danger Zone
        </p>
        <button
          type="button"
          className="text-white bg-red-500/20 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all"
          onClick={() => alert("Hook this to your real auth system later.")}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};
