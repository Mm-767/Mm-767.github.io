---
title: "중앙톤 코드 공부 1 — 인증 (JwtService / AuthService)"
date: 2026-08-10
tags: ["spring-boot", "jwt", "security", "java"]
series: "중앙톤 코드 공부"
description: "JWT 발급·검증, 비밀번호 해시, Optional 체이닝 로그인 검증까지 — 팀 프로젝트 인증 코드를 실제 파일 기준으로 읽은 기록."
draft: false
---

커밋된 것 중 아직 안 짚은 인증 관련 코드 — `JwtService.java`, `AuthService.java` (이메일 회원가입/로그인) 기준.

## 1. JWT 발급 — `auth/JwtService.java:62-70`

```java
private String buildToken(UUID userId, long expirationMs) {
    return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(expirationMs)))
            .signWith(key)
            .compact();
}
```

JWT는 "서버가 서명한 자기 증명서" 같은 것. `subject`에 사용자 ID를 넣고, 서버만 아는 비밀키(`key`, HMAC 방식)로 서명해서 문자열로 압축(`compact()`)한다.

- 클라이언트는 이후 요청마다 이 토큰을 `Authorization` 헤더에 실어 보냄
- 서버는 `getUserId()`(48-60행)에서 서명을 검증해 위조 여부를 확인한 뒤 `subject`를 다시 UUID로 꺼내 씀
- 서명 검증 실패 시(`JwtException`) 401을 던지는 구조

19-30행에서 비밀키와 만료시간을 생성자에서 `@Value`로 주입받는데, 하드코딩 대신 `application.yaml`에서 값을 읽어오게 하는 Spring의 표준 설정 주입 방식이다.

## 2. 비밀번호는 절대 원문 저장 안 함 — `auth/AuthService.java:42`

```java
.passwordHash(passwordEncoder.encode(request.password()))
```

`PasswordEncoder`(보통 BCrypt 구현체)가 비밀번호를 **단방향 해시**로 바꿔서 저장한다. "단방향"이 핵심 — 해시값에서 원문을 복원할 수 없다. 로그인 검증(60행)도 원문끼리 비교하는 게 아니라 `passwordEncoder.matches(입력값, 저장된해시)`로 확인한다.

## 3. Optional 체이닝으로 로그인 검증 — `AuthService.java:58-61`

```java
User user = userRepository.findByEmail(request.email())
        .filter(u -> u.getPasswordHash() != null
                && passwordEncoder.matches(request.password(), u.getPasswordHash()))
        .orElseThrow(() -> new ApiException(
                HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "..."));
```

`findByEmail`은 `Optional<User>`를 반환한다(찾았을 수도, 못 찾았을 수도 있으니까).

- `.filter()`로 "비밀번호가 맞는 이메일 가입자인가"까지 한 번에 걸러냄
- 조건 불만족 시(이메일 없음 / 구글 가입자라 `passwordHash`가 null / 비밀번호 틀림) `.orElseThrow()`로 예외
- `if-else` 없이 "찾고, 검증하고, 없으면 던진다"를 한 문장 체인으로 표현

> **왜 에러를 뭉뚱그리나**: 이메일 미존재/비밀번호 오류를 구분하지 않고 같은 `INVALID_CREDENTIALS`로 응답하는 건 의도적이다. 어느 쪽인지 알려주면 공격자가 "이 이메일이 가입돼 있는지"를 무차별로 알아낼 수 있다(계정 존재 여부 노출 방지).

## 4. 나이 계산 — `AuthService.java:34`

```java
Period.between(request.birthDate(), LocalDate.now()).getYears() < MIN_AGE
```

`java.time.Period`는 두 날짜 사이의 "년/월/일" 차이를 계산해주는 클래스. `getYears()`로 만 나이를 뽑아서 14세 미만이면 가입을 막는다.
