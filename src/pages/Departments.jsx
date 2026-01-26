import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useData } from "../context/DataContext";
import Header from "../components/layout/Header";
import { Card } from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import CustomModal from "../components/common/CustomModal";
import { GoTrash } from "react-icons/go";
import { LuBuilding2, LuPencil } from "react-icons/lu";
import { BiPlus } from "react-icons/bi";

function Departments() {
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    loadingData,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // if (loadingData) {
  //   return <p className="p-6">Loading departments...</p>;
  // }

  const openCreate = () => {
    setEditingDept(null);
    setFormData({ name: "", description: "", isActive: true });
    setIsModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      isActive: dept.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (editingDept) {
      updateDepartment(editingDept._id, formData);
      toast.success("Department updated successfully");
    } else {
      addDepartment(formData);
      toast.success("Department created successfully");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      deleteDepartment(id);
      toast.success("Department deleted");
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Departments"
        subtitle="Manage hospital departments and specialties"
      />

      <div className="p-6">
        {/* Header Actions */}
        <div className="mb-6 flex justify-between">
          <p className="py-2  text-xl text-primary">
            Departments: {departments.length}
          </p>
          <button
            onClick={openCreate}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <BiPlus className="h-5 w-5" />
            Add Department
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments &&
            departments.length > 0 &&
            departments?.map((dept, index) => (
              <Card
                key={dept?._id}
                hover
                className="animate-slide-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-display text-lg font-bold text-foreground">
                      {dept.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {dept.description}
                    </p>
                  </div>
                  <StatusBadge
                    status={dept.isActive ? "active" : "inactive"}
                    label={dept.isActive ? "Active" : "Inactive"}
                  />
                </div>

                <div className="flex items-center gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => openEdit(dept)}
                    className="cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <LuPencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <GoTrash className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </Card>
            ))}
        </div>

        {departments.length == 0 && (
          <Card className="py-12 text-center flex flex-col items-center justify-center">
            <p className="text-muted-foreground">
              No departments found. Create your first department.
            </p>
            <LuBuilding2 className="text-muted-foreground text-4xl mt-3" />
            <button
              onClick={openCreate}
              className="mt-3 cursor-pointer inline-flex items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <BiPlus className="h-5 w-5" />
              Add Department
            </button>
          </Card>
        )}
      </div>

      {/* Create / Edit Modal */}
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? "Edit Department" : "Add Department"}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer h-10 rounded-lg border border-input px-4 font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="department-form"
              className="cursor-pointer h-10 rounded-lg [background:var(--gradient-primary)] px-4 font-medium text-primary-foreground hover:opacity-90"
            >
              {editingDept ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <form
          id="department-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g., Cardiology"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of the department..."
              className="h-24 w-full resize-none rounded-lg border border-input bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
            />
            <span className="text-sm font-medium text-foreground">Active</span>
          </div>
        </form>
      </CustomModal>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}

export default Departments;
