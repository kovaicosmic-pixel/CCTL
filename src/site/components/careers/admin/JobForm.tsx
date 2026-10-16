import { useState, type FormEvent } from "react";
import { Plus, Trash2, ArrowLeft, Check } from "lucide-react";
import { createJob, updateJob } from "@/site/lib/careersAdmin";
import { Alert, Button, Card, CardHeader, Field, Switch, inputCls } from "./ui";

interface JobFormData {
  id?: string;
  title: string;
  department: string;
  experienceBand: string;
  employmentType: "Onsite" | "Hybrid" | "Remote";
  locations: ("coimbatore" | "bangalore")[];
  responsibilities: string[];
  requirements: string[];
  active: boolean;
}

interface Props {
  initial?: JobFormData;
  onSuccess: () => void;
  onCancel: () => void;
}

const EMPLOYMENT_TYPES = ["Onsite", "Hybrid", "Remote"] as const;

function BulletListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  function update(idx: number, val: string) {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  }

  return (
    <div>
      <ol className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-right text-xs font-medium tabular-nums text-slate-400">
              {idx + 1}.
            </span>
            <input
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              disabled={items.length <= 1}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="ml-8 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a6cf5] hover:text-[#155ad0]"
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    </div>
  );
}

export default function JobForm({ initial, onSuccess, onCancel }: Props) {
  const isEdit = !!initial?.id;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [department, setDepartment] = useState(initial?.department ?? "Engineering");
  const [experienceBand, setExperienceBand] = useState(initial?.experienceBand ?? "");
  const [employmentType, setEmploymentType] = useState<"Onsite" | "Hybrid" | "Remote">(
    initial?.employmentType ?? "Onsite",
  );
  const [locations, setLocations] = useState<("coimbatore" | "bangalore")[]>(
    initial?.locations ?? ["coimbatore", "bangalore"],
  );
  const [responsibilities, setResponsibilities] = useState<string[]>(
    initial?.responsibilities?.length ? initial.responsibilities : [""],
  );
  const [requirements, setRequirements] = useState<string[]>(
    initial?.requirements?.length ? initial.requirements : [""],
  );
  const [active, setActive] = useState(initial?.active ?? true);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function toggleLocation(loc: "coimbatore" | "bangalore") {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const filledResponsibilities = responsibilities.filter((r) => r.trim());
    const filledRequirements = requirements.filter((r) => r.trim());

    if (!filledResponsibilities.length || !filledRequirements.length) {
      setErrorMsg("Please add at least one responsibility and one requirement.");
      setStatus("error");
      return;
    }
    if (!locations.length) {
      setErrorMsg("Please select at least one location.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    setErrorMsg(null);

    try {
      const payload = {
        title: title.trim(),
        department: department.trim(),
        experienceBand: experienceBand.trim(),
        employmentType,
        locations,
        responsibilities: filledResponsibilities,
        requirements: filledRequirements,
        active,
      };

      if (isEdit && initial?.id) {
        await updateJob({ data: { id: initial.id, ...payload } });
      } else {
        await createJob({ data: payload });
      }

      setStatus("success");
      setTimeout(onSuccess, 800);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to save job. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to job postings
        </button>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          {isEdit ? "Edit job posting" : "New job posting"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isEdit
            ? "Changes go live on the careers page as soon as you save."
            : "Fill in the details below. You can edit everything later."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Role details" description="The basics candidates see first." />
            <div className="space-y-5">
              <Field label="Job title" required htmlFor="job-title">
                <input
                  id="job-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. EMI/EMC Test Engineer"
                  className={inputCls}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Department" htmlFor="job-dept">
                  <input
                    id="job-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Engineering"
                    className={inputCls}
                  />
                </Field>
                <Field label="Experience" required htmlFor="job-exp">
                  <input
                    id="job-exp"
                    required
                    value={experienceBand}
                    onChange={(e) => setExperienceBand(e.target.value)}
                    placeholder="e.g. 1–3 years"
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="What you'll do"
              description="Responsibilities — one bullet point per line."
            />
            <BulletListEditor
              items={responsibilities}
              onChange={setResponsibilities}
              placeholder="e.g. Conduct EMI/EMC testing on electronic products"
            />
          </Card>

          <Card>
            <CardHeader
              title="What we're looking for"
              description="Requirements — one bullet point per line."
            />
            <BulletListEditor
              items={requirements}
              onChange={setRequirements}
              placeholder="e.g. 1–3 years of hands-on EMI/EMC testing experience"
            />
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Publishing" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {active ? "Live on careers page" : "Hidden from public"}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Toggle off to save as a draft.
                </p>
              </div>
              <Switch
                checked={active}
                label="Publish job"
                onChange={() => setActive((v) => !v)}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Employment type" />
            <div className="grid grid-cols-3 gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEmploymentType(t)}
                  aria-pressed={employmentType === t}
                  className={`h-10 rounded-lg border text-sm font-medium transition-colors ${
                    employmentType === t
                      ? "border-[#1a6cf5] bg-blue-50 text-[#1a6cf5]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Locations" description="Select at least one." />
            <div className="space-y-2">
              {(["coimbatore", "bangalore"] as const).map((loc) => {
                const on = locations.includes(loc);
                return (
                  <label
                    key={loc}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      on
                        ? "border-[#1a6cf5] bg-blue-50 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => toggleLocation(loc)}
                    />
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                        on ? "border-[#1a6cf5] bg-[#1a6cf5] text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                    {loc.charAt(0).toUpperCase() + loc.slice(1)}
                  </label>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-[1px] flex-1">
          {status === "error" && errorMsg && <Alert tone="error">{errorMsg}</Alert>}
          {status === "success" && (
            <Alert tone="success">Job {isEdit ? "updated" : "created"} successfully!</Alert>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={status === "saving"}
            disabled={status === "success"}
          >
            {status === "saving" ? "Saving…" : isEdit ? "Save changes" : active ? "Publish job" : "Save as draft"}
          </Button>
        </div>
      </div>
    </form>
  );
}
