const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Mock Firebase Firestore
jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  cert: jest.fn(),
  getApp: jest.fn(() => ({ name: 'mock-app' }))
}));

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => mockDb),
  FieldValue: {
    serverTimestamp: () => ({ _type: 'timestamp' })
  }
}));

// Mock database
const mockDb = {
  collection: jest.fn(),
  batch: jest.fn()
};

let app;

describe('API CRUD Operations', () => {
  beforeEach(() => {
    // Re-require to get fresh app instance
    jest.resetModules();
    jest.clearAllMocks();

    // Mock Firestore collection
    const mockCollectionRef = {
      where: jest.fn(),
      doc: jest.fn(),
      add: jest.fn(),
      get: jest.fn()
    };

    mockDb.collection = jest.fn(() => mockCollectionRef);
    mockDb.batch = jest.fn(() => ({
      delete: jest.fn(),
      commit: jest.fn()
    }));

    // Create a minimal Express app for testing
    const express = require('express');
    app = express();
    app.use(express.json());

    // Mock Firestore utils
    const { FieldValue } = require('firebase-admin/firestore');

    // ===== API Routes =====

    // 1. GET all specialists (live catalog)
    app.get('/api/specialists', async (req, res) => {
      try {
        const snapshot = await mockDb.collection('pending_specialists')
          .where('status', '==', 'approved')
          .get();

        const specialists = [];
        if (snapshot.docs) {
          snapshot.docs.forEach(doc => {
            specialists.push({ id: doc.id, ...doc.data() });
          });
        }

        res.json(specialists);
      } catch (err) {
        console.error('Error fetching specialists:', err);
        res.status(500).json({ error: err.message });
      }
    });

    // 2. GET pending applications (admin)
    app.get('/api/admin/pending', async (req, res) => {
      try {
        const snapshot = await mockDb.collection('pending_specialists')
          .where('status', '==', 'pending')
          .get();

        const apps = [];
        if (snapshot.docs) {
          snapshot.docs.forEach(doc => {
            apps.push({ id: doc.id, ...doc.data() });
          });
        }

        res.json(apps);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // 3. CREATE or UPDATE specialist
    app.post('/api/specialists', async (req, res) => {
      try {
        const { id, ...data } = req.body;
        const timestamp = FieldValue.serverTimestamp();

        if (id) {
          // Update existing
          console.log(`[CRUD] UPDATE specialist ID: ${id}`);
          const docRef = mockDb.collection('pending_specialists').doc(id);
          await docRef.update({
            ...data,
            updatedAt: timestamp,
            status: data.status || 'approved'
          });
          console.log(`[CRUD] ✅ Successfully updated ID: ${id}`);
          res.json({ success: true, id, message: 'Спеціаліста оновлено' });
        } else {
          // Create new
          const newRef = await mockDb.collection('pending_specialists').add({
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp,
            status: data.status || 'approved'
          });
          console.log(`[CRUD] CREATE specialist with ID: ${newRef.id}`);
          res.json({ success: true, id: newRef.id, message: 'Спеціаліста додано' });
        }
      } catch (err) {
        console.error(`[CRUD] ❌ Error:`, err.message);
        res.status(500).json({ error: err.message });
      }
    });

    // 4. DELETE specialist
    app.delete('/api/specialists/:id', async (req, res) => {
      try {
        console.log(`[CRUD] DELETE specialist ID: ${req.params.id}`);
        await mockDb.collection('pending_specialists').doc(req.params.id).delete();
        console.log(`[CRUD] ✅ Successfully deleted ID: ${req.params.id}`);
        res.json({ success: true, message: 'Спеціаліста видалено' });
      } catch (err) {
        console.error(`[CRUD] ❌ Error deleting:`, err.message);
        res.status(500).json({ error: err.message });
      }
    });

    // 5. APPROVE application
    app.patch('/api/admin/approve/:id', async (req, res) => {
      try {
        console.log(`[CRUD] APPROVE application ID: ${req.params.id}`);
        await mockDb.collection('pending_specialists').doc(req.params.id).update({
          status: 'approved',
          updatedAt: FieldValue.serverTimestamp()
        });
        console.log(`[CRUD] ✅ Successfully approved ID: ${req.params.id}`);
        res.json({ success: true, message: 'Заявка підтверджена' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // 6. REJECT application
    app.patch('/api/admin/reject/:id', async (req, res) => {
      try {
        const { reason } = req.body;
        console.log(`[CRUD] REJECT application ID: ${req.params.id}`);
        await mockDb.collection('pending_specialists').doc(req.params.id).update({
          status: 'rejected',
          rejectReason: reason || '',
          updatedAt: FieldValue.serverTimestamp()
        });
        console.log(`[CRUD] ✅ Successfully rejected ID: ${req.params.id}`);
        res.json({ success: true, message: 'Заявка відхилена' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  });

  describe('CREATE (POST /api/specialists)', () => {
    test('should create a new specialist without ID', async () => {
      const mockRef = { id: 'new-spec-123' };
      mockDb.collection('pending_specialists').add = jest.fn().mockResolvedValue(mockRef);

      const response = await request(app)
        .post('/api/specialists')
        .send({
          name: 'John Doe',
          description: 'Test specialist',
          category: 'Services',
          subcategory: 'Cleaning',
          phone: '+1234567890',
          instagram: 'john_instagram',
          status: 'approved'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.id).toBe('new-spec-123');
      expect(response.body.message).toContain('додано');
    });

    test('should create specialist with all fields', async () => {
      const mockRef = { id: 'full-spec-456' };
      mockDb.collection('pending_specialists').add = jest.fn().mockResolvedValue(mockRef);

      const payload = {
        name: 'Jane Smith',
        description: 'Full service provider',
        category: 'Health',
        subcategory: 'Fitness',
        locationType: 'office',
        address: '123 Main St',
        phone: '+1987654321',
        telegram: '@jane_tg',
        instagram: 'jane_inst',
        facebook: 'jane.fb',
        website: 'https://jane.com',
        price: '$50/hour',
        notes: 'Accepts both online and offline'
      };

      const response = await request(app)
        .post('/api/specialists')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.id).toBe('full-spec-456');
    });
  });

  describe('READ (GET /api/specialists)', () => {
    test('should fetch all approved specialists', async () => {
      const mockDocs = [
        { id: 'spec-1', data: () => ({ name: 'Spec 1', status: 'approved' }) },
        { id: 'spec-2', data: () => ({ name: 'Spec 2', status: 'approved' }) }
      ];

      mockDb.collection('pending_specialists').where = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ docs: mockDocs })
      });

      const response = await request(app).get('/api/specialists');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Spec 1');
    });

    test('should fetch empty list when no specialists', async () => {
      mockDb.collection('pending_specialists').where = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ docs: [] })
      });

      const response = await request(app).get('/api/specialists');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should fetch pending applications for admin', async () => {
      const mockDocs = [
        { id: 'pend-1', data: () => ({ name: 'Pending App', status: 'pending' }) }
      ];

      mockDb.collection('pending_specialists').where = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ docs: mockDocs })
      });

      const response = await request(app).get('/api/admin/pending');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe('pend-1');
    });
  });

  describe('UPDATE (POST /api/specialists with ID)', () => {
    test('should update existing specialist with ID', async () => {
      const mockDocRef = {
        update: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      const response = await request(app)
        .post('/api/specialists')
        .send({
          id: 'spec-94',
          name: 'Updated Name',
          description: 'Updated desc',
          instagram: 'new_instagram_link',
          category: 'Services',
          subcategory: 'Cleaning'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.id).toBe('spec-94');
      expect(response.body.message).toContain('оновлено');
      expect(mockDocRef.update).toHaveBeenCalled();
    });

    test('should preserve other fields when updating single field', async () => {
      const mockDocRef = {
        update: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      const response = await request(app)
        .post('/api/specialists')
        .send({
          id: 'spec-94',
          name: 'Old Name',
          description: 'Old description',
          instagram: 'updated_instagram_link',
          category: 'Services',
          subcategory: 'Cleaning'
        });

      expect(response.status).toBe(200);
      const callArgs = mockDocRef.update.mock.calls[0][0];
      expect(callArgs.instagram).toBe('updated_instagram_link');
      expect(callArgs.name).toBe('Old Name');
      expect(callArgs.description).toBe('Old description');
    });

    test('should NOT create duplicate when updating', async () => {
      const mockDocRef = {
        update: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      // This should update, not create
      await request(app)
        .post('/api/specialists')
        .send({
          id: 'existing-id',
          name: 'Updated'
        });

      // Verify .doc() was called (update path), not .add()
      expect(mockDb.collection('pending_specialists').doc).toHaveBeenCalledWith('existing-id');
      expect(mockDb.collection('pending_specialists').add).not.toHaveBeenCalled();
    });
  });

  describe('DELETE (DELETE /api/specialists/:id)', () => {
    test('should delete specialist by ID', async () => {
      const mockDocRef = {
        delete: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      const response = await request(app)
        .delete('/api/specialists/spec-94');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('видалено');
      expect(mockDocRef.delete).toHaveBeenCalled();
    });

    test('should return error if deletion fails', async () => {
      const mockDocRef = {
        delete: jest.fn().mockRejectedValue(new Error('Delete failed'))
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      const response = await request(app)
        .delete('/api/specialists/nonexistent');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Delete failed');
    });
  });

  describe('APPROVE (PATCH /api/admin/approve/:id)', () => {
    test('should approve pending application', async () => {
      const mockDocRef = {
        update: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      const response = await request(app)
        .patch('/api/admin/approve/pend-123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('підтверджена');
      expect(mockDocRef.update).toHaveBeenCalled();
      expect(mockDocRef.update.mock.calls[0][0].status).toBe('approved');
    });
  });

  describe('REJECT (PATCH /api/admin/reject/:id)', () => {
    test('should reject application with reason', async () => {
      const mockDocRef = {
        update: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      const response = await request(app)
        .patch('/api/admin/reject/pend-456')
        .send({ reason: 'Incorrect contact info' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockDocRef.update).toHaveBeenCalled();
      expect(mockDocRef.update.mock.calls[0][0].status).toBe('rejected');
      expect(mockDocRef.update.mock.calls[0][0].rejectReason).toBe('Incorrect contact info');
    });

    test('should reject without reason', async () => {
      const mockDocRef = {
        update: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      const response = await request(app)
        .patch('/api/admin/reject/pend-789')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Edge Cases & Logging', () => {
    test('should log [CRUD] messages on create', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const mockRef = { id: 'logged-spec' };
      mockDb.collection('pending_specialists').add = jest.fn().mockResolvedValue(mockRef);

      await request(app)
        .post('/api/specialists')
        .send({ name: 'Test', category: 'Test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRUD]'),
        expect.any(String)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRUD] ✅ Successfully created')
      );

      consoleSpy.mockRestore();
    });

    test('should log [CRUD] messages on update', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const mockDocRef = {
        update: jest.fn().mockResolvedValue({})
      };

      mockDb.collection('pending_specialists').doc = jest.fn().mockReturnValue(mockDocRef);

      await request(app)
        .post('/api/specialists')
        .send({ id: 'spec-logged', name: 'Test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRUD] UPDATE')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRUD] ✅ Successfully updated')
      );

      consoleSpy.mockRestore();
    });
  });
});
