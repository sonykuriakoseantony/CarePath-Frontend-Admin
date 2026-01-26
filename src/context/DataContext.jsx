import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  addDepartmentAPI,
  addDoctorAPI,
  addRuleAPI,
  editDepartmentAPI,
  editDoctorAPI,
  editRuleAPI,
  getAllDepartmentsAPI,
  getAllDoctorsAPI,
  getAllRulesAPI,
  getAllSymptomsAPI,
  removeDepartmentAPI,
  removeDoctorAPI,
  removeRuleAPI,
} from "../services/allAPI";
import { getAuthHeader } from "../utils/authHeader";

const DataContext = createContext(undefined);

/* -------------------- Initial Mock Data -------------------- */

const initialDepartments = [
  {
    id: "1",
    name: "General Medicine",
    description: "Primary care and general health concerns",
    isActive: true,
  },
  {
    id: "2",
    name: "Cardiology",
    description: "Heart and cardiovascular system",
    isActive: true,
  },
  {
    id: "3",
    name: "Orthopedics",
    description: "Bones, joints, and muscles",
    isActive: true,
  },
  {
    id: "4",
    name: "Neurology",
    description: "Brain and nervous system",
    isActive: true,
  },
  {
    id: "5",
    name: "Dermatology",
    description: "Skin conditions and disorders",
    isActive: true,
  },
];

const initialDoctors = [
  {
    _id: "1",
    name: "Emily Chen",
    email: "emily@medcare.com",
    departmentId: "1",
    specialization: "Internal Medicine",
    isAvailable: true,
  },
  {
    _id: "2",
    name: "Michael Ross",
    email: "michael@medcare.com",
    departmentId: "2",
    specialization: "Interventional Cardiology",
    isAvailable: true,
  },
  {
    _id: "3",
    name: "Lisa Park",
    email: "lisa@medcare.com",
    departmentId: "3",
    specialization: "Sports Medicine",
    isAvailable: true,
  },
  {
    _id: "4",
    name: "James Wright",
    email: "james@medcare.com",
    departmentId: "4",
    specialization: "Clinical Neurology",
    isAvailable: false,
  },
  {
    _id: "5",
    name: "Anna Miller",
    email: "anna@medcare.com",
    departmentId: "5",
    specialization: "Clinical Dermatology",
    isAvailable: true,
  },
];

const initialRules = [
  {
    id: "1",
    symptomKeywords: [
      "chest pain",
      "heart",
      "palpitations",
      "shortness of breath",
    ],
    departmentId: "2",
    priority: 1,
    confidenceWeight: 0.9,
  },
  {
    id: "2",
    symptomKeywords: ["headache", "migraine", "dizziness", "numbness"],
    departmentId: "4",
    priority: 1,
    confidenceWeight: 0.85,
  },
  {
    id: "3",
    symptomKeywords: ["back pain", "joint pain", "fracture", "sprain"],
    departmentId: "3",
    priority: 2,
    confidenceWeight: 0.8,
  },
  {
    id: "4",
    symptomKeywords: ["rash", "itching", "acne", "skin"],
    departmentId: "5",
    priority: 2,
    confidenceWeight: 0.85,
  },
  {
    id: "5",
    symptomKeywords: ["fever", "cold", "flu", "cough", "fatigue"],
    departmentId: "1",
    priority: 3,
    confidenceWeight: 0.7,
  },
];

const initialSymptoms = [
  {
    id: "1",
    patientName: "John Smith",
    patientEmail: "john@email.com",
    symptoms: "Experiencing chest pain and shortness of breath for 2 days",
    severity: "severe",
    duration: "2 days",
    status: "SUBMITTED",
    submittedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    patientName: "Mary Johnson",
    patientEmail: "mary@email.com",
    symptoms: "Persistent headache and occasional dizziness",
    severity: "moderate",
    duration: "1 week",
    status: "SUBMITTED",
    submittedAt: new Date(Date.now() - 172800000),
  },
  {
    id: "3",
    patientName: "Robert Davis",
    patientEmail: "robert@email.com",
    symptoms: "Lower back pain after lifting heavy objects",
    severity: "moderate",
    duration: "3 days",
    status: "AUTO_SUGGESTED",
    submittedAt: new Date(Date.now() - 259200000),
    suggestedDepartmentId: "3",
    suggestedDoctorId: "3",
    confidenceScore: 0.82,
  },
  {
    id: "4",
    patientName: "Sarah Wilson",
    patientEmail: "sarah@email.com",
    symptoms: "Skin rash with itching on arms",
    severity: "mild",
    duration: "5 days",
    status: "APPROVED",
    submittedAt: new Date(Date.now() - 345600000),
    suggestedDepartmentId: "5",
    suggestedDoctorId: "5",
    confidenceScore: 0.88,
    approvedAt: new Date(Date.now() - 172800000),
    adminNotes: "Patient scheduled for consultation",
  },
];

/* -------------------- Provider -------------------- */

export function DataProvider({ children }) {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [matchingRules, setMatchingRules] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  console.log(symptoms);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  useEffect(() => {
    fetchDepartments();
    fetchAllDoctors();
    fetchAllRules();
    fetchSymptomsRequests();
  }, []);

  /* ---------- Department CRUD ---------- */
  const fetchDepartments = async () => {
    try {
      console.log("Fetching dpts");

      setLoadingData(true);
      const headers = getAuthHeader();
      const res = await getAllDepartmentsAPI(headers);
      const depts = res.data;
      setDepartments(depts);
    } catch (error) {
      console.log("Failed to fetch departments", error);
    } finally {
      setLoadingData(false);
    }
  };

  const addDepartment = async (dept) => {
    const headers = getAuthHeader();
    try {
      const res = await addDepartmentAPI(dept, headers);
      if (res?.status == 200) {
        fetchDepartments();
      } else {
        console.log("Error adding Department.", res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateDepartment = useCallback(async (id, dept) => {
    const headers = getAuthHeader();
    try {
      const res = await editDepartmentAPI(id, dept, headers);
      if (res?.status == 200) {
        fetchDepartments();
      } else {
        console.log("Error adding Department.", res);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deleteDepartment = useCallback(async (id) => {
    const headers = getAuthHeader();
    try {
      const res = await removeDepartmentAPI(id, headers);
      if (res?.status == 200) {
        fetchDepartments();
      } else {
        console.log("Error deleting Department.", res);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  /* ---------- Doctors CRUD ---------- */
  const fetchAllDoctors = async () => {
    try {
      console.log("Fetching dpts");

      setLoadingData(true);
      const headers = getAuthHeader();
      const res = await getAllDoctorsAPI(headers);
      setDoctors(res.data);
    } catch (error) {
      console.log("Failed to fetch departments", error);
    } finally {
      setLoadingData(false);
    }
  };

  const addDoctor = async (doctor) => {
    const headers = getAuthHeader();
    try {
      const res = await addDoctorAPI(doctor, headers);
      if (res?.status == 200) {
        fetchAllDoctors();
        return true;
      } else {
        console.log("Error adding Doctors.", res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateDoctor = useCallback(async (id, doctor) => {
    const headers = getAuthHeader();
    try {
      const res = await editDoctorAPI(id, doctor, headers);
      if (res?.status == 200) {
        fetchAllDoctors();
      } else {
        console.log("Error adding Department.", res);
      }
    } catch (err) {
      console.log(err);
    }
    // setDoctors((prev) =>
    //   prev.map((d) => (d.id === id ? { ...d, ...doctor } : d)),
    // );
  }, []);

  const deleteDoctor = useCallback(async (id) => {
    const headers = getAuthHeader();
    try {
      const res = await removeDoctorAPI(id, headers);
      if (res?.status == 200) {
        fetchAllDoctors();
      } else {
        console.log("Error deleting Doctor.", res);
      }
    } catch (err) {
      console.log(err);
    }
    // setDoctors((prev) => prev.filter((d) => d.id !== id));
  }, []);

  /* ---------- Matching Rule CRUD ---------- */
  const fetchAllRules = async () => {
    try {
      console.log("Fetching Rules");

      setLoadingData(true);
      const headers = getAuthHeader();
      const res = await getAllRulesAPI(headers);
      setMatchingRules(res.data);
    } catch (error) {
      console.log("Failed to fetch Rules", error);
    } finally {
      setLoadingData(false);
    }
  };

  const addMatchingRule = useCallback(async (rule) => {
    const headers = getAuthHeader();
    try {
      const res = await addRuleAPI(rule, headers);
      if (res?.status == 200) {
        fetchAllRules();
        return true;
      } else {
        console.log("Error adding Symptom Matching Rule.", res);
      }
    } catch (err) {
      console.log(err);
    }
    // setMatchingRules((prev) => [...prev, { ...rule, id: generateId() }]);
  }, []);

  const updateMatchingRule = useCallback(async (id, rule) => {
    const headers = getAuthHeader();
    try {
      const res = await editRuleAPI(id, rule, headers);
      if (res?.status == 200) {
        fetchAllRules();
      } else {
        console.log("Error adding Symptom Matching Rule.", res);
      }
    } catch (err) {
      console.log(err);
    }
    // setMatchingRules((prev) =>
    //   prev.map((r) => (r.id === id ? { ...r, ...rule } : r)),
    // );
  }, []);

  const deleteMatchingRule = useCallback(async (id) => {
    const headers = getAuthHeader();
    try {
      const res = await removeRuleAPI(id, headers);
      if (res?.status == 200) {
        fetchAllRules();
      } else {
        console.log("Error deleting Symptom Matching Rule.", res);
      }
    } catch (err) {
      console.log(err);
    }
    // setMatchingRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  /* ---------- Symptoms request fetch ---------- */
  const fetchSymptomsRequests = async () => {
    try {
      console.log("Fetching Symptoms");

      setLoadingData(true);
      const headers = getAuthHeader();
      const res = await getAllSymptomsAPI(headers);
      setSymptoms(res.data);
    } catch (error) {
      console.log("Failed to fetch Symptoms", error);
    } finally {
      setLoadingData(false);
    }
  };

  /* ---------- Matching Logic ---------- */
  const runMatching = useCallback(
    async (symptomId) => {
      const symptom = symptoms.find((s) => s._id === symptomId);
      if (!symptom || symptom.status !== "submitted") return;

      const symptomText = symptom.symptoms.toLowerCase();
      let bestMatch = null;

      for (const rule of matchingRules) {
        const matchCount = rule.symptomKeywords.filter((k) =>
          symptomText.includes(k.toLowerCase()),
        ).length;

        if (matchCount > 0) {
          const confidence =
            (matchCount / rule.symptomKeywords.length) * rule.confidenceWeight;

          if (
            !bestMatch ||
            confidence > bestMatch.confidence ||
            (confidence === bestMatch.confidence &&
              rule.priority < bestMatch.priority)
          ) {
            bestMatch = {
              departmentId: rule.departmentId,
              confidence,
              priority: rule.priority,
            };
          }
        }
      }

      if (!bestMatch) return;

      const availableDoctors = doctors.filter(
        (d) => d.departmentId === bestMatch.departmentId && d.isAvailable,
      );

      const updatePayload = {
        status: "auto_suggested",
        suggestedDepartmentId: bestMatch.departmentId,
        suggestedDoctorId: availableDoctors[0]?._id || "",
        confidenceScore: Math.round(bestMatch.confidence * 100) / 100,
      };

      // 1️⃣ Save to DB
      const headers = getAuthHeader();
      await updateSymptomAPI(symptomId, updatePayload, headers);

      // 2️⃣ Update local state (instant UI update)
      setSymptoms((prev) =>
        prev.map((s) => (s._id === symptomId ? { ...s, ...updatePayload } : s)),
      );
    },
    [symptoms, matchingRules, doctors],
  );

  const approveSymptom = useCallback((id, notes) => {
    setSymptoms((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "approved",
              adminNotes: notes,
              approvedAt: new Date(),
            }
          : s,
      ),
    );
  }, []);

  const rejectSymptom = useCallback((id, notes) => {
    setSymptoms((prev) =>
      prev.map((s) =>
        s.id == id ? { ...s, status: "rejected", adminNotes: notes } : s,
      ),
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        departments,
        doctors,
        matchingRules,
        symptoms,
        loadingData,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addMatchingRule,
        updateMatchingRule,
        deleteMatchingRule,
        runMatching,
        approveSymptom,
        rejectSymptom,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

/* -------------------- Hook -------------------- */

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
