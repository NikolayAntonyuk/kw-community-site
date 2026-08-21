import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("API CRUD Operations", () => {
  const baseURL = "http://localhost:3010/api";
  let createdId = "";
  const dataFilePath = path.resolve(__dirname, "../../data/specialists.json");

  it("Create a new specialist directly via API", async () => {
    const res = await fetch(`${baseURL}/specialists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'API Test Specialist',
        category: 'IT',
        subcategory: 'QA Engineer',
        email: 'qa@example.com',
        status: 'approved'
      })
    });
    
    expect(res.ok).toBe(true);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.id).toBeDefined();
    createdId = json.id; // Save the auto-generated ID
  });

  it("Update existing specialist via API", async () => {
    const res = await fetch(`${baseURL}/specialists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: createdId,
        name: 'API Test Specialist UPDATED',
        status: 'approved'
      })
    });
    expect(res.ok).toBe(true);
  });

  it("Sync API should move the updated specialist to JSON and keep original ID", async () => {
    const res = await fetch(`${baseURL}/sync`, { method: 'POST' });
    expect(res.ok).toBe(true);
    
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const specialists = JSON.parse(fileContent);
    const found = specialists.find((s) => s.id === createdId);
    expect(found).toBeDefined();
    expect(found.name).toBe('API Test Specialist UPDATED');
  });

  it("Clean up the test specialist from JSON", async () => {
    // Manually clean up to avoid polluting test data
    let fileContent = fs.readFileSync(dataFilePath, 'utf8');
    let specialists = JSON.parse(fileContent);
    specialists = specialists.filter((s) => s.id !== createdId);
    fs.writeFileSync(dataFilePath, JSON.stringify(specialists, null, 2));
  });
});
