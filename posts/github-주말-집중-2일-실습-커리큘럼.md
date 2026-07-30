---
title: "GitHub 주말 집중 2일 실습 커리큘럼"
date: 2026-07-30
tags: ["GIT"]
series: "GIT"
---

> **대상**: 혼자 실습 (1인) · **환경**: CLI 중심 (터미널) · **분량**: 이틀 × 4~5시간 **교재 출처**: 「개발을 위한 Git과 Github」(Git 기초 개념) + 「알잘딱깔센 GitHub 핵심 개념 — GitHub로 협업하기」(브랜치 전략·Issues·pull 전략) **실습 소재**: 교재 예제와 동일한 **사칙연산 계산기(**`calculator.js`**)** 프로젝트를 이틀 내내 이어서 만듭니다.

* * *

## 0\. 시작 전 30초 요약

|  | Day 1 (혼자 Git 다루기) | Day 2 (GitHub로 협업하기) |
| --- | --- | --- |
| 목표 | 3-tree 모델을 손에 익히고, 브랜치·머지·충돌까지 스스로 해결 | 이슈 → 브랜치 → PR → 머지 사이클을 실제 레포에서 한 바퀴 완주 |
| 산출물 | 커밋 15개 이상 + 충돌 해결 1회 | 이슈 5개, PR 3개, 칸반 보드 1개, 자기만의 치트시트 |
| 핵심 감각 | "지금 내 파일이 어느 영역에 있지?" | "이 작업의 이슈 번호가 뭐지?" |

**1인 실습의 핵심 트릭**: 협업 상황(충돌, pull 전략)은 **같은 원격 레포를 두 폴더에 clone**해서 재현합니다. 계정 2개 없이도 "나 vs 팀원"을 완벽히 흉내 낼 수 있습니다.

```
~/git-practice/
├── calculator/        ← "나"의 작업 공간
└── calculator-teammate/  ← "팀원"의 작업 공간 (같은 레포를 clone)
```

* * *

# DAY 1 — 혼자 Git 다루기 (약 4.5h)

## Block 0 · 환경 세팅 (30분)

**목적**: 이후 8시간 동안 삽질을 만들지 않기 위한 사전 정리.

```bash
# 1) 설치 확인
git --version

# 2) 신원 등록 (모든 커밋에 새겨집니다)
git config --global user.name "본인이름"
git config --global user.email "GitHub에 등록한 이메일"

# 3) 기본 브랜치를 main으로
git config --global init.defaultBranch main

# 4) 한글 파일명 깨짐 방지 (macOS 필수)
git config --global core.precomposeunicode true
git config --global core.quotepath false

# 5) 확인
git config --list
```

**GitHub 인증 준비** — 둘 중 하나를 선택하세요.

*   **SSH 키 (권장)**
    
    ```bash
    ssh-keygen -t ed25519 -C "본인이메일"
    cat ~/.ssh/id_ed25519.pub    # 출력 내용을 GitHub → Settings → SSH and GPG keys → New SSH key 에 붙여넣기
    ssh -T git@github.com        # "successfully authenticated" 나오면 성공
    ```
    
*   **GitHub CLI (더 쉬움)**
    
    ```bash
    gh auth login    # 브라우저로 로그인. 이후 gh 명령으로 이슈·PR까지 터미널에서 처리 가능
    ```
    

> ⚠️ HTTPS + 비밀번호 방식은 더 이상 지원되지 않습니다. 반드시 SSH 키나 Personal Access Token을 쓰세요.

**✅ 체크포인트**: `git config --list`에 user.name/user.email이 보이고, `ssh -T git@github.com`(또는 `gh auth status`)이 성공한다.

* * *

## Block 1 · 3-tree 모델 체감하기 (60분)

**목적**: 교재의 _Working Directory → Staging Area → Local Repository_ 3단 구조를 "설명할 수 있는" 수준이 아니라 "손이 기억하는" 수준으로.

### 1-1. 레포 만들기

```bash
mkdir -p ~/git-practice/calculator && cd ~/git-practice/calculator
git init
ls -a          # .git 폴더 확인 — 이 안에 모든 히스토리가 들어갑니다
git status     # "No commits yet" 상태 관찰
```

### 1-2. 상태 변화를 눈으로 추적하기

각 명령 **직후마다 반드시** `git status`**를 치세요.** 이 블록의 진짜 학습 목표는 status 출력을 읽는 능력입니다.

```bash
echo 'function add(a, b) { return a + b; }' > calculator.js
git status     # ① Untracked files

git add calculator.js
git status     # ② Changes to be committed  ← staged 상태

echo 'function sub(a, b) { return a - b; }' >> calculator.js
git status     # ③ staged + not staged 가 동시에! (왜 그런지 스스로 설명해보기)

git add .
git commit -m "feat: add, sub 기능 구현"
git status     # ④ nothing to commit, working tree clean
```

> 🧠 **③번이 이 블록의 핵심입니다.** `git add`는 "파일"이 아니라 **그 시점의 스냅샷**을 스테이징합니다. 교재의 "A만 커밋하고 싶은데 B, C도 건드려버렸다" 시나리오가 바로 이것입니다.

### 1-3. 선택적 스테이징 연습 (교재 A·B·C 시나리오 재현)

```bash
echo 'function mul(a, b) { return a * b; }' > mul.js
echo 'function div(a, b) { return a / b; }' > div.js
echo '// 아직 미완성 실험' > experiment.js

git add mul.js div.js          # experiment.js는 일부러 제외
git status
git commit -m "feat: mul, div 기능 구현"
git status                     # experiment.js만 untracked로 남아있음 — 의도한 결과
```

### 1-4. `.gitignore` 실습

```bash
cat > .gitignore << 'EOF'
# 보안 — 절대 원격에 올라가면 안 되는 것
.env
*.key

# 의존성 / 빌드 산출물
node_modules/
dist/

# OS 잡파일
.DS_Store

# 개인 실험용
experiment.js
EOF

echo "API_KEY=super-secret-1234" > .env
git status     # .env와 experiment.js가 목록에서 사라짐

git add .gitignore
git commit -m "chore: gitignore 설정"
```

**🔥 함정 실습 (실무에서 제일 많이 당하는 것)**

```bash
# 이미 추적 중인 파일은 .gitignore에 넣어도 무시되지 않습니다
echo "config.json" >> .gitignore
touch config.json && git add config.json && git commit -m "test"
echo "changed" > config.json
git status     # ← 여전히 추적됨!

# 해결: 인덱스에서만 제거 (로컬 파일은 유지)
git rm --cached config.json
git commit -m "chore: config.json 추적 해제"
git status     # 이제 무시됨
```

**✅ 체크포인트**: `git status`의 세 가지 섹션(`Changes to be committed` / `Changes not staged` / `Untracked files`)이 각각 3-tree의 어느 영역인지 말로 설명할 수 있다.

* * *

## Block 2 · 히스토리 조회와 되돌리기 (45분)

**목적**: 교재의 `git log`·HEAD 파트 + "사고 쳤을 때 살아 돌아오는 법".

### 2-1. log 읽기

```bash
git log                                    # 기본
git log --oneline                          # 한 줄 요약 — 가장 많이 씁니다
git log --oneline --graph --all --decorate # 브랜치 구조 시각화 (Day 1 후반에 진가 발휘)
git log -p calculator.js                   # 특정 파일의 변경 내역 전체
git log --stat                             # 파일별 변경 줄 수 요약
```

**별칭 등록** (앞으로 `git lg` 한 번이면 끝):

```bash
git config --global alias.lg "log --oneline --graph --all --decorate"
```

### 2-2. HEAD 이해하기

```bash
cat .git/HEAD          # ref: refs/heads/main  ← HEAD는 "현재 브랜치를 가리키는 포인터"
git log --oneline -1   # HEAD가 가리키는 최신 커밋
git show HEAD          # 최신 커밋의 상세 내용
git show HEAD~1        # 그 이전 커밋
git diff HEAD~2 HEAD   # 두 커밋 사이의 차이
```

> 🧠 HEAD는 "내가 지금 서 있는 위치"입니다. `HEAD~1`은 한 칸 뒤, `HEAD~2`는 두 칸 뒤.

### 2-3. 되돌리기 3종 세트 — 상황별로 골라 쓰기

```bash
# ① 아직 add 안 한 변경 취소 (working directory)
echo "실수로 망친 코드" >> calculator.js
git restore calculator.js

# ② add는 했지만 commit 전 — 스테이징만 취소
git add calculator.js
git restore --staged calculator.js

# ③ 이미 커밋했는데 메시지만 고치고 싶다 (아직 push 전일 때만!)
git commit --amend -m "feat: mul, div 기능 구현 (오타 수정)"

# ④ 이미 push한 커밋을 되돌린다 → 되돌리는 "새 커밋"을 만든다 (안전)
git revert HEAD
```

> ⚠️ `git reset --hard`**는 이 커리큘럼에서 의도적으로 뒤로 미룹니다.** 작업 내용이 복구 불가능하게 날아갈 수 있어서, 위 4가지로 해결되지 않는 상황을 만난 뒤에 배우는 게 안전합니다. 참고로 사고가 나도 `git reflog`가 대부분 구해줍니다.

**✅ 체크포인트**: "add 전 취소 / add 후 취소 / commit 후 취소"를 각각 어떤 명령으로 하는지 보지 않고 쓸 수 있다.

* * *

## Block 3 · 원격 저장소 연결 (60분)

**목적**: 교재의 _local ↔ remote_ 개념을 실제로 왕복시켜 보기.

### 3-1. 원격 레포 만들고 연결

GitHub에서 **New repository** → 이름 `git-practice-calculator` → **Public** → README·gitignore·license는 **모두 체크 해제** (이미 로컬에 있으므로 충돌 방지).

```bash
git remote add origin git@github.com:{내아이디}/git-practice-calculator.git
git remote -v                  # origin이 fetch/push 두 줄로 보이면 성공
git branch -M main
git push -u origin main        # -u : 이후로는 git push만 쳐도 됨
```

> `gh` CLI를 쓴다면 한 줄로도 됩니다: `gh repo create git-practice-calculator --public --source=. --push`

### 3-2. 원격 → 로컬 왕복 실습

```bash
# GitHub 웹에서 README.md를 직접 만들고 커밋해보세요 (Add file → Create new file)
git pull                       # 웹에서 만든 커밋이 로컬로 내려옴
git log --oneline              # 두 개의 출처가 한 줄로 합쳐진 것 확인
```

### 3-3. "팀원" 클론 만들기 — Day 2 준비

```bash
cd ~/git-practice
git clone git@github.com:{내아이디}/git-practice-calculator.git calculator-teammate
cd calculator-teammate
git log --oneline              # 🔑 히스토리까지 통째로 복제됨 = 교재의 "분산 버전 관리"
```

> 🧠 clone은 파일 복사가 아니라 **저장소 전체(모든 커밋 이력 포함) 복제**입니다. 교재가 말한 \*"중앙에서 관리하던 모든 이력을 가진 저장소 전체를 복사하여 사용자의 컴퓨터로 가져온다"\*가 바로 이 명령 하나입니다.

**✅ 체크포인트**: 두 폴더에서 각각 `git log --oneline`을 쳤을 때 동일한 커밋 해시가 나온다.

* * *

## Block 4 · 브랜치와 머지, 그리고 충돌 (60분)

**목적**: 브랜치를 "무서운 것"에서 "그냥 폴더 같은 것"으로 만들기 + 충돌을 미리 한 번 겪어두기.

### 4-1. 브랜치 기본

```bash
cd ~/git-practice/calculator
git branch                          # 현재 브랜치 목록
git switch -c feature/pow           # 생성 + 이동 (구버전: git checkout -b)

cat >> calculator.js << 'EOF'
function pow(a, b) { return a ** b; }
EOF
git add . && git commit -m "feat: 거듭제곱 기능 추가"

git switch main
cat calculator.js                   # 🔑 pow가 없다! — 브랜치는 독립된 작업 공간
git lg                              # 갈라진 그래프 확인
```

### 4-2. Fast-forward 머지

```bash
git merge feature/pow               # "Fast-forward" 메시지 확인
git lg                              # 일직선으로 이어짐
git branch -d feature/pow           # 머지 끝난 브랜치는 지웁니다
```

> 🧠 **fast-forward**: main이 갈라진 뒤 아무 변화가 없었기 때문에, 포인터만 앞으로 밀면 끝. 교재 4.3의 `--ff-only`가 요구하는 바로 그 관계입니다.

### 4-3. 3-way 머지 + 충돌 만들기 (이 블록의 하이라이트)

```bash
# 브랜치 A: 입력값 검증 추가
git switch -c feature/validation
cat > calculator.js << 'EOF'
function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    return "숫자만 입력해주세요.";
  }
  return a + b;
}
EOF
git commit -am "fix: add 함수에 타입 검증 추가"

# main에서도 같은 줄을 건드립니다
git switch main
cat > calculator.js << 'EOF'
function add(a, b) {
  console.log("계산 시작");
  return a + b;
}
EOF
git commit -am "chore: 디버그 로그 추가"

# 충돌 발생!
git merge feature/validation
```

터미널에 `CONFLICT (content): Merge conflict in calculator.js`가 뜹니다. 파일을 열면:

```
<<<<<<< HEAD
  console.log("계산 시작");
=======
  if (typeof a !== "number" || typeof b !== "number") {
    return "숫자만 입력해주세요.";
  }
>>>>>>> feature/validation
```

**해결 순서**:

1.  `git status`로 충돌 파일 목록 확인
    
2.  `<<<<<<<`, `=======`, `>>>>>>>` **세 줄을 모두 지우고** 원하는 최종 코드로 정리 (양쪽을 다 살려도 됩니다)
    
3.  `git add calculator.js`
    
4.  `git commit` (머지 커밋 메시지가 자동으로 채워져 있음 — 그대로 저장)
    
5.  `git lg`로 두 갈래가 합쳐진 다이아몬드 모양 확인
    

```bash
# 겁이 나면 언제든 되돌릴 수 있습니다
git merge --abort
```

```bash
git push
git branch -d feature/validation
```

**✅ Day 1 최종 체크포인트**

*   `git status` 출력만 보고 현재 파일이 어느 영역에 있는지 안다
    
*   `git lg` 그래프에서 브랜치가 갈라지고 합쳐지는 지점을 짚을 수 있다
    
*   충돌 마커를 직접 지워서 머지를 완료해봤다
    
*   커밋이 15개 이상 쌓였다
    

> 🌙 **Day 1 마무리 과제 (10분)**: 오늘 쓴 명령어 중 손이 안 나갔던 것 5개를 `CHEATSHEET.md`로 만들어 커밋하세요. Day 2에도 계속 추가합니다.

* * *

# DAY 2 — GitHub로 협업하기 (약 4.5h)

## Block 5 · 브랜치 전략 정하기 (45분)

**목적**: 교재 1장. Git-flow와 GitHub-flow를 "읽어서" 아는 게 아니라 "골라서" 쓰기.

### 5-1. 둘의 차이 정리

|  | **Git-flow** | **GitHub-flow** |
| --- | --- | --- |
| 브랜치 | main, develop, feature, release, hotfix | main + 목적을 이름에 담은 브랜치 |
| 배포 | 정해진 릴리즈 주기 | 머지 즉시 배포 (CD) |
| 적합 | 버전이 명확한 대규모/설치형 제품 | 웹 서비스, 소규모 팀, 1인 프로젝트 |
| 비용 | 관리할 브랜치가 많음 | 단순하지만 main 품질 관리가 필수 |

> **이번 실습은 GitHub-flow로 진행합니다.** 혼자 하는 프로젝트에 Git-flow는 과합니다. 대신 Block 10에서 Git-flow를 구조만 한번 만들어봅니다.

### 5-2. 브랜치 네이밍 규칙 정하고 문서화

```bash
cd ~/git-practice/calculator
mkdir -p .github
cat > CONTRIBUTING.md << 'EOF'
# 브랜치 규칙 (GitHub-flow)

- `main` : 항상 배포 가능한 상태. 직접 push 금지, PR로만 머지.
- `feature/{설명}` : 새 기능      예) feature/percent
- `fix/{설명}`     : 버그 수정    예) fix/divide-by-zero
- `docs/{설명}`    : 문서
- `chore/{설명}`   : 설정·빌드

# 커밋 메시지 (Conventional Commits)

`{type}: {한 줄 요약}` — type은 feat / fix / docs / style / refactor / test / chore
예) feat: 나누기 0 예외 처리 추가
EOF
git add . && git commit -m "docs: 브랜치·커밋 규칙 문서화" && git push
```

### 5-3. main 브랜치 보호 (실무 감각)

GitHub 레포 → **Settings → Rules → Rulesets → New branch ruleset** (또는 Branches → Add branch protection rule)

*   Target: `main`
    
*   ✅ Require a pull request before merging
    
*   ✅ Block force pushes
    

> 이걸 켜두면 이후 실습에서 실수로 main에 직접 push할 수 없게 되어, PR 흐름을 강제로 몸에 익히게 됩니다.

**✅ 체크포인트**: main에 직접 push를 시도하면 거부당한다.

* * *

## Block 6 · Issues 제대로 쓰기 (60분)

**목적**: 교재 3장 전체. 이슈를 "할 일 메모"가 아니라 **작업의 단위이자 문서**로 쓰기.

### 6-1. 라벨 정리 (10분)

레포 → Issues → **Labels**. 기본 라벨 중 안 쓸 것은 지우고, 다음을 추가하세요.

| 라벨 | 색 | 용도 |
| --- | --- | --- |
| `feat` | `#0E8A16` | 새 기능 |
| `bug` | `#D73A4A` | 버그 |
| `docs` | `#0075CA` | 문서 |
| `refactor` | `#FBCA04` | 리팩터링 |
| `priority: high` | `#B60205` | 우선 처리 |

### 6-2. 마일스톤 만들기 (5분)

Issues → **Milestones** → New milestone

*   Title: `v1.0 — 기본 계산기 완성`
    
*   Due date: 오늘 날짜
    
*   Description: 사칙연산 + 예외 처리 + README 완성
    

### 6-3. 이슈 템플릿 만들기 (20분)

교재는 웹 UI(Settings → Set up templates) 경로를 안내하는데, **CLI로 직접 만드는 게 더 빠르고 정확합니다.**

```bash
mkdir -p .github/ISSUE_TEMPLATE

cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: 🐛 버그 리포트
about: 동작하지 않는 부분을 알려주세요
title: "[BUG] "
labels: bug
assignees: ''
---

## 무슨 일이 일어났나요?

## 재현 방법
1.
2.

## 기대한 결과

## 실제 결과

## 환경
- OS:
- Node 버전:
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: ✨ 기능 요청
about: 새로운 기능을 제안합니다
title: "[FEAT] "
labels: feat
assignees: ''
---

## 어떤 기능인가요?

## 왜 필요한가요?

## 완료 조건 (Definition of Done)
- [ ]
- [ ]
EOF

git add .github && git commit -m "chore: 이슈 템플릿 추가" && git push
```

레포 → Issues → **New issue**를 눌러 템플릿 선택 화면이 뜨는지 확인하세요.

### 6-4. 이슈 5개 생성 (25분)

아래 5개를 **템플릿을 써서** 만듭니다. 각각에 **Assignees(본인), Label, Milestone(v1.0)** 을 반드시 붙이세요.

| # | 제목 | 라벨 |
| --- | --- | --- |
| 1 | `[FEAT] 나머지 연산(mod) 기능 추가` | feat |
| 2 | `[BUG] 0으로 나눌 때 Infinity가 반환됨` | bug, priority: high |
| 3 | `[FEAT] 모든 함수에 타입 검증 추가` | feat |
| 4 | `[DOCS] README에 사용법과 예제 작성` | docs |
| 5 | `[FEAT] 계산 기록(history) 배열 저장` | feat |

**본문 작성 시 교재의 마크다운 기법을 최소 3개 이상 써보세요:**

*   `- [ ] 체크박스` — 완료 조건을 태스크로 쪼개기
    
*   `#2` — 다른 이슈 참조 (자동 링크됨)
    
*   ` ```js ` 코드 블록
    
*   파일 permalink — 코드 줄 클릭 → `···` → **Copy permalink** → 붙여넣으면 코드가 미리보기로 임베드됨
    
*   `@본인아이디` — 멘션
    

> `gh` CLI를 쓴다면: `gh issue create --title "[FEAT] 나머지 연산 추가" --label feat --assignee @me --milestone "v1.0 — 기본 계산기 완성"`

**✅ 체크포인트**: Issues 탭에서 `label:bug`, `milestone:"v1.0..."`, `assignee:@me`로 필터링이 동작한다.

* * *

## Block 7 · Projects 칸반 보드 (45분)

**목적**: 교재 2장. 진행 상황을 한눈에.

> 📌 **교재와 화면이 다릅니다.** 교재가 설명하는 `Basic kanban`, `Automated kanban` 같은 **classic 프로젝트 보드 템플릿은 현재 GitHub에서 제공되지 않습니다.** 지금은 새 Projects(Projects v2)로 통합되었고, 템플릿 선택 대신 **Board 뷰 + 자동화 워크플로우**를 직접 켜는 방식입니다. 개념(칸반 = 진행 단계를 열로 표현)은 그대로이니 아래 순서로 진행하세요.

### 7-1. 보드 만들기

1.  레포 → **Projects** → **Link a project → New project** → **Board** 선택
    
2.  이름: `계산기 v1.0`
    
3.  기본 컬럼: `Todo` / `In Progress` / `Done`
    

### 7-2. 이슈 연결

*   보드 하단 **\+ Add item** → `#`을 입력해 아까 만든 이슈 5개를 모두 추가
    
*   또는 각 이슈 우측 사이드바 **Projects**에서 연결
    

### 7-3. 자동화 켜기 (교재의 "Automated kanban"에 해당)

보드 우측 상단 `···` → **Workflows**에서 다음을 **Enable**:

*   `Item added to project` → Status: **Todo**
    
*   `Item reopened` → Status: **Todo**
    
*   `Item closed` → Status: **Done**
    
*   `Pull request merged` → Status: **Done**
    

### 7-4. 유용한 필드 추가 (선택, 5분)

`+` → New field

*   `Priority` (Single select: High / Medium / Low)
    
*   `Estimate` (Number, 예상 소요 시간)
    

이후 뷰를 **Group by: Status**, **Sort by: Priority**로 설정해보세요.

**✅ 체크포인트**: 이슈를 하나 close하면 보드에서 자동으로 Done으로 이동한다.

* * *

## Block 8 · Issue → 브랜치 → PR → Merge 완주 (60분)

**이 커리큘럼의 심장부입니다.** 아래 사이클을 **3번 반복**하세요. 3번째쯤이면 손이 알아서 움직입니다.

### 8-1. 1회차 — `#2` 0으로 나누기 버그 (표준 사이클)

```bash
cd ~/git-practice/calculator
git switch main && git pull                 # ① 항상 최신 main에서 출발

git switch -c fix/divide-by-zero            # ② 이슈에 대응하는 브랜치
```

```bash
cat > calculator.js << 'EOF'
function add(a, b) { return a + b; }
function sub(a, b) { return a - b; }
function mul(a, b) { return a * b; }

function div(a, b) {
  if (b === 0) {
    throw new Error("0으로 나눌 수 없습니다.");
  }
  return a / b;
}

module.exports = { add, sub, mul, div };
EOF

git add calculator.js
git commit -m "fix: 0으로 나눌 때 예외 발생하도록 수정

- b가 0이면 Error를 throw
- 기존에는 Infinity가 반환되어 이후 계산이 오염되는 문제가 있었음

resolve #2"                                  # ③ 커밋 메시지로 이슈 연결
git push -u origin fix/divide-by-zero
```

> 🧠 **이슈 종료 키워드** (교재 3.4.3): `close` / `closes` / `closed`, `fix` / `fixes` / `fixed`, `resolve` / `resolves` / `resolved` ※ 교재 원문에 `revolves`라고 적힌 것은 `resolves`**의 오타**입니다. ※ 이 키워드는 **기본 브랜치에 머지될 때** 이슈를 닫습니다. feature 브랜치에 커밋한 순간 바로 닫히지 않습니다.

**④ PR 생성**

```bash
gh pr create --title "fix: 0으로 나눌 때 예외 처리" --body "closes #2" --assignee @me
# 또는 push 후 터미널에 뜨는 GitHub 링크를 클릭
```

PR 본문에 반드시 포함할 것:

````markdown
## 관련 이슈
closes #2

## 변경 사항
- `div()`에서 b === 0일 때 Error throw

## 확인 방법
```js
div(10, 0)  // → Error: 0으로 나눌 수 없습니다.
````

## 체크리스트

*   로컬에서 동작 확인
    
*   커밋 메시지 규칙 준수
    

````

**⑤ 셀프 리뷰** — PR의 **Files changed** 탭에서 변경된 줄에 직접 코멘트를 달아보세요. 혼자여도 이 습관이 코드 품질을 크게 올립니다. "여기 왜 이렇게 했지?"를 스스로 설명하지 못하면 대개 문제가 있는 코드입니다.

**⑥ 머지**

```bash
gh pr merge --squash --delete-branch
````

*   **Squash and merge** 권장: 브랜치의 지저분한 커밋들이 main에 1개로 정리됩니다.
    
*   머지 직후 확인: 이슈 #2가 자동으로 **Closed** 되었는가? 프로젝트 보드에서 **Done**으로 이동했는가?
    

**⑦ 로컬 정리**

```bash
git switch main
git pull
git branch -d fix/divide-by-zero
git remote prune origin        # 원격에서 삭제된 브랜치 참조 정리
```

### 8-2. 2회차 — `#1` 나머지 연산 (`feature/mod`)

같은 사이클을 반복하되, 이번엔 **커밋을 3개로 쪼개서** 만들어보세요. 그리고 머지할 때 **Rebase and merge**를 선택해 히스토리 모양이 squash와 어떻게 달라지는지 `git lg`로 비교하세요.

### 8-3. 3회차 — `#4` README (`docs/readme`)

이번엔 PR을 올린 뒤 **일부러 리뷰 코멘트를 남기고, 그 지적을 반영하는 추가 커밋을 push**해보세요. PR에 커밋이 자동으로 추가되는 것을 확인합니다. (실무 PR의 90%가 이 흐름입니다.)

### 8-4. 이슈 재오픈 실습 (5분)

Issues → **Closed** 탭 → #2 → 코멘트로 _"음수 나눗셈에서 여전히 문제가 있습니다"_ 작성 → **Reopen issue**. 보드에서 Todo로 돌아가는지 확인하세요.

**✅ 체크포인트**: PR 머지 → 이슈 자동 close → 보드 자동 Done 까지 사람 손 안 대고 연결된다.

* * *

## Block 9 · pull 전략 3종 비교 (45분)

**목적**: 교재 4장. 이 블록에서 **"팀원" 클론**이 드디어 쓰입니다.

### 9-1. 왜 경고가 뜨는가

```bash
git pull
# warning: Pulling without specifying how to reconcile divergent branches is discouraged.
```

원격과 로컬이 **갈라졌을 때(divergent)** Git이 어떻게 합칠지 모르기 때문입니다. 선택지는 세 가지입니다.

### 9-2. 갈라진 상황 만들기

```bash
# "팀원"이 원격에 커밋을 올림
cd ~/git-practice/calculator-teammate
git pull
echo '// 팀원이 추가한 주석' >> README.md
git commit -am "docs: 팀원 코멘트 추가"
git push

# "나"는 그 사실을 모르고 로컬에서 다른 작업
cd ~/git-practice/calculator
echo '// 내가 추가한 주석' >> CHEATSHEET.md
git commit -am "docs: 내 메모 추가"
# 이제 로컬 1커밋 vs 원격 1커밋 → 갈라진 상태
```

### 9-3. 세 가지 방식 직접 비교

**① merge (**`pull.rebase false`**)** — 기본값

```bash
git -c pull.rebase=false pull
git lg
```

→ **merge commit이 하나 생깁니다.** 안전하지만 히스토리에 다이아몬드가 계속 쌓입니다.

되돌리고 다음 방식 시험:

```bash
git reset --hard HEAD~1   # ⚠️ 이 실습 상황에서만 안전하게 사용
```

**② rebase (**`pull.rebase true`**)**

```bash
git -c pull.rebase=true pull
git lg
```

→ **일직선.** 내 커밋이 원격 커밋 _위로_ 다시 얹힙니다(re + base). 커밋 해시가 **바뀐다**는 점이 핵심입니다.

**③ ff-only (**`pull.ff only`**)**

```bash
git -c pull.ff=only pull
# fatal: Not possible to fast-forward, aborting.
```

→ **아예 거부합니다.** 갈라진 상태를 자동으로 봉합하지 않고, 사용자에게 판단을 넘깁니다. 사고 방지에는 가장 안전합니다.

> ⚠️ 교재에 `git pull -ff -only`로 표기된 부분은 `git pull --ff-only`**(하이픈 두 개)** 가 맞습니다.

### 9-4. rebase 수동 실습 (교재 4.2.1)

```bash
git switch -c feature/history
echo 'const history = [];' >> calculator.js
git commit -am "feat: 계산 기록 배열 추가"

git switch main && git pull        # main이 앞서나간 상황을 만듭니다

git switch feature/history
git rebase main                    # ① feature의 히스토리를 main 기준으로 재정렬
git switch main
git merge feature/history          # ② 반드시 이 단계까지! rebase만 하면 main엔 반영 안 됩니다
git lg                             # 완벽한 일직선
```

> 🧠 교재가 특히 강조한 지점입니다. **rebase는 "정리"일 뿐 "반영"이 아닙니다.** rebase 후 merge까지 해야 main에 들어갑니다.

### 9-5. 팀 규칙 정하고 설정

```bash
# 개인 프로젝트 / 깔끔한 히스토리 선호
git config --global pull.rebase true

# 또는 가장 안전한 선택
git config --global pull.ff only

git config --list | grep pull      # 확인
git config --global --unset pull.rebase   # 되돌리기 (교재 4.4)
```

> 🚨 **rebase 절대 금지 상황**: **이미 push해서 남과 공유 중인 브랜치**는 rebase하지 마세요. 커밋 해시가 바뀌기 때문에 다른 사람의 히스토리와 어긋나 교재가 말한 \*"Git 꼬임"\*이 발생합니다. **rebase는 아직 내 로컬에만 있는 커밋에만.**

**✅ 체크포인트**: 세 옵션의 `git lg` 그래프 모양 차이를 그림으로 그려서 설명할 수 있다.

* * *

## Block 10 · Git-flow 구조 체험 + 회고 (30분)

### 10-1. Git-flow 뼈대 만들어보기 (15분)

혼자 쓸 일은 드물지만, 구조를 한 번 만들어보면 "왜 과한지"가 체감됩니다.

```bash
git switch main
git switch -c develop && git push -u origin develop

git switch -c feature/percent
echo 'function percent(a, b) { return (a / b) * 100; }' >> calculator.js
git commit -am "feat: 퍼센트 계산 추가"
git switch develop && git merge feature/percent

git switch -c release-1.0
# (여기서 테스트 및 버그 수정)
git switch main && git merge release-1.0
git tag -a v1.0.0 -m "첫 릴리즈"
git push origin main --tags

# hotfix 시뮬레이션
git switch -c hotfix-1
echo '// 긴급 수정' >> calculator.js
git commit -am "hotfix: 배포 후 발견된 오류 수정"
git switch main && git merge hotfix-1
git switch develop && git merge hotfix-1   # 🔑 develop에도 반드시 반영!

git lg                                      # 5개 브랜치의 흐름 확인
```

### 10-2. 회고 (15분)

`RETROSPECTIVE.md`를 만들어 커밋하세요.

```markdown
# 2일 실습 회고

## 가장 헷갈렸던 개념 3가지와 내 언어로 정리한 설명
1.
2.
3.

## 실습 중 실제로 만난 에러와 해결 방법
| 에러 메시지 | 원인 | 해결 |
|---|---|---|
| | | |

## 내일부터 실제 프로젝트에 바로 적용할 것 3가지
- [ ]
- [ ]
- [ ]
```

* * *

# 부록 A · 최종 자가진단 체크리스트

머지 않아 잊습니다. **1주일 뒤에 다시 이 표만 보고 실습 없이 답할 수 있는지** 확인하세요.

**개념**

*   Working Directory / Staging Area / Local Repo / Remote Repo의 차이를 설명할 수 있다
    
*   `.gitignore`가 **이미 추적 중인 파일에는 안 먹히는** 이유를 안다
    
*   HEAD가 무엇을 가리키는지 안다
    
*   merge와 rebase의 히스토리 차이를 그림으로 그릴 수 있다
    
*   fast-forward가 성립하는 조건을 안다
    
*   Git-flow와 GitHub-flow 중 상황에 맞는 것을 고를 수 있다
    

**실행**

*   충돌을 스스로 해결하고 머지를 완료할 수 있다
    
*   이슈 → 브랜치 → PR → 머지 → 이슈 자동 close 사이클을 혼자 완주할 수 있다
    
*   커밋 메시지만으로 이슈를 닫을 수 있다
    
*   잘못 커밋했을 때 상황별로 되돌릴 수 있다 (restore / --staged / amend / revert)
    
*   이슈 템플릿을 만들 수 있다
    

* * *

# 부록 B · 명령어 치트시트

```bash
# ── 설정 ──────────────────────────────
git config --global user.name "이름"
git config --global user.email "메일"
git config --list
git config --global --unset [항목]

# ── 기본 사이클 ────────────────────────
git init
git status                  # 습관적으로 자주!
git add .                   # git add -p 로 부분 스테이징도 가능
git commit -m "type: 메시지"
git push
git pull

# ── 조회 ──────────────────────────────
git log --oneline --graph --all --decorate
git show HEAD
git diff                    # working dir vs staging
git diff --staged           # staging vs 최신 커밋
git reflog                  # 사고 났을 때의 생명줄

# ── 되돌리기 ───────────────────────────
git restore <file>          # add 전 변경 취소
git restore --staged <file> # add 취소
git commit --amend          # 직전 커밋 수정 (push 전에만)
git revert <commit>         # 되돌리는 새 커밋 생성 (push 후 안전)

# ── 브랜치 ────────────────────────────
git switch -c feature/x     # 생성 + 이동
git switch main
git branch -d feature/x     # 머지된 브랜치 삭제
git merge feature/x
git merge --abort           # 충돌 시 탈출
git rebase main             # 주의: 공유된 브랜치엔 금지

# ── 원격 ──────────────────────────────
git remote -v
git remote add origin <url>
git clone <url> [폴더명]
git push -u origin main
git remote prune origin

# ── GitHub CLI ────────────────────────
gh issue create / gh issue list / gh issue close <n>
gh pr create / gh pr view --web / gh pr merge --squash --delete-branch
```

* * *

# 부록 C · 교재 내용 중 정정이 필요한 부분

실습 중 헷갈릴 수 있어 정리해둡니다.

| 교재 표기 | 정정 | 이유 |
| --- | --- | --- |
| `git pull -ff -only` | `git pull --ff-only` | 긴 옵션은 하이픈 두 개 |
| 종료 키워드 `revolves` | `resolves` | 원문 오타 |
| `git config --global branch.autosetuprebase always` | `git config --global pull.rebase true` | 전자는 _새로 만드는 브랜치_의 추적 설정이라 의도와 다르게 동작할 수 있음 |
| "rebase 시 feature 브랜치가 삭제된다" | 자동 삭제되지 않음 | rebase는 커밋을 재배치할 뿐, 브랜치 삭제는 `git branch -d`로 별도 수행 |
| Projects `Basic kanban` / `Automated kanban` 템플릿 | 현재 UI에 없음 | classic 프로젝트 보드가 Projects(v2)로 통합됨. Board 뷰 + Workflows로 동일 기능 구현 (Block 7 참고) |
| `git checkout -b` / `git checkout <branch>` | `git switch -c` / `git switch` | checkout도 계속 동작하지만, switch/restore로 역할이 분리되어 더 안전하고 명확 |

* * *

# 부록 D · 이틀 뒤 이어서 하면 좋은 것

1.  **GitHub Actions** — PR 올리면 자동으로 테스트 실행 (`.github/workflows/test.yml`)
    
2.  **PR 템플릿** — `.github/pull_request_template.md`
    
3.  `git stash` — 작업 중 급하게 브랜치 갈아탈 때
    
4.  `git cherry-pick` — 특정 커밋만 골라 가져오기
    
5.  **오픈소스 기여** — 관심 있는 레포에서 `good first issue` 라벨 찾아 실제 PR 보내기 (Fork → 수정 → PR)
    
6.  `git bisect` — 버그가 들어온 커밋을 이분 탐색으로 찾기
