---
title: "ADR-18 미션 알림 발송 주체 — Supabase Edge Function + Supabase Cron Jobs"
date: 2026-09-16
tags: ["supabase", "fcm", "architecture", "adr"]
series: "PETOX 설계 결정 로그"
description: "저장소를 직접 뒤져 'FastAPI가 실제로는 한 번도 배포된 적 없다'는 사실 하나로 선택지를 좁힌 기록."
draft: false
---

상태: 채택 · ADR-005·ADR-002의 연장선

## 문제

일일 미션 할당 시 푸시 알림(설정 제어)을 보내야 하는데(P0), 발송 주체가 처음부터 미정이었다(ADR-005의 "당시 몰랐던 것"에도 남아있던 질문). `generate_daily_missions()`(ADR-005)가 매일 06:00에 미션 row를 만들지만, 실제로 유저 폰에 푸시를 보내는 코드는 어디에도 없다.

선택지를 비교하다가 결정적인 사실 하나를 확인했다: 이 프로젝트에서 FastAPI는 로컬 개발 환경과 CI 테스트에서만 돌고 있고, 프로덕션에 배포된 적이 한 번도 없다. TRD 문서의 AWS/Heroku/Railway는 전부 "예정"이라고만 적혀 있고, 같은 절에 예시로 실린 `.github/workflows/deploy.yml`도 실제로는 존재하지 않는 파일이다. 이게 이후 선택지 비교의 축 하나를 결정했다.

제약: 유저 기기 식별용 `fcm_token`을 저장할 컬럼조차 아직 없다(어느 옵션을 고르든 공통 선행 작업). FCM(Firebase Cloud Messaging)에 발송을 요청하려면 Google 서비스 계정으로 OAuth2 인증이 필요하다.

## 검토한 선택지

| 안 | 트리거(언제 실행) | FCM 호출 코드 위치 | 지금 바로 구현 가능? | FCM 인증 난이도 |
|---|---|---|---|---|
| A. pg_cron + pg_net → FastAPI | pg_cron (기존 미션 생성과 같은 스케줄러 재사용) | FastAPI 새 내부 엔드포인트, Python firebase-admin | 아니오 — FastAPI 배포부터 필요 | 낮음 — firebase-admin이 토큰 발급·갱신 자동 처리 |
| B. GitHub Actions 스케줄 → FastAPI | GitHub Actions cron (이미 CI에서 쓰는 도구) | FastAPI 새 내부 엔드포인트, Python firebase-admin | 아니오 — FastAPI 배포부터 필요 | 낮음 |
| C. Supabase Edge Function + Supabase Cron Jobs | Supabase 대시보드 Cron Jobs | Edge Function(Deno) | 예 — Supabase는 이미 떠 있는 서비스 | 중간 — Deno엔 firebase-admin이 없어 npm:firebase-admin 시도 또는 OAuth2 JWT 직접 서명 필요 |

## 결정

C. Supabase Edge Function + Supabase Cron Jobs로 간다. Edge Function이 매일 미션 생성 시각 이후 실행되어, DB에서 "오늘 미션 생성됨 + mission_alert 설정 켜짐 + fcm_token 존재" 조건에 맞는 유저를 조회하고 FCM으로 발송한다.

## 근거

A·B는 둘 다 "FastAPI가 인터넷에서 호출 가능한 주소를 갖고 있다"는 전제를 깔고 있는데, 그 전제 자체가 이 프로젝트에서 아직 성립하지 않는다. FastAPI를 AWS/Heroku/Railway 중 어디에 어떻게 배포할지는 서버 비용과 운영 방식이 걸린 더 큰 결정이고, 알림 기능 하나를 처리하려고 그 결정까지 지금 끌어와서 끝낼 이유는 없다고 판단했다.

Supabase 프로젝트는 이 앱의 DB·Auth 때문에 이미 항상 켜져 있는 서비스다. 여기에 Edge Function을 배포하면 그 자체로 인터넷에서 호출 가능한 주소가 생기고, Supabase Cron Jobs로 스케줄을 걸면 별도로 관리해야 할 배포 파이프라인이나 서버가 없다. 즉 C는 "FastAPI를 어디에 배포할지"라는 미해결 질문과 완전히 독립적으로 지금 바로 끝낼 수 있는 유일한 선택지였다.

B(GitHub Actions)는 A와 같은 FastAPI 배포 전제를 안고 있으면서, 추가로 GitHub 고유의 리스크가 있다: 스케줄 워크플로우는 그 레포에 60일간 커밋이 하나도 없으면 GitHub이 자동으로 비활성화한다. 매일 새벽 유저에게 알림을 보내는 기능이 "레포에 커밋을 안 하면 조용히 멈춘다"는 성질을 갖는 건 알아채기 어려운 프로덕션 리스크라 판단해 제외했다.

## 포기한 것

- Python `firebase-admin`의 성숙한 OAuth2 자동 처리(access token 발급·만료 전 자동 갱신을 라이브러리가 대신 해줌)를 포기한다. Deno(Edge Function 런타임)엔 동급 라이브러리가 없어서, `npm:firebase-admin`이 실제로 동작하는지는 검증이 필요했다.
- FastAPI를 "요청·응답 API"에서 "스케줄 job도 도는 곳"으로 확장하는 경로를 포기한다. 나중에 FastAPI가 실제로 프로덕션에 배포되면, 서버 로직이 Edge Function(Deno)과 FastAPI(Python) 두 군데로 나뉘어 있게 된다 — ADR-002가 이미 경고한 "시스템이 나뉘면 로직이 어디 있는지 헷갈릴 수 있다"는 비용의 연장선이다.

## 당시 몰랐던 것

`npm:firebase-admin`이 Deno/Supabase Edge Function 환경에서 FCM 메시징(`admin.messaging()`) 기능을 문제없이 지원하는지 아직 실제로 확인하지 않았다.

> **추가 (2026-09-16)**: 구현 시작하면서 제일 먼저 검증했다. 둘 다 확인: (1) `deno run`으로 단독 스파이크 — 진짜 RSA 키로 `admin.initializeApp` → `messaging.send()`를 호출하면 OAuth2 JWT 서명과 구글 토큰 교환 HTTP 요청까지 전부 정상 진행되고, 가짜 계정이라 마지막에만 `invalid_grant(account not found)`로 실패했다 — Deno 호환성 문제가 아니라 순수하게 가짜 계정이라서 생기는 실패임을 확인. (2) 실제 `supabase functions serve`(edge-runtime, 단순 Deno CLI가 아니라 실제 서빙 환경)로 `send-mission-notifications`를 만들고 HTTP로 호출해도 동일하게 동작(`{"sent":0,"failed":4}`, 순수하게 가짜 계정 탓이었던 것). 결론: OAuth2 JWT 직접 서명 fallback은 구현하지 않기로 함 — firebase-admin으로 확정.

`fcm_token`을 `profiles` 테이블에 컬럼 하나로 추가할지(1기기만 가정), 아니면 별도 `device_tokens` 테이블로 분리할지(멀티 디바이스 대응)는 "멀티 디바이스 요구사항이 없다"는 근거로 단일 컬럼을 가정만 하고 넘어갔다 — 명시적으로 확정한 결정은 아니다.

FastAPI가 나중에 실제로 프로덕션에 배포되면 이 결정을 다시 열어야 할 수도 있다(그 시점엔 A안의 전제가 성립하므로). 그때 재검토할 기준은 아직 정해지지 않았다.

> **추가 (2026-09-16, 배포 직후)**: 또 하나 몰랐던 것이 드러났다. 이 프로젝트가 이미 Supabase의 새 API 키 체계(publishable/secret)로 전환돼 있었다. 새 secret key는 JWT가 아니라서 원래 설계(Authorization: Bearer + 기본 verify_jwt=true)로는 플랫폼 게이트를 통과하기 전에 막혔다. 공식 문서 확인 후 수정: verify_jwt=false + npm:@supabase/server의 withSupabase({auth: 'secret:cron'})로 apikey 헤더의 키를 직접 검증하도록 바꿈. 프로덕션에 실제 호출해서 `{"sent":0,"failed":0}` 응답까지 확인 완료. legacy service_role 키는 존재는 하지만(Legacy 탭) Supabase가 2026년 말까지 폐지 예정이라 사용하지 않기로 함.
