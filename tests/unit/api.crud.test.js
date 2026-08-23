import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import request from "supertest";

const mockDocSet = vi.fn().mockResolvedValue(true);
const mockDocDelete = vi.fn().mockResolvedValue(true);

const mockCollectionRef = {
  where: vi.fn().mockReturnThis(),
  get: vi.fn().mockResolvedValue({ docs: [] }),
  doc: vi.fn(() => ({
    id: "mock-id",
    set: mockDocSet,
    delete: mockDocDelete
  })),
  add: vi.fn(),
  set: vi.fn(),
};

const mockDb = {
  collection: vi.fn(() => mockCollectionRef),
  batch: vi.fn(() => ({
    delete: vi.fn(),
    commit: vi.fn()
  }))
};

let app;

describe("API CRUD Operations via Supertest", () => {
  beforeAll(async () => {
    global.__TEST_DB__ = mockDb;
    process.env.NODE_ENV = 'test';
    // Dynamic import to avoid hoisting, so global is set before server.js runs
    const serverModule = await import("../../server.js");
    app = serverModule.default || serverModule;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockDocSet.mockClear();
  });

  it("Create a new specialist", async () => {
    const res = await request(app)
      .post("/api/specialists")
      .send({
        name: "Test User",
        category: "IT",
        status: "approved"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockDocSet).toHaveBeenCalled();
  });

  it("Update existing specialist", async () => {
    const fakeId = "mock-id-456";
    
    const res = await request(app)
      .post("/api/specialists")
      .send({
        id: fakeId,
        name: "Test User Updated"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBe(fakeId); 
    expect(mockDocSet).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Test User Updated" }),
      { merge: true }
    );
  });
});
