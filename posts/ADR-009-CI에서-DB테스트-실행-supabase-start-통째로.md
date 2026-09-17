---
title: "ADR-009 CI에서 DB 테스트 실행 — supabase start 통째로"
date: 2026-09-13
tags: ["ci-cd", "testing", "supabase", "adr"]
series: "PETOX 설계 결정 로그"
description: "테스트 7개가 CI에서 조용히 스킵되고 있었다 — advisory lock을 지운 PR도 초록으로 통과하는 초록을 없앤 기록."
draft: false
---

상태: 채택

## 문제

`test_rpc_trust.py`의 RPC·RLS 테스트 **7개가 CI에서 전부 스킵**되고 있었다. 워크플로가 가짜 DB 환경변수를 써서 `db_available()`이 False가 되고, `requires_db`가 조용히 넘긴다.

[ADR-008](/posts/adr-008-코인-rpc-동시성-사용자-단위-advisory-lock)이 잡은 동시성 버그를 지키는 게 바로 이 테스트들인데, 정작 CI에서는 하나도 돌지 않는다. **누가 advisory lock을 지운 PR을 올려도 초록으로 통과한다.** 테스트가 있다는 사실만 있고 강제력은 없는 상태다.

제약이 하나 있다. 이 테스트들은 Supabase 고유 인프라에 의존한다 — `auth.users`(GoTrue가 자기 마이그레이션으로 만드는 테이블), `auth.uid()`, `authenticated` 롤, 그리고 마이그레이션이 `pg_cron`을 건다. 평범한 postgres 이미지에는 하나도 없다.

## 검토한 선택지

| 안 | auth 스키마를 어디서 얻나 | CI 추가 시간 | 초록이 보증하는 것 |
|---|---|---|---|
| **A. `supabase start` 통째로** | 실제 Supabase 스택 | ~2분 | 로컬과 같은 환경에서 통과했다는 것 |
| B. `supabase/postgres` 서비스 컨테이너 | 직접 쓴 shim | ~30초 | shim이 실물과 같을 때만 유효 |
| C. 평범한 `postgres` 서비스 컨테이너 | 직접 쓴 shim + `pg_cron` 대체까지 | ~20초 | 위와 같고, 흉내낼 게 더 많다 |

## 결정

A. `supabase/setup-cli@v1` + `supabase start`.

여기에 하나를 덧붙였다 — **CI 환경에서는 스킵 자체를 금지**했다. `conftest.py`가 `CI` 환경변수를 보고, DB에 못 붙으면 수집 단계에서 `RuntimeError`를 던진다. 로컬에서는 그대로 스킵된다.

## 근거

**B와 C는 이 ADR이 풀려는 문제를 형태만 바꿔 남긴다.** 지금 문제는 "CI 초록이 아무것도 보증하지 않는다"인데, 손으로 쓴 auth shim은 그 보증을 "내 shim이 실제 Supabase와 같다면"으로 바꿀 뿐이다. Supabase가 `auth.users` 스키마를 바꾸는 순간 CI는 여전히 초록인데 운영은 깨진다. **거짓말하는 초록을 더 빨리 만드는 건 개선이 아니다.**

2분은 4인 팀의 PR 빈도에서 아무 문제가 안 된다. 사는 게 속도고 파는 게 신뢰라면, 여기서는 신뢰가 압도적으로 비싸다.

스킵 금지를 같이 넣은 이유도 같다. `supabase start`가 조용히 실패하면 테스트는 다시 스킵되고 CI는 또 초록이 된다. 원래 문제로 그대로 돌아간다. **조용히 초록이 되는 경로를 없애는 게 이 결정의 핵심이고, 스택 선택은 그 수단이다.**

## 포기한 것

CI가 20초에서 2분 10초로 늘었다. PR이 잦아지면 체감될 수 있다. 그때는 `supabase start -x`로 studio·imgproxy·realtime 같은 안 쓰는 서비스를 빼면 된다 — 지금 미리 빼지 않은 건 서비스 이름을 틀리면 CI가 통째로 안 도는데, 느린 것보다 안 도는 게 나쁘기 때문이다.

Docker를 쓰는 러너에만 묶였다. self-hosted나 Docker 없는 환경으로 옮기면 재검토 대상이다.

## 당시 몰랐던 것

**`supabase start`가 GitHub 러너에서 몇 분 걸릴지 모르고 결정했다.** 로컬 경험으로 "몇 분"이라고 보고 감수할 만하다고 판단했는데, 실측 전에 내린 판단이다. 실제는 2분 10초였고 추정 범위 안이었다.

스킵 금지 가드를 **CI에서는 실제로 발동시켜 보지 않았다.** 로컬에서 `CI=true` + 죽은 포트로 재현해 수집 단계 실패를 확인한 게 전부다. 일부러 깨뜨린 커밋을 밀어 CI를 빨갛게 만드는 건 지원 마감 당일에 할 일이 아니라고 봤다. 다음 PR 때 한 번 확인할 것.

마이그레이션이 늘어나면 `supabase start` 시간도 같이 늘 텐데, 어느 지점에서 문제가 되는지는 모른다.

## 결과

| | 수정 전 | 수정 후 |
|---|---|---|
| CI에서 실행된 DB 테스트 | **0개** (7개 스킵) | **7개 전부** |
| CI pytest 결과 | 1 passed, 7 skipped | **collected 8 items → 8 passed** |
| CI 소요 시간 | ~20초 | 2분 10초 |
| advisory lock 삭제 시 | 초록 통과 | **테스트 2개 실패** |

로컬 3분기 검증:

| 조건 | 기대 | 실제 |
|---|---|---|
| `CI=true` · DB 살아있음 | 전수 실행 | 8 passed ✓ |
| `CI=true` · DB 없음 | 시끄럽게 실패 | 수집 단계 RuntimeError ✓ |
| CI 아님 + DB 없음 | 조용히 스킵 | 1 passed, 7 skipped ✓ |

덧붙임 — 이 과정에서 문서 오류를 하나 찾았다. 포트폴리오에 "DB 테스트 6개가 스킵"이라고 적어둔 게 실제로는 **7개**였다(전체 8개 = RPC 7 + health 1). 실측하기 전까지 틀린 숫자를 적어두고 있었다.
