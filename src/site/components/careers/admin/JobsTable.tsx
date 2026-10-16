import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, MapPin, Clock, Briefcase } from "lucide-react";
import { listAllJobs, toggleJobActive, deleteJob } from "@/site/lib/careersAdmin";
import JobForm from "./JobForm";
import type { AdminSession } from "@/site/lib/careersAuth";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  IconButton,
  PageHeader,
  SkeletonRows,
  Switch,
  formatDate,
} from "./ui";

interface Props {
  session: AdminSession;
  initialShowForm?: boolean;
}

const LOC: Record<string, string> = {
  coimbatore: "Coimbatore",
  bangalore: "Bangalore",
};

export default function JobsTable({ initialShowForm = false }: Props) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(initialShowForm);
  const [editJob, setEditJob] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-all-jobs"],
    queryFn: () => listAllJobs(),
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["admin-all-jobs"] });
    qc.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    qc.invalidateQueries({ queryKey: ["active-jobs"] });
  }

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleJobActive({ data: { id, active } }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJob({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setDeleteConfirmId(null);
    },
    onError: (err: any) => setDeleteError(err?.message ?? "Failed to delete."),
  });

  const jobs = data?.jobs ?? [];

  if (showForm || editJob) {
    return (
      <JobForm
        initial={editJob ?? undefined}
        onSuccess={() => {
          setShowForm(false);
          setEditJob(null);
          invalidate();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditJob(null);
        }}
      />
    );
  }

  function startEdit(job: (typeof jobs)[number]) {
    setEditJob({
      id: job.id,
      title: job.title,
      department: job.department,
      experienceBand: job.experienceBand,
      employmentType: job.employmentType,
      locations: job.locations as any,
      responsibilities: job.responsibilities as any,
      requirements: job.requirements as any,
      active: job.active,
    });
  }

  const activeCount = jobs.filter((j) => j.active).length;

  return (
    <div>
      <PageHeader
        title="Job postings"
        description={`${activeCount} live · ${jobs.length - activeCount} hidden`}
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>
            Add job
          </Button>
        }
      />

      <Card padded={false} className="overflow-hidden">
        {isLoading ? (
          <SkeletonRows rows={3} />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase />}
            title="No job postings yet"
            description="Create your first posting and it will appear on the public careers page."
            action={
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>
                Create job posting
              </Button>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Locations</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Posted</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4 align-middle">
                      <p className="font-semibold text-slate-900">{job.title}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        {job.department}
                        <span className="text-slate-300">•</span>
                        <Clock className="h-3 w-3" />
                        {job.experienceBand}
                        <span className="text-slate-300">•</span>
                        {job.employmentType}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex flex-wrap gap-1.5">
                        {(job.locations as string[]).map((l) => (
                          <Badge key={l}>{LOC[l] ?? l}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={job.active}
                          label={job.active ? "Hide job" : "Publish job"}
                          disabled={toggleMutation.isPending}
                          onChange={() =>
                            toggleMutation.mutate({ id: job.id, active: !job.active })
                          }
                        />
                        <Badge tone={job.active ? "emerald" : "slate"} dot>
                          {job.active ? "Live" : "Hidden"}
                        </Badge>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 align-middle text-slate-600">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <IconButton label="Edit job" onClick={() => startEdit(job)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton
                          label="Delete job"
                          tone="danger"
                          onClick={() => {
                            setDeleteConfirmId(job.id);
                            setDeleteError(null);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {jobs.map((job) => (
                <li key={job.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{job.title}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.experienceBand}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {(job.locations as string[]).map((l) => LOC[l] ?? l).join(", ")}
                        </span>
                      </p>
                    </div>
                    <Badge tone={job.active ? "emerald" : "slate"} dot>
                      {job.active ? "Live" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Switch
                        checked={job.active}
                        label={job.active ? "Hide job" : "Publish job"}
                        disabled={toggleMutation.isPending}
                        onChange={() => toggleMutation.mutate({ id: job.id, active: !job.active })}
                      />
                      Posted {formatDate(job.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <IconButton label="Edit job" onClick={() => startEdit(job)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </IconButton>

                      <IconButton
                        label="Delete job"
                        tone="danger"
                        onClick={() => {
                          setDeleteConfirmId(job.id);
                          setDeleteError(null);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete job posting?"
          body="This permanently removes the job from the database. Applications already submitted for this role will remain. This cannot be undone."
          confirmLabel="Delete job"
          pendingLabel="Deleting…"
          pending={deleteMutation.isPending}
          error={deleteError}
          onConfirm={() => deleteMutation.mutate(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}
