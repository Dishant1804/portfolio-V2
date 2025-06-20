---
title: "Diving into Multi-stage Builds with Docker"
excerpt: "I slashed my Node.js application image size by 6 times! Docker often eats up a lot of memory (we all know that pain right?)"
author: Dishant Miyani
date: "2025-02-07"
---

I slashed my Node.js application image size by 6 times! Docker often eats up a lot of memory (we all know that pain right?)

Here's where Docker Multi-Stage builds changes the game completely. Traditional Dockerfiles often lead to bloated images due to unnecessary dependencies carried over from the build process. Multi-stage builds solve this by using multiple intermediate images, ensuring only the essentials make it to the final image, resulting in faster deployments and improved security.

---

## How Multi-Stage Builds Work

Multi-stage builds work by defining multiple `FROM` statements in a single Dockerfile. The first stage includes everything needed to build the application, like dependencies and compilers. The second stage, which is the final one, extracts only the compiled output, significantly reducing the image size. This approach is particularly useful for Node.js applications where `node_modules` and build artifacts can be large.

Let's dive into a real-world example that reduces image size by 80% while improving security:

---

## Traditional Dockerfile (The Problem)

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

**Issues with this approach:**
- This final image contains unnecessary build dependencies
- The image size is large (~500MB+)
- Security risks due to extra files being included

---

## Optimized Multi-Stage Build (The Solution)

```dockerfile
# First stage: build
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Second stage: production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

**Benefits of this approach:**
- The final image only contains the necessary runtime files
- Reduced image size (under 100MB)
- Improved security by avoiding unnecessary dependencies

---

## The Results

With this method, we achieve:

- **Better Efficiency**: Significantly smaller image sizes mean faster deployments
- **Enhanced Security**: Fewer components in the final image reduce attack surface
- **Improved Performance**: Lighter images consume less memory and start faster

Whether deploying to the cloud or optimizing CI/CD pipelines, multi-stage builds in Docker are a must-have for any serious developer.

---

## Key Takeaways

1. **Use Alpine Images**: The `node:18-alpine` base image is much smaller than the standard `node:18`
2. **Copy Only What's Needed**: Use `COPY --from=builder` to selectively copy files from build stage
3. **Separate Build and Runtime**: Keep build tools in the first stage, runtime essentials in the final stage
4. **Security First**: Fewer dependencies mean fewer potential vulnerabilities