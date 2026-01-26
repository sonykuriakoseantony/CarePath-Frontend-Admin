import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import { Card, CardHeader } from "../components/common/Card";
import { BiPlus } from "react-icons/bi";
import StatusBadge from "../components/common/StatusBadge";
import { LuEye, LuPencil, LuShield, LuUserCheck } from "react-icons/lu";
import { GoTrash } from "react-icons/go";
import CustomModal from "../components/common/CustomModal";
import { addUserAPI, editUserAPI, getAllUsersAPI, removeUserAPI } from "../services/allAPI";
import { Link } from 'react-router-dom'

const ROLE_DESCRIPTIONS = {
  admin: {
    label: "Super Admin",
    description:
      "Full system access including user management, configuration, and all operations",
    color: "bg-primary text-primary-foreground",
  },
  review_specialist: {
    label: "Review Specialist",
    description:
      "Can view symptoms, run matching, approve/reject cases, and add notes",
    color: "bg-secondary text-secondary-foreground",
  },
};

const PERMISSIONS_BY_ROLE = {
  admin: [
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
  review_specialist: [
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
  phone: "",
  passwordHash: "",
  role: "review_specialist",
  isActive: true,
};

function UserManagement() {
  const {
    user
  } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [showPermissions, setShowPermissions] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    getAllAdminUsers()
    setCurrentUser(user)
  }, [])

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      passwordHash: "",
      role: "review_specialist",
      isActive: true,
    })
  }

  const getAllAdminUsers = async () => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      }
      try {
        const result = await getAllUsersAPI(reqHeader);
        const allUsers = result.data;
        const allAdmins = allUsers.filter(user => user.role == 'admin' || user.role == 'review_specialist')
        setAdminUsers(allAdmins)

      } catch (err) {
        console.log(err);
      }
    }
    else {
      console.log("No Token exists");
    }
  }

  const handleOpenCreate = () => {
    console.log("handleOpenCreate");

    setEditingUser(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!editingUser && !formData.passwordHash.trim()) {
      toast.error("Password is required for new users");
      return;
    }
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      }

      if (editingUser) {
        const updates = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          passwordHash: formData.passwordHash,
          role: formData.role,
          isActive: formData.isActive,
        };
        if (formData.passwordHash.trim()) {
          updates.passwordHash = formData.passwordHash;
        }
        try {
          const result = await editUserAPI(editingUser._id, updates, reqHeader)
          if (result.status == 200) {
            toast.success("User updated successfully");
          }
          else {
            toast.error("Something went wrong!")
            console.log(result);
          }
        } catch (err) {
          console.log(err);
        }
      } else {

        try {
          console.log("handleOpenCreate Submit");
          const result = await addUserAPI(formData, reqHeader);
          if (result.status == 200) {
            toast.success("User Added successfully");
          }
          else if (result.status == 409) {
            toast.warning(result.response.data);
          } else {
            toast.error("Something went wrong!")
            console.log(result);
          }
          //clear the form after api call response received
          handleResetForm();

        } catch (err) {
          console.log(err);
        }
      }
    }
    else {
      console.log("No Token exists");
    }

    setIsModalOpen(false);
    setFormData(initialFormData);
    getAllAdminUsers();
  };

  const handleDelete = async (userId) => {
    console.log(userId);

    if (userId == currentUser?._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    const user = adminUsers.find(
      (u) => u._id == userId
    );
    if (user?.role == "admin") {
      const otherUsers = adminUsers.filter(
        (u) =>
          u.role == "admin" &&
          u._id != userId
      );
      if (otherUsers.length == 0) {
        toast.error(
          "Cannot delete the last Super Admin"
        );
        return;
      }
    }
    // deleteAdminUser(userId);
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      }
      try {
        const result = await removeUserAPI(userId, reqHeader)
        if (result.status == 200) {
          toast.success("User deleted successfully");
        }
        else {
          toast.error("Something went wrong!")
          console.log(result);
        }
      } catch (err) {
        console.log(err);
      }
    }
    else {
      console.log("No Token exists");
    }
    getAllAdminUsers();
  };

  const toggleUserStatus = (userId) => {
    const user = adminUsers.find(
      (u) => u._id == userId
    );
    if (!user) return;

    if (userId == currentUser?._id) {
      toast.error(
        "You cannot deactivate your own account"
      );
      return;
    }

    updateAdminUser(userId, {
      isActive: !user.isActive,
    });
    toast.success(
      `User ${user.isActive
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
            subtitle={`${adminUsers?.length} user(s) total`}
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
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm text-muted-foreground">
                    Actions
                  </th>
                  <th className="px-4 py-3 text-right text-sm text-muted-foreground">

                  </th>
                </tr>
              </thead>
              <tbody>
                {adminUsers?.map((u, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {u?.name}
                        {u?.name === user?.name && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </p>
                      <p
                        className={`rounded-full px-2.5 py-1 inline-block text-xs font-medium ${ROLE_DESCRIPTIONS[u?.role]?.color}`}>
                        {ROLE_DESCRIPTIONS[u?.role]?.label}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div className="flex flex-col" style={{ fontSize: '12px' }}>
                        <p>{u?.email}</p>
                        <p>{u?.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          toggleUserStatus(u._id)
                        }
                        disabled={
                          u?._id == user?._id
                        }
                      >
                        <StatusBadge
                          status={
                            u?.isActive
                              ? "active"
                              : "inactive"
                          }
                          label={
                            u?.isActive
                              ? "Active"
                              : "Inactive"
                          }
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleOpenEdit(u)
                          }
                          className="transition-all duration-300 rounded-lg p-2 text-blue-800 bg-blue-50 hover:bg-blue-200 cursor-pointer"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(u._id)
                          }
                          disabled={
                            u?._id == user?._id
                          }
                          className={`transition-all duration-300 rounded-lg p-2 text-red-800 bg-red-50 hover:bg-red-200 disabled:opacity-50 ${u?._id == user?._id ? '' : 'cursor-pointer'}`}>
                          <GoTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-foreground text-right">
                      <Link title="View More Details" to={`/user/${u?._id}`} className="rounded-lg p-2 bg-status-approved/10 text-emerald-700 hover:bg-status-approved/25 cursor-pointer transition-all duration-300 inline-flex justify-center items-center">
                        <LuEye />
                      </Link>
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
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                phone: e.target.value,
              }))
            }
            placeholder="Phone"
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            type="text"
            value={formData.passwordHash}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                passwordHash: e.target.value,
              }))
            }
            placeholder="Password"
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            type="text"
            value={formData.isActive}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                isActive: e.target.value,
              }))
            }
            placeholder="Is Active"
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
            <option value="admin">
              Super Admin
            </option>
            <option value="review_specialist">
              Review Specialist
            </option>
          </select>
        </div>
      </CustomModal>

      <ToastContainer position="top-center" autoClose={3000} theme='colored' />
    </div>
  );
}


export default UserManagement;