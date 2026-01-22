import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

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
    id: "1",
    name: "Emily Chen",
    email: "emily@medcare.com",
    departmentId: "1",
    specialization: "Internal Medicine",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Michael Ross",
    email: "michael@medcare.com",
    departmentId: "2",
    specialization: "Interventional Cardiology",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Lisa Park",
    email: "lisa@medcare.com",
    departmentId: "3",
    specialization: "Sports Medicine",
    isAvailable: true,
  },
  {
    id: "4",
    name: "James Wright",
    email: "james@medcare.com",
    departmentId: "4",
    specialization: "Clinical Neurology",
    isAvailable: false,
  },
  {
    id: "5",
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
    symptoms:
      "Experiencing chest pain and shortness of breath for 2 days",
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
  const [departments, setDepartments] = useState(initialDepartments);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [matchingRules, setMatchingRules] = useState(initialRules);
  const [symptoms, setSymptoms] = useState(initialSymptoms);

  const generateId = () =>
    Math.random().toString(36).substr(2, 9);

  /* ---------- Department CRUD ---------- */

  const addDepartment = useCallback((dept) => {
    setDepartments((prev) => [
      ...prev,
      { ...dept, id: generateId() },
    ]);
  }, []);

  const updateDepartment = useCallback((id, dept) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...dept } : d))
    );
  }, []);

  const deleteDepartment = useCallback((id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  /* ---------- Doctor CRUD ---------- */

  const addDoctor = useCallback((doctor) => {
    setDoctors((prev) => [
      ...prev,
      { ...doctor, id: generateId() },
    ]);
  }, []);

  const updateDoctor = useCallback((id, doctor) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...doctor } : d))
    );
  }, []);

  const deleteDoctor = useCallback((id) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  }, []);

  /* ---------- Matching Rule CRUD ---------- */

  const addMatchingRule = useCallback((rule) => {
    setMatchingRules((prev) => [
      ...prev,
      { ...rule, id: generateId() },
    ]);
  }, []);

  const updateMatchingRule = useCallback((id, rule) => {
    setMatchingRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...rule } : r))
    );
  }, []);

  const deleteMatchingRule = useCallback((id) => {
    setMatchingRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  /* ---------- Matching Logic ---------- */

  const runMatching = useCallback(
    (symptomId) => {
      setSymptoms((prev) =>
        prev.map((symptom) => {
          if (
            symptom.id !== symptomId ||
            symptom.status !== "SUBMITTED"
          )
            return symptom;

          const symptomText = symptom.symptoms.toLowerCase();
          let bestMatch = null;

          for (const rule of matchingRules) {
            const matchCount = rule.symptomKeywords.filter((k) =>
              symptomText.includes(k.toLowerCase())
            ).length;

            if (matchCount > 0) {
              const confidence =
                (matchCount / rule.symptomKeywords.length) *
                rule.confidenceWeight;

              if (!bestMatch || confidence > bestMatch.confidence) {
                bestMatch = {
                  departmentId: rule.departmentId,
                  confidence,
                };
              }
            }
          }

          if (bestMatch) {
            const availableDoctors = doctors.filter(
              (d) =>
                d.departmentId === bestMatch.departmentId &&
                d.isAvailable
            );

            return {
              ...symptom,
              status: "AUTO_SUGGESTED",
              suggestedDepartmentId: bestMatch.departmentId,
              suggestedDoctorId: availableDoctors[0]?.id,
              confidenceScore:
                Math.round(bestMatch.confidence * 100) / 100,
            };
          }

          return {
            ...symptom,
            status: "AUTO_SUGGESTED",
            suggestedDepartmentId: "1",
            suggestedDoctorId: doctors.find(
              (d) => d.departmentId === "1" && d.isAvailable
            )?.id,
            confidenceScore: 0.5,
          };
        })
      );
    },
    [matchingRules, doctors]
  );

  const approveSymptom = useCallback((id, notes) => {
    setSymptoms((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "APPROVED",
              adminNotes: notes,
              approvedAt: new Date(),
            }
          : s
      )
    );
  }, []);

  const rejectSymptom = useCallback((id, notes) => {
    setSymptoms((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "REJECTED", adminNotes: notes }
          : s
      )
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        departments,
        doctors,
        matchingRules,
        symptoms,
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
