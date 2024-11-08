import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Hono } from "hono"
import { storage } from "../initializeFirebase.ts";


export const imageRoutes = new Hono()
    .post('/upload', async (c) => {
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`
    const storageRef = ref(storage, 'images/' + filename);
    const file = await c.req.blob()
    const metadata = {
        contentType: 'image/jpeg',
      };
    const snapshot = await uploadBytes(storageRef, file, metadata)
    const url = await getDownloadURL(snapshot.ref)
    return c.json({ message: 'Uploaded a blob or file! URL: ', url });
  })
  .get('/download', async (c) => {
    return c.json({ message: 'TEsting' });
  });
  