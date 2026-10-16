import { useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MailCheck,
  MailWarning,
  ShieldCheck,
  Trash2,
  User,
  UserPlus,
  Users,
  Wand2,
  X,
} from "lucide-react";
import { listAdmins, createAdminAccount, removeAdminAccount } from "@/site/lib/careersAdmin";
import type { AdminSession } from "@/site/lib/careersAuth";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  EmptyState,
  Field,
  IconButton,
  PageHeader,
  PasswordInput,
  SkeletonRows,
  formatDate,
  inputCls,
} from "./ui";

interface Props {
  session: AdminSession;
}

type Role = "superadmin" | "admin";

const ROLE_INFO: Record<Role, { label: string; description: string }> = {
  admin: {
    label: "Admin",
    description: "Add, edit & delete jobs, review applications and update their status."
  },
  superadmin: {
    label: "Super Admin",
    description: "Everything an Admin can do, plus manage the team and notification settings."
  },
};

export default function TeamManager({ session }: Props) {
  const qc = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [role, setRole] = useState<Role>("admin");
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  /** Result of the last invite — kept on screen until dismissed */
  const [invited, setInvited] = useState<{
    name: string;
    email: string;
    password: string;
    inviteSent: boolean;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => listAdmins(),
  });

  const addMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; password: string; role: Role }) =>
      createAdminAccount({ data: payload }),
    onSuccess: (res, payload) => {
      qc.invalidateQueries({ queryKey: ["admin-team"] });
      setInvited({
        name: payload.name,
        email: res.admin.email,
        password: payload.password,
        inviteSent: res.inviteSent,
      });
      closeForm();
    },
    onError: (err: any) => {
      setFormError(err?.message ?? "Failed to create admin account.");
      setFormStatus("error");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeAdminAccount({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-team"] });
      setRemoveConfirmId(null);
    },
    onError: (err: any) => setRemoveError(err?.message ?? "Failed to remove admin."),
  });

  function closeForm() {
    setShowAddForm(false);
    setFormStatus("idle");
    setFormError(null);
    setRole("admin");
    setTempPassword("");
  }

  function handleAddSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setFormStatus("saving");
    setFormError(null);
    addMutation.mutate({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      password: tempPassword,
      role,
    });
  }

  const admins = data?.admins ?? [];
  const nameById = new Map(admins.map((a) => [a.id, a.name]));
  const removing = admins.find((a) => a.id === removeConfirmId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team & admins"
        description={`${admins.length} admin account${admins.length !== 1 ? "s" : ""}`}
        actions={
          !showAddForm && (
            <Button
              icon={<UserPlus className="h-4 w-4" />}
              onClick={() => {
                setInvited(null);
                setShowAddForm(true);
              }}
            >
              Add admin
            </Button>
          )
        }
      />

      {invited && (
        <Card>
          <div className="flex items-start gap-4">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                invited.inviteSent ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {invited.inviteSent ? <MailCheck className="h-5 w-5" /> : <MailWarning className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">
                {invited.inviteSent
                  ? `Invitation sent to ${invited.name}`
                  : `Account created — but the invitation email couldn't be sent`}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {invited.inviteSent ? (
                  <>
                    We emailed <strong className="font-medium text-slate-900">{invited.email}</strong>{" "}
                    their sign-in link and temporary password. They'll be asked to choose their own
                    password when they first sign in.
                  </>
                ) : (
                  <>Please share these details with them directly. They'll choose their own password at first sign-in.</>
                )}
              </p>
              {!invited.inviteSent && (
                <dl className="mt-3 grid gap-1 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-4">
                  <dt className="text-slate-500">Login page</dt>
                  <dd className="break-all font-medium text-slate-900">{window.location.origin}/careers/admin</dd>
                  <dt className="text-slate-500">Email</dt>
                  <dd className="break-all font-medium text-slate-900">{invited.email}</dd>
                  <dt className="text-slate-500">Temporary password</dt>
                  <dd className="font-mono font-medium text-slate-900">{invited.password}</dd>
                </dl>
              )}
            </div>
            <IconButton label="Dismiss" onClick={() => setInvited(null)}>
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        </Card>
      )}

      {showAddForm && (
        <Card>
          <CardHeader
            title="New admin account"
            description="We'll email them an invitation with a sign-in link and this temporary password."
          />
          <form onSubmit={handleAddSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required htmlFor="team-name">
                <input id="team-name" required name="name" placeholder="Ravi Kumar" className={inputCls} />
              </Field>
              <Field label="Email" required htmlFor="team-email">
                <input
                  id="team-email"
                  required
                  name="email"
                  type="email"
                  placeholder="ravi@cosmictest.com"
                  className={inputCls}
                />
              </Field>
              <Field
                label="Temporary password"
                required
                hint="They'll replace it with their own at first sign-in."
                htmlFor="team-pw"
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <PasswordInput
                      id="team-pw"
                      required
                      name="password"
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    icon={<Wand2 className="h-4 w-4" />}
                    onClick={() => setTempPassword(generatePassword())}
                  >
                    Generate
                  </Button>
                </div>
              </Field>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-700">Role</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(ROLE_INFO) as Role[]).map((r) => {
                  const on = role === r;
                  return (
                    <label
                      key={r}
                      className={`flex cursor-pointer gap-3 rounded-lg border p-3.5 transition-colors ${
                        on
                          ? "border-[#1a6cf5] bg-blue-50/60 ring-1 ring-[#1a6cf5]"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role-choice"
                        checked={on}
                        onChange={() => setRole(r)}
                        className="mt-0.5 h-4 w-4 accent-[#1a6cf5]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">
                          {ROLE_INFO[r].label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                          {ROLE_INFO[r].description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {formError && <Alert tone="error">{formError}</Alert>}

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={formStatus === "saving"}
                disabled={formStatus === "success"}
              >
                {formStatus === "saving" ? "Sending invite…" : "Create & send invite"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card padded={false} className="overflow-hidden">
        {isLoading ? (
          <SkeletonRows rows={2} />
        ) : admins.length === 0 ? (
          <EmptyState icon={<Users />} title="No admin accounts" />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Added by</th>
                  <th className="px-5 py-3">Date added</th>
                  <th className="px-5 py-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={admin.name} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-semibold text-slate-900">
                            {admin.name}
                            {admin.id === session.id && <Badge>You</Badge>}
                          </p>
                          <p className="truncate text-xs text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={admin.role} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {admin.createdBy ? (nameById.get(admin.createdBy) ?? "Removed admin") : "System"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {admin.id !== session.id && (
                        <IconButton
                          label={`Remove ${admin.name}`}
                          tone="danger"
                          onClick={() => {
                            setRemoveConfirmId(admin.id);
                            setRemoveError(null);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {admins.map((admin) => (
                <li key={admin.id} className="flex items-center gap-3 p-4">
                  <Avatar name={admin.name} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate font-semibold text-slate-900">
                      {admin.name}
                      {admin.id === session.id && <Badge>You</Badge>}
                    </p>
                    <p className="truncate text-xs text-slate-500">{admin.email}</p>
                    <div className="mt-1.5">
                      <RoleBadge role={admin.role} />
                    </div>
                  </div>
                  {admin.id !== session.id && (
                    <IconButton
                      label={`Remove ${admin.name}`}
                      tone="danger"
                      onClick={() => {
                        setRemoveConfirmId(admin.id);
                        setRemoveError(null);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {removeConfirmId && (
        <ConfirmDialog
          title="Remove admin?"
          body={
            <>
              <strong className="font-semibold text-slate-900">{removing?.name}</strong> will
              immediately lose access to the admin panel. This cannot be undone.
            </>
          }
          confirmLabel="Remove admin"
          pendingLabel="Removing…"
          pending={removeMutation.isPending}
          error={removeError}
          onConfirm={() => removeMutation.mutate(removeConfirmId)}
          onCancel={() => setRemoveConfirmId(null)}
        />
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return role === "superadmin" ? (
    <Badge tone="violet">
      <ShieldCheck className="h-3 w-3" />
      Super Admin
    </Badge>
  ) : (
    <Badge tone="blue">
      <User className="h-3 w-3" />
      Admin
    </Badge>
  );
}

/** 12 chars from an unambiguous alphabet (no 0/O, 1/l/I) — easy to read from an email. */
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%";
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}
