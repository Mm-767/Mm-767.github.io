---
title: "Spring Boot / JPA 과제 — Member·Assignment 1:N 양방향 연관관계와 트랜잭션 설계"
date: 2026-07-17
tags: []
---

> **과제 목표**: `Member`(회원)와 `Assignment`(과제) 간 1:N 양방향 연관관계를 설계하고, Service 계층 `@Transactional`로 데이터 안정성과 일관성을 확보한다.
> 
> **비즈니스 규칙**: 한 명의 Member는 여러 Assignment를 가질 수 있고, 하나의 Assignment는 반드시 한 명의 Member에게 귀속된다.

* * *

## 0\. 프로젝트 구조 및 실행 환경

```text
src
├── main
│   ├── java/com/university/assignment
│   │   ├── AssignmentApplication.java
│   │   ├── domain
│   │   │   ├── Member.java
│   │   │   ├── Assignment.java
│   │   │   └── AssignmentStatus.java
│   │   ├── exception
│   │   │   ├── AssignmentLimitExceededException.java   (Unchecked — 롤백 대상)
│   │   │   └── ReportGenerationException.java          (Checked — 기본 정책상 커밋)
│   │   ├── repository
│   │   │   ├── MemberRepository.java
│   │   │   └── AssignmentRepository.java
│   │   └── service
│   │       ├── MemberService.java
│   │       └── AssignmentService.java
│   └── resources/application.yml
└── test/java/com/university/assignment/service
    └── AssignmentServiceTest.java
```

**build.gradle** (Spring Boot 3.x / Java 17)

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.1'
    id 'io.spring.dependency-management' version '1.1.5'
}

group = 'com.university'
version = '0.0.1-SNAPSHOT'

java {
    toolchain { languageVersion = JavaLanguageVersion.of(17) }
}

repositories { mavenCentral() }

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    runtimeOnly 'com.h2database:h2'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    testCompileOnly 'org.projectlombok:lombok'
    testAnnotationProcessor 'org.projectlombok:lombok'
}

tasks.named('test') { useJUnitPlatform() }
```

**src/main/resources/application.yml**

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:assignmentdb
    driver-class-name: org.h2.Driver
    username: sa
  jpa:
    hibernate:
      ddl-auto: create-drop
    properties:
      hibernate:
        format_sql: true
    open-in-view: false   # OSIV 비활성화 — 트랜잭션(서비스 계층) 밖에서의 지연 로딩을 원천 차단

logging:
  level:
    org.hibernate.SQL: debug
    org.hibernate.orm.jdbc.bind: trace   # 바인딩 파라미터까지 확인 (Dirty Checking UPDATE 검증용)
```

**AssignmentApplication.java**

```java
package com.university.assignment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AssignmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssignmentApplication.class, args);
    }
}
```

* * *

# \[Part 1\] 과제 구현 소스 코드

## 1-1. Member.java — 연관관계의 종속자(Inverse)

```java
package com.university.assignment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 회원 엔티티 — 연관관계의 주인이 "아닌" 쪽(Inverse).
 *
 * mappedBy = "member" : Assignment 엔티티의 member 필드가 이 관계를 관리(주인)함을 선언.
 * 따라서 Member.assignments 컬렉션은 오직 "조회용"으로만 동작하며,
 * 이 컬렉션에 값을 넣고 빼는 것만으로는 DB의 FK(member_id)가 변경되지 않는다.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 스펙상 기본 생성자 필요, 외부 오용 방지를 위해 protected
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /**
     * 1:N 양방향 관계의 Inverse 사이드.
     * - fetch = LAZY : @OneToMany의 기본값이지만, 과제 지침에 따라 명시적으로 선언 (불필요한 컬렉션 로딩 방지)
     * - 필드에서 즉시 new ArrayList<>()로 초기화 : 엔티티 생성 직후 addAssignment() 호출 시
     *   NullPointerException을 방지하고, 하이버네이트의 컬렉션 래핑 메커니즘과도 안전하게 동작
     */
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<Assignment> assignments = new ArrayList<>();

    @Builder
    public Member(String name, String email) {
        this.name = name;
        this.email = email;
    }

    //== 연관관계 편의 메서드 ==//
    /**
     * 양방향 연관관계를 "한 번의 호출로 원자적으로" 설정한다.
     *
     * JPA 입장에서는 주인(Assignment.member)에만 값이 있으면 FK가 저장되지만,
     * 객체 세상에서는 양쪽 참조가 모두 맞아야 같은 트랜잭션(1차 캐시) 안에서
     * member.getAssignments()를 조회해도 방금 추가한 과제가 누락되지 않는다.
     */
    public void addAssignment(Assignment assignment) {
        this.assignments.add(assignment);   // Inverse(조회용) 컬렉션에 반영 → 객체 그래프 일관성
        assignment.setMember(this);         // 주인 쪽에 반영 → 실제 FK 저장의 근거
    }
}
```

## 1-2. Assignment.java — 연관관계의 주인(Owner)

```java
package com.university.assignment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 과제 엔티티 — 연관관계의 "주인(Owner)".
 * DB 테이블 관점에서 FK(member_id) 컬럼을 물리적으로 소유하는 쪽이므로
 * 이 엔티티의 member 필드 값이 곧 DB에 저장되는 FK 값이 된다.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "assignment")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 1000)
    private String content;

    @Enumerated(EnumType.STRING) // ORDINAL 금지: enum 순서 변경 시 데이터가 깨진다
    @Column(nullable = false, length = 20)
    private AssignmentStatus status;

    /**
     * N:1 매핑 — 연관관계의 주인.
     * - @ManyToOne의 기본 fetch는 EAGER이므로 반드시 LAZY로 명시해야 한다.
     *   (EAGER 방치 시 Assignment 조회마다 Member까지 무조건 조인/조회 → 성능 저하, N+1 유발)
     * - optional = false + nullable = false : "과제는 반드시 회원에게 귀속"이라는
     *   비즈니스 규칙을 DB 제약(NOT NULL)과 프록시 최적화 양쪽에 반영
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Builder
    public Assignment(String title, String content) {
        this.title = title;
        this.content = content;
        this.status = AssignmentStatus.IN_PROGRESS;
    }

    /**
     * 연관관계 편의 메서드(Member.addAssignment)에서만 호출되도록
     * public setter 대신 package-private으로 제한 — 한쪽만 설정되는 실수를 구조적으로 차단.
     */
    void setMember(Member member) {
        this.member = member;
    }

    //== 비즈니스 메서드 : Dirty Checking의 대상 ==//
    /**
     * 수정은 setter 나열이 아니라 의도가 드러나는 비즈니스 메서드로 캡슐화한다.
     * 영속 상태에서 이 메서드로 값만 바꾸면, 트랜잭션 커밋 시점에
     * 스냅샷 비교를 통해 UPDATE SQL이 자동 실행된다. (save() 재호출 불필요)
     */
    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void submit() {
        if (this.status == AssignmentStatus.SUBMITTED) {
            throw new IllegalStateException("이미 제출된 과제입니다. id=" + id);
        }
        this.status = AssignmentStatus.SUBMITTED;
    }
}
```

**AssignmentStatus.java**

```java
package com.university.assignment.domain;

public enum AssignmentStatus {
    IN_PROGRESS,  // 작성 중
    SUBMITTED     // 제출 완료
}
```

**예외 클래스 2종** — 롤백 정책 검증의 핵심 재료

```java
package com.university.assignment.exception;

/**
 * Unchecked(RuntimeException) 예외 — Spring 기본 정책상 발생 시 트랜잭션 "롤백".
 */
public class AssignmentLimitExceededException extends RuntimeException {

    public AssignmentLimitExceededException(String message) {
        super(message);
    }
}
```

```java
package com.university.assignment.exception;

/**
 * Checked(Exception) 예외 — Spring 기본 정책상 발생해도 트랜잭션 "커밋".
 * 롤백이 필요하다면 @Transactional(rollbackFor = Exception.class)를 명시해야 한다.
 */
public class ReportGenerationException extends Exception {

    public ReportGenerationException(String message) {
        super(message);
    }
}
```

## 1-3. Repository 계층

```java
package com.university.assignment.repository;

import com.university.assignment.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);
}
```

```java
package com.university.assignment.repository;

import com.university.assignment.domain.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    /**
     * [N+1 해결] Fetch Join — 과제 목록과 소속 회원을 "단 1번의 쿼리"로 함께 로딩.
     * 지연 로딩 상태로 목록을 순회하며 a.getMember()에 접근하면
     * 회원 수만큼 추가 SELECT(N번)가 발생하는 N+1 문제가 생기는데,
     * fetch join은 조회 시점에 연관 엔티티를 즉시 함께 영속화하여 이를 제거한다.
     */
    @Query("select a from Assignment a join fetch a.member")
    List<Assignment> findAllWithMember();

    long countByMemberId(Long memberId);
}
```

> **N+1 문제 요약** — 원인: `FetchType.LAZY`는 조회 시점을 미룰 뿐 조회 자체를 없애지 않으므로, 목록(1번 쿼리)을 순회하며 연관 엔티티에 접근하는 순간 건별 SELECT(N번)가 추가 발생한다. 해결: ① 위와 같은 **Fetch Join**(JPQL `join fetch`), ② `@EntityGraph(attributePaths = "member")`, ③ 전역 완충 장치로 `hibernate.default_batch_fetch_size`(IN 절 일괄 조회). 그럼에도 기본 전략은 LAZY로 두고, 필요한 화면/로직에서만 fetch join을 선택 적용하는 것이 정석이다.

## 1-4. Service 계층 — 트랜잭션 경계와 비즈니스 로직

**MemberService.java**

```java
package com.university.assignment.service;

import com.university.assignment.domain.Member;
import com.university.assignment.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 클래스 기본은 읽기 전용(스냅샷 비교·flush 생략 → 성능 최적화)
public class MemberService {

    private final MemberRepository memberRepository;

    /** 쓰기 메서드에만 readOnly=false 트랜잭션을 재선언 */
    @Transactional
    public Long join(String name, String email) {
        memberRepository.findByEmail(email).ifPresent(m -> {
            throw new IllegalStateException("이미 가입된 이메일입니다: " + email);
        });
        Member member = Member.builder()
                .name(name)
                .email(email)
                .build();
        return memberRepository.save(member).getId();
    }

    public Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. id=" + memberId));
    }
}
```

**AssignmentService.java**

```java
package com.university.assignment.service;

import com.university.assignment.domain.Assignment;
import com.university.assignment.domain.Member;
import com.university.assignment.exception.AssignmentLimitExceededException;
import com.university.assignment.exception.ReportGenerationException;
import com.university.assignment.repository.AssignmentRepository;
import com.university.assignment.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 트랜잭션 경계는 Repository가 아닌 "Service"에 둔다.
 * 하나의 비즈니스 유스케이스(과제 등록)가 회원 조회 + 과제 저장 + 정책 검증이라는
 * 여러 Repository/도메인 호출로 구성되므로, 이 전체가 하나의 원자적 단위로
 * 커밋되거나 일괄 롤백되어야 데이터 정합성이 보장되기 때문이다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssignmentService {

    public static final int MAX_ASSIGNMENTS_PER_MEMBER = 3; // 회원당 과제 등록 한도(비즈니스 정책)

    private final AssignmentRepository assignmentRepository;
    private final MemberRepository memberRepository;

    /**
     * [등록] 신규(비영속) 엔티티이므로 save()를 "최초 1회만" 호출한다.
     * 저장 이후 정책 검증에서 RuntimeException이 발생하면
     * 이미 수행된 INSERT까지 포함해 트랜잭션 전체가 롤백된다. → 테스트로 검증
     */
    @Transactional
    public Long createAssignment(Long memberId, String title, String content) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다. id=" + memberId));

        Assignment assignment = Assignment.builder()
                .title(title)
                .content(content)
                .build();

        member.addAssignment(assignment);        // 연관관계 편의 메서드 — 양방향을 원자적으로 설정
        assignmentRepository.save(assignment);   // 주인(Assignment)에 member가 설정된 상태로 INSERT → FK 저장

        validateAssignmentLimit(member);          // 정책 위반 시 RuntimeException → 위 INSERT까지 전부 롤백
        return assignment.getId();
    }

    /**
     * [수정] save() 호출 금지 — 변경 감지(Dirty Checking)가 UPDATE를 담당한다.
     *
     * 1) findById()로 조회한 순간 엔티티는 "영속 상태"가 되고, 영속성 컨텍스트는 스냅샷(원본 복사본)을 보관
     * 2) 비즈니스 메서드(update)로 필드 값만 변경
     * 3) 트랜잭션 커밋 직전 flush 시점에 스냅샷과 현재 값을 비교 → 달라진 엔티티에 대해 UPDATE SQL 자동 실행
     */
    @Transactional
    public void updateAssignment(Long assignmentId, String title, String content) {
        Assignment assignment = findAssignment(assignmentId); // 영속 상태로 조회
        assignment.update(title, content);
        // 여기서 assignmentRepository.save(assignment)를 다시 호출하지 않는다!
        // 영속 엔티티에 save()를 또 호출하는 것은 무의미하거나(동일 인스턴스 반환)
        // merge 동작으로 이어져 의도치 않은 부작용을 낳을 수 있다.
    }

    /**
     * [롤백 정책 검증용 시나리오] 과제 제출 후 결과 리포트 생성.
     * ReportGenerationException은 "Checked" 예외이므로 Spring 기본 정책상 롤백되지 않는다.
     * 즉, 리포트 생성이 실패해도 제출 상태 변경(Dirty Checking에 의한 UPDATE)은 커밋된다. → 테스트로 검증
     * 모든 예외에 대해 롤백이 필요하다면 @Transactional(rollbackFor = Exception.class)로 선언해야 한다.
     */
    @Transactional
    public void submitWithReport(Long assignmentId) throws ReportGenerationException {
        Assignment assignment = findAssignment(assignmentId);
        assignment.submit();          // 상태 변경 — Dirty Checking으로 UPDATE 예정
        generateReport(assignment);   // Checked 예외 발생 가능 지점
    }

    public Assignment findAssignment(Long assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 과제입니다. id=" + assignmentId));
    }

    /** 목록 화면 등 회원 정보가 함께 필요한 조회는 fetch join으로 N+1 방지 */
    public List<Assignment> findAllWithMember() {
        return assignmentRepository.findAllWithMember();
    }

    private void validateAssignmentLimit(Member member) {
        if (member.getAssignments().size() > MAX_ASSIGNMENTS_PER_MEMBER) {
            throw new AssignmentLimitExceededException(
                    "회원당 최대 " + MAX_ASSIGNMENTS_PER_MEMBER + "개의 과제만 등록할 수 있습니다. memberId=" + member.getId());
        }
    }

    private void generateReport(Assignment assignment) throws ReportGenerationException {
        // 실제로는 외부 리포트 시스템 연동 지점. 테스트를 위해 특정 제목에서 실패를 시뮬레이션한다.
        if (assignment.getTitle().contains("[REPORT-FAIL]")) {
            throw new ReportGenerationException("리포트 생성에 실패했습니다. assignmentId=" + assignment.getId());
        }
    }
}
```

## 1-5. AssignmentServiceTest.java — JUnit 5 통합 테스트

```java
package com.university.assignment.service;

import com.university.assignment.domain.Assignment;
import com.university.assignment.domain.AssignmentStatus;
import com.university.assignment.domain.Member;
import com.university.assignment.exception.AssignmentLimitExceededException;
import com.university.assignment.exception.ReportGenerationException;
import com.university.assignment.repository.AssignmentRepository;
import com.university.assignment.repository.MemberRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Hibernate;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class AssignmentServiceTest {

    @Autowired AssignmentService assignmentService;
    @Autowired MemberService memberService;
    @Autowired MemberRepository memberRepository;
    @Autowired AssignmentRepository assignmentRepository;

    @PersistenceContext EntityManager em;

    /**
     * 롤백 검증 테스트(3, 4번)는 테스트 메서드에 @Transactional이 없어서
     * 서비스가 실제로 커밋/롤백한 데이터가 DB에 남는다. → 테스트 간 격리를 위해 직접 정리.
     * (FK 제약 때문에 자식인 assignment부터 삭제)
     */
    @AfterEach
    void tearDown() {
        assignmentRepository.deleteAllInBatch();
        memberRepository.deleteAllInBatch();
    }

    @Test
    @Transactional // 테스트 트랜잭션 — 종료 시 자동 롤백되어 DB를 오염시키지 않음 (Part 2 - Q5)
    @DisplayName("1. 과제 등록 성공 — 양방향 연관관계 매핑과 지연 로딩(LAZY)을 함께 검증한다")
    void createAssignment_success_and_bidirectionalMapping() {
        // given
        Long memberId = memberService.join("김민형", "mapping@univ.ac.kr");

        // when
        Long assignmentId = assignmentService.createAssignment(memberId, "1주차 과제", "JPA 연관관계 매핑 실습");
        em.flush();  // 영속성 컨텍스트의 변경분을 DB에 반영
        em.clear();  // 1차 캐시를 비워, 이후 조회가 "실제 DB"에서 일어나도록 강제

        // then 1: 주인(Assignment) → Member 방향. FK(member_id)가 정상 저장되었는지 확인
        Assignment foundAssignment = assignmentRepository.findById(assignmentId).orElseThrow();
        Member memberProxy = foundAssignment.getMember();

        assertThat(Hibernate.isInitialized(memberProxy)).isFalse();  // FetchType.LAZY → 아직 프록시(미초기화)
        assertThat(memberProxy.getName()).isEqualTo("김민형");         // 실제 필드 접근 시점에 SELECT 발생
        assertThat(Hibernate.isInitialized(memberProxy)).isTrue();   // 접근 후 초기화 완료

        // then 2: 종속자(Member) → Assignment 방향. 조회용 컬렉션으로도 정상 탐색되는지 확인
        Member foundMember = memberRepository.findById(memberId).orElseThrow();
        assertThat(foundMember.getAssignments())
                .hasSize(1)
                .extracting(Assignment::getTitle)
                .containsExactly("1주차 과제");
        assertThat(foundMember.getAssignments().get(0).getStatus()).isEqualTo(AssignmentStatus.IN_PROGRESS);
    }

    @Test
    @Transactional
    @DisplayName("2. 수정 시 save() 없이 변경 감지(Dirty Checking)만으로 UPDATE가 반영된다")
    void updateAssignment_dirtyChecking() {
        // given
        Long memberId = memberService.join("김민형", "dirty@univ.ac.kr");
        Long assignmentId = assignmentService.createAssignment(memberId, "1주차 과제", "초안");

        // when: 서비스는 영속 엔티티의 값만 변경할 뿐, save()를 호출하지 않는다
        assignmentService.updateAssignment(assignmentId, "1주차 과제(수정)", "연관관계 + 트랜잭션 정리");
        em.flush();  // 커밋 시점을 시뮬레이션 — 스냅샷 비교 후 UPDATE SQL 실행 (로그로 확인 가능)
        em.clear();

        // then: DB에서 다시 읽어도 수정 값이 반영되어 있다
        Assignment updated = assignmentRepository.findById(assignmentId).orElseThrow();
        assertThat(updated.getTitle()).isEqualTo("1주차 과제(수정)");
        assertThat(updated.getContent()).isEqualTo("연관관계 + 트랜잭션 정리");
    }

    @Test
    // 주의: 이 테스트에는 @Transactional을 붙이지 않는다.
    // 붙이면 서비스 트랜잭션이 테스트 트랜잭션에 "참여(REQUIRED)"해 버려서
    // 서비스의 실제 커밋/롤백 여부를 관찰할 수 없기 때문이다.
    @DisplayName("3. 비즈니스 예외(RuntimeException) 발생 시 INSERT를 포함한 트랜잭션 전체가 롤백된다")
    void createAssignment_runtimeException_rollback() {
        // given: 정책 한도(3개)까지는 정상 등록 — 각 호출은 독립 트랜잭션으로 커밋됨
        Long memberId = memberService.join("김민형", "rollback@univ.ac.kr");
        assignmentService.createAssignment(memberId, "1주차 과제", "내용1");
        assignmentService.createAssignment(memberId, "2주차 과제", "내용2");
        assignmentService.createAssignment(memberId, "3주차 과제", "내용3");

        // when: 4번째 등록 — 서비스 내부에서 save(INSERT)가 "먼저" 수행된 뒤 정책 검증에서 예외 발생
        assertThatThrownBy(() -> assignmentService.createAssignment(memberId, "4주차 과제", "내용4"))
                .isInstanceOf(AssignmentLimitExceededException.class)
                .hasMessageContaining("최대 3개");

        // then: 예외 직전에 수행된 INSERT까지 모두 롤백되어, DB에는 여전히 3개만 존재
        assertThat(assignmentRepository.countByMemberId(memberId)).isEqualTo(3);
    }

    @Test
    // 이 테스트 역시 실제 커밋 여부를 관찰해야 하므로 @Transactional 미적용
    @DisplayName("4. Checked Exception은 기본 정책상 롤백되지 않는다 — 상태 변경이 그대로 커밋됨")
    void submitWithReport_checkedException_commits() {
        // given
        Long memberId = memberService.join("김민형", "checked@univ.ac.kr");
        Long assignmentId = assignmentService.createAssignment(memberId, "[REPORT-FAIL] 기말 과제", "리포트 실패 시나리오");

        // when: 제출 상태 변경(Dirty Checking) 후 리포트 생성에서 Checked 예외 발생
        assertThatThrownBy(() -> assignmentService.submitWithReport(assignmentId))
                .isInstanceOf(ReportGenerationException.class);

        // then: 예외가 났음에도 상태 변경은 "커밋"되어 있다 — Spring 기본 롤백 정책의 증거
        Assignment assignment = assignmentService.findAssignment(assignmentId);
        assertThat(assignment.getStatus()).isEqualTo(AssignmentStatus.SUBMITTED);
        // 이 동작이 위험한 도메인이라면 반드시 @Transactional(rollbackFor = Exception.class)로 선언할 것
    }
}
```

**실행 방법**

```bash
./gradlew test          # 전체 테스트 실행
./gradlew test --tests "com.university.assignment.service.AssignmentServiceTest"
```

* * *

# \[Part 2\] 핵심 기술 정리 보고서

## Q1. 왜 외래 키(FK)가 있는 엔티티가 연관관계의 주인이 되어야 하나요?

객체는 `Member → assignments`, `Assignment → member`라는 **참조 2개**로 양방향을 표현하지만, 테이블은 `assignment.member_id`라는 **FK 1개**로 관계를 표현한다. 관리 지점의 개수가 다르기 때문에, JPA는 둘 중 한쪽만 FK를 관리하도록 지정해야 하며 그 관리자가 곧 "연관관계의 주인"이다.

주인은 FK를 가진 쪽(`Assignment`)이어야 한다. 이유는 SQL의 대응 관계 때문이다. 관계를 바꾼다는 것은 결국 `assignment` 테이블의 `member_id` 컬럼을 바꾸는 일이므로, `Assignment.member`를 수정하면 자기 자신의 테이블에 UPDATE가 나가는 직관적인 1:1 대응이 성립한다. 반대로 `Member.assignments`(컬렉션)를 주인으로 두면, `Member` 객체를 수정했는데 SQL은 엉뚱하게 `assignment` 테이블로 나가는 구조가 되어 유지보수 시 혼란을 부르고, 컬렉션 변경을 추적해 별도의 FK UPDATE 쿼리가 추가 발생하는 성능 손해까지 감수해야 한다. 그래서 "FK가 있는 곳이 주인, N측이 주인"이 JPA 설계의 표준 규칙이며, 주인이 아닌 쪽은 `mappedBy`로 선언되어 조회 전용으로만 동작한다.

## Q2. 실무에서 Service 계층에 `@Transactional`을 선언하는 진짜 이유는 무엇인가요?

트랜잭션 경계는 기술 단위가 아니라 **비즈니스 유스케이스 단위**여야 하기 때문이다. "과제를 등록한다"는 하나의 업무는 회원 조회, 과제 저장, 정책 검증이라는 여러 Repository/도메인 호출의 묶음인데, 이 묶음이 전부 성공하거나 전부 실패해야(원자성) 데이터 정합성이 유지된다. 만약 Repository 메서드 단위로 트랜잭션이 각각 걸리면, 세 번째 호출에서 예외가 나도 앞의 두 호출은 이미 커밋되어 되돌릴 수 없다 — 본 과제의 테스트 3번이 보여주듯, Service에 트랜잭션을 두면 INSERT가 이미 수행된 뒤의 예외도 전체를 일괄 롤백시킨다.

부가적으로, 영속성 컨텍스트의 생존 범위가 트랜잭션 범위와 함께하므로 Service 로직 전체에서 변경 감지·지연 로딩·1차 캐시·쓰기 지연을 온전히 활용할 수 있고, `readOnly = true` 같은 선언적 최적화(스냅샷 비교와 flush 생략)를 유스케이스 단위로 제어할 수 있다는 실익도 있다.

## Q3. 변경 감지(Dirty Checking)가 동작하기 위한 필수 조건 2가지는 무엇인가요?

**첫째, 엔티티가 영속(managed) 상태여야 한다.** 영속성 컨텍스트는 자신이 관리하는 엔티티에 대해서만 최초 상태의 스냅샷을 보관하고 비교할 수 있다. `em.find()`나 `findById()`로 조회해 온 엔티티가 여기에 해당하며, 준영속(detached)이나 비영속(new) 객체는 아무리 값을 바꿔도 감지되지 않는다.

**둘째, 트랜잭션 안에서 변경이 일어나고 flush(커밋) 시점이 존재해야 한다.** 스냅샷 비교와 UPDATE SQL 생성은 트랜잭션 커밋 직전의 flush 시점에 수행되므로, 트랜잭션이 없으면 비교할 계기 자체가 없다. 본 과제의 `updateAssignment()`가 정확히 이 두 조건 위에서 동작한다: `@Transactional` 안에서 영속 상태로 조회한 뒤 값만 변경하고, `save()` 없이 커밋 시점의 자동 UPDATE에 맡긴다.

## Q4. 기본 롤백 정책(Unchecked vs Checked)의 차이와, 모든 예외를 강제 롤백하는 옵션은 무엇인가요?

| 구분 | 예외 유형 | 기본 동작 | 본 과제의 검증 |
| --- | --- | --- | --- |
| Unchecked | `RuntimeException`, `Error` | **롤백** | `AssignmentLimitExceededException` → INSERT까지 롤백 (테스트 3) |
| Checked | `Exception` (RuntimeException 제외) | **커밋** | `ReportGenerationException` → 상태 변경이 커밋됨 (테스트 4) |

Spring은 EJB 시절의 관례를 이어받아 Checked 예외를 "호출자가 복구할 수 있는 예상된 비즈니스 흐름"으로 간주해 커밋하고, Unchecked 예외와 Error는 "복구 불가능한 장애"로 보아 롤백한다. 문제는 개발자가 이 기본값을 모른 채 Checked 예외를 던지면, 테스트 4번처럼 실패한 작업의 일부가 조용히 커밋되는 정합성 사고로 이어진다는 점이다.

모든 예외에 대해 강제로 롤백하려면 다음과 같이 선언한다.

```java
@Transactional(rollbackFor = Exception.class)
```

반대로 특정 예외를 롤백 대상에서 제외하는 `noRollbackFor` 속성도 있다. 실무에서는 Checked 예외를 트랜잭션 경계 밖으로 흘리지 않거나(런타임 예외로 래핑), 흘려야 한다면 반드시 `rollbackFor`를 명시하는 것이 안전하다.

## Q5. 테스트 클래스에 `@Transactional`을 적용하면 DB가 오염되지 않는 설계적 이유는 무엇인가요?

Spring TestContext 프레임워크는 `@Transactional`이 붙은 테스트 메서드를 하나의 트랜잭션으로 감싸고, 테스트가 끝나면 **커밋이 아니라 롤백을 기본 동작**으로 수행한다(`@Rollback`의 기본값이 `true`). 테스트 중 실행된 INSERT/UPDATE/DELETE가 전부 취소되므로 DB는 테스트 이전 상태로 돌아가고, 그 결과 각 테스트가 서로 격리되어 실행 순서와 무관하게 몇 번을 반복해도 같은 결과를 낸다. 본 테스트의 1, 2번이 이 방식으로 데이터 정리 코드 없이 깨끗하게 동작한다.

다만 설계상 주의점이 하나 있다. 테스트 트랜잭션이 걸려 있으면 서비스의 `@Transactional(REQUIRED)`은 새 트랜잭션을 만들지 않고 테스트 트랜잭션에 참여하므로, **서비스의 실제 커밋/롤백 여부 자체를 검증하는 테스트에서는 오히려** `@Transactional`**을 빼야 한다.** 그래서 본 과제의 롤백 검증 테스트(3, 4번)는 테스트 트랜잭션 없이 실행하고, `@AfterEach`에서 데이터를 직접 정리하는 방식으로 격리를 유지했다.

* * *

## 부록. 요구사항 ↔ 구현 매핑 체크리스트

| # | 요구사항 | 구현 위치 |
| --- | --- | --- |
| 1 | FK 소유 엔티티를 주인으로, `@JoinColumn(name = "member_id")` | `Assignment.member` |
| 1 | `mappedBy = "member"`로 Inverse 선언, 조회 전용 | `Member.assignments` |
| 1 | 컬렉션 `new ArrayList<>()` 필드 초기화 (NPE 방지) | `Member.assignments` |
| 2 | `FetchType.LAZY` 명시 (양쪽 모두) | `Member.assignments`, `Assignment.member` |
| 2 | N+1 원인·해결(Fetch Join) 언급 | `AssignmentRepository.findAllWithMember()` + 1-3 해설 |
| 3 | 연관관계 편의 메서드로 양방향 원자적 설정 | `Member.addAssignment()` (+ package-private `setMember`) |
| 4 | Service 계층 `@Transactional` — 일괄 롤백 보장 | `AssignmentService.createAssignment()` 외 |
| 5 | 수정 시 `save()` 금지, Dirty Checking 적용 | `AssignmentService.updateAssignment()` + 테스트 2 |
| 6 | 기본 롤백 규칙(Unchecked 롤백 / Checked 커밋) 테스트 검증 | 테스트 3(런타임 → 롤백), 테스트 4(체크드 → 커밋) |

### 추가 주의사항

양방향 연관관계 엔티티에는 `@ToString`이나 롬복 `@Data`를 쓰지 않는 것이 좋다. 양쪽이 서로를 참조하므로 `toString()`/`hashCode()` 순환 호출로 `StackOverflowError`가 나거나, 컨트롤러에서 엔티티를 그대로 JSON 직렬화할 때 무한 루프가 발생한다(해법: DTO 변환). 또한 `application.yml`에서 `open-in-view: false`로 두면 지연 로딩이 트랜잭션(Service) 밖에서 동작하지 않도록 강제되어, 트랜잭션 경계를 명확히 지키는 습관을 검증받을 수 있다.
