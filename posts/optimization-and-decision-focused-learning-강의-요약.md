---
title: "Optimization and Decision-Focused Learning — 강의 요약"
date: 2026-07-20
tags: ["lg-aimers"]
---

> 이용재 교수 (UNIST 산업공학과 / Financial Engineering Lab) 전체 구성: **Ch.1 볼록 최적화 입문 → Ch.2 최적화 문제 유형 → Ch.3 의사결정 중심 학습(DFL)**

* * *

## Chapter 1. Introduction to Convex Optimization (볼록 최적화 입문)

### 1-1. 최적화란 무엇인가

*   **정의**: 주어진 제약 하에서 최선의 해를 찾는 것.
    
*   **수학적 표준형(mathematical optimization)**
    
    *   minimize $f\_0(x)$
        
    *   subject to $f\_i(x) \\le b\_i,\\ i=1,\\dots,m$
        
    *   $x=(x\_1,\\dots,x\_n)$: 최적화 변수(=의사결정 변수)
        
    *   $f\_0:\\mathbb{R}^n\\to\\mathbb{R}$: 목적함수(objective)
        
    *   $f\_i:\\mathbb{R}^n\\to\\mathbb{R}$: 제약함수(constraint)
        
    *   **최적해 $x^\*$**: 제약을 만족하는 모든 벡터 중 $f\_0$ 값이 가장 작은 점.
        

### 1-2. 최적화 활용 예시

*   **포트폴리오 최적화**: 변수=자산별 투자액 / 제약=예산·자산별 상하한·최소 수익률 / 목적=전체 리스크(예: 수익률 분산).
    
*   **전자회로 소자 크기 결정**: 변수=소자 폭·길이 / 제약=제조 한계·타이밍·최대 면적 / 목적=전력 소비.
    
*   **데이터 피팅(통계·머신러닝)**: 변수=모델 파라미터 / 제약=사전정보·파라미터 한계 / 목적=오차(misfit·예측오차).
    

### 1-3. 최적화 문제의 난이도

*   **일반 최적화 문제**: 매우 풀기 어려움. 해법은 타협을 수반(긴 계산시간, 항상 해를 찾지는 못함).
    
*   **예외적으로 효율·신뢰성 있게 풀리는 문제 클래스**: 최소제곱(least-squares), 선형계획(LP), **볼록 최적화(convex optimization)**.
    

### 1-4. 최적화 vs 머신러닝

*   **최적화**: 의사결정과 그 결과를 **수학적으로 모델링**하는 접근.
    
*   **머신러닝**: 의사결정과 결과 간 **매핑을 데이터로 학습**하는 접근.
    
*   **완전히 다른가? → 아니다.**
    
    *   최적화도 적절한 모델·파라미터 결정을 위해 도메인 지식과 데이터가 필요.
        
    *   머신러닝도 모델링 기반 접근을 취할 수 있음.
        
    *   최근 강화학습·샘플링 기반 대규모 최적화 기법은 상호 밀접.
        
    *   무엇보다 **"학습(learning)" 자체가 최적화를 내포**함.
        

### 1-5. 볼록 최적화의 직관 (등산 비유)

*   **일반 최적화 = 산 오르기**: 가장 높은 봉우리로 가야 함.
    
    *   문제: 봉우리가 여러 개 → 오르기 전에 최고봉을 식별해야 함.
        
    *   더 큰 문제: 눈을 가린 상태(blindfolded)라면 사실상 불가능.
        
*   **볼록 최적화의 희소식**: 봉우리가 **단 하나뿐**.
    
    *   매 스텝 더 높은 곳으로만 이동해도 결국 정상에 도달.
        
    *   국소최적(local optima)의 함정이 존재하지 않음.
        

### 1-6. 문제 클래스 위계와 난이도

*   일반 최적화 문제 → **풀기 어려움(Difficult)**.
    
*   볼록 최적화 문제 → **효율적으로 풀림(Can be solved efficiently)**.
    
*   선형계획(LP) 문제(볼록의 부분집합) → **쉽게 풀림(Easy)**.
    

### 1-7. 최소제곱 (Least-squares)

*   형태: minimize $|Ax-b|\_2^2$
    
*   **해석해 존재**: $x^\* = (A^TA)^{-1}A^Tb$.
    
*   신뢰성·효율성 높은 알고리즘/소프트웨어 존재, 성숙한 기술.
    
*   계산시간은 $n^2k$에 비례($A\\in\\mathbb{R}^{k\\times n}$), 구조가 있으면 더 빠름.
    
*   **활용**: 인식(recognize)하기 쉬움. 가중치 부여·정규화항 추가 등 표준 기법으로 유연성 확보.
    

### 1-8. 최소제곱 예시 — 다항 회귀

*   데이터 ${(x\_i,y\_i)}\_{i=1}^k$를 $y=\\beta\_0+\\beta\_1 x+\\cdots+\\beta\_n x^n$에 피팅.
    
*   잔차 포함: $y\_i=\\beta\_0+\\beta\_1 x\_i+\\cdots+\\beta\_n x\_i^n+\\varepsilon\_i$.
    
*   행렬형: $\\mathbf{y}=X\\boldsymbol{\\beta}+\\boldsymbol{\\varepsilon}$ → minimize $|X\\boldsymbol{\\beta}-\\mathbf{y}|\_2^2$.
    

### 1-9. 선형계획 (Linear Programming, LP)

*   형태: minimize $c^Tx$ s.t. $a\_i^Tx\\le b\_i$.
    
*   **해석식 없음**(no analytical formula), 그러나 신뢰·효율적 알고리즘 존재.
    
*   계산시간 $n^2m$에 비례($m\\ge n$일 때), 구조가 있으면 더 빠름.
    
*   **활용**: 최소제곱만큼 인식이 쉽지는 않음. $\\ell\_1$·$\\ell\_\\infty$ norm, 조각선형(piecewise-linear) 함수 등을 LP로 변환하는 표준 기법 존재.
    

### 1-10. 볼록 최적화 문제 (Convex Optimization Problem)

*   형태: minimize $f\_0(x)$ s.t. $f\_i(x)\\le b\_i$.
    
*   **핵심 조건**: 목적함수·제약함수가 모두 **볼록(convex)**.
    
    *   볼록 함수 정의(**Jensen 부등식**): $f(tx\_1+(1-t)x\_2)\\le tf(x\_1)+(1-t)f(x\_2),\\ 0\\le t\\le 1$.
        
*   최소제곱·LP를 **특수 케이스로 포함**.
    

### 1-11. 볼록 최적화의 풀이 특성

*   해석해는 없음, 그러나 신뢰·효율적 알고리즘 존재.
    
*   계산시간은 대략 $\\max{n^3,\\ n^2m,\\ F}$에 비례($F$=$f\_i$ 및 2계 도함수 평가 비용).
    
*   "거의 하나의 기술(almost a technology)" 수준으로 성숙.
    
*   **활용**: 볼록임을 **인식하기 어려운** 경우가 많음. 볼록 형태로 변환하는 다양한 기법 존재. 의외로 많은 문제가 볼록 최적화로 풀림.
    

### 1-12. 왜 정식화(formulation)가 중요한가 — 조명 예시

*   **설정**: $m$개 램프가 $n$개의 작고 평평한 패치를 비춤.
    
    *   패치 $k$의 조도: $I\_k=\\sum\_{j=1}^m a\_{kj}p\_j$, $a\_{kj}=r\_{kj}^{-2}\\max{\\cos\\theta\_{kj},0}$ (램프 파워 $p\_j$에 선형 의존).
        
    *   **문제**: 램프 파워 상한 하에서 목표 조도 $I\_{des}$ 달성.
        
    *   정식화: minimize $\\max\_k|\\log I\_k-\\log I\_{des}|$ s.t. $0\\le p\_j\\le p\_{\\max}$.
        
*   **풀이 접근법 5가지 (정식화에 따라 난이도가 크게 달라짐)**
    
    1.  **균일 파워**: $p\_j=p$로 두고 $p$만 변화.
        
    2.  **최소제곱**: minimize $\\sum\_k(I\_k-I\_{des})^2$ 후, 범위 벗어난 $p\_j$를 반올림(clip).
        
    3.  **가중 최소제곱**: minimize $\\sum\_k(I\_k-I\_{des})^2+\\sum\_j w\_j(p\_j-p\_{\\max}/2)^2$, 가중치 $w\_j$를 범위 만족까지 반복 조정.
        
    4.  **선형계획(LP)**: minimize $\\max\_k|I\_k-I\_{des}|$ 형태로 LP화. (단, log 대신 선형 근사 → 근사·준최적 해)
        
    5.  **볼록 최적화**: 동치 문제 minimize $f\_0(p)=\\max\_k h(I\_k/I\_{des})$, 여기서 $h(u)=\\max{u,1/u}$.
        
        *   $f\_0$는 **볼록 함수들의 최댓값 → 볼록**.
            
        *   **정확한 해(exact)** 를 최소제곱 대비 완만한 배수(modest factor)의 노력으로 획득.
            
    
    *   1~4는 근사(준최적) 해, 5만 정확해.
        

### 1-13. 추가 제약과 직관의 함정

*   다음 제약 추가 시 난이도 변화:
    
    1.  **어떤 10개 램프에도 총 파워의 절반 이상이 몰리지 않도록** → 추가해도 **여전히 쉽게** 풀림.
        
    2.  **켜진 램프($p\_j>0$)가 절반을 넘지 않도록** → **극도로 어려워짐**.
        
*   **교훈**
    
    *   (훈련되지 않은) **직관은 항상 통하지 않음**.
        
    *   적절한 배경지식이 없으면 매우 쉬운 문제와 매우 어려운 문제가 비슷해 보일 수 있음.
        

* * *

## Chapter 2. Optimization Problems (최적화 문제 유형)

### 2-1. 표준형 최적화 문제 (Standard Form)

*   minimize $f\_0(x)$
    
*   s.t. $f\_i(x)\\le 0\\ (i=1,\\dots,m)$, $h\_i(x)=0\\ (i=1,\\dots,p)$
    
    *   $x\\in\\mathbb{R}^n$: 의사결정 변수 / $f\_0$: 목적(비용)함수.
        
    *   $f\_i$: 부등식 제약함수 / $h\_i$: 등식 제약함수.
        
*   **최적값(optimal value)**: $p^\*=\\inf{f\_0(x)\\mid f\_i(x)\\le 0,\\ h\_i(x)=0}$.
    
    *   $p^\*=\\infty$: 실행 불가능(infeasible, 제약 만족 $x$ 없음).
        
    *   $p^\*=-\\infty$: 아래로 무한(unbounded below).
        

### 2-2. 최적점과 국소 최적점

*   **실행 가능(feasible)**: $x\\in\\text{dom},f\_0$이고 제약을 만족.
    
*   **최적(optimal)**: 실행 가능하면서 $f\_0(x)=p^\*$. 최적점 집합 = $X\_{opt}$.
    
*   **국소 최적(locally optimal)**: 어떤 $R>0$이 존재하여, $|z-x|\_2\\le R$ 범위 내에서 $x$가 최적인 경우.
    

### 2-3. 최적/국소최적 예시 (무제약, $n=1$)

*   $f\_0(x)=1/x$, dom$=\\mathbb{R}\_{++}$: $p^\*=0$, **최적점 없음**.
    
*   $f\_0(x)=-\\log x$, dom$=\\mathbb{R}\_{++}$: $p^\*=-\\infty$, **아래로 무한**.
    
*   $f\_0(x)=x\\log x$, dom$=\\mathbb{R}\_{++}$: $p^\*=-1/e$, $x=1/e$가 **최적**.
    
*   $f\_0(x)=x^3-3x$: $p^\*=-\\infty$, $x=1$에서 **국소 최적**.
    

### 2-4. 볼록 집합 (Convex Set)

*   **선분(line segment)**: $x=\\theta x\_1+(1-\\theta)x\_2,\\ 0\\le\\theta\\le 1$ (두 점 사이의 모든 볼록 조합).
    
*   **볼록 집합**: 집합 내 임의의 두 점을 잇는 선분을 전부 포함.
    
    *   $x\_1,x\_2\\in C,\\ 0\\le\\theta\\le1 \\Rightarrow \\theta x\_1+(1-\\theta)x\_2\\in C$.
        
*   **볼록 조합의 일반화**
    
    *   $k$개 점: $\\sum\\theta\_i x\_i\\in C$ ($\\sum\\theta\_i=1,\\ \\theta\_i\\ge0$).
        
    *   무한합·적분($\\int\_C p(x)x,dx\\in C$)·**확률분포의 기댓값**($\\mathbb{E}x\\in C$)까지 확장.
        

### 2-5. 볼록 함수 (Convex Function)

*   $f:\\mathbb{R}^n\\to\\mathbb{R}$가 볼록 ⇔ dom$,f$가 볼록 집합이고 **Jensen 부등식** 성립:
    
    *   $f(\\theta x+(1-\\theta)y)\\le\\theta f(x)+(1-\\theta)f(y)$, $0\\le\\theta\\le1$.
        
*   **오목(concave)**: $-f$가 볼록일 때.
    
*   **강볼록(strictly convex)**: $x\\ne y,\\ 0<\\theta<1$에서 부등호가 **엄격(<)** 성립.
    

### 2-6. 볼록 최적화 문제 (표준형)

*   minimize $f\_0(x)$ s.t. $f\_i(x)\\le0$, $a\_i^Tx=b\_i$ → 행렬형 $Ax=b$.
    
*   **조건**: $f\_0,\\dots,f\_m$이 볼록, **등식 제약은 아핀(affine)**.
    
*   **핵심 성질**: 볼록 최적화 문제의 **실행 가능 집합은 볼록**.
    

### 2-7. 볼록 최적화 문제의 미묘함 — 예시

*   minimize $x\_1^2+x\_2^2$ s.t. $f\_1(x)=x\_1/(1+x\_2^2)\\le0$, $h\_1(x)=(x\_1+x\_2)^2=0$.
    
    *   $f\_0$는 볼록, 실행 가능 집합 ${x\_1=-x\_2\\le0}$도 볼록.
        
    *   **그러나 볼록 문제는 아님**: $f\_1$이 비볼록, $h\_1$이 비아핀.
        
    *   다음 볼록 문제와 **동치(equivalent, but not identical)**: minimize $x\_1^2+x\_2^2$ s.t. $x\_1\\le0,\\ x\_1+x\_2=0$.
        
    *   → 형태가 비볼록이어도 동치 볼록 문제로 바꿀 수 있음.
        

### 2-8. 미분 가능 $f\_0$의 최적성 조건

*   $x$가 최적 ⇔ 실행 가능하고 $\\nabla f\_0(x)^T(y-x)\\ge0$ (모든 실행 가능 $y$에 대해).
    
    *   근거: 볼록성에서 $f\_0(y)\\ge f\_0(x)+\\nabla f\_0(x)^T(y-x)$이므로, 최적이면 $f\_0(y)\\ge f\_0(x)$.
        
*   $-\\nabla f\_0(x)$가 0이 아니면, 실행 가능 집합 $X$의 $x$에서의 **지지 초평면(supporting hyperplane)** 을 정의.
    

### 2-9. 선형계획 (LP)

*   minimize $c^Tx+d$ s.t. $Gx\\preceq h,\\ Ax=b$ ($G\\in\\mathbb{R}^{m\\times n}$, $A\\in\\mathbb{R}^{p\\times n}$).
    
*   **아핀 목적·제약함수를 가진 볼록 문제**, 실행 가능 집합은 **다면체(polyhedron)**.
    
*   **예시 ① 식단 문제(Diet)**: $n$개 식품 수량 $x\_j$ 선택, 단가 $c\_j$·영양소 함량 $a\_{ij}$, 영양소 $i$ 최소 $b\_i$ 필요.
    
    *   최소 비용 식단: minimize $c^Tx$ s.t. $Ax\\succeq b,\\ x\\succeq0$.
        
*   **예시 ② 조각선형(piecewise-linear) 최소화**: minimize $\\max\_i(a\_i^Tx+b\_i)$.
    
    *   에피그래프 문제로 변환: minimize $t$ s.t. $\\max\_i(a\_i^Tx+b\_i)\\le t$.
        
    *   다시 $m$개 개별 부등식으로: minimize $t$ s.t. $a\_i^Tx+b\_i\\le t$.
        

### 2-10. 이차계획 (Quadratic Program, QP)

*   minimize $\\tfrac12 x^TPx+q^Tx+r$ s.t. $Gx\\preceq h,\\ Ax=b$.
    
*   $P\\in\\mathbf{S}\_+^n$(반정치) → 목적이 **볼록 이차함수**. 다면체 위에서 볼록 이차함수 최소화.
    
*   **예시 ① 최소제곱·회귀**: minimize $|Ax-b|\_2^2$, 해석해 $x^\*=A^\\dagger b$($A^\\dagger$=유사역행렬). 선형 제약($l\\preceq x\\preceq u$) 추가 가능.
    
*   **예시 ② 무작위 비용 LP**: $c$가 평균 $\\bar c$·공분산 $\\Sigma$인 확률변수일 때,
    
    *   minimize $\\mathbb{E}\[c^Tx\]+\\gamma,\\text{var}(c^Tx)$ s.t. $Gx\\preceq h,\\ Ax=b$.
        
    *   $\\mathbb{E}\[c^Tx\]=\\bar c^Tx$, $\\text{var}(c^Tx)=x^T\\Sigma x$, $\\gamma>0$=위험회피 계수(기대비용·분산 trade-off 조절).
        
*   **예시 ③ 마코위츠 포트폴리오 최적화**
    
    *   $n$개 자산, 수익률 $r=\[r\_1\\dots r\_n\]$은 평균 $\\mu$·공분산 $\\Sigma$인 확률변수.
        
    *   투자비중 $w$: $\\mathbf 1^Tw=1$(예산), $w\\ge0$(공매도 금지, 경우에 따라 생략 가능).
        
    *   minimize $w^T\\Sigma w-\\lambda\\mu^Tw$ s.t. $\\mathbf1^Tw=1,\\ w\\succeq0$ (위험 최소·수익 최대).
        
    *   $\\lambda>0$=위험선호 계수. 결과는 **효율적 프론티어(efficient frontier)** 를 형성.
        

### 2-11. 이차제약 이차계획 (QCQP)

*   minimize $\\tfrac12 x^TP\_0x+q\_0^Tx+r\_0$ s.t. $\\tfrac12 x^TP\_ix+q\_i^Tx+r\_i\\le0$, $Ax=b$.
    
*   $P\_i\\in\\mathbf{S}_+^n$ → 목적·부등식 제약이 볼록 이차. $P\_1,\\dots,P\_m\\in\\mathbf{S}_{++}^n$이면 실행 가능 영역은 $m$개 **타원체 ∩ 아핀 집합**.
    
*   **포함 관계**: LP $\\subset$ QP $\\subset$ QCQP (QP는 $P=0$이면 LP, QCQP는 $P\_i=0\\ (i>0)$이면 QP).
    

### 2-12. QCQP 예시 — 샤프 비율 최대화

*   원 문제: maximize$\_w\\ \\dfrac{w^T\\mu-r\_f}{\\sqrt{w^T\\Sigma w}}$ s.t. $\\mathbf1^Tw=1$. (샤프 비율 = 위험 대비 수익 지표)
    
*   변수 변환으로 동치 QCQP화: maximize$\_{y,t}\\ y^T\\mu-tr\_f$ s.t. $\\mathbf1^Ty=t,\\ \\sqrt{y^T\\Sigma y}\\le1,\\ t\\ge0$.
    
*   동일 해 제공($w=y/t$), 이는 **볼록 QCQP**.
    

### 2-13. 이차원뿔 계획 (Second-Order Cone Program, SOCP)

*   minimize $f^Tx+r\_0$ s.t. $|A\_ix+b\_i|\_2\\le c\_i^Tx+d\_i$, $Fx=g$.
    
*   부등식은 **이차원뿔(SOC) 제약**: $(A\_ix+b\_i,\\ c\_i^Tx+d\_i)\\in$ $\\mathbb{R}^{n\_i+1}$의 이차원뿔.
    
*   $n\_i=0$이면 LP로, $c\_i=0$이면 QCQP로 축소 → **QCQP·LP보다 일반적**.
    

### 2-14. SOCP 예시 — 강건 선형계획 (Robust LP)

*   **배경**: LP 파라미터($c,a\_i,b\_i$)는 종종 불확실. 불확실성 처리 두 접근(예: $a\_i$).
    
    *   **결정론적(deterministic) 모델**: 모든 $a\_i\\in\\mathcal E\_i$에 대해 제약이 성립해야 함.
        
    *   **확률론적(stochastic) 모델**: $a\_i$가 확률변수, 제약이 확률 $\\eta$ 이상으로 성립.
        
*   **① 결정론 접근 (SOCP화)**: 불확실 집합을 타원체 $\\mathcal E\_i={\\bar a\_i+P\_iu\\mid|u|\_2\\le1}$로 선택.
    
    *   Robust LP: minimize $c^Tx$ s.t. $a\_i^Tx\\le b\_i\\ \\forall a\_i\\in\\mathcal E\_i$.
        
    *   동치 SOCP: s.t. $\\bar a\_i^Tx+|P\_i^Tx|\_2\\le b\_i$.
        
    *   근거: $\\sup\_{|u|\_2\\le1}(\\bar a\_i+P\_iu)^Tx=\\bar a\_i^Tx+|P\_i^Tx|\_2$.
        
*   **② 확률 접근 (SOCP화)**: $a\_i\\sim\\mathcal N(\\bar a\_i,\\Sigma\_i)$ 가정. $a\_i^Tx$는 평균 $\\bar a\_i^Tx$·분산 $x^T\\Sigma\_ix$인 가우시안.
    
    *   $\\text{prob}(a\_i^Tx\\le b\_i)=\\Phi!\\big((b\_i-\\bar a\_i^Tx)/|\\Sigma\_i^{1/2}x|\_2\\big)$, $\\Phi$=표준정규 CDF.
        
    *   $\\eta\\ge1/2$일 때 동치 SOCP: s.t. $\\bar a\_i^Tx+\\Phi^{-1}(\\eta)|\\Sigma\_i^{1/2}x|\_2\\le b\_i$.
        

### 2-15. 반정치 계획 (Semidefinite Program, SDP)

*   minimize $c^Tx$ s.t. $x\_1F\_1+\\cdots+x\_nF\_n+G\\preceq0$, $Ax=b$ ($G,F\_i\\in\\mathbf S^k$).
    
*   부등식 제약을 **선형 행렬 부등식(LMI)** 이라 함.
    
*   다중 LMI는 블록대각 구성으로 **단일 LMI**로 통합 가능.
    
*   **표준형 SDP**: minimize $\\text{tr}(CX)$ s.t. $\\text{tr}(A\_iX)=b\_i$, $X\\succeq0$ ($C,A\_i\\in\\mathbf S^n$).
    
    *   $\\text{tr}(CX)=\\sum\_{i,j}C\_{ij}X\_{ij}$는 $\\mathbf S^n$ 위 일반 실수값 선형함수 → **LP의 행렬 버전**으로 볼 수 있음.
        

### 2-16. 볼록 최적화 문제의 위계

*   포함 관계(안쪽 → 바깥쪽): **LP ⊂ QP ⊂ SOCP ⊂ SDP ⊂ CP(cone program)**.
    

* * *

## Chapter 3. Decision-Focused Learning (의사결정 중심 학습, DFL)

### 3-1. ML 기반 의사결정 프로세스의 문제점

*   통상 방식 = **예측 후 최적화(Predict-then-Optimize)**: 머신러닝(예측) → 입력 → 최적화(의사결정).
    
*   **Issue 1**: 예측에는 오차가 포함될 수밖에 없음 → "쓰레기 입력, 쓰레기 출력(Garbage in, garbage out)".
    
*   **Issue 2**: **최선의 예측 ≠ 최적의 의사결정**.
    

### 3-2. 동기 예시 — 왜 예측 정확도와 의사결정이 다른가

*   **박스 선택 예시**: 빨강/파랑 박스의 가치를 예측해 더 나은 쪽 선택.
    
    *   같은 MSE라도, 예측 오차 분포에 따라 **의사결정 경계(대각선)를 넘느냐**가 달라짐.
        
    *   오차 크기가 같아도 결정 경계를 침범하는 예측은 "나쁜 예측", 같은 쪽에 머무는 예측은 "좋은 예측".
        
*   **재고/수요 예시** (Chung et al., 2022)
    
    *   사전재고가 높은 시설: 대개 재고>수요 → 조치 불필요.
        
    *   사전재고가 낮은 시설: 대개 수요>재고 → 조치 필요.
        
    *   **MSE 최소화 예측 모델은 이런 비대칭 의사결정 맥락을 반영하지 못함**.
        
*   **SPO Loss 기하 예시** (Elmachtoub & Grigas, 2022): $c^Tx$를 실행 가능 영역에서 최소화.
    
    *   두 예측 $\\hat c\_A,\\hat c\_B$가 **비슷한 오차 수준**이어도, 최적 결정 $w^\*(\\hat c)$는 크게 달라질 수 있음.
        
    *   핵심은 오차 크기보다 **비용 벡터의 방향($c$와 정렬 여부)**: $c$와 방향이 같은 예측이 같은 최적해를 냄.
        

### 3-3. DFL의 정식화

*   데이터 $\\mathcal D={(x\_1,y\_1),\\dots,(x\_n,y\_n)}$, 주어진 $x$에 대해 의사결정 필요.
    
*   **예측 후 최적화**
    
    *   $\\hat\\theta=\\arg\\min\_\\theta\\sum\_i\\mathcal L^{pred}(f\_\\theta(x\_i),y\_i)$ (예: $\\mathcal L^{pred}(\\hat y,y)=(y-\\hat y)^2$).
        
    *   정책 $A^\\pi(x)=a^\\star(f\_{\\hat\\theta}(x))$, 여기서 $a^\\star(y):=\\arg\\min\_{a\\in\\mathcal A}c(a,y)$.
        
*   **의사결정 중심 학습**
    
    *   $\\hat\\theta=\\arg\\min\_\\theta\\sum\_i\\mathcal L^{dec}(f\_\\theta(x\_i),y\_i)$.
        
    *   **결정 손실** $\\mathcal L^{dec}(\\hat y,y):=c(a^\\star(\\hat y),y)$ → 예측 오차가 아니라 **결정의 결과 비용**을 직접 최소화.
        

### 3-4. 포트폴리오 최적화에서의 4가지 접근 (Lee et al., 2024)

1.  **예측 후 최적화(Predict-then-Optimize)**: 파라미터 추정 → 별도 최적화.
    
2.  **의사결정 중심 학습(DFL)**: 최적화 결과를 통해 예측 모델로 역전파.
    
3.  **End-to-End 접근**: 시장 데이터에서 최적 포트폴리오를 직접 출력.
    
4.  **강화학습(RL)**: 보상(reward) 기반으로 최적 포트폴리오 학습.
    

### 3-5. DFL의 미분(기울기) 계산

*   모든 요소가 미분 가능하면, 연쇄법칙으로:
    
    *   $\\dfrac{d\\mathcal L^{dec}}{d\\theta}=\\dfrac{dc(a^\\star(f\_\\theta(x\_i)),y\_i)}{da^\\star(f\_\\theta(x\_i))}\\cdot\\dfrac{da^\\star(f\_\\theta(x\_i))}{df\_\\theta(x\_i)}\\cdot\\dfrac{df\_\\theta(x\_i)}{d\\theta}$.
        
*   **핵심 난점**: 두 번째 항 $\\dfrac{da^\\star(y)}{dy}$.
    
    *   $a^\\star(y)$가 **유일하게 정의되지 않거나 미분 불가능**할 수 있음.
        

### 3-6. 대리 목적함수 (Proxy Objectives / Surrogates)

*   **동기**: 결정 손실 최소화는 (i) 내부 최적화 $a^\\star(f\_\\theta(x\_i))$를 포함하고 (ii) 미분 불가능할 수 있어 계산상 난해.
    
*   해법: 결정 손실 $\\mathcal L^{dec}$을 대리 손실 $\\hat{\\mathcal L}^{dec}$로 치환.
    
*   **대표 기법**
    
    *   Linear reparameterization (Wang et al., 2020).
        
    *   **SPO+** (Elmachtoub & Grigas, 2022).
        
    *   Local approximation (Chung et al., 2022; Shah et al., 2022).
        
*   **LODL — 국소 최적화 결정 손실** (Shah et al., 2022)
    
    *   2-Stage: 중간손실(MSE) 학습 / DFL: 최적화 역전파 필요.
        
    *   LODL: (Step1) 참 레이블에서 예측 샘플링 → 최적화·결정 손실로 LODL 학습, (Step2) 학습된 LODL로 예측 모델 학습.
        
    *   $LODL\_{\\phi\_i}(\\hat y\_i)\\approx DL(\\hat y\_i,y\_i)-DL(y\_i,y\_i)$이며 $DL(y\_i,y\_i)$는 상수 → **최적화 문제를 역전파할 필요 없음**.
        

### 3-7. 접선공간 투영 — PEAR (Lee et al., 2026)

*   **PEAR (Prediction Error As Regret-gradient)**: 예측 오차를 **국소 결정 기하로 투영**해 후회(regret) 기울기로 변환.
    
*   절차: 활성 제약(active constraints) 식별 → 오차를 국소 곡률로 재조정 → 실행 가능 접선공간으로 투영(결정과 무관한 성분 제거).
    
*   기울기 공식: $\\nabla\_{\\hat c}\\mathcal R(\\hat c;c)=\\underbrace{(I-H^{-1}J^\\top(JH^{-1}J^\\top)^{-1}J)}_{\\text{접선 투영자}}\\underbrace{(H^{-1})}_{\\text{곡률 재조정}}e$.
    
    *   $R$=regret, $H$=목적함수 헤시안, $\\Pi\_H$=접선공간 투영자, $e=\\nabla\_{\\hat c}\\mathcal L\_{MSE}=\\hat c-c$.
        
*   **성능 (Table 1, LP 벤치마크)**: PEAR는 최단경로·배낭(Knapsack) 등에서 낮은 정규화 후회(regret)와 경쟁력 있는 학습시간을 달성(다수 항목 최우수/차우수).
    
*   **강건성 (Figure 2)**: 제약 변화(OD shift·용량 변화·공매도 변화) 하에서도 DFL 기법 중 **가장 낮은 후회 유지**.
    

### 3-8. DFL의 부작용과 정규화

*   **과최적화 위험**: 예측 모델이 의사결정 품질에만 과도하게 맞춰지면 **예측 품질이 심각히 저하** → 다른 다운스트림 과제에 무용해질 수 있음.
    
*   **해법**: 결정 손실 최소화에 **정규화항 추가**가 자주 제안됨.
    
*   **기울기 충돌 근거** (Jeon et al., 2025)
    
    *   예측손실 기울기 $\\nabla\\mathcal L\_{pred}$와 결정손실 기울기 $\\nabla\\mathcal L\_{dec}$는 종종 **방향이 충돌**($\\cos\\phi<0$가 다수).
        
    *   크기 불균형도 커서($\\nabla\\mathcal L\_{dec}$가 $\\nabla\\mathcal L\_{pred}$보다 약 100배 작은 경우 다수), 단순 합산은 편향된 학습을 유발.
        

* * *

## 부록 A. 관련 연구 성과 (강의 후반부 소개 논문)

### Paper 1 — DFL이 예측 모델을 어떻게 변형하는가 (ACM ICAIF 2025)

*   제목: _Return Prediction for Mean-Variance Portfolio Selection: How Decision-Focused Learning Shapes Forecasting Models_ (Lee, Jeon, Bae, Lee, 2025).
    
*   **핵심 메커니즘**: DFL의 기울기가 MSE 기반 예측 오차를 **역공분산 $\\Sigma^{-1}$로 기울여(tilt)**, 자산 간 상관을 학습에 반영. (MSE는 각 자산을 독립 취급.)
    
*   이로 인해 포함(IN) 자산 수익률은 **과대추정**, 제외(OUT) 자산은 **과소추정**하는 체계적 편향 발생.
    
*   결합 손실 $\\mathcal L\_{Combined}=\\alpha\\mathcal L\_{MVO}+(1-\\alpha)\\mathcal L\_{MSE}$ 사용.
    
*   **결과**: $\\alpha>0$ 모델이 순수 MSE($\\alpha=0$) 대비 일관되게 우수. 최적 성능은 중간값($\\alpha\\in\[0.25,0.75\]$)에서. Sharpe·MDD 등 지표 개선.
    
*   **함의**: 이 전략적 편향은 결함이 아니라 **의도된 특징(features, not flaws)**.
    

### Paper 2 — GMVP를 위한 공분산 추정 (ACM ICAIF 2025)

*   제목: _Estimating Covariance for Global Minimum Variance Portfolio: A Decision-Focused Learning Approach_ (Kim, Tae, Lee, 2025).
    
*   **접근**: MSE 대신 **결정 품질을 직접 최적화**하는 DFL로 전역 최소분산 포트폴리오(GMVP) 도출. GMVP 해석해로 결정 손실 기울기를 이론적으로 유도.
    
*   예측 모델은 **DLinear**(계절성·추세 분해)로 공분산 행렬 $\\Sigma$ 예측 → GMVP 최적화 레이어 → regret loss로 end-to-end 학습.
    
*   **결과**: 예측 중심 추정은 최적 배분에 실패할 수 있으나, **DFL 기반 방법이 일관되게 더 우수한 결정 성능**(낮은 실현 변동성)을 제공. S&P·Industry·Dow Jones 데이터에서 검증.
    
*   DFL의 변동성 저감 능력·결정 주도 특성·추정 특성을 종합 분석.
    

* * *

## 핵심 요약 (One-page Takeaways)

*   **볼록 최적화**는 국소최적이 없어(=봉우리 하나) 효율·신뢰성 있게 풀리는 특별한 문제 클래스이며, 위계는 **LP ⊂ QP ⊂ SOCP ⊂ SDP ⊂ CP**.
    
*   **정식화가 성패를 좌우**한다: 같은 문제도 볼록 형태로 잘 세우면 정확해를, 잘못 세우면 근사·난해로 이어진다. 직관은 자주 배신한다.
    
*   **DFL**은 "최선의 예측 ≠ 최적의 결정"이라는 통찰에서 출발해, 예측 오차 대신 **결정의 결과 비용**을 직접 최소화한다.
    
*   실무 난점은 최적화 레이어의 \*\*미분($da^\\star/dy$)\*\*이며, 이를 SPO+·LODL·PEAR 같은 **대리 손실·투영 기법**으로 해결한다.
    
*   DFL은 강력하지만 **예측 품질 저하·기울기 충돌**의 부작용이 있어, 정규화와 결합 손실($\\alpha\\mathcal L\_{dec}+(1-\\alpha)\\mathcal L\_{pred}$) 설계가 중요하다.
