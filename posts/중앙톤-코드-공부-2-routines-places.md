---
title: "중앙톤 코드 공부 2 — routines / places (엔티티부터 테스트까지)"
date: 2026-08-11
tags: ["spring-boot", "jpa", "java", "testing"]
series: "중앙톤 코드 공부"
description: "Lombok·커스텀 파라미터 리졸버·더티 체킹·Mockito 단위 테스트까지, 새 기능 두 개(PR)를 파일 순서대로 읽은 기록."
draft: false
---

## feat/actions-routines (PR #12)

백엔드 폴더에 실제로 올라간 코드 기준. 핵심 패턴 3가지.

### 1. Lombok으로 보일러플레이트 제거 — `routine/Routine.java:21-27`

```java
@Entity
@Table(name = "routines")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    // ...
}
```

- `@Entity` / `@Table` — JPA에게 "이 클래스는 `routines` 테이블과 매핑된다"고 알려줌
- `@Id` + `@GeneratedValue(UUID)` — 기본키를 DB가 아니라 자바 쪽에서 UUID로 채번
- `@Getter` / `@NoArgsConstructor` / `@AllArgsConstructor` / `@Builder` — Lombok이 컴파일 시점에 getter, 기본 생성자, 전체 필드 생성자, 빌더 패턴 코드를 자동 생성
- 필드에 `@Setter`가 없으면 그 필드는 불변(immutable) — `title`(41행)엔 `@Setter`가 있어 수정 가능하지만 `scheduleType`은 없어서 생성 이후 못 바꿈

### 2. Spring MVC 커스텀 파라미터 리졸버 — `common/auth/CurrentUserArgumentResolver.java`

컨트롤러 메서드에 `@CurrentUserId UUID userId`(`RoutineController.java:31`)라고만 써두면 실제 로그인한 사용자 ID가 자동으로 채워져 들어온다. `HandlerMethodArgumentResolver`를 구현한 클래스가 있어서 가능한 것.

1. `supportsParameter()` — "`@CurrentUserId`가 붙은 UUID 타입 파라미터를 보면 내가 처리하겠다"고 Spring에 등록
2. `resolveArgument()` — 실제 HTTP 요청이 오면 `Authorization: Bearer <토큰>` 헤더를 꺼내서 JWT를 검증하고, 그 안의 사용자 ID를 반환

즉 컨트롤러는 인증 로직을 전혀 몰라도 되고, 파라미터 타입 선언만으로 "로그인된 사용자"를 받아쓰는 구조다.

> **알려진 리스크 (파일 16-19행 주석):** 이 리졸버가 프로젝트의 인증 검사 전부다. 컨트롤러가 `@CurrentUserId`를 깜빡하면 그 엔드포인트는 인증 없이 그냥 열린다 — 전역 필터가 없음.

### 3. 계층 분리: Controller → Service → Repository

- `RoutineController` — HTTP 요청/응답만 담당 (`@Valid`로 입력 검증, `@ResponseStatus(CREATED)`로 응답 코드 지정)
- `RoutineService` — 실제 비즈니스 로직
- `RoutineRepository` — DB 접근 (Spring Data JPA)

Spring 프로젝트의 표준 3계층 구조.

### 메모: 주석으로 남긴 "안 만든 이유"

`Routine.java:18-20`, `RoutineController.java:21-22`처럼 "지금은 place 엔티티가 없어서 연관관계 안 잡았다", "AI 초안 생성이 없어서 `/today` 엔드포인트 안 만들었다"는 식으로 검증 못 할 걸 미리 만들지 않은 이유를 기록해뒀다. YAGNI를 실천하면서 "왜 안 했는지"를 남겨둔 셈.

---

## feat/places

파일 순서(엔티티 → 레포지토리 → DTO → 서비스 → 컨트롤러 → 테스트)대로, 자바/스프링 개념 위주 정리.

### 1. `Place.java` — JPA 엔티티

```java
@Entity
@Table(name = "places")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Setter
    @Column(nullable = false)
    private double lat;

    @Setter
    @Column(name = "radius_m", nullable = false)
    private int radiusM;
    // ...
}
```

**개념**

- `@Entity` / `@Table`은 이 클래스가 DB 테이블 하나에 대응한다는 표시. 클래스명(`Place`)과 필드명은 자바 컨벤션(카멜케이스)을 쓰고, DB 컬럼명(snake_case)으로의 변환은 Hibernate가 자동으로 해준다.
- `@GeneratedValue(strategy = GenerationType.UUID)` — "이 ID는 Hibernate가 애플리케이션 레벨에서 랜덤 UUID를 만들어 채운다"는 뜻. DB가 `default gen_random_uuid()`로 만들어주는 것과는 별개 경로지만 결과는 같다.
- Lombok 조합 — JPA 스펙이 요구하는 기본 생성자(`@NoArgsConstructor`, JPA가 리플렉션으로 객체를 만들 때 필요)와, 쓰기 편한 빌더 패턴(`@Builder`)을 동시에 생성. `@Setter`는 수정 가능한 필드에만 개별로 붙였다 — 클래스 전체에 붙이면 `id`, `createdAt`처럼 절대 바뀌면 안 되는 필드까지 다 열린다.
- **primitive vs wrapper** (`double`/`int` vs `Double`/`Integer`) — DB 컬럼이 not null이면 자바 필드도 primitive로 선언한다. null이 아예 들어갈 수 없는 타입이라 컴파일 시점에 NPE 가능성을 차단한다. 반대로 DTO(`CreatePlaceRequest`)에서는 wrapper를 쓴다 — 클라이언트가 아예 안 보낸 값과 `0`을 구분해야 하니까(`radiusM`이 안 오면 기본값 300을 채우는 로직이 필요한 이유).

> **실제로 걸렸던 버그 — 네이밍 전략**
> `radiusM`처럼 끝이 대문자 한 글자로 끝나는 필드명은 Spring 기본 네이밍 전략이 `radius_m`이 아니라 `radiusm`으로 잘못 변환한다. 변환 알고리즘이 "대문자 앞에 언더스코어를 넣는다"를 판단할 때 "그 대문자 뒤에 소문자가 와야 한다"는 조건을 같이 보는데, 단어 맨 끝 대문자는 뒤에 아무것도 없어 조건이 성립하지 않기 때문.
> 실제 DB 컬럼(`radius_m`)과 Hibernate가 기대하는 컬럼명(`radiusm`)이 어긋나서 `ddl-auto: validate`가 앱 시작을 막았다.
> **해결:** `@Column(name = "radius_m")`으로 매핑을 직접 명시 — 네이밍 전략에 기대지 않고 확정.

### 2. `PlaceVisit.java` — ID 전략이 다른 이유

```java
@Entity
@Table(name = "place_visits")
public class PlaceVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ...
}
```

`Place`는 UUID(`GenerationType.UUID`)인데 `PlaceVisit`은 Long(`GenerationType.IDENTITY`). DB 스키마가 그렇게 정의돼 있기 때문 — `places.id`는 `uuid`, `place_visits.id`는 `bigserial`(자동증가 정수). **엔티티의 ID 전략은 항상 DB 컬럼 타입을 따라간다**, 임의로 고르는 게 아니다.

### 3. Repository — Spring Data JPA의 "이름으로 쿼리 만들기"

```java
public interface PlaceRepository extends JpaRepository<Place, UUID> {
    List<Place> findByUserIdAndArchivedAtIsNull(UUID userId);
    Optional<Place> findByIdAndUserIdAndArchivedAtIsNull(UUID id, UUID userId);
}

public interface PlaceVisitRepository extends JpaRepository<PlaceVisit, Long> {
    Optional<PlaceVisit> findFirstByUserIdAndPlaceIdAndExitedAtIsNullOrderByEnteredAtDesc(
            UUID userId, UUID placeId);
}
```

**개념:** 이 인터페이스들은 구현체를 직접 안 짠다. Spring Data JPA가 메서드 이름 자체를 파싱해서 SQL을 자동 생성한다.

- `findByUserIdAndArchivedAtIsNull` → `WHERE user_id = ? AND archived_at IS NULL`
- `findFirstBy...OrderByEnteredAtDesc` → `ORDER BY entered_at DESC LIMIT 1` (가장 최근 것 하나만)
- 여러 개 나올 수 있으면 `List<T>`, 있거나 없을 수 있는 단건이면 `Optional<T>`. Optional을 쓰면 호출하는 쪽이 "null일 수도 있다"를 타입에서부터 강제로 인지하게 된다 (뒤의 `orElseThrow`가 자연스럽게 붙는 이유).

> **리뷰에서 걸린 실수 — archived 필터 누락**
> 처음엔 `findByIdAndUserId`(archived 필터 없음) 하나만 만들어서 update/delete/enter/exit 전부가 이걸 재사용했다. 그래서 소프트 삭제(archived)된 장소도 여전히 수정·진입 기록이 가능했다.
> **해결:** 메서드 이름에 `AndArchivedAtIsNull`을 추가. 이름 하나 바꾸는 것만으로 그걸 쓰는 4곳이 한 번에 고쳐졌다 — 공용 private 헬퍼(`findOwnedPlace`)로 묶어놨던 게 여기서 힘을 발휘했다.

### 4. DTO — record

```java
public record CreatePlaceRequest(
        @NotBlank String label,
        @NotNull Double lat,
        @NotNull Double lng,
        Integer radiusM,
        String kakaoPlaceId
) {}

public record UpdatePlaceRequest(String label, Double lat, Double lng, Integer radiusM) {}
```

**개념:** Java 16+의 `record`는 불변 데이터 클래스를 한 줄로 선언하게 해준다. 생성자, `label()`/`lat()` 같은 getter(자바빈 관례인 `getLabel()`이 아니라 필드명 그대로), `equals`/`hashCode`/`toString`을 컴파일러가 자동 생성한다.

- `@NotBlank` / `@NotNull`은 Bean Validation 어노테이션. 컨트롤러에서 `@Valid`와 같이 쓰면 조건을 어기는 요청이 컨트롤러 메서드 본문에 들어가기도 전에 400으로 걸러진다.
- `UpdatePlaceRequest`는 검증 어노테이션이 하나도 없다 — PATCH는 부분 수정이라 "필드가 없으면 안 바꾼다"가 정상 상태고, 그래서 서비스 쪽에서 `if (request.label() != null)`처럼 null 체크로 직접 분기한다.

### 5. `PlaceService.java` — 핵심 로직

**더티 체킹 (dirty checking)**

```java
@Transactional
public PlaceResponse updatePlace(UUID userId, UUID placeId, UpdatePlaceRequest request) {
    Place place = findOwnedPlace(userId, placeId);
    if (request.label() != null) {
        place.setLabel(request.label());
    }
    // ...
    return toResponse(place);
}
```

`placeRepository.save(place)`를 부르는 부분이 없다는 걸 눈여겨볼 것. 이게 JPA의 **더티 체킹**이다. `@Transactional` 메서드 안에서 조회한 `place`는 영속성 컨텍스트가 "관리"하는 객체라서, setter를 부르면 트랜잭션 커밋 시점에 Hibernate가 "이 객체 필드가 DB랑 달라졌네?"를 감지해 자동으로 UPDATE 쿼리를 날린다.

**중복 진입 이벤트 방어**

```java
@Transactional
public PlaceVisitResponse enter(UUID userId, UUID placeId) {
    findOwnedPlace(userId, placeId);

    placeVisitRepository
            .findFirstByUserIdAndPlaceIdAndExitedAtIsNullOrderByEnteredAtDesc(userId, placeId)
            .ifPresent(open -> open.setExitedAt(Instant.now()));

    PlaceVisit visit = placeVisitRepository.save(PlaceVisit.builder()...build());
    return toResponse(visit);
}
```

- `Optional.ifPresent(람다)` — "값이 있으면 이 람다를 실행, 없으면 아무것도 안 함". `if (opt.isPresent()) { opt.get().setExitedAt(...); }`를 한 줄로 줄인 것.
- `open.setExitedAt(...)`도 위와 똑같은 더티 체킹 케이스 — `save()` 없이 커밋 때 자동 반영.
- **왜 필요했나(리뷰 포인트):** 지오펜스 진입 이벤트가 중복으로 올 수 있는데(앱이 꺼졌다 켜지는 등), `enter()`가 무조건 새 행만 INSERT하면 이전에 안 닫힌 방문 기록이 영원히 열린 채로 남는다. 그래서 새로 열기 전에 "열려있는 게 있으면 먼저 닫는다"는 방어 로직을 앞에 붙였다.

**애플리케이션 레벨 검증**

```java
private int resolveRadius(Integer radiusM) {
    if (radiusM == null) {
        return DEFAULT_RADIUS_M;
    }
    if (radiusM < MIN_RADIUS_M || radiusM > MAX_RADIUS_M) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_RADIUS",
                "radiusM은 %d~%d 사이여야 합니다.".formatted(MIN_RADIUS_M, MAX_RADIUS_M));
    }
    return radiusM;
}
```

- `"...".formatted(a, b)`는 Java 15+ 문자열 메서드로 `String.format("...", a, b)`와 동일하지만 문자열 리터럴에 바로 체이닝할 수 있다.
- DB에도 `check (radius_m between 100 and 2000)` 제약이 있는데 왜 애플리케이션에서도 검증하냐 — DB 제약 위반은 `DataIntegrityViolationException` 같은 뭉뚱그려진 500 에러로 튀어서 사용자에게 "뭐가 잘못됐는지" 알려줄 방법이 없기 때문. 앱 레벨에서 먼저 걸러 깔끔한 400 + 에러 코드로 응답하고, DB 제약은 최후의 안전망으로 남긴다.

### 6. `PlaceController.java` — REST 매핑

```java
@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaceResponse create(@CurrentUserId UUID userId,
                                @Valid @RequestBody CreatePlaceRequest request) {
        return placeService.createPlace(userId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@CurrentUserId UUID userId, @PathVariable UUID id) {
        placeService.deletePlace(userId, id);
    }
}
```

- `@RequiredArgsConstructor`(Lombok)는 final 필드를 인자로 받는 생성자를 자동 생성한다. `private final PlaceService placeService;` 하나만 써도 Spring이 이 생성자를 통해 빈을 주입 — 이게 **생성자 주입** 방식의 DI다.
- `@CurrentUserId`는 이 프로젝트가 직접 만든 커스텀 어노테이션. `Authorization: Bearer` 헤더의 JWT를 까서 `userId`를 꺼내는 걸 컨트롤러 파라미터 자리에서 바로 받게 해준다.
- `@ResponseStatus(HttpStatus.NO_CONTENT)` + `void` 리턴: 성공했지만 돌려줄 데이터가 없는 케이스(삭제)의 표준 패턴. 204 No Content.

### 7. `PlaceServiceTest.java` — Mockito 단위 테스트

```java
@ExtendWith(MockitoExtension.class)
class PlaceServiceTest {

    @Mock private PlaceRepository placeRepository;
    @Mock private PlaceVisitRepository placeVisitRepository;

    private PlaceService service() {
        return new PlaceService(placeRepository, placeVisitRepository);
    }

    @Test
    void radiusM을_안_주면_기본값_300이_들어간다() {
        var request = new CreatePlaceRequest("집", 37.5, 127.0, null, null);
        ArgumentCaptor<Place> captor = ArgumentCaptor.forClass(Place.class);
        when(placeRepository.save(captor.capture())).thenAnswer(inv -> captor.getValue());

        PlaceResponse response = service().createPlace(UUID.randomUUID(), request);

        assertThat(response.radiusM()).isEqualTo(300);
    }
}
```

- **진짜 DB를 안 쓴다.** `@Mock`으로 만든 `PlaceRepository`는 "가짜"라서 `save()`를 불러도 실제 INSERT가 안 일어나고 `when(...).thenAnswer(...)`로 정해준 대로만 동작한다. 그래서 밀리초 단위로 끝나고 Postgres 없이도 돌아간다. (반대로 `ConsentControllerTest`처럼 `@SpringBootTest`를 쓰는 테스트는 진짜 Spring 컨텍스트 + 진짜 DB를 다 띄우는 통합 테스트라 더 느리고 무겁다.)
- **`ArgumentCaptor`** — `save()`에 실제로 뭐가 넘어왔는지 "붙잡아서" 나중에 검사할 때 쓴다. 여기선 "save한테 넘어간 그 `Place` 객체를 그대로 리턴값처럼 흉내내라"는 트릭(`thenAnswer(inv -> captor.getValue())`)으로, DB가 자동 생성해줄 id 없이도 "radiusM이 300으로 채워져서 저장 요청이 갔는지"만 검증한다.
- **AssertJ** — `assertThatThrownBy(...).isInstanceOf(ApiException.class).hasFieldOrPropertyWithValue("code", "INVALID_RADIUS")`: "이 코드를 실행하면 예외가 터지는데, 그 예외가 `ApiException` 타입이고 `code` 프로퍼티 값이 정확히 `INVALID_RADIUS`인지"까지 한 줄로 검증.

---

## 오늘 흐름 한 문장 요약

엔티티(DB 매핑) → 레포지토리(메서드 이름 = 쿼리) → DTO(record, 검증) → 서비스(더티 체킹, 예외 던지기) → 컨트롤러(REST 매핑, DI) 순으로 레이어가 쌓이고, 각 레이어는 자기 밑 레이어만 알면 된다(컨트롤러는 서비스만 알고 리포지토리는 모름).

오늘 잡은 버그 두 개(네이밍 전략, archived 필터 누락)는 전부 "타입 시스템은 못 잡아주는, 런타임에만 드러나는" 종류라서 — 통합 테스트(`ddl-auto: validate` + 진짜 Postgres)와 리뷰가 왜 둘 다 필요한지 보여주는 좋은 예시였다.
