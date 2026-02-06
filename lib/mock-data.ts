export type RequestStatus = "uploaded" | "processing" | "ready" | "downloaded" | "issue";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface ProjectRequest {
  id: string;
  projectName: string;
  projectNumber: string;
  status: RequestStatus;
  files: UploadedFile[];
  includeBOM: boolean;
  notes?: string;
  basePrice: number;
  bomPrice: number;
  totalPrice: number;
  createdAt: Date;
  completedAt?: Date;
  paidAt?: Date;
  estimatedHours: number;
  deliverables?: {
    ifcFile?: { name: string; size: number };
    csvFile?: { name: string; size: number };
  };
}

export const mockUser = {
  id: "user-1",
  name: "Vedanshi",
  email: "vedanshi@example.com",
  company: "Structural Designs Co.",
};

export const mockRequests: ProjectRequest[] = [
  {
    id: "req-001",
    projectName: "Tower Block A - Phase 1",
    projectNumber: "STK-4521",
    status: "processing",
    files: [
      { id: "f1", name: "structural-drawings-tower-a.pdf", size: 15400000, type: "application/pdf" },
    ],
    includeBOM: true,
    notes: "Please prioritize the foundation sections. Need this for client review meeting.",
    basePrice: 450,
    bomPrice: 200,
    totalPrice: 650,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    estimatedHours: 4,
  },
  {
    id: "req-002",
    projectName: "Residential Complex B",
    projectNumber: "STK-4520",
    status: "ready",
    files: [
      { id: "f3", name: "residential-b-structural.pdf", size: 22100000, type: "application/pdf" },
    ],
    includeBOM: false,
    basePrice: 450,
    bomPrice: 0,
    totalPrice: 450,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    estimatedHours: 4,
    deliverables: {
      ifcFile: { name: "residential-b-stickmodel.ifc", size: 45200000 },
      csvFile: { name: "residential-b-elements.csv", size: 124000 },
    },
  },
  {
    id: "req-003",
    projectName: "Bridge Section C",
    projectNumber: "STK-4519",
    status: "uploaded",
    files: [
      { id: "f4", name: "bridge-section-c.pdf", size: 34500000, type: "application/pdf" },
    ],
    includeBOM: true,
    notes: "Complex geometry, please check the connection points carefully.",
    basePrice: 450,
    bomPrice: 200,
    totalPrice: 650,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    estimatedHours: 6,
  },
  {
    id: "req-004",
    projectName: "Commercial Plaza D",
    projectNumber: "STK-4518",
    status: "downloaded",
    files: [
      { id: "f5", name: "commercial-plaza-d.pdf", size: 18700000, type: "application/pdf" },
    ],
    includeBOM: true,
    basePrice: 450,
    bomPrice: 200,
    totalPrice: 650,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    completedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
    estimatedHours: 5,
    deliverables: {
      ifcFile: { name: "commercial-plaza-stickmodel.ifc", size: 52300000 },
      csvFile: { name: "commercial-plaza-bom.csv", size: 256000 },
    },
  },
  {
    id: "req-005",
    projectName: "Warehouse E",
    projectNumber: "STK-4517",
    status: "downloaded",
    files: [
      { id: "f7", name: "warehouse-e-structural.pdf", size: 9800000, type: "application/pdf" },
    ],
    includeBOM: false,
    basePrice: 450,
    bomPrice: 0,
    totalPrice: 450,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    completedAt: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000),
    estimatedHours: 3,
    deliverables: {
      ifcFile: { name: "warehouse-e-stickmodel.ifc", size: 28100000 },
      csvFile: { name: "warehouse-e-elements.csv", size: 98000 },
    },
  },
  {
    id: "req-006",
    projectName: "School Building F",
    projectNumber: "STK-4516",
    status: "downloaded",
    files: [
      { id: "f8", name: "school-building-f.pdf", size: 12300000, type: "application/pdf" },
    ],
    includeBOM: true,
    basePrice: 450,
    bomPrice: 200,
    totalPrice: 650,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    completedAt: new Date(Date.now() - 13.5 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 13.5 * 24 * 60 * 60 * 1000),
    estimatedHours: 4,
    deliverables: {
      ifcFile: { name: "school-building-stickmodel.ifc", size: 38900000 },
      csvFile: { name: "school-building-bom.csv", size: 178000 },
    },
  },
  {
    id: "req-007",
    projectName: "Parking Garage G",
    projectNumber: "STK-4515",
    status: "issue",
    files: [
      { id: "f9", name: "parking-garage-g.pdf", size: 5600000, type: "application/pdf" },
    ],
    includeBOM: false,
    basePrice: 450,
    bomPrice: 0,
    totalPrice: 450,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    estimatedHours: 4,
  },
];

export function getRequestById(id: string): ProjectRequest | undefined {
  return mockRequests.find((r) => r.id === id);
}

export function getActiveRequests(): ProjectRequest[] {
  return mockRequests.filter((r) => r.status !== "downloaded");
}

export function getPastRequests(): ProjectRequest[] {
  return mockRequests.filter((r) => r.status === "downloaded");
}

export function getStats() {
  const active = mockRequests.filter((r) => r.status !== "downloaded").length;
  const processing = mockRequests.filter((r) => r.status === "processing").length;
  const completed = mockRequests.filter((r) => r.status === "downloaded").length;
  const ready = mockRequests.filter((r) => r.status === "ready").length;

  return { active, processing, completed, ready };
}
