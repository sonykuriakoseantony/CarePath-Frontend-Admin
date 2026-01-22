import { useState } from "react";
import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import Header from "../components/layout/Header";
import { Card } from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import CustomModal from "../components/common/CustomModal";
import { LuMail, LuPencil } from "react-icons/lu";
import { BiPlus, BiTrashAlt } from "react-icons/bi";
import { GoTrash } from "react-icons/go";

function Doctors() {
  const {
    doctors,
    departments,
    addDoctor,
    updateDoctor,
    deleteDoctor,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    departmentId: "",
    specialization: "",
    isAvailable: true,
  });

  const getDepartmentName = (id) =>
    departments.find((d) => d.id === id)?.name || "Unknown";

  const openCreate = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      email: "",
      departmentId: departments[0]?.id || "",
      specialization: "",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      departmentId: doctor.departmentId,
      specialization: doctor.specialization,
      isAvailable: doctor.isAvailable,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, formData);
      toast.success("Doctor updated successfully");
    } else {
      addDoctor(formData);
      toast.success("Doctor added successfully");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this doctor?"
      )
    ) {
      deleteDoctor(id);
      toast.success("Doctor removed");
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Doctors"
        subtitle="Manage medical staff and availability"
      />

      <div className="p-6">
        {/* Header Actions */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={openCreate}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <BiPlus className="h-5 w-5" />
            Add Doctor
          </button>
        </div>

        {/* Doctors Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Specialization
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {doctor.name}
                          </p>
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <LuMail className="h-3.5 w-3.5" />
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {getDepartmentName(
                          doctor.departmentId
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {doctor.specialization}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={
                          doctor.isAvailable
                            ? "available"
                            : "unavailable"
                        }
                        label={
                          doctor.isAvailable
                            ? "Available"
                            : "Unavailable"
                        }
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEdit(doctor)
                          }
                          className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(doctor.id)
                          }
                          className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <GoTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {doctors.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                No doctors found. Add your first doctor.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? "Edit Doctor" : "Add Doctor"}
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
              form="doctor-form"
              className="cursor-pointer h-10 rounded-lg [background:var(--gradient-primary)] px-4 font-medium text-primary-foreground hover:opacity-90"
            >
              {editingDoctor ? "Update" : "Add"}
            </button>
          </>
        }
      >
        <form
          id="doctor-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              className="h-10 w-full rounded-lg border border-input px-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  email: e.target.value,
                }))
              }
              className="h-10 w-full rounded-lg border border-input px-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Department
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  departmentId: e.target.value,
                }))
              }
              className="h-10 w-full rounded-lg border border-input px-3"
              required
            >
              {departments.map((dept) => (
                <option
                  key={dept.id}
                  value={dept.id}
                >
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  specialization: e.target.value,
                }))
              }
              className="h-10 w-full rounded-lg border border-input px-3"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  isAvailable: e.target.checked,
                }))
              }
            />
            <span className="text-sm font-medium">
              Available for appointments
            </span>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}


export default Doctors