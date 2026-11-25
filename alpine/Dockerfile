# syntax=docker/dockerfile:1
# qpu's one environment, Alpine throughout, so no host decides what quantum can run: Node 26 and pnpm, Lean v4.33.0
# built from source (Lean publishes glibc binaries only; Alpine is musl), Mathlib's cache, and wrangler through pnpm.
# CI runs every gate in the runtime stage, the devcontainer develops in it, and the Cloudflare Lean container serves
# the prover stage.
ARG NODE=node:26-alpine3.22@sha256:c7932b9e5e337b0e733d6e16abc1b0e104759e8b05e59ed56586cce967d26dfe
# glibc for workerd: the loader and libraries of Debian 12, at a pinned digest
ARG GLIBC=debian:bookworm-slim@sha256:734a72b3d6142a71993b4bc580ca01d8ca687f77a2c422d96a961d3376b179bc

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

FROM ${GLIBC} AS glibc

# The environment every gate runs in: Lean and lake on PATH, a C toolchain for lake to build executables, Node and pnpm
# (installed by npm: Node 25 and later ship no corepack), at the version the workflows pin. Lake links an executable,
# Mathlib's cache first, against GMP, libuv and OpenSSL by their unversioned libraries, which Alpine ships in the -dev
# packages; those pull in the runtime libraries.
FROM ${NODE} AS runtime
RUN apk add --no-cache build-base git bash gmp-dev libuv-dev openssl-dev curl ca-certificates zstd \
 && npm install -g pnpm@10.34.9
COPY --from=lean /opt/lean /opt/lean
# workerd, the runtime wrangler and miniflare start, is linked against glibc, which Alpine does not have: glibc's
# loader and libraries sit in a prefix of their own, and a wrapper runs the workerd the tree's dependencies install
# through that loader. Miniflare starts the wrapper (MINIFLARE_WORKERD_PATH).
COPY --from=glibc /usr/lib/x86_64-linux-gnu /opt/glibc
RUN printf '#!/bin/sh\nexec /opt/glibc/ld-linux-x86-64.so.2 --library-path /opt/glibc "${QPU_ROOT:-/qpu}"/node_modules/.pnpm/@cloudflare+workerd-linux-64@*/node_modules/@cloudflare/workerd-linux-64/bin/workerd "$@"\n' > /usr/local/bin/workerd \
 && chmod +x /usr/local/bin/workerd
# the tree is mounted at /qpu from a host whose user owns it: git trusts it there, so the machine door and the meaning
# gate read the repository inside the image as they do outside
RUN git config --system --add safe.directory /qpu
ENV PATH=/opt/lean/bin:${PATH} MINIFLARE_WORKERD_PATH=/usr/local/bin/workerd
WORKDIR /qpu

# The prover: qpu's Lean project with Mathlib's cache in place, served by alpine/prover-server.ts to the Prover Durable
# Object (src/quantum/net/prover-object.ts), which starts it with no internet. The project is root's and read-only to
# the unprivileged user the server runs as, so no check can change what the next one is checked against; only the gap
# run's own outputs are writable. Mathlib's cache unpacks its compiled files readable by their owner alone, so the layer
# that fetches them makes the project readable by every user and leaves it writable by root alone: a later layer would
# hold a second copy of every file whose mode it changed. Lean's environment is written once here, as lake names it, so
# no request runs lake; the last step checks one theorem that holds, one that does not and one that needs Mathlib, as
# the user the server runs as: an image whose prover gives a wrong answer, or none, is not built, so it is never
# deployed.
FROM runtime AS prover
COPY lean-toolchain lakefile.lean lake-manifest.json ./
COPY lean ./lean
RUN lake exe cache get && lake build \
 && touch .lake/build/gaps-0-of-3.jsonl .lake/build/gaps-1-of-3.jsonl .lake/build/gaps-2-of-3.jsonl .lake/build/gaps-index.ts \
 && chmod -R a+rX .lake
COPY alpine/prover-server.ts ./alpine/
RUN node alpine/prover-server.ts --write-env && adduser -D -H prover && chown prover .lake/build/gaps-*
USER prover
RUN node alpine/prover-server.ts --selftest
EXPOSE 8080
CMD ["node", "alpine/prover-server.ts"]
