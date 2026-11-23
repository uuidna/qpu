# syntax=docker/dockerfile:1
# qpu's one environment, Alpine throughout, so no host decides what quantum can run: Node 26 and pnpm, Lean v4.33.0
# built from source (Lean publishes glibc binaries only; Alpine is musl), Mathlib's cache, and wrangler through pnpm.
# CI runs every gate in the runtime stage, the devcontainer develops in it, and the Cloudflare Lean container serves
# the prover stage.
ARG NODE=node:26-alpine3.22@sha256:c7932b9e5e337b0e733d6e16abc1b0e104759e8b05e59ed56586cce967d26dfe

# Lean from source at the commit lean-toolchain names (v4.33.0), so Mathlib's cache, built by that commit, loads; it
# builds against GMP, libuv, OpenSSL 3 and the kernel headers, and the runtime stage carries the libraries it loads.
# mimalloc includes linux/prctl.h beside sys/prctl.h, which on musl both define struct prctl_mm_map: the fetched source
# drops the first, and every prctl constant it uses is guarded by #if defined, so musl's sys/prctl.h serves them.
FROM ${NODE} AS lean
RUN apk add --no-cache build-base cmake git gmp-dev libuv-dev openssl-dev linux-headers python3 bash ccache
ARG LEAN_COMMIT=d8b18978322de05a8f3dba51ef03cf5461676c17
RUN git clone --filter=blob:none https://github.com/leanprover/lean4 /src/lean4 \
 && git -C /src/lean4 checkout "${LEAN_COMMIT}" \
 && cmake -S /src/lean4 --preset release \
 && sed -i '/#include <linux\/prctl.h>/d' /src/lean4/build/release/mimalloc/src/mimalloc/src/prim/unix/prim.c \
 && make -C /src/lean4/build/release -j"$(nproc)" \
 && cp -r /src/lean4/build/release/stage1 /opt/lean

# The environment every gate runs in: Lean and lake on PATH, a C toolchain for lake to build executables, Node and pnpm
# (installed by npm: Node 25 and later ship no corepack), at the version the workflows pin.
FROM ${NODE} AS runtime
RUN apk add --no-cache build-base git bash gmp libuv libssl3 curl ca-certificates zstd \
 && npm install -g pnpm@10.34.9
COPY --from=lean /opt/lean /opt/lean
ENV PATH=/opt/lean/bin:${PATH}
WORKDIR /qpu

# The prover: qpu's Lean project with Mathlib's cache in place, served by alpine/prover-server.ts to the Prover Durable
# Object (src/quantum/net/prover-object.ts), which starts it with no internet. The project is root's and read-only to
# the unprivileged user the server runs as, so no check can change what the next one is checked against; only the gap
# run's own outputs are writable.
FROM runtime AS prover
COPY lean-toolchain lakefile.lean lake-manifest.json ./
COPY lean ./lean
RUN lake exe cache get && lake build \
 && touch .lake/build/gaps-0-of-3.jsonl .lake/build/gaps-1-of-3.jsonl .lake/build/gaps-2-of-3.jsonl .lake/build/gaps-index.ts
COPY alpine/prover-server.ts ./alpine/
RUN adduser -D -H prover && chown prover .lake/build/gaps-*
USER prover
EXPOSE 8080
CMD ["node", "alpine/prover-server.ts"]
