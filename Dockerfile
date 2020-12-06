FROM node:14-alpine

# Update Package Manager
RUN apk update

# Add OS-level dependencies
RUN apk add git python gcc g++ make sqlite

# Primary Application Directory
WORKDIR /usr/src/app

# Copy over package-related files
COPY package*.json ./

# Install dependencies
RUN npm install
# RUN npm ci --only=production  # For production installations

# Bundle app source
COPY . .

# Set up database
RUN cat schema.sql | sqlite3 datacollection.db

# Networking Setup
EXPOSE 3000
ENV HOST=0.0.0.0

# Start Server
CMD [ "npm", "run-script", "backend" ]
