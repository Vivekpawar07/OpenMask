# OpenMask

**Full stack anonymous social media app with AI features.**

---

### This project covers following domains:
1. Web Development (MERN Stack)
2. AI/ML(Fine-tunning LLM, Logistic Regression, Custom Transformer architecture based on Attention is all you needed research paper, Resnet50 , opencv , Vertor search, Unsupervised Machine Learning Algorithm(KNN), Custom Encoder-decoder architecture with Resnet 50 as encoder and LSTM as decoder.)
3. DevOps(Git, github, github actions ,Docker , AWS)

---

### **AI Features**:
1. Toxic Comment Detection
2. Grammar Error Correction
3. Text Style Transfer
4. Search User's Profile with Image
5. Tag Generation from Images (for better recommendation system)
6. Personalized Recommendation System
7. Nudity Detection (to prevent users from posting vulgar content, includes multi-class detection)
8. Gore Content Detection and Segmentation (for blurring blood and violence-related content)

---

### **Web Application Features**:
Includes basic social media application functionalities like follow, unfollow, post, like, comment, search, texting, etc.

1. **Anonymous Features**:
    - Anonymous Text Posting.
    - Anonymous Liking.
    - Anonymous Comments on Posts.
    - Anonymous Public Group Chats.

---

### **Setting up the Application in the Local System**:

#### 1. Frontend:

```bash
cd /client
npm i  # or npm install
npm run build  # for production build
npm start  # to start the development server
```

Note: Before starting the server, ensure you have your .env file in the client folder.

The .env should contain:
```bash
REACT_APP_BACKEND_SERVER_URL=your-backend-server-url
REACT_APP_GOOGLE_AUTH_CLIENT_ID=your-google-auth-client-id
```
To learn how to get the Google Auth Client ID, follow this tutorial.

#### 2.Backend (Node/Express):
```bash
cd /server
npm i  # or npm install
nodemon start  # to start the development server
```
Note: Before starting the server, ensure you have your .env file in the server folder.
The .env should contain:
```bash
PORT=your-server-port
MONGO_URL=your-mongodb-url  # Create a cluster on MongoDB Atlas, see this tutorial: https://youtu.be/VkXvVOb99g0?feature=shared
GOOGLE_AUTH_CLIENT_ID=your-google-auth-client-id
GOOGLE_AUTH_SECRET=your-google-auth-secret
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ML_BACKEND_SERVER=url-to-ml-backend
```

#### 3. ML Backend:
```bash
cd /ML-backend
```
If poetry is not installed:
```bash
pip install poetry
```
```bash 
poetry install
poetry shell
poetry env info --path
python app.py
```
By following the above steps, you should be able to run the application locally.

Note:

	1.	The website is not fully responsive.
	2.	ML model files are not yet uploaded to GitHub as some models are still pending (they will be uploaded soon).

Feel free to contribute, raise issues, or contact me:

	•	LinkedIn: https://www.linkedin.com/in/vivek-pawar-127b70293?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
	•	Email: vivekpawarvp07@gmail.com
