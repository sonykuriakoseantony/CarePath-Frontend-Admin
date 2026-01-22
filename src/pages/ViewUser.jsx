import React, { useEffect, useState } from 'react'
import { viewUserAPI } from '../services/allAPI';
import { Link, useParams } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import Header from '../components/layout/Header';

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
  patient: {
    label: "Patient",
    description:
      "Cannot view or access any of the admin features",
    color: "bg-secondary text-secondary-foreground",
  }
};

function ViewUser() {

  const [userData, setUserData] = useState({})
  const { id } = useParams();

  useEffect(() => {
    getSingleUserById();
  }, [])

  const getSingleUserById = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Authorization": `Bearer ${token}`
      }
      // call api to get book details
      const result = await viewUserAPI(id, reqHeader);

      if (result.status == 200) {
        setUserData(result.data)
      }
      else {
        console.log(result);
      }
    }
  }

  return (

    <div>
      <Header
        title="User Settings"
        subtitle="Manage admin users and assign roles"
      />
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
        <div className='flex justify-end w-full max-w-lg py-6'>
          <Link to={'/user-settings'} className='inline-flex items-center justify-center gap-2 text-primary transition-all duration-300 hover:text-emerald-800 hover:bg-primary/10 p-3 rounded'> <BiArrowBack /> Back to Users</Link>
        </div>
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-emerald-600 pb-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xl">
              {userData?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {userData?.name}
              </h2>
              <p className="text-sm text-gray-500">{ROLE_DESCRIPTIONS[userData?.role]?.label}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <Detail label="Name" value={userData?.name} />
            <Detail label="Email" value={userData?.email} />
            <Detail label="Phone" value={userData?.phone || "-"} />

            {/* Disabled Password */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Password</span>

              <p className="w-40 text-right bg-gray-100 text-gray-400 border border-gray-200 rounded px-2 py-1 cursor-not-allowed">{userData?.passwordHash}</p>
            </div>

            <Detail label="Role" value={userData?.role} />
            <Detail
              label="Status"
              value={
                userData?.isActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )
              }
            />
            <Detail label="Created On" value={new Date(userData.createdAt).toLocaleDateString()} />
            <Detail label="Updated On" value={new Date(userData.updatedAt).toLocaleDateString()} />
          </div>
        </div>

      </div>
    </div>
  )
}

const Detail = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm text-gray-800 text-right">
      {value || "-"}
    </span>
  </div>
);

export default ViewUser