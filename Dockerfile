FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy server code
COPY server ./

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "index.js"]
