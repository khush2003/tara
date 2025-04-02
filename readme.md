Please visit the thesis document to see more details about this project including screenshots

To setup and install the project follow the following steps:

## Prerequisites
---
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Create a MongoDb Atlas Account and create a cluster database: https://www.mongodb.com/products/platform/atlas-database
	1. Be sure to set network access to 0.0.0.0
	2. Copy the password and connection string to example.env in setup
3. Create a Firebase Project and copy project information to example.env: https://firebase.google.com/. You may need to add your billing info.
	1. Create a firebase project, name it whatever you like
	2. Create a Firebase Storage product
	3. Add a web application and you should get the project information, copy paste it into the example.env in backend.
4. Create an openrouter account and create an api key: https://openrouter.ai/. Copy the api key to example.env in frontend > student_portal



## Setup
---
1. Go to backend and fill in the example.env file by using the keys and info from created account
2. Go to frontend > student potal and fill in the example.env using the API key from openrouter
3. Rename the example.env in backend example.env in frontend/student_portal to .env
4. Type `docker compose up --build` in a terminal to build and run the project.
5. The application should be running properly. You can test with the following urls:
	1. `localhost:8080` For Student Portal
	2. `localhost:8081` For Teacher Portal
	3. You can access game through student portal
	4. You can access backend api through `localhost:8080/api/v1 ... routes`

## Additional Steps:
---
### Course Data

You can import the already created 8 units into the database by running `bun run upload` in the backend docker container. To do this please follow the following steps:

1. Make sure the docker containers are running. If they are not, you can run them with `docker compose up`
2. In a separate terminal, List the running containers with running `docker ps` in the terminal
3. Copy the **CONTAINER ID** for `tara-backend`
4. Run `docker exec -it <CONTAINER ID> bash` in the terminal. Make sure to replace `<CONTAINER ID>` with the id you copied in step 3. Example: `docker exec -it 56eaa55894a4 bash`
5. You should now be in a bash environment
6. Upload the course data with the command `bun run upload`

### Information of students
---
Name: Passapol Phukang
Email: Passapol.phuk@kmutt.ac.th 
Address: 379, 3 Thai Raman rd. Sam Wa Tawan Tok, Khlong Sam Wa, Bangkok 10510 
Phone: 0925514453

Name: Khush Agarwal
Email: khush.mui.op@gmail.com
Address: House No.1229/17, Soi Charoen Krung 47/2, Bangrak, Bangkok, 10500
Phone: 0921979782

Name: Ratchanon 
Email: ratchanontraitiprat@gmail.com
Address: 57/99 moo.8 Naklua Phra samut chedi Samutprakarn, 10290
Phone: 0629359922
