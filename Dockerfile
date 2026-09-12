# QPU on hardware — Alpine + Node 22 + this unit. Builds on arm64 (Raspberry Pi 4/5) and amd64 alike:
#   docker buildx build --platform linux/arm64,linux/amd64 -t qpu .
# The image serves only after the unit has proven itself on this machine (boot.js runs qpu_prove first), and the
# HEALTHCHECK is that same proof. The seat stays empty: the simulator inside is the reference.
FROM node:22-alpine AS build
WORKDIR /qpu
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /qpu
ENV NODE_ENV=production PORT=8787
COPY --from=build /qpu/package.json /qpu/package-lock.json ./
COPY --from=build /qpu/dist ./dist
COPY --from=build /qpu/src/quantum/processing/unit/index.lean ./src/quantum/processing/unit/index.lean
COPY --from=build /qpu/qpu.d.ts /qpu/LICENSE /qpu/README.md /qpu/CITATION.cff /qpu/mcp.json /qpu/install.json ./
RUN npm ci --omit=dev --ignore-scripts
EXPOSE 8787
HEALTHCHECK --interval=60s --timeout=30s --start-period=20s CMD node dist/quantum/processing/unit/boot.js --prove || exit 1
CMD ["node", "dist/quantum/processing/unit/boot.js"]
