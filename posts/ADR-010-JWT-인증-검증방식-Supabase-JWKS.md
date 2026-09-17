---
title: "ADR-010 JWT 인증 검증 방식 — Supabase JWKS 비대칭키 로컬 검증"
date: 2026-09-14
tags: ["jwt", "security", "fastapi", "adr"]
series: "PETOX 설계 결정 로그"
description: "공유 비밀키 vs 공개키 서명 검증 — HMAC을 손으로 계산해 라이브러리 출력과 바이트 단위로 맞춰본 뒤에 고른 결정."
draft: false
---

상태: 채택 · ADR-002 범위(주간 리포트) 구현을 위한 선행 결정

## 문제

FastAPI엔 로그인한 사용자가 누구인지 확인하는 코드가 아예 없다. 지금 구현된 엔드포인트는 `/health`, `/db-health`, `/items/{id}`(더미), `POST /auth/signup`뿐이라 "누구 것인지" 알 필요가 없었는데, ADR-002가 FastAPI에 남긴 마지막 기능인 주간 리포트(`GET /reports/weekly`)는 "이 사람의 데이터만" 보여줘야 하므로 요청에 실린 Supabase 액세스 토큰(JWT)을 검증해서 유저 ID를 뽑아내는 로직이 반드시 필요하다.

제약: 해커톤 규모(사용자 수십 명, 3~4주, BE 1명), 새 시크릿을 GitHub Secrets에 추가하는 건 괜찮음.

## 검토한 선택지

| 안 | 지연 | 새 시크릿 필요 | 실시간 revocation | 이 프로젝트에서 지금 쓸 수 있나 |
|---|---|---|---|---|
| A. 로컬 HS256 검증(공유 비밀키) | 없음(로컬 계산) | SUPABASE_JWT_SECRET 필요 | 안 됨(토큰 만료 전까진 유효) | 됨 — 단, Supabase 대시보드 확인 결과 은퇴 예정 부품(레거시) |
| B. Supabase Admin API 호출(`auth.get_user`) | 매 요청마다 네트워크 왕복 | 불필요 | 됨(항상 실시간 조회) | 됨 |
| C. JWKS 비대칭키 로컬 검증 | 최초 fetch 후 캐시(로컬) | 불필요(공개 URL만) | 안 됨 | 됨 — 이미 이 프로젝트가 비대칭키로 전환 완료 상태 |

## 결정

C. Supabase가 공개하는 JWKS 엔드포인트(`{SUPABASE_URL}/auth/v1/.well-known/jwks.json`)에서 공개키를 가져와 FastAPI에서 로컬로 서명을 검증한다. Python에서는 `PyJWT`의 `PyJWKClient`가 JWKS 캐싱까지 대신 해준다.

## 근거

**JWT가 왜 검증이 필요한지부터.** 토큰은 `header.payload.signature` 세 조각을 점(.)으로 이어붙인 문자열이다. `payload` 부분(예: `{"sub":"abc123","aud":"authenticated"}`)은 base64로 인코딩만 됐을 뿐 암호화가 아니라서, 누구나 디코드해서 읽을 수 있고 — 마찬가지로 누구나 고쳐서 다시 인코드할 수도 있다. 그래서 "이 payload가 진짜 Supabase가 만든 거고 중간에 안 고쳐졌다"를 보장하는 게 `signature`의 역할이다.

Supabase는 토큰을 만들 때 `header+payload`를 비밀키로 "서명"한다(HMAC-SHA256이라는 함수). 이 서명은 비밀키가 딱 한 글자만 달라도 결과가 완전히 다른 값이 나오는 성질(눈사태 효과)이 있어서, 비밀키를 모르는 쪽은 payload를 고쳐놓고 그에 맞는 "그럴듯한" 서명을 새로 만들어낼 방법이 사실상 없다(가능한 값이 2^256개 — 우주의 원자 수보다 많다). 그래서 서명이 일치하면 "이건 진짜다"라고 믿을 수 있다.

실제로 직접 계산해서 확인했다: `hmac.new(secret, message, sha256)`으로 손으로 만든 서명과, `PyJWT`의 `jwt.encode()`가 만든 진짜 토큰의 서명 부분을 나란히 놓고 비교하니 **글자 하나까지 완전히 일치**했다. 즉 `jwt` 라이브러리는 새로운 마법이 아니라 "HMAC 계산 + base64 인코딩/디코딩 + JSON 파싱"을 한 줄로 묶어주는 포장지일 뿐이라는 게 실제 코드로 확인됐다.

**A(공유 비밀키)와 C(공개키)의 차이는 "누가 서명을 만들 수 있는가"다.** A는 Supabase와 우리 서버가 똑같은 비밀 값(`SUPABASE_JWT_SECRET`)을 나눠 갖고 그걸로 서명을 만들기도, 검증하기도 한다 — 이 비밀 값이 유출되면 공격자가 그 값으로 가짜 토큰을 마음대로 찍어낼 수 있다. C는 Supabase만 "개인키"로 서명을 만들고 우리는 누구나 볼 수 있는 "공개키"로 검증만 한다 — 공개키가 유출돼도 그걸로 서명을 새로 만들 수는 없다(비대칭 암호의 성질). 그래서 업계 표준(Auth0, Firebase, AWS Cognito 등)도 C 방식을 기본값으로 민다.

**결정타는 Supabase 대시보드를 직접 확인한 결과였다.** JWT Keys 페이지에 "Legacy JWT secret has been migrated to new JWT Signing Keys"라고 떠 있었고, "Legacy JWT secret (still used)"라고도 적혀 있었다. 이건 이 프로젝트가 **이미 비대칭키(JWT Signing Keys) 체계로 전환을 마친 상태**라는 뜻이다. 레거시 공유시크릿은 "아직은" 검증에 쓸 수 있지만, 문구 자체("rotate to a standby key and then revoking it")가 Supabase의 표준 폐기 절차를 가리키고 있어서 — A를 고르면 **이미 은퇴 수순을 밟고 있는 부품에 새로 의존**하게 되는 셈이었다. 반면 C에 필요한 건 이미 다 갖춰져 있었다.

마지막으로 "C가 복잡하다"는 처음 걱정도 코드로 확인하니 기우였다. A와 C의 실제 코드 차이는 이 두 줄뿐이다:

```python
# A안
os.environ["SUPABASE_JWT_SECRET"]

# C안
jwks_client = PyJWKClient(f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json")
signing_key = jwks_client.get_signing_key_from_jwt(token)
```

`PyJWKClient`가 JWKS 캐싱·키 조회를 대신 해줘서, 새 시크릿 관리(GitHub Secrets에 값 추가)조차 필요 없어진다.

## 포기한 것

- **실시간 revocation을 포기한다.** B(Supabase Admin API 호출)를 골랐다면 계정이 밴/삭제된 순간 바로 막을 수 있었는데, C는 서명이 유효하면(=발급 시점엔 정상 계정이었으면) 토큰 만료 전까진 통과시킨다. 다만 Supabase 액세스 토큰 기본 수명이 1시간이라, 지금 규모(해커톤)에선 이 창구가 실질적 위험이 아니라고 판단했다.
- **JWKS 캐싱·키 로테이션 로직을 직접 구현하지 않고 `PyJWKClient`에 위임한다.** 이 라이브러리가 내부적으로 뭘 하는지(캐시 만료 정책 등)는 아직 뜯어보지 않았다 — 문제가 생기면 그때 들여다봐야 한다.

## 당시 몰랐던 것

- 실제 JWKS 응답이 이 프로젝트에서 구체적으로 ES256을 쓰는지 RS256을 쓰는지는 아직 curl로 확인 안 했다. 코드는 `algorithms=["ES256", "RS256"]` 둘 다 받게 해놓아서 어느 쪽이든 동작하긴 한다.
- 실제 Supabase 로그인 토큰의 `aud` claim이 정말 `"authenticated"`인지도 실제 토큰 하나를 까봐야 확정된다(지금까진 공식 문서 기준으로 가정).

> **추기 (2026-09-14, 구현 직후 Supabase 공식 문서로 검증)**: 위 두 항목 중 하나는 배포 없이도 확인되었다. Supabase 공식 "JWT Claims Reference" 문서에 `aud`는 필수 클레임으로 명시되어 있고, 값은 로그인한 유저면 `"authenticated"`, anon key면 `"anon"`이라 적혀 있어서 이 부분은 확정이다. 또 "JWT Signing Keys" 문서에 따르면 Supabase가 지원하는 비대칭키 알고리즘은 딱 둘(ES256=P-256 타원곡선, RS256=RSA 2048)이고 Supabase는 ES256을 권장한다 — 코드가 이미 둘 다 받아서 추가 변경 불필요. 이 프로젝트가 실제로 둘 중 뭐를 쓰는지도 확정된다: 진짜 `SUPABASE_URL`로 JWKS 엔드포인트를 curl해보니 `{"kty":"EC","crv":"P-256","alg":"ES256"}` 키 1개뿐이었다(RS256 아님). 안 쓰는 RS256을 굳이 열어둘 이유가 없어서 코드를 `algorithms=["ES256"]`으로 좁혔다(공격 표면 축소). 당시 몰랐던 것은 이것으로 전부 해소되었다.

- JWT 검증 미들웨어를 FastAPI 의존성(`Depends`)으로 어디까지 재사용 가능하게 만들지는 구현 시점에 다시 볼 문제.
