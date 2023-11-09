# Use an official Node.js runtime as the base image
FROM node:14

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install your application's dependencies
RUN npm install express body-parser express-session multer path fs sharp

# Bundle your app's source code inside the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "app.js"]
