

import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import { useData } from "../context/DataContext";
import { Card, CardHeader, StatCard } from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import { LuBuilding2, LuFileText } from "react-icons/lu";
import { FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";

function Dashboard() {
  const { symptoms, departments, doctors } = useData();
  const navigate = useNavigate();

  console.log(symptoms);

  // console.log(symptoms, departments, doctors);
  

  const submittedCount = symptoms.filter(
    (s) => s.status == "submitted"
  ).length;

  const suggestedCount = symptoms.filter(
    (s) => s.status == "suggested"
  ).length;

  const approvedCount = symptoms.filter(
    (s) => s.status == "approved"
  ).length;

  const activeDoctors = doctors.filter(
    (d) => d.isAvailable
  ).length;

  const recentSymptoms = symptoms
    .filter((s) => s.status == "submitted")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const getDepartmentName = (id) => {
    return (
      departments.find((d) => d._id == id)?.name ||
      "Pending"
    );
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Overview of symptom submissions and operations"
      />

      <div className="space-y-6 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending Review"
            value={submittedCount}
            icon={<FiClock className="h-6 w-6 text-red-400" />}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Awaiting Approval"
            value={suggestedCount}
            icon={<IoWarningOutline className="h-6 w-6 text-yellow-500" />}
          />
          <StatCard
            title="Approved Cases"
            value={approvedCount}
            icon={<FiCheckCircle className="h-6 w-6 text-green-500" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Active Doctors"
            value={`${activeDoctors}/${doctors.length}`}
            icon={<FiUsers className="h-6 w-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Submissions */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Recent Symptom Submissions"
              subtitle="Latest cases requiring attention"
              action={
                <button
                  onClick={() => navigate("/symptoms")}
                  className="cursor-pointer text-sm font-medium text-primary hover:underline"
                >
                  View All
                </button>
              }
            />

            <div className="space-y-3">
              {recentSymptoms.map((symptom, index) => (
                <div
                  key={symptom._id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-4 animate-slide-up"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <p className="truncate font-medium text-foreground">
                        {symptom.patientName}
                      </p>
                      <StatusBadge status={symptom.status} />
                    </div>

                    <p className="truncate text-sm text-muted-foreground">
                      {symptom.symptoms}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(
                        symptom.submittedAt
                      ).toLocaleDateString()}{" "}
                      •{" "}
                      {getDepartmentName(
                        symptom.suggestedDepartmentId
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/symptoms")}
                    className="cursor-pointer ml-4 rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    Review
                  </button>
                </div>
              ))}

              {recentSymptoms.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  No pending submissions
                </p>
              )}
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Departments */}
            <Card>
              <div className="flex justify-between">
                <CardHeader
                title="Departments"
                subtitle={`${departments.length} total`}
              />
                  <Link to={"/departments"} className="text-sm font-medium text-primary hover:underline">View All</Link>
                </div>
              
              <div className="space-y-2">
                {departments.slice(0, 4).map((dept) => (
                  <div
                    key={dept._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <LuBuilding2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {dept.name}
                      </span>
                    </div>
                    <StatusBadge
                      status={
                        dept.isActive ? "active" : "inactive"
                      }
                      label={
                        dept.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </div>
                ))}
                
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="gradient-hero border-0">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LuFileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold text-foreground">
                    Quick Actions
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {submittedCount > 0
                      ? `${submittedCount} submission(s) need review`
                      : "All caught up!"}
                  </p>

                  {submittedCount > 0 && (
                    <button
                      onClick={() =>
                        navigate("/symptoms")
                      }
                      className="cursor-pointer mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Start Review
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
