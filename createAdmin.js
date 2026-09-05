const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require('./firebase-key.json');

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const auth = getAuth();
auth.createUser({
  email: 'tetyana.chuchkevych@gmail.com',
  password: 'Password123!',
  displayName: 'Tetyana Chuchkevych'
})
.then((userRecord) => {
  console.log('Successfully created new user:', userRecord.uid);
  process.exit(0);
})
.catch((error) => {
  if (error.code === 'auth/email-already-exists') {
      console.log('User already exists');
      process.exit(0);
  }
  console.error('Error creating new user:', error);
  process.exit(1);
});
