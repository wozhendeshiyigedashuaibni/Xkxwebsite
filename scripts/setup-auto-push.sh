#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

git config core.hooksPath .githooks

echo "✅ 已启用 Git hooks: core.hooksPath=.githooks"
echo "提示: 提交后将自动尝试 push 到 origin 当前分支。"
echo "如需临时禁用: AUTO_PUSH_TO_GITHUB=0 git commit -m 'msg'"
