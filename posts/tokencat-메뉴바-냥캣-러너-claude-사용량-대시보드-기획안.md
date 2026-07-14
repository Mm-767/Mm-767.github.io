---
title: "🐱 TokenCat — 메뉴바 냥캣 러너 & Claude 사용량 대시보드 기획안"
date: 2026-07-14
tags: ["개인프로젝트", "TokenCat"]
thumbnail: "data:image/png;base64,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"
---

> **한 줄 정의**: macOS 메뉴바에서 픽셀 고양이가 뛰어다니고, Claude(Claude Code) 토큰 소모 속도가 빨라질수록 고양이도 빨라진다. 클릭하면 RunCat 스타일 팝오버로 5시간 세션·주간 사용량을 보여준다.
> 
> **레퍼런스 UX**: RunCat(메뉴바 러너 + 클릭 시 다크 팝오버) × 냥캣(픽셀 아트 + 무지개 트레일)
> 
> 작성일: 2026-07-14 · 이 문서는 Claude Code에 그대로 투입하는 구현 스펙임

* * *

![스크린샷 2026-07-14 18.08.05.png](data:image/png;base64,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)

## 1\. 목표 / 비목표

**목표**

*   코딩 중 시선 이동 없이 "지금 토큰을 얼마나 태우고 있는지"를 고양이 속도로 체감하게 한다.
    
*   클릭 한 번으로 5시간 세션 사용량, 주간 사용량, 오늘 토큰/추정 비용, 리셋 시각을 확인한다.
    
*   한도 임박(80%/95%) 시 고양이 상태 변화 + macOS 알림으로 "한도 초과 서프라이즈"를 방지한다.
    

**비목표 (v1에서 하지 않음)**

*   Windows/Linux 지원, 팀 단위 집계, 과거 통계 차트 화면, App Store 배포.
    

* * *

## 2\. 데이터 소스 (조사 결과 요약 — 구현 전 M0에서 재검증할 것)

| 항목 | 내용 |
| --- | --- |
| 원천 데이터 | `~/.claude/projects/**/*.jsonl` — Claude Code가 세션별 대화·usage를 기록. 각 assistant 메시지에 `message.usage`(input\_tokens, output\_tokens, cache\_creation\_input\_tokens, cache\_read\_input\_tokens)와 `timestamp`, `message.model`, `requestId` 포함 |
| 검증된 선례 | ccusage(CLI)가 동일 JSONL을 파싱해 일별/세션/5시간 블록 리포트 제공. 파싱·중복제거·단가 로직은 ccusage 소스를 참조 구현 |
| 5시간 블록 | 첫 활동 시각을 UTC 정시로 내림(floor)한 시점부터 5시간 창. ccusage와 동일 규칙 사용 |
| 주간 사용량 | 계정 리셋 시각은 비공개 → 기본값: 최근 7일 롤링 합계. 설정에서 "주간 리셋 요일/시각" 수동 입력 시 그 기준으로 계산 |
| **공식 사용량 % (게이지 1순위)** | **비문서화 OAuth usage 엔드포인트**: Claude Code가 로컬에 저장한 OAuth 토큰(`~/.claude/.credentials.json`의 `claudeAiOauth.accessToken`, macOS는 키체인일 수 있음)으로 Anthropic usage 엔드포인트를 조회하면 `/usage`와 동일한 **세션·주간 사용률(%)과 리셋 시각**을 응답받음. 이 값은 **웹/데스크톱 앱 사용량까지 합산된 계정 단위 공식 데이터**라서 플랜 선택·캘리브레이션 없이 게이지가 정확해짐. 운용 규칙: 폴링 180초 간격, 올바른 User-Agent 필수(아니면 429 지속), 액세스 토큰 약 60분 만료 → `refreshToken` 갱신 로직 필요. 선례: jens-duttke/usage-monitor-for-claude(Windows 트레이), Claude-Code-Usage-Monitor issue #202 |
| 추정 모드 (폴백) | 위 엔드포인트가 실패·변경된 경우: 플랜 프리셋(§5) 대비 JSONL 집계로 사용률 추정 + "(추정)" 라벨 + 설정에서 `/usage` 실측값 캘리브레이션 |
| 주의 | 2026-06-15부터 프로그래매틱 사용(Agent SDK, `claude -p` 등)은 별도 월간 크레딧 풀로 분리됨 — v1은 인터랙티브 사용량만 다룬다고 명시 |

**역할 분담(하이브리드)**: 팝오버의 세션/주간 **게이지 % = OAuth 엔드포인트(공식, 웹 사용량 포함)**, 고양이 속도·오늘 토큰·스파크라인 = **로컬 JSONL(초 단위 실시간, Claude Code분)**. 두 소스를 명확히 분리해 표기한다.

**M0 스파이크(구현 첫날 필수)**: ⑴ 실제 JSONL 3~4개를 열어 스키마 필드명 확인 → `docs/jsonl-schema.md`에 기록. ⑵ OAuth usage 엔드포인트를 실제 토큰으로 1회 호출해 응답 JSON 구조를 `docs/usage-endpoint.md`에 기록(위 선례 저장소 2곳의 구현을 먼저 읽을 것). 포맷이 다르면 이 문서보다 실물 우선.

* * *

## 3\. 핵심 기능 명세

### F1. 메뉴바 러너 (NSStatusItem)

*   22pt 높이 메뉴바에 픽셀 고양이 스프라이트 애니메이션 (프레임 순환).
    
*   스프라이트: 8프레임 달리기 사이클, 36×22pt(@1x)/72×44pt(@2x) PNG 시퀀스.
    
*   냥캣 오마주(팝타르트 몸통 + 무지개 트레일)는 **오리지널로 새로 그린 에셋** 사용(원작 냥캣 이미지 무단 사용 금지 — §9 리스크).
    
*   다크/라이트 메뉴바 대응: 컬러 스프라이트이므로 template image 사용하지 않고, 라이트 모드용 외곽선 버전 별도 제공.
    

### F2. 속도 매핑 (핵심 재미 요소)

*   신호: **burn rate = 최근 60초 토큰 소모량(tokens/min)**, EMA(α=0.3)로 스무딩.
    
*   5단계 상태 머신:
    

| 상태 | 조건 (tokens/min) | 애니메이션 | 프레임 간격 |
| --- | --- | --- | --- |
| 😴 잠자기 | 0 (5분 이상 무활동) | 웅크려 잠, Zzz 2프레임 | 1000ms |
| 🚶 산책 | 1 ~ 2,000 | 걷기 | 200ms |
| 🏃 달리기 | 2,000 ~ 10,000 | 달리기 | 100ms |
| 💨 질주 | 10,000 ~ 30,000 | 달리기(속도업) | 60ms |
| 🌈 무지개 모드 | 30,000+ | 달리기 + 무지개 트레일 | 40ms |

*   임계값은 `Thresholds.swift` 상수로 두고 설정에서 "민감도(낮음/보통/높음)" 3단 조절.
    
*   한도 임박 오버라이드: 세션 또는 주간 사용률 80% 이상이면 상태와 무관하게 고양이가 🥵 지친 표정 프레임, 95% 이상이면 ⚠️ 빨간 경고 프레임으로 전환.
    

### F3. 사용량 팝오버 (클릭 시 — RunCat 팝오버 레이아웃 그대로)

*   러너 클릭 → NSPopover(다크 머티리얼, 폭 약 360pt). 좌측 정보 카드 + 우측 버튼 열(첨부 스크린샷과 동일한 구조).
    

**좌측 정보 카드 (위→아래, 각 섹션 사이 구분선)**

```
🐱  세션 (5시간)  : 42.3% ✓공식     ← 게이지 바, "2시간 18분 후 리셋"(엔드포인트 값)
     Claude Code 소모: 1.24M tokens (JSONL 집계)
────────────────────────────
📅  주간 사용량   : 61.0% ✓공식     ← 게이지 바, 리셋 시각(엔드포인트 값)
     Opus 12% · Sonnet 88% (모델 비중, JSONL 기준)
────────────────────────────
🔥  현재 속도     : 8,420 tok/min  ← 최근 30분 스파크라인 미니 그래프
     상태: 달리기 🏃
────────────────────────────
💰  오늘         : 3.1M tokens · $12.40 (API 단가 환산 추정)
────────────────────────────
📦  데이터: 공식 연동 ✓ (폴백 시 "추정 모드")  ← 클릭 시 설정으로 이동
```

**우측 버튼 열 (RunCat의 러너/스토어/설정 열 대응)**

*   🐾 러너: 스프라이트 테마 선택(v1은 고양이 1종 + 색상 3종)
    
*   📊 상세: 일별 사용 내역 시트(간단 테이블, v1.1)
    
*   🔄 새로고침: 즉시 재스캔
    
*   ⚙️ 설정: §F5
    
*   ⏻ 종료
    
*   게이지 바 색상: 0~60% 파랑 → 60~80% 노랑 → 80%+ 빨강.
    
*   모든 추정값에는 "(추정)" 라벨 — 정직한 UI가 신뢰를 만든다.
    

**갱신 전략 (체감 실시간화)**

*   백그라운드: 공식 % 폴링은 180초 간격 유지(안전 간격, 429 방지).
    
*   **팝오버를 여는 순간 즉시 1회 재조회**(직전 조회가 30초 이내면 생략) → 사용자가 보는 시점엔 항상 최신값.
    
*   **보간 게이지**: 마지막 공식 % 위에, 그 이후 JSONL로 감지된 Claude Code 소모분을 추정 한도로 환산해 실시간으로 얹어 표시. 게이지 옆에 "공식 N분 전 · 보간 중" 캡션 표기. 웹에서 쓴 분량은 다음 폴링 때 따라잡음.
    
*   M0에서 usage 응답에 % 외 절대값(한도·잔여 토큰)이 포함되는지 확인 — 포함되면 보간 정확도를 그 값으로 높인다.
    

### F4. 알림

*   세션/주간 80%, 95% 도달 시 1회씩 macOS UserNotifications 발송. 예: "🐱 세션 한도 80% — 약 1시간 12분 분량 남음(현재 속도 기준)".
    
*   5시간 블록 리셋 시 "새 세션 시작!" 알림(옵션, 기본 off).
    

### F5. 설정 (UserDefaults)

*   공식 사용량 연동 on/off (기본 on — off 또는 실패 시 아래 추정 모드로 폴백).
    
*   (추정 모드용) 플랜 선택: Pro / Max 5x / Max 20x / Custom + `/usage` 실측값 캘리브레이션.
    
*   주간 리셋 요일·시각 입력. / 민감도 3단. / 로그인 시 자동 시작(SMAppService). / 폴링 주기(기본 3초).
    

* * *

## 4\. 기술 아키텍처

**스택**: Swift 5.9+ · SwiftUI(팝오버/설정) + AppKit(NSStatusItem) · macOS 13+ · Xcode 프로젝트(SPM). 서명·notarize 후 dmg 배포.

```
TokenCat/
├── App/                TokenCatApp.swift, AppDelegate.swift(NSStatusItem 소유)
├── SpriteEngine/       SpriteAnimator.swift(Timer/CVDisplayLink, 프레임 전환)
│                       SpriteState.swift(상태머신), Assets/cat_*.png
├── UsageCore/
│   ├── JSONLWatcher.swift      # ~/.claude/projects 재귀 감시(DispatchSource/FSEvents)
│   ├── JSONLParser.swift       # 증분 파싱(파일별 마지막 오프셋 기억), requestId 중복 제거
│   ├── UsageStore.swift        # 인메모리 집계 + 디스크 캐시(시작 시 풀스캔 1회, 이후 증분)
│   ├── BlockCalculator.swift   # 5시간 블록(UTC floor) / 주간 롤링 or 사용자 리셋 기준
│   ├── BurnRateMeter.swift     # 60초 창 tokens/min + EMA
│   ├── OAuthUsageProvider.swift# 공식 % 폴링(180s): 토큰 로드(credentials.json/키체인)
│   │                           #  + refreshToken 갱신 + User-Agent 준수, 실패 시 추정 모드 폴백
│   │                           #  ⚠ 토큰은 읽기 전용, Anthropic 외 어디에도 전송 금지
│   └── PricingTable.swift      # 모델별 단가(모델명 프리픽스 매칭, 단가표는 JSON 리소스)
├── UI/                 PopoverView.swift, GaugeBar.swift, Sparkline.swift, SettingsView.swift
├── Services/           Notifier.swift, LaunchAtLogin.swift
└── docs/               jsonl-schema.md(M0 산출물)
```

**성능 예산**: 유휴 CPU < 0.5%(러너 프레임 타이머 포함), 메모리 < 50MB. 파싱은 백그라운드 큐, 풀스캔은 시작 시 1회만.

**대안 스택**(참고): Python + rumps로 반나절 MVP 가능하나 애니메이션 fps·배포에 한계 → 최종은 Swift 권장. Electron은 러너 앱 용도로 리소스 과다라 배제.

* * *

## 5\. 플랜 프리셋 (폴백 전용 — 공식 연동 실패 시에만 사용)

게이지의 기본 소스는 §2의 OAuth 엔드포인트(공식 %)다. 아래 프리셋은 엔드포인트가 실패·변경됐을 때의 추정 모드에서만 쓰는 **초기 추정값 상수**이며, `/usage` 캘리브레이션으로 덮어쓴다. (2026-05-06 5시간 한도 2배 상향 반영해 M0에서 최신 커뮤니티 추정치로 갱신할 것)

```json
{
  "pro":    { "session_tokens_est": 500000,  "weekly_multiplier_est": 8 },
  "max5x":  { "session_tokens_est": 2500000, "weekly_multiplier_est": 8 },
  "max20x": { "session_tokens_est": 10000000,"weekly_multiplier_est": 8 },
  "custom": { "session_tokens_est": null,    "weekly_multiplier_est": null }
}
```

* * *

## 6\. 마일스톤

| 단계 | 내용 | 완료 기준 |
| --- | --- | --- |
| M0 (0.5일) | JSONL 스키마 실물 검증, ccusage 블록 로직 대조 | `docs/jsonl-schema.md` + 파서 단위테스트 통과 |
| M1 MVP (2일) | 메뉴바 러너 + burn rate 속도 연동 + 최소 팝오버(세션 게이지, 오늘 토큰) | 실사용 중 고양이 속도가 체감상 맞음 |
| M2 (2일) | 5시간 블록·주간 게이지, 플랜 설정·캘리브레이션, 스파크라인 | ccusage blocks 결과와 오차 < 2% |
| M3 (1~2일) | 알림, 지친 고양이 상태, 자동 시작, 서명·notarize, README | dmg 배포 가능 |

* * *

## 7\. 수용 기준 (Acceptance Criteria)

*   Claude Code에서 대화 시 3초 이내에 고양이 속도가 반응한다.
    
*   5분 무활동 시 고양이가 잠든다.
    
*   공식 연동 상태에서 팝오버의 세션/주간 %가 Claude Code `/usage` 표시값과 일치한다.
    
*   공식 연동을 끄면(또는 실패 시) 추정 모드로 자동 전환되고 "(추정)" 라벨이 붙는다.
    
*   팝오버의 세션 토큰 합계가 `npx ccusage blocks`의 현재 블록과 오차 2% 이내.
    
*   플랜 변경·캘리브레이션 즉시 게이지에 반영.
    
*   80%/95% 알림이 각 1회만 발송된다.
    
*   유휴 CPU < 0.5% (Activity Monitor 기준).
    
*   추정값에는 항상 "(추정)" 라벨이 보인다.
    

* * *

## 8\. 리스크 & 대응

| 리스크 | 대응 |
| --- | --- |
| 비문서화 usage 엔드포인트 변경·차단 | 추정 모드 자동 폴백(앱이 죽지 않게), 폴링 180초·User-Agent 준수, 응답 스키마 관용 파싱. OAuth 토큰은 로컬 읽기 전용 — Anthropic 외 전송 절대 금지 |
| Claude Code가 JSONL 포맷 변경 | 파서를 스키마-관용적으로(필드 누락 시 skip), 버전 감지 로그 |
| 공식 한도와 추정치 괴리 | "(추정)" 라벨 + `/usage` 캘리브레이션 + README에 한계 명시 |
| 냥캣 원작 저작권 | 스프라이트 전부 자체 제작(오마주 수준), 이름도 Nyan Cat 미사용 |
| 프로그래매틱 사용(별도 크레딧 풀) 혼입 | v1은 구분 없이 합산하되 README에 명시, v1.1에서 분리 표시 검토 |
| 다수 프로젝트 폴더로 시작 풀스캔 지연 | 디스크 캐시 + 파일 mtime 필터(최근 8일만) |

* * *

## 9\. Claude Code 시작 프롬프트 (복붙용)

```
이 저장소의 TokenCat_기획안.md를 읽고 구현해줘.
순서: M0부터. 먼저 ~/.claude/projects 에서 JSONL 샘플 3개를 읽어
실제 스키마를 docs/jsonl-schema.md로 정리하고, 기획안 §2와 다른 점을 보고해.
그다음 §4 구조로 Xcode(SPM) 프로젝트를 만들고 M1까지 진행해.
각 마일스톤 완료 시 §7 수용 기준을 스스로 체크해서 결과를 보여줘.
스프라이트는 우선 임시 단색 픽셀 고양이 8프레임을 코드로 생성해 사용하고,
에셋 교체가 쉽게 Assets 폴더 경로만 바꾸면 되게 해줘.
```

* * *

## 10\. 참고 자료

*   OAuth usage 엔드포인트 논의(Claude-Code-Usage-Monitor #202): [https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor/issues/202](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor/issues/202)
    
*   공식 % 트레이 앱 선례(usage-monitor-for-claude): [https://github.com/jens-duttke/usage-monitor-for-claude](https://github.com/jens-duttke/usage-monitor-for-claude)
    
*   ccusage 5시간 블록 리포트: [https://ccusage.com/guide/blocks-reports](https://ccusage.com/guide/blocks-reports)
    
*   실시간 모니터 선례(Claude-Code-Usage-Monitor): [https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor)
    
*   Claude Code 한도 해설(2026): [https://www.morphllm.com/claude-code-usage-limits](https://www.morphllm.com/claude-code-usage-limits)
    
*   사용량 확인 가이드(/usage): [https://sessionwatcher.com/guides/how-to-check-claude-code-usage](https://sessionwatcher.com/guides/how-to-check-claude-code-usage)
    
*   RunCat (UX 레퍼런스): [https://kyome.io/runcat/](https://kyome.io/runcat/)
