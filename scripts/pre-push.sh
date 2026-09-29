#!/bin/sh
# pre-push — HARD. The same chain GitHub CI runs, against the commit being pushed.
#
# Tracked here so the gate is part of the tree it guards; .git/hooks/pre-push only execs this file
# (install: `npm run hooks`). A hook that lives only in .git/hooks is one nobody can review or restore.
#
# THE PUSH IS CHECKED, NOT THE WORKING TREE. `npm run ci` reads files on disk, so an uncommitted edit could
# turn a red commit green (or a green one red). A dirty tracked tree is refused, and a ref whose tip is not
# HEAD is refused too: the check would be measuring a different commit from the one leaving this machine.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

zero=0000000000000000000000000000000000000000
head=$(git rev-parse HEAD)
checked=0
while read -r local_ref local_sha remote_ref remote_sha; do
  [ "$local_sha" = "$zero" ] && continue   # a deletion pushes no code
  commit=$(git rev-parse "$local_sha^{commit}" 2>/dev/null || echo "$local_sha")
  # a tag on a commit HEAD already contains ships no code the chain below does not also check
  case "$local_ref" in refs/tags/*) git merge-base --is-ancestor "$commit" "$head" 2>/dev/null && continue ;; esac
  if [ "$commit" != "$head" ]; then
    echo "pre-push: RED — $local_ref ($local_sha) is not the checked-out HEAD ($head)."
    echo "pre-push: check it out and push from there, so the gate runs on the commit being pushed."
    exit 1
  fi
  checked=1
done

if [ "$checked" -eq 0 ]; then
  echo "pre-push: no branch tip to check (only deletions, or tags already contained in HEAD)."
  exit 0
fi

if ! git diff --quiet HEAD --; then
  echo "pre-push: RED — tracked files differ from HEAD; the gate would test the working tree, not the push:"
  git --no-pager diff --stat HEAD --
  echo "pre-push: commit or stash them, then push again."
  exit 1
fi

echo "pre-push: HARD — npm run ci on $head"
if ! npm run ci; then
  echo "pre-push: RED — npm run ci failed. Push BLOCKED."
  exit 1
fi

# The chain rewrites receipts on disk; a push that leaves the tree dirty shipped a proof it did not commit.
if ! git diff --quiet HEAD --; then
  echo "pre-push: RED — npm run ci changed tracked files; commit what it regenerated:"
  git --no-pager diff --stat HEAD --
  exit 1
fi
echo "pre-push: GREEN"
