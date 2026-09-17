---
title: "ADR-001 백엔드 플랫폼 — Supabase"
date: 2026-09-10
tags: ["supabase", "postgresql", "architecture", "adr"]
series: "PETOX 설계 결정 로그"
description: "3주짜리 해커톤에서 백엔드 1명이 DB·인증·저장소를 왜 플랫폼 하나로 묶었는지."
draft: false
---

## 문제

PETOX 백엔드에 필요한 것: 데이터베이스 + 인증(구글·카카오·네이버 소셜 로그인) + 파일 저장(반려동물 사진) + 약간의 서버 로직(코인·구매·미션 추천).

제약 조건:
- 최종 제출까지 약 3주, BE 담당 1명
- 비용 최소화 — 무료 티어 안에서, 한도 초과 없이
- 한국 사용자 대상 → 낮은 지연
- 학습 목표: 관계형 DB 설계·SQL·RLS, 그리고 FastAPI
- AI 파트는 온디바이스 ML Kit라서 서버와 무관 — "AI 서버"는 필요 없음

## 검토한 선택지

| 안 | DB | 인증 | 배포할 조각 | 서울 리전 | 학습 적합성 |
|---|---|---|---|---|---|
| A. Supabase | Postgres | 내장, 구글·카카오 네이티브 | 없음 | 있음 (ap-northeast-2) | 관계형·SQL·RLS 그대로 배움 |
| B. Firebase | Firestore (NoSQL) | 내장, 구글만 네이티브 / 카카오·네이버 직접 | 없음 | 있음 (asia-northeast3) | NoSQL — 관계형 학습 목표와 불일치 |
| C. Neon + FastAPI 직접 | Postgres | 직접 구현 | DB·백엔드·인증 3조각 | 없음 (싱가포르 최근접) | 다 배우지만 3주엔 과함 |
| D. Vercel + Neon + Auth.js | Postgres | 서드파티 라이브러리 | 프론트·API·DB | 부분 | JS/Next 스택 — FastAPI 목표와 불일치 |

## 결정

A. Supabase. Postgres + Auth + Storage + Edge Functions를 한 플랫폼으로 쓴다. 프로젝트 리전은 서울(ap-northeast-2).

## 근거

- 조각이 하나라서 배포할 서버도, 청구서도, 서비스 간 이음매도 없다. 3주 마감에 BE 혼자면 움직이는 부품이 적은 쪽이 이긴다.
- 진짜 Postgres라서 배우고 싶은 것(스키마 설계·SQL·RLS)을 실제로 배운다. Firestore는 그걸 못 가르친다.
- 구글·카카오 소셜 로그인이 네이티브. 다른 안은 최소한 카카오를 직접 구현해야 한다.
- 무료 티어가 해커톤 규모(사용자 수십 명, 몇 주)에서 어느 축도 안 넘는다. 서울 리전으로 지연이 낮다.
- 락인이 낮다. Supabase는 그냥 Postgres라서 pg_dump로 스키마·데이터를 통째로 옮길 수 있다. Firebase는 안 된다.

## 포기한 것

- Supabase 인프라에 대한 의존. 무료 프로젝트는 7일 무활동 시 일시정지된다 (외부에서 주기적 핑으로 방어).
- Edge Function 런타임이 Deno(TypeScript)라서 파이썬을 그쪽에 못 쓴다. 파이썬 로직은 별도 FastAPI 서비스로 가야 한다.
- 단일 API 표면을 일부 포기 — 클라이언트가 Supabase SDK와(FastAPI를 둔다면) FastAPI를 둘 다 호출하게 된다.

## 당시 몰랐던 것

- Supabase 무료 티어 한도(DB 500MB, Edge Function 월 50만 호출, 대역폭 등)가 대회 데모 + 심사 기간 트래픽에 정말 충분한지 실측하지 않았다.
- 카카오 네이티브 provider 연동이 문서에 적힌 만큼 매끄러운지 직접 확인하지 않았다.
- 네이버 커스텀 로그인(Edge Function 토큰 발급)이 얼마나 걸릴지 미검증.
