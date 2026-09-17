---
title: "ADR-006 DB 최적화 적용 여부 — 지금은 안 함"
date: 2026-09-12
tags: ["postgresql", "performance", "adr"]
series: "PETOX 설계 결정 로그"
description: "파티셔닝·읽기 레플리카·캐싱 체크리스트를 유저 수십 명짜리 스키마에 대입해보고, 근거 있게 아무것도 안 하기로 한 기록."
draft: false
---

상태: 채택 · ADR-001에 이어짐

## 문제

push 직전에 PETOX 스키마가 정규화·인덱스·쿼리 최적화가 잘 되어 있는지 점검함. 정규화 밸런스, 인덱스 설계 규칙, EXPLAIN 활용, 파티셔닝·읽기 레플리카·캐싱·keyset 페이징 같은 대규모 서비스용 체크리스트를 PETOX 마이그레이션 7개에 대입해서 검토했다.

## 검토한 선택지

| 안 | 내용 | 실제로 필요한가 |
|---|---|---|
| A. 현행 유지 | 지금 마이그레이션 그대로 push | — |
| B. daily_usage PK 순서 변경 | (user_id, app_id, usage_date) → (user_id, usage_date, app_id) | 유저당 최대 90행이라 체감 차이 없음 |
| C. missions에 (type, valid_date) 인덱스 추가 | "오늘 미션 있나" 체크용 | user_missions 경유 조인이라 missions 풀스캔 자체가 안 걸림 — 불필요 |
| D. 파티셔닝/읽기 레플리카/캐싱/keyset 페이징 도입 | 대규모 서비스용 최적화 기법 | 사용자 수십 명, 3~4주 규모에 안 맞음 |

## 결정

A. 현행 스키마·인덱스 그대로 push한다. B, C, D는 지금 적용하지 않는다.

## 근거

- FK 컬럼마다 이미 인덱스가 있음(`idx_pets_user_id` 등 6개 + coin_ledger 2개), `request_id`와 `(user_id, mission_id)`엔 unique 제약이 인덱스 역할을 겸함.
- complete_mission/buy_item/generate_daily_missions 세 함수의 실제 조회 경로를 직접 추적한 결과, 풀 테이블 스캔이 걸리는 지점이 없었다. generate_daily_missions()의 "오늘 미션 있나" 체크도 user_missions.user_id 인덱스로 시작해서 missions는 PK로 조인이라, 유저당 지금까지 받은 미션 수(최대 수십 개)만 본다.
- daily_usage는 유저당 앱 3개 × 날짜 최대 30일 = 최대 90행이 전부라, PK 컬럼 순서를 이론적으로 더 맞는 쪽으로 바꿔도 체감 차이가 없다. 지금 바꾸는 건 근거 없는 조기 최적화.
- 파티셔닝·읽기 레플리카·캐싱·keyset 페이징은 데이터량·트래픽이 이 프로젝트와 몇 자릿수 다른 서비스를 전제로 한 기법이라, 지금 들여오면 관리 복잡도만 늘고 실익이 없다.

## 포기한 것

- daily_usage의 "이론적으로 더 나은" PK 순서. 사용시간 로그 방식이 일별 집계에서 세션 단위 등으로 바뀌어 행 수가 크게 늘면 재검토 필요.
- 실제 EXPLAIN ANALYZE로 확인하지 않고 로우 카운트 추정과 코드 추적만으로 판단함.

## 당시 몰랐던 것

- 실제 대회 기간 중 사용자 수·요청 빈도가 ADR-001 추정(수십 명)을 크게 넘어서면 이 결정 전체가 재검토 대상이 된다.
