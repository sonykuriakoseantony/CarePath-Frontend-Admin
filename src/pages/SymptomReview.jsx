import { useState } from "react";
import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import Header from "../components/layout/Header";
import { Card } from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import CustomModal from "../components/common/CustomModal";
import { LuCheck, LuEye, LuMessageSquare, LuPlay } from "react-icons/lu";
import { MdClose } from "react-icons/md";

function SymptomReview() {
  const {
    symptoms,
    departments,
    doctors,
    runMatching,
    approveSymptom,
    rejectSymptom,
  } = useData();

  const [filter, setFilter] = useState("ALL");
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [notes, setNotes] = useState("");

  const filteredSymptoms =
    filter === "ALL"
      ? symptoms
      : symptoms.filter((s) => s.status === filter);

  const getDepartmentName = (id) =>
    departments.find((d) => d.id === id)?.name ||
    "N/A";

  const getDoctorName = (id) =>
    doctors.find((d) => d.id === id)?.name ||
    "N/A";

  const handleRunMatching = (symptomId) => {
    runMatching(symptomId);
    toast.success(
      "Matching algorithm executed successfully"
    );
  };

  const handleApprove = () => {
    if (!selectedSymptom) return;

    approveSymptom(selectedSymptom.id, notes);
    toast.success(
      `Patient ${selectedSymptom.patientName} notified via email`
    );
    setSelectedSymptom(null);
    setNotes("");
  };

  const handleReject = () => {
    if (!selectedSymptom) return;

    rejectSymptom(selectedSymptom.id, notes);
    toast.info("Submission rejected");
    setSelectedSymptom(null);
    setNotes("");
  };

  const statusCounts = {
    SUBMITTED: symptoms.filter(
      (s) => s.status === "SUBMITTED"
    ).length,
    AUTO_SUGGESTED: symptoms.filter(
      (s) => s.status === "AUTO_SUGGESTED"
    ).length,
    APPROVED: symptoms.filter(
      (s) => s.status === "APPROVED"
    ).length,
    REJECTED: symptoms.filter(
      (s) => s.status === "REJECTED"
    ).length,
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Symptom Review"
        subtitle="Two-step matching and approval workflow"
      />

      <div className="space-y-6 p-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            "ALL",
            "SUBMITTED",
            "AUTO_SUGGESTED",
            "APPROVED",
            "REJECTED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status === "ALL"
                ? "All"
                : status.replace("_", " ")}
              {status !== "ALL" && (
                <span className="ml-2 rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                  {statusCounts[status]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Symptoms Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Symptoms
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Severity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Suggested
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredSymptoms.map((symptom) => (
                  <tr
                    key={symptom.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {symptom.patientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {symptom.patientEmail}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="line-clamp-2 max-w-xs text-sm text-foreground">
                        {symptom.symptoms}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Duration: {symptom.duration}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          symptom.severity === "severe"
                            ? "bg-red-100 text-red-700"
                            : symptom.severity ===
                              "moderate"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {symptom.severity}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={symptom.status} />
                    </td>

                    <td className="px-6 py-4">
                      {symptom.suggestedDepartmentId ? (
                        <>
                          <p className="text-sm font-medium">
                            {getDepartmentName(
                              symptom.suggestedDepartmentId
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getDoctorName(
                              symptom.suggestedDoctorId
                            )}
                          </p>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {symptom.confidenceScore !==
                      undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${
                                  symptom.confidenceScore *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(
                              symptom.confidenceScore *
                                100
                            )}
                            %
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {symptom.status ===
                          "SUBMITTED" && (
                          <button
                            onClick={() =>
                              handleRunMatching(
                                symptom.id
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                          >
                            <LuPlay className="h-3.5 w-3.5" />
                            Run Matching
                          </button>
                        )}

                        {symptom.status ===
                          "AUTO_SUGGESTED" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedSymptom(
                                  symptom
                                );
                                setNotes("");
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                            >
                              <LuCheck className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSymptom(
                                  symptom
                                );
                                setNotes("");
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20"
                            >
                              <MdClose className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        {(symptom.status ===
                          "APPROVED" ||
                          symptom.status ===
                            "REJECTED") && (
                          <button
                            onClick={() =>
                              setSelectedSymptom(
                                symptom
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                          >
                            <LuEye className="h-3.5 w-3.5" />
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSymptoms.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                No submissions found
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Approval / View Modal */}
      <CustomModal
        open={!!selectedSymptom}
        onClose={() => setSelectedSymptom(null)}
        title={
          selectedSymptom?.status ===
          "AUTO_SUGGESTED"
            ? "Approve Submission"
            : "Submission Details"
        }
        footer={
          selectedSymptom?.status ===
          "AUTO_SUGGESTED" && (
            <>
              <button
                onClick={handleApprove}
                className="h-10 flex-1 rounded-lg [background:var(--gradient-primary)] text-primary-foreground font-medium hover:opacity-90"
              >
                Approve & Notify Patient
              </button>
              <button
                onClick={handleReject}
                className="h-10 rounded-lg bg-destructive/10 px-4 font-medium text-destructive hover:bg-destructive/20"
              >
                Reject
              </button>
            </>
          )
        }
      >
        {selectedSymptom && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Patient
                </span>
                <span className="text-sm font-medium">
                  {selectedSymptom.patientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Email
                </span>
                <span className="text-sm">
                  {selectedSymptom.patientEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Suggested Department
                </span>
                <span className="text-sm font-medium">
                  {getDepartmentName(
                    selectedSymptom.suggestedDepartmentId
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Suggested Doctor
                </span>
                <span className="text-sm">
                  {getDoctorName(
                    selectedSymptom.suggestedDoctorId
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Confidence
                </span>
                <span className="text-sm">
                  {selectedSymptom.confidenceScore
                    ? `${Math.round(
                        selectedSymptom.confidenceScore *
                          100
                      )}%`
                    : "N/A"}
                </span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Symptoms
              </p>
              <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                {selectedSymptom.symptoms}
              </p>
            </div>

            {selectedSymptom.status ===
              "AUTO_SUGGESTED" && (
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <LuMessageSquare className="h-4 w-4" />
                  Admin Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  className="h-24 w-full resize-none rounded-lg border border-input p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Add notes for the patient (optional)..."
                />
              </div>
            )}

            {selectedSymptom.adminNotes && (
              <div>
                <p className="mb-2 text-sm font-medium">
                  Admin Notes
                </p>
                <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                  {selectedSymptom.adminNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </CustomModal>
    </div>
  );
}


export default SymptomReview