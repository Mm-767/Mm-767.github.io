---
title: "시계열 분석 (Time-Series Analysis) — 강의 요약 4,5,6강"
date: 2026-07-20
tags: ["lg-aimers"]
series: "LG Aimers"
---

> 이용재 교수 (UNIST 산업공학과 / Financial Engineering Lab) 강의 4·5·6강 통합 정리 · 총 3개 섹션 + 사례연구

* * *

## 전체 구조 (Overview)

| Section | 주제 | 핵심 내용 |
| --- | --- | --- |
| 1 | Introduction to Time-Series Analysis | 시계열의 정의, 특징, 예측 모형의 원리, model-driven vs data-driven |
| 2 | Deep Learning Models | RNN 계열, 생성모형, 어텐션·트랜스포머, LLM 기반 모형 |
| 3 | Case Studies | 외부 맥락(external context) 통합, DFL·LLM 기반 포트폴리오 연구, 예측시장 |

* * *

## Section 1. 시계열 분석 개요

### 1.1 시계열 분석의 정의와 특징

*   **정의**: 여러 시점에 걸쳐 관측된 데이터를 분석하는 것.
    
*   기존 통계 기법은 대부분 관측치가 \*\*독립적이고 동일 분포(i.i.d.)\*\*라고 가정 → 시계열에 바로 적용하기 어려움.
    
*   시계열 데이터는 **인접 시점 관측치 사이에 분명한 관계성**이 존재.
    
*   따라서 시계열 분석은 이러한 \*\*시간적 의존성(temporal dependency)\*\*을 잘 다룰 수 있어야 함.
    
*   참고: 가장 오래된 시계열 차트는 약 10~11세기에 그려진 **천체의 움직임** 기록.
    

### 1.2 사례로 보는 시계열의 성질 (관측 → 질문 → 판단)

| 예시 | 데이터 | 관측 | 질문: 전해-이듬해 관계성? | 판단 |
| --- | --- | --- | --- | --- |
| 예시 1 | LA 연간 강우량 | 변동 큼, 1880년대 극단값 | 관계 있나? | **아마 아닐 것** (산점도상 무관) |
| 예시 2 | 캐나다 토끼 개체 수 | 인접 관측값이 유사 | 관계 있나? | **그런 듯** (양의 관계 존재) |
| 예시 3 | 월간 오일필터 판매량 | 변동 폭 큼 | 계절성(seasonality) 있나? | **그런 듯** (월별 심볼로 계절성 확인) |

*   핵심: 시각화(시계열 플롯·산점도)와 특수 심볼로 **자기상관/계절성** 유무를 탐색적으로 판단.
    

### 1.3 예측 모형의 원리

*   모든 예측 모형은 본질적으로 **함수 f**: 입력 x → 출력 f(x).
    
*   f의 자리에 들어가는 것: 전통적 수식 → **ML/AI** → 이미지 분류(예: 사진→"Dog") → 주가 차트 예측 → **LLM**(예: "미국 대선 누가 이겼니?"→답).
    
*   **정상성(stationarity) 개념**:
    
    *   거칠게 말해, **하나의 입력값에 하나의 출력값이 잘 대응**되어 함수의 성질이 잘 지켜지는 데이터가 정상성이 있는 데이터.
        
    *   **정상성이 있는 데이터일수록 예측이 잘 되는 편.**
        

### 1.4 Model-driven vs Data-driven 방식

**Model-driven (전통 기법)**

*   계산 수식이 큰 틀에서 **이미 결정**되어 있음.
    
*   데이터 분포에 대한 **가정이 있는 경우**가 많음.
    
*   장점: 도메인 지식 활용 용이, 분석 결과 **일반화 용이**.
    
*   단점: 데이터·분석 환경이 **복잡하면 사용 어려움**.
    
*   예시: **ARIMA** (차분 d, AR(p), MA(q) 항), **GARCH** (ARCH항 + GARCH항).
    

**Data-driven (AI 기법)**

*   계산 수식·확률 분포에 대한 **특별한 가정이 없음**.
    
*   장점: 변수 간 **복잡한(비선형) 관계성** 반영 가능.
    
*   단점: **충분한 데이터 필요**, **결과 해석이 어려움**.
    
*   예시: **Random Forest**(다수결 투표), **Neural Network**.
    

* * *

## Section 2. 시계열 분석을 위한 딥러닝 모형

### 2.0 인공신경망 (ANN) 기초

*   구조: **입력층 → 은닉층(여러 개) → 출력층**. 다수 입력을 다수 출력으로 매핑.
    

### 2.1 RNN 계열 모형

**Recurrent Neural Networks (RNN)**

*   동일 구조 A를 시간축으로 \*\*반복(unroll)\*\*하며 hidden state를 갱신.
    
*   활용 분야: 음성인식, 음악생성, 감성분류, DNA 서열분석, 기계번역, 영상 행동인식, 개체명 인식.
    

**Vanishing Gradient 문제 (RNN 한계)**

*   같은 구조를 반복하므로 input의 영향이 **뒤로 갈수록 소멸**하거나 반대로 **과도하게 증폭**됨.
    
*   요약: RNN이 **초기 입력값을 잊어버림**.
    

**Long Short-Term Memory (LSTM)**

*   표준 RNN의 반복 모듈은 단일 층 → LSTM은 **4개의 상호작용 층**(게이트 구조)을 포함해 장기 의존성 학습.
    

**Neural ODE (Chen et al., 2018)**

*   RNN·LSTM은 관측값이 **동일 간격**으로 관측되었다고 가정.
    
*   Neural ODE는 **불규칙 간격 데이터**도 다루도록 hidden state를 \*\*연속(continuous)\*\*하게 설정.
    
*   ANN이 hidden state의 \*\*미분값(derivative, 변화량)\*\*을 학습: dh(t)/dt = f(h(t), t, θ).
    

**DeepAR (Salinas et al., 2020, Amazon)**

*   RNN 기반 **확률적 예측**: 각 시점 입력은 공변량·이전 목표값·이전 네트워크 출력.
    
*   예측 구간에서 표본을 뽑아 다음 시점으로 되먹임 → 다수의 trace로 **결합 예측 분포** 생성.
    
*   서로 다른 속도·연령의 아이템에 대해 **계절성·불확실성** 추정.
    

### 2.2 생성모형 (Generative Models)

**Generative vs Discriminative**

*   **Discriminative**: 데이터 종류 **판별**(예: 사진이 개인지 고양이인지).
    
*   **Generative**: **새로운 데이터 생성**(예: 학습 후 새 이미지 생성).
    

**Generative Adversarial Networks (GAN, Goodfellow et al., 2014)**

*   두 네트워크가 게임처럼 경쟁:
    
    *   **Generator**: 데이터 분포 학습→새 데이터 생성, discriminator 속이기가 목표.
        
    *   **Discriminator**: 가짜 vs 진짜 구분이 목표.
        
*   응용 사례:
    
    *   **StyleGAN** (Karras et al., 2019, NVIDIA): 사실적 얼굴 생성.
        
    *   **CycleGAN** (Zhu et al., 2017): 도메인 변환(Monet↔사진, 얼룩말↔말, 여름↔겨울, 화풍 변환).
        
    *   **TimeGAN** (Yoon et al., 2019): 시계열 생성(임베딩+지도/비지도 손실 결합).
        
    *   **QuantGANs** (Wiese et al., 2020): S&P500 로그경로 생성, 수익률 분포·ACF 재현.
        
    *   **TadGAN** (Geiger et al., 2020): 비지도 시계열 **이상탐지**.
        

**Diffusion Models**

*   데이터에 노이즈를 점진적으로 더하면 결국 완전한 노이즈가 됨.
    
*   그 **역과정을 학습**하면 노이즈로부터 실제 같은 데이터 생성 가능.
    
*   응용: **TimeGrad** (Rasul et al., 2021): RNN conditioned diffusion, 예측구간 추정.
    

### 2.3 어텐션 기반 모형 (Attention-based)

**Sequence-to-Sequence (seq2seq)**

*   입력이 sequence로 들어가며 hidden state 갱신 → context vector로 요약 → 출력 sequence 생성(예: 영→중 번역).
    
*   **한계**: input이 길어지면 이를 **하나로 기억하기 어려움**.
    

**Attention Mechanism**

*   전체 input을 하나로 요약하지 말고, input에서 \*\*어디에 더 '집중(attend)'\*\*할지 판단해 사용.
    
*   같은 문장 내 단어들이 서로 다른 가중치로 attend (Cheng et al., 2016).
    

**Transformers — "Attention is all you need" (Vaswani et al., 2017)**

*   RNN cell 없이 **어텐션만으로** 구성.
    
*   여러 task에서 매우 높은 성능.
    
*   최대 장점: **병렬화**가 쉬워 모델을 크게 만들기 용이 → **대규모 데이터 학습** 가능.
    
*   시계열 응용 사례:
    
    *   **Temporal Fusion Transformers (TFT, Lim et al., 2021)**: 과거·미래·정적 공변량 통합, 분위수(quantile) 예측. COVID-19 국면 전환에도 합리적 불확실성 추정.
        
    *   **Informer** (Zhou et al., 2021): ProbSparse self-attention으로 **긴 시퀀스** 효율 처리, self-attention distilling.
        
    *   **Autoformer** (Wu et al., 2021): 시계열 **분해(추세-계절)** + Auto-Correlation 메커니즘, 주기 기반 sub-series 연결.
        

### 2.4 LLM 기반 모형 (LLM-based)

| 모형 | 핵심 아이디어 | 한계(-) |
| --- | --- | --- |
| **LLMTime** (Gruver et al., 2023) | 수치값을 위한 **토큰화**로 zero-shot 예측 (자릿수별 토큰화가 성능 좌우) | 연산/대수 관계를 제대로 이해하는 방식이 아니라 **한계 명확** |
| **TimeLLM** (Jin et al., 2023) | 시계열을 **단일 모달 임베딩**으로 투영(patch reprogram) | 언어모델 backbone 사용 → **모달리티 갭**, TS→임베딩 과정의 **정보 손실** |
| **TimesNet** (Wu et al., 2022) | TS를 frequency/amplitude로 변환해 **long/short context 동시 반영** | domain shift 시 **inductive bias 상당 소실** → adaptation 어려움 |
| **Time-VLM** (Zhong et al., 2025) | 비전-언어 멀티모달: 검색(RAL)·비전(VAL)·텍스트(TAL) 증강 학습기 융합 | — |
| **Time-MQA** (Kong et al., 2025) | 예측·보간·이상탐지·분류·**개방형 추론 QA**를 컨텍스트 강화로 통합 | — |

* * *

## Section 3. 사례 연구 (Case Studies)

### 3.1 동기 (Motivation)

*   순수 수치 분석의 한계: "왜 오르지?/왜 떨어지지?" — **가격만 봐서는 설명 불가**.
    
*   통합 맥락 분석: **지정학 이벤트(전쟁)·정치적 영향(트윗)·글로벌 경제 뉴스** 등 외부 맥락을 결합 → 더 정확한 예측 + **설명력(explainability) 향상**.
    
*   핵심 명제: **외부 맥락(external context)은 금융 시계열의 불확실성(uncertainty)과 비정상성(non-stationarity)을 줄일 수 있음.**
    

### 3.2 관련 연구

| # | 논문 | 핵심 기여 |
| --- | --- | --- |
| **Paper 1** | Return Prediction for MVO: How DFL Shapes Forecasting (ICAIF 2025) | \*\*결정중심학습(DFL)\*\*을 평균-분산 최적화(MVO)에 적용. DFL 그래디언트는 MSE 오차를 **역공분산 Σ⁻¹로 기울여** 자산 간 상관을 학습에 반영(MSE는 자산 독립 취급). 결합손실 α·MVO + (1-α)·MSE. **α∈\[0.25,0.75\] 중간값에서 최적 성능**, 높은 예측오차에도 Sharpe↑·MDD↓. |
| **Paper 2** | Estimating Covariance for GMVP: A DFL Approach (ICAIF 2025) | DLinear로 **공분산 예측** → GMVP 폐형해로 가중치 산출 → regret loss로 end-to-end 학습. 예측중심 추정은 최적 배분 실패 가능, **DFL이 변동성 감소·우수한 결정 성능**. S&P/Industry/Dow에서 낮은 실현 변동성. |
| **Paper 3** (working) | Decision-informed Neural Networks + LLM for Portfolio Optimization | **DFL + LLM 기반 예측**을 MVO에 통합(DINN). 거시·자산 임베딩 + 크로스어텐션 + 최적화층. 정규화·분해(장기추세/단기동학), 프롬프트 기반 통계 요약. S&P100·DOW30에서 SOTA 상회. |
| **Paper 4** | FinTexTS: 텍스트-시계열 페어 데이터셋 (KDD 2026) | 뉴스·SEC 공시를 **의미기반·다층(macro/sector/company) 페어링**으로 시계열과 정렬. 임베딩 매칭으로 의미적으로 관련된 뉴스 검색 → 주가 예측 성능 향상. |
| **Paper 5** | LLM as a Risk Manager: 예측시장 Lead-Lag 트레이딩 (ACL 2026) | **Granger 인과**로 후보 리더-팔로워 쌍(Top K=100) 발굴 → **LLM이 경제적 전달경로 타당성으로 재랭킹**(Stage 2). Kalshi Economics에서 승률 51.4%→54.5%, 손실거래 평균손실 $649→$347. 통계적으로 취약한 링크를 필터링. |

### 3.3 예측시장 (Prediction Markets)

*   플랫폼: **Polymarket, Kalshi**.
    
*   예: "트럼프가 지명할 Fed 의장은?", "국정연설에서 트럼프가 할 말은?" 등을 \*\*가격(확률)\*\*으로 거래.
    
*   핵심 명제: 예측시장은 **비정형 글로벌·로컬 이벤트**(예: Fed 금리 인하, 연설 어휘)를 **거래 가능하고 유동적인 데이터**로 변환하며, **자기자본을 건(skin-in-the-game)** 고유의 정확성을 가짐.
    

* * *

## 핵심 흐름 요약 (One-line Takeaways)

1.  시계열은 **시간적 의존성**이 있어 i.i.d. 가정 기반 기법을 그대로 쓸 수 없다.
    
2.  **정상성**이 높을수록 예측이 잘 되며, 예측은 결국 함수 f를 찾는 문제다.
    
3.  **Model-driven**(ARIMA/GARCH)은 해석·일반화에, **Data-driven**(NN)은 복잡한 비선형 관계에 강하다.
    
4.  딥러닝 계보: **RNN→LSTM→Neural ODE**(불규칙), **GAN/Diffusion**(생성), **Attention/Transformer**(장기·병렬), **LLM 기반**(멀티모달).
    
5.  사례연구의 방향성: \*\*외부 맥락(뉴스·거시·예측시장)\*\*을 결합하고 \*\*결정중심학습(DFL)\*\*으로 예측을 최적화해 불확실성·비정상성을 줄인다.
