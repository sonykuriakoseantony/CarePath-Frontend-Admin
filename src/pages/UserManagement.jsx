import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import { Card, CardHeader } from "../components/common/Card";
import { BiPlus } from "react-icons/bi";
import StatusBadge from "../components/common/StatusBadge";
import { LuPencil, LuShield, LuUserCheck } from "react-icons/lu";
import { GoTrash } from "react-icons/go";
import CustomModal from "../components/common/CustomModal";

const ROLE_DESCRIPTIONS = {
  SUPER_ADMIN: {
    label: "Super Admin",
    description:
      "Full system access including user management, configuration, and all operations",
    color: "bg-primary text-primary-foreground",
  },
  REVIEW_SPECIALIST: {
    label: "Review Specialist",
    description:
      "Can view symptoms, run matching, approve/reject cases, and add notes",
    color: "bg-secondary text-secondary-foreground",
  },
};

const PERMISSIONS_BY_ROLE = {
  SUPER_ADMIN: [
    "View Admin Dashboard",
    "Manage Departments (CRUD)",
    "Manage Doctors (CRUD)",
    "Manage Symptom Matching Rules (CRUD)",
    "View and Manage All Symptom Requests",
    "Assign/Reassign Review Specialists",
    "Manage User Accounts",
    "Configure Notification Settings",
    "Trigger Manual Notifications",
  ],
  REVIEW_SPECIALIST: [
    "View Assigned Symptom Requests",
    "View Patient Symptom Details",
    "Trigger Rule-Based Matching",
    "Review System-Generated Suggestions",
    "Approve or Reject Symptom Matches",
    "Add Review Notes",
    "Update Symptom Request Status",
  ],
};

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "REVIEW_SPECIALIST",
  isActive: true,
};

function UserManagement() {
  const {
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    user: currentUser,
  } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [showPermissions, setShowPermissions] = useState(null);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      toast.error("Password is required for new users");
      return;
    }

    const duplicate = adminUsers.find(
      (u) =>
        u.email == formData.email &&
        u.id != editingUser?.id
    );
    if (duplicate) {
      toast.error(
        "A user with this email already exists"
      );
      return;
    }

    if (editingUser) {
      const updates = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      };
      if (formData.password.trim()) {
        updates.password = formData.password;
      }
      updateAdminUser(editingUser.id, updates);
      toast.success("User updated successfully");
    } else {
      addAdminUser(formData);
      toast.success("User created successfully");
    }

    setIsModalOpen(false);
    setFormData(initialFormData);
  };

  const handleDelete = (userId) => {
    if (userId == currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    const user = adminUsers.find(
      (u) => u.id == userId
    );
    if (user?.role == "SUPER_ADMIN") {
      const otherUsers = adminUsers.filter(
        (u) =>
          u.role == "SUPER_ADMIN" &&
          u.id != userId
      );
      if (otherUsers.length == 0) {
        toast.error(
          "Cannot delete the last Super Admin"
        );
        return;
      }
    }

    deleteAdminUser(userId);
    toast.success("User deleted successfully");
  };

  const toggleUserStatus = (userId) => {
    const user = adminUsers.find(
      (u) => u.id == userId
    );
    if (!user) return;

    if (userId == currentUser?.id) {
      toast.error(
        "You cannot deactivate your own account"
      );
      return;
    }

    updateAdminUser(userId, {
      isActive: !user.isActive,
    });
    toast.success(
      `User ${
        user.isActive
          ? "deactivated"
          : "activated"
      } successfully`
    );
  };

  return (
    <div className="min-h-screen">
      <Header
        title="User Settings"
        subtitle="Manage admin users and assign roles"
      />

      <div className="space-y-6 p-6">
        {/* Role Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(ROLE_DESCRIPTIONS).map(
            ([role, info]) => (
              <Card key={role}>
                <div className="flex gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${info.color}`}
                  >
                    {role == "SUPER_ADMIN" ? (
                      <LuShield className="h-6 w-6" />
                    ) : (
                      <LuUserCheck className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">
                      {info.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {info.description}
                    </p>
                    <button
                      onClick={() =>
                        setShowPermissions(
                          showPermissions === role
                            ? null
                            : role
                        )
                      }
                      className="mt-2 text-sm font-medium text-primary hover:underline cursor-pointer"
                    >
                      {showPermissions == role
                        ? "Hide"
                        : "View"}{" "}
                      Permissions
                    </button>

                    {showPermissions == role && (
                      <ul className="mt-3 space-y-1">
                        {PERMISSIONS_BY_ROLE[
                          role
                        ].map((p, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            )
          )}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader
            title="Admin Users"
            subtitle={`${adminUsers.length} user(s) total`}
            action={
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 rounded-lg [background:var(--gradient-primary)] px-4 py-2 text-primary-foreground cursor-pointer"
              >
                <BiPlus className="h-4 w-4" />
                Add User
              </button>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-sm text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {u.name}
                        {u.id === currentUser?.id && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_DESCRIPTIONS[u.role].color}`}
                      >
                        {ROLE_DESCRIPTIONS[u.role].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          toggleUserStatus(u.id)
                        }
                        disabled={
                          u.id == currentUser?.id
                        }
                      >
                        <StatusBadge
                          status={
                            u.isActive
                              ? "active"
                              : "inactive"
                          }
                          label={
                            u.isActive
                              ? "Active"
                              : "Inactive"
                          }
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(
                        u.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleOpenEdit(u)
                          }
                          className="rounded-lg p-2 hover:bg-muted cursor-pointer"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(u.id)
                          }
                          disabled={
                            u.id == currentUser?.id
                          }
                          className={`rounded-lg p-2 hover:bg-muted disabled:opacity-50 ${u.id == currentUser?.id ? '' : 'cursor-pointer'}`}
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
        </Card>
      </div>

      {/* Create / Edit Modal */}
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingUser
            ? "Edit User"
            : "Create New User"
        }
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="h-10 rounded-lg border border-input px-4"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 rounded-lg [background:var(--gradient-primary)] px-4 text-primary-foreground"
            >
              {editingUser
                ? "Update User"
                : "Create User"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <input
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                name: e.target.value,
              }))
            }
            placeholder="Full name"
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                email: e.target.value,
              }))
            }
            placeholder="Email"
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                password: e.target.value,
              }))
            }
            placeholder="Password"
            className="w-full rounded-lg border px-3 py-2"
          />
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                role: e.target.value,
              }))
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="SUPER_ADMIN">
              Super Admin
            </option>
            <option value="REVIEW_SPECIALIST">
              Review Specialist
            </option>
          </select>
        </div>
      </CustomModal>
    </div>
  );
}


export default UserManagement;