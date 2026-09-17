---
title: "ADR-003 사용시간 저장 grain — 일·앱별 집계"
date: 2026-09-10
tags: ["data-modeling", "postgresql", "adr"]
series: "PETOX 설계 결정 로그"
description: "아무도 안 보는 세션 목록을 저장하지 않기로 한 이유 — 복합 PK 하나로 클라이언트 동기화를 멱등하게 만든 기록."
draft: false
---

상태: 채택 · ADR-001·002에 이어짐

## 문제

숏폼 사용시간을 DB에 어떤 해상도(grain)로 저장할까. 후보: 세션(started_at/ended_at) / 일·앱별 집계 / + 시간대 버킷 / 시간별.

기준: 화면이 요구하는 최소 해상도. 홈="오늘 총량", 리포트="일별·앱별·이번주 vs 지난주·앱별 비율", 시간대 4버킷 요구사항(P1)도 있음. 프론트가 안드로이드 UsageStatsManager에서 뽑아 올린다.

## 검토한 선택지

| 안 | 테이블 | 하루/앱당 행 | 시간대 요구사항 | FE 부담 |
|---|---|---|---|---|
| 세션 grain | usage_sessions(started_at, ended_at, duration) | 수십 | 됨 | 서버 집계·중복제거 필요 |
| A. 일·앱별 집계 | daily_usage(user_id, app_id, usage_date, minutes) | 1 | 보류(나중에 컬럼 추가) | 낮음 — queryUsageStats(DAILY) |
| B. + 시간대 4버킷 | daily_usage(..., bucket 0~3) | 4 | 됨 | 중간 |
| C. 시간별 | daily_usage(..., hour 0~23) | 24 | 됨(유연) | 높음 |

## 결정

A. `daily_usage(user_id, app_id, usage_date, minutes)`, 복합 PK `(user_id, app_id, usage_date)`. 시간대 버킷 없음, 세션 grain 저장 안 함.

클라가 `INSERT ... ON CONFLICT (user_id, app_id, usage_date) DO UPDATE`(upsert)로 오늘 숫자를 주기적으로 갱신. 실시간 판정(오버레이 트리거·홈 진행률)은 클라이언트 로컬 카운터가 담당 — 서버는 실시간일 필요 없음.

## 근거

- 세션 grain을 읽는 화면이 하나도 없다. 아무도 "오늘 틱톡 세션 목록"을 안 본다 → 저장할 이유 없음(YAGNI).
- 복합 PK가 "조합당 행 하나"를 보장 → 클라 동기화가 멱등. 5분마다 보내도, 앱이 죽었다 살아나도 중복 행이 안 생긴다. 대리키 id를 썼으면 같은 날 행이 쌓여 총량이 뻥튀기됐을 것.
- 그 PK가 곧 조회 인덱스. `WHERE user_id=? AND usage_date=?`가 PK를 그대로 탄다.
- `date` 타입이라 시간을 실수로 못 넣는다 — "하루 한 행" 규칙이 성립.
- 집계는 클라가(자기 하루치 합산), DB는 결과만 저장하는 "집계(rollup) 테이블" 패턴.

## 포기한 것

- 시간대별 사용량(P1 요구사항). 나중에 `bucket` 컬럼 추가는 무해한 마이그레이션.
- 세션 단위 분석 여지(어떤 세션이 길었나, 하루 열어본 횟수). 나중에 필요하면 별도 테이블.

## 당시 몰랐던 것

- UsageStatsManager 일 집계가 앱별로 얼마나 정확한지(2시간 캐시 이슈) 실측 안 함.
- 클라 로컬 카운터와 서버 daily_usage가 얼마나 자주·어떤 트리거로 동기화될지 미정.
- 자정 넘김 처리 — 23:50~00:10 세션이 두 날짜로 어떻게 쪼개지는지 클라 로직 미정.
