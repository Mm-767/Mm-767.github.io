---
title: "🐱 TokenCat — 메뉴바 냥캣 러너 & Claude 사용량 대시보드 기획안"
date: 2026-07-14
tags: ["개인프로젝트", "TokenCat"]
---

> **한 줄 정의**: macOS 메뉴바에서 픽셀 고양이가 뛰어다니고, Claude(Claude Code) 토큰 소모 속도가 빨라질수록 고양이도 빨라진다. 클릭하면 RunCat 스타일 팝오버로 5시간 세션·주간 사용량을 보여준다.
> 
> **레퍼런스 UX**: RunCat(메뉴바 러너 + 클릭 시 다크 팝오버) × 냥캣(픽셀 아트 + 무지개 트레일)
> 
> 작성일: 2026-07-14 · 이 문서는 Claude Code에 그대로 투입하는 구현 스펙임

* * *

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
| 공식 한도 % | Anthropic은 플랜별 정확한 한도를 수치로 공개하지 않음(Claude Code `/usage`로만 확인 가능). → **추정 모드**: 플랜 프리셋(아래 §6) 대비 사용률 계산 + "추정치" 라벨 표기. 설정에서 `/usage` 실측값으로 한도 보정(캘리브레이션) 가능하게 함 |
| 주의 | 2026-06-15부터 프로그래매틱 사용(Agent SDK, `claude -p` 등)은 별도 월간 크레딧 풀로 분리됨 — v1은 인터랙티브 사용량만 다룬다고 명시 |

**M0 스파이크(구현 첫날 필수)**: 실제 JSONL 3~4개를 열어 스키마 필드명 확인 → `docs/jsonl-schema.md`에 기록 후 파서 작성. 포맷이 다르면 이 문서보다 실물 우선.

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
🐱  세션 (5시간)  : 42.3%          ← 게이지 바, 남은 시간 "2시간 18분 후 리셋"
     토큰: 1.24M / 추정 한도 2.9M(추정)
────────────────────────────
📅  주간 사용량   : 61.0%          ← 게이지 바, "일요일 09:00 리셋(사용자 설정)"
     Opus 12% · Sonnet 88% (모델 비중)
────────────────────────────
🔥  현재 속도     : 8,420 tok/min  ← 최근 30분 스파크라인 미니 그래프
     상태: 달리기 🏃
────────────────────────────
💰  오늘         : 3.1M tokens · $12.40 (API 단가 환산 추정)
────────────────────────────
📦  플랜: Max 5x (추정 모드)       ← 클릭 시 설정으로 이동
```

**우측 버튼 열 (RunCat의 러너/스토어/설정 열 대응)**

*   🐾 러너: 스프라이트 테마 선택(v1은 고양이 1종 + 색상 3종)
    
*   📊 상세: 일별 사용 내역 시트(간단 테이블, v1.1)
    
*   🔄 새로고침: 즉시 재스캔
    
*   ⚙️ 설정: §F5
    
*   ⏻ 종료
    
*   게이지 바 색상: 0~60% 파랑 → 60~80% 노랑 → 80%+ 빨강.
    
*   모든 추정값에는 "(추정)" 라벨 — 정직한 UI가 신뢰를 만든다.
    

### F4. 알림

*   세션/주간 80%, 95% 도달 시 1회씩 macOS UserNotifications 발송. 예: "🐱 세션 한도 80% — 약 1시간 12분 분량 남음(현재 속도 기준)".
    
*   5시간 블록 리셋 시 "새 세션 시작!" 알림(옵션, 기본 off).
    

### F5. 설정 (UserDefaults)

*   플랜 선택: Pro / Max 5x / Max 20x / Custom(한도 직접 입력).
    
*   한도 캘리브레이션: "Claude Code에서 `/usage`가 보여주는 세션 % 입력" → 내부 추정 한도를 역산 보정.
    
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
│   └── PricingTable.swift      # 모델별 단가(모델명 프리픽스 매칭, 단가표는 JSON 리소스)
├── UI/                 PopoverView.swift, GaugeBar.swift, Sparkline.swift, SettingsView.swift
├── Services/           Notifier.swift, LaunchAtLogin.swift
└── docs/               jsonl-schema.md(M0 산출물)
```

**성능 예산**: 유휴 CPU < 0.5%(러너 프레임 타이머 포함), 메모리 < 50MB. 파싱은 백그라운드 큐, 풀스캔은 시작 시 1회만.

**대안 스택**(참고): Python + rumps로 반나절 MVP 가능하나 애니메이션 fps·배포에 한계 → 최종은 Swift 권장. Electron은 러너 앱 용도로 리소스 과다라 배제.

* * *

## 5\. 플랜 프리셋 (추정 한도 초기값)

정확한 한도는 비공개이므로 아래는 **초기 추정값 상수**로만 넣고, `/usage` 캘리브레이션으로 덮어쓰는 구조로 구현한다. (2026-05-06 5시간 한도 2배 상향 반영해 M0에서 최신 커뮤니티 추정치로 갱신할 것)

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
    
*   팝오버의 세션 토큰 합계가 `npx ccusage blocks`의 현재 블록과 오차 2% 이내.
    
*   플랜 변경·캘리브레이션 즉시 게이지에 반영.
    
*   80%/95% 알림이 각 1회만 발송된다.
    
*   유휴 CPU < 0.5% (Activity Monitor 기준).
    
*   추정값에는 항상 "(추정)" 라벨이 보인다.
    

* * *

## 8\. 리스크 & 대응

| 리스크 | 대응 |
| --- | --- |
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

*   ccusage 5시간 블록 리포트: [https://ccusage.com/guide/blocks-reports](https://ccusage.com/guide/blocks-reports)
    
*   실시간 모니터 선례(Claude-Code-Usage-Monitor): [https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor)
    
*   Claude Code 한도 해설(2026): [https://www.morphllm.com/claude-code-usage-limits](https://www.morphllm.com/claude-code-usage-limits)
    
*   사용량 확인 가이드(/usage): [https://sessionwatcher.com/guides/how-to-check-claude-code-usage](https://sessionwatcher.com/guides/how-to-check-claude-code-usage)
    
*   RunCat (UX 레퍼런스): [https://kyome.io/runcat/](https://kyome.io/runcat/)
