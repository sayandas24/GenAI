import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "virtual-mate-7878"
  });
}

export const adminAuth = admin.auth();
