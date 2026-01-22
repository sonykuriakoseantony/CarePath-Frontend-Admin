import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/layout/Header";
import { useData } from "../context/DataContext";
import { Card } from "../components/common/Card";
import CustomModal from "../components/common/CustomModal";
import { BiPlus } from "react-icons/bi";
import { LuLink2, LuPencil, LuTag } from "react-icons/lu";
import { GoTrash } from "react-icons/go";

function MatchingRules() {
  const {
    matchingRules,
    departments,
    addMatchingRule,
    updateMatchingRule,
    deleteMatchingRule,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [formData, setFormData] = useState({
    symptomKeywords: "",
    departmentId: "",
    priority: 1,
    confidenceWeight: 0.8,
  });

  const getDepartmentName = (id) =>
    departments.find((d) => d.id === id)?.name || "Unknown";

  const openCreate = () => {
    setEditingRule(null);
    setFormData({
      symptomKeywords: "",
      departmentId: departments[0]?.id || "",
      priority: 1,
      confidenceWeight: 0.8,
    });
    setIsModalOpen(true);
  };

  const openEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      symptomKeywords: rule.symptomKeywords.join(", "),
      departmentId: rule.departmentId,
      priority: rule.priority,
      confidenceWeight: rule.confidenceWeight,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.symptomKeywords.trim()) {
      toast.error("Keywords are required");
      return;
    }

    const keywords = formData.symptomKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const ruleData = {
      symptomKeywords: keywords,
      departmentId: formData.departmentId,
      priority: formData.priority,
      confidenceWeight: formData.confidenceWeight,
    };

    if (editingRule) {
      updateMatchingRule(editingRule.id, ruleData);
      toast.success("Rule updated successfully");
    } else {
      addMatchingRule(ruleData);
      toast.success("Rule created successfully");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this rule?"
      )
    ) {
      deleteMatchingRule(id);
      toast.success("Rule deleted");
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Matching Rules"
        subtitle="Configure symptom-to-specialist matching logic"
      />

      <div className="p-6">
        {/* Header Actions */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <BiPlus className="h-5 w-5" />
            Add Rule
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {matchingRules.map((rule, index) => (
            <Card
              key={rule.id}
              hover
              className="animate-slide-up"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <LuLink2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">
                        {getDepartmentName(rule.departmentId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Priority: {rule.priority} • Weight:{" "}
                        {rule.confidenceWeight}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {rule.symptomKeywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        <LuTag className="h-3 w-3" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(rule)}
                    className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                  >
                    <LuPencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <GoTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {matchingRules.length === 0 && (
          <Card className="py-12 text-center">
            <p className="text-muted-foreground">
              No matching rules found. Create your first rule.
            </p>
          </Card>
        )}
      </div>

      {/* Create / Edit Modal */}
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRule ? "Edit Rule" : "Add Rule"}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="h-10 rounded-lg border border-input px-4 font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="rule-form"
              className="h-10 rounded-lg [background:var(--gradient-primary)] px-4 font-medium text-primary-foreground hover:opacity-90"
            >
              {editingRule ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <form
          id="rule-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Symptom Keywords
            </label>
            <textarea
              value={formData.symptomKeywords}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  symptomKeywords: e.target.value,
                }))
              }
              placeholder="chest pain, heart, palpitations"
              className="h-24 w-full resize-none rounded-lg border border-input bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter keywords separated by commas
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Target Department
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  departmentId: e.target.value,
                }))
              }
              className="h-10 w-full rounded-lg border border-input bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Priority
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority:
                      parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="h-10 w-full rounded-lg border border-input bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                1 = highest priority
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Confidence Weight
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={formData.confidenceWeight}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confidenceWeight:
                      parseFloat(e.target.value) || 0.5,
                  }))
                }
                className="h-10 w-full rounded-lg border border-input bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                0.0 – 1.0
              </p>
            </div>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}


export default MatchingRules