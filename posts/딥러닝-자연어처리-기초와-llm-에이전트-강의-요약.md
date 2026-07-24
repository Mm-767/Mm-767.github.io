---
title: "딥러닝 자연어처리 기초와 LLM 에이전트 — 강의 요약"
date: 2026-07-20
tags: ["lg-aimers"]
series: "LG Aimers"
---

> LG AI Research Special Lecture · 중앙대학교 AI학과 이환희 총 6강 (204쪽 슬라이드) · AI 기초 → NLP/RNN → Transformer → 사전학습/RLHF → LLM Agent → 하드웨어/GPU

* * *

## 전체 구조 (Overview)

| Lecture | 주제 | 핵심 키워드 |
| --- | --- | --- |
| 01 | AI의 첫걸음, 머신러닝과 딥러닝 기초 | ML 유형, 신경망, XOR, 역전파, Softmax |
| 02 | 자연어처리의 기초와 RNN | 토큰화, 워드임베딩(Word2Vec), 언어모델, RNN/LSTM |
| 03 | 트랜스포머와 어텐션 메커니즘 | Seq2Seq, Attention, Self-Attention, Transformer, 텍스트 생성 |
| 04 | 거대 언어 모델의 사전학습과 진화 | 사전학습/파인튜닝, GPT-3, ICL, RLHF, InstructGPT, ChatGPT |
| 05 | 스스로 계획하고 실행하는 AI, LLM 에이전트 | Agent 정의, Memory, Tool/MCP, Planning/ReAct, Multi-agent |
| 06 | LLM을 움직이는 힘, AI 하드웨어와 GPU | CPU vs GPU, 부동소수점, VRAM 사이징 |

* * *

## Lecture 01. 머신러닝과 딥러닝의 기초

### 1.1 The AI Landscape and Machine Learning

*   **머신러닝 정의**: 명시적 지시 없이 일반화하여 작업을 수행하는 **통계적 알고리즘**.
    
*   **경험으로부터 학습**(Tom Mitchell 정의): Task T(예: 손글씨 숫자 분류) / Performance P(정답률) / Experience E(예: MNIST 데이터셋).
    
*   필요 요소: **데이터(특징 features)** + **알고리즘(경험을 통해 자동 개선)**.
    
*   계층 관계: **AI ⊃ ML ⊃ Deep Learning** (DL은 다층 신경망을 쓰는 ML의 하위 분야).
    

### 1.2 Types of Machine Learning (피드백 성격에 따른 분류)

*   **지도학습(Supervised)**: 레이블(정답) 데이터로 학습. 정답은 비쌈, **과적합(overfitting) 위험**.
    
    *   **회귀(Regression)**: 연속값 예측 (선형/비선형).
        
    *   **분류(Classification)**: 범주값 예측 (Naive Bayes, SVM, 로지스틱 회귀 / Decision Tree, Random Forest, k-NN, NN은 둘 다 가능).
        
*   **준지도학습(Semi-supervised)**: 지도-비지도 하이브리드. 소량 레이블 + 대량 비레이블. 학습→의사레이블(pseudo-label) 생성→재학습. 레이블 부족 문제 완화.
    
*   **비지도학습(Unsupervised)**: 레이블 없음. 데이터 자체에서 특징·패턴 추출 → **군집화(Clustering, 예: k-Means)**.
    
*   **강화학습(Reinforcement)**: 학습 데이터 없음. 환경과 상호작용하며 **시행착오** + **보상(reward) 시스템**으로 최적 행동 강화.
    

### 1.3 Deep Learning Fundamentals

*   **딥러닝**: 은닉층이 **2개 이상**인 심층 신경망(vs Shallow). 층이 깊어질수록 더 복잡한 특징 학습.
    
*   **인공신경망(ANN)**: 뉴런(간단한 학습 가능 단위)의 상호연결 집합.
    
    *   입력층(데이터의 수치 표현) → 은닉층(가중합+편향에 **활성함수** 적용) → 출력층(회귀=연속, 분류=이산).
        
    *   뉴런 연산: `y = F(w₁x₁ + w₂x₂ + … + wₙxₙ + b)`, 예: `F(x)=max(0,x)` (ReLU).
        
*   **학습(training)의 의미**: 입력마다 모델 파라미터를 자동 조정해 출력이 정답(ground truth)에 근접하게 만듦 → **순전파** + **역전파**로 손실 최소화.
    
*   **신경망 입력(디지털 이미지)**: 2D 픽셀 배열(모노 0/1, 그레이 0~255, 컬러 RGB 각 채널). Fully-connected 입력층은 2D/3D를 **1D 벡터로 평탄화**.
    

### 1.4 XOR 문제와 비선형성

*   Minsky-Papert: **단층 퍼셉트론은 XOR를 계산 불가**(AND·OR는 가능).
    
*   이유: 퍼셉트론은 **선형 분류기**인데 XOR는 **선형 분리 불가능**.
    
*   순수 선형 유닛을 여러 층 쌓아도 결국 단일 선형층으로 축소됨 → **비선형 활성함수 필요**.
    
*   **ReLU 기반 2개 층**으로 XOR 계산 가능 → 다층 네트워크의 필요성 입증.
    
*   **ReLU**: 특징맵을 활성화맵으로 변환. CNN에서 성능 최적, 입력은 보통 \[-1,1\]로 정규화(학습 속도·정확도 개선).
    

### 1.5 출력층과 학습 알고리즘

*   **Softmax Layer**: FC층 뒤 최종층. 로짓(raw score)을 **합이 1인 확률분포**로 변환 → 손실 계산에 필수.
    
*   **역전파(Backpropagation)** — 손실 최소화를 위한 핵심 학습 절차:
    
    1.  **순전파(Forward Pass)**: 입력→예측 생성→정답과 비교해 오차 계산.
        
    2.  **역전파(Backward Pass)**: 오차를 출력→입력 방향으로 전파, 각 가중치의 오차 기여도 계산 → 오차를 줄이는 방향으로 가중치 갱신.
        
    3.  이 사이클을 반복해 성능을 점진 개선.
        

* * *

## Lecture 02. 자연어처리의 기초와 RNN

### 2.1 What is NLP?

*   **정의**: 컴퓨터가 인간처럼 텍스트를 이해하게 하는 것. 구성: **NLU(이해)** + **NLG(생성)**.
    
*   대표 태스크: 대화 시스템, 요약, 기계번역, 스토리 생성.
    
*   NLP 시스템 3단계: **전처리(토큰화)** → **임베딩(수치 벡터화, N×D)** → **모델링(대규모 코퍼스 학습)**.
    

### 2.2 Tokenization

*   입력 텍스트를 토큰 단위로 분해 (예: "I loved the movie" → \["I","loved","the","movie"\]).
    
*   **Padding**으로 길이 정렬.
    
*   **어휘 크기(Vocab Size) 트레이드오프**: 너무 크면 연산량·희소성↑ / 너무 작으면 **OOV(사전에 없는 단어)** 발생.
    
    *   해결 1: **문자 단위(Character Level)**.
        
    *   해결 2: **Byte Pair Encoding(BPE)**.
        

### 2.3 Word Embedding

*   단어를 실수 벡터로 매핑하는 표현.
    
*   **Bag-of-Words(BoW)**: 단어 집합으로 표현 (예: One-hot 인코딩).
    
*   **Word2Vec** (Mikolov, 2013): 유사 문맥의 단어가 가까이 임베딩됨.
    
    *   **CBOW**: 문맥으로 중심어 예측 `E = -log p(wₜ|w_{t-c}…w_{t+c})`.
        
    *   **Skip-gram**: 중심어로 문맥어 예측 `E = -log p(w_{t-c}…w_{t+c}|wₜ)`.
        
    *   중심어 + 윈도우(context words)로 학습. 은닉층 가중치 행렬의 **행이 곧 단어 벡터**(look-up table).
        

### 2.4 Language Modeling

*   **언어모델**: 문장·단어의 확률분포를 학습해 다음 단어 예측/새 문장 생성.
    
*   시퀀스 확률: `P(w₁,…,w_T) = P(w₁)·P(w₂|w₁)·…·P(wₙ|w₁,…,w_{n-1})`.
    
    *   어순: P(the cat is small) > P(small the is cat).
        
    *   단어 선택: P(walking home after school) > P(walking house after school).
        
*   **고정 길이 언어모델**: 앞선 고정 개수(fixed window)만 참조 → "임의 길이 입력 처리 아키텍처 필요".
    

### 2.5 Recurrent Neural Networks (RNN)

*   순차 데이터를 자연스럽게 모델링. **매 시점 동일한 가중치**를 반복 적용, 은닉 상태에 정보 기억.
    
*   **장점**: 임의 길이 입력 처리 / 과거 정보 활용 / 입력 길어져도 모델 크기 불변 / 가중치 공유로 대칭성.
    
*   **단점**: 순차 연산이라 느림 / 실제로는 먼 과거 정보 접근 어려움.
    
*   **학습**: 대규모 코퍼스로 매 시점 다음 단어 확률분포 예측 → **교차 엔트로피 손실** 평균. **Teacher Forcing** 사용. 전체 코퍼스 일괄 계산은 비싸 **SGD로 문장(배치) 단위** 학습.
    
*   **역전파(BPTT)**: 반복 가중치에 대한 미분은 각 시점 기여 미분의 **합**.
    
*   **생성(roll-out)**: 샘플링한 출력을 다음 스텝 입력으로 사용해 반복 생성.
    

### 2.6 RNN의 한계와 LSTM

*   **Vanishing Gradient**: 시점 t 입력 영향이 시간이 지날수록 감소·소멸 → 장기 의존성 학습 어려움.
    
*   **LSTM**: 그래디언트 정보 보존, 장기간 정보 저장·접근. **3개 게이트**:
    
    *   **Input gate**(입력→셀 영향 조절), **Forget gate**(셀→셀 시간에 따른 영향 조절), **Output gate**(셀→출력 영향 조절).
        
*   활용: 문장 인코딩(예: 감성 분류).
    

* * *

## Lecture 03. 트랜스포머와 어텐션 메커니즘

### 3.1 언어모델링의 진화

*   **Seq2Seq(Encoder-Decoder)** → **Seq2Seq + Attention**(디코딩 시 적응적 인코딩) → **Transformer**(Self-Attention, Multi-head).
    
*   응용: 기계번역, 대화 생성, 문법 트리 파싱.
    

### 3.2 Seq2Seq & Attention

*   **Seq2Seq(RNN)**: Encoder(단어열→문장 표현 벡터) + Decoder(표현→단어열 분포).
    
*   **어텐션 동기**: vanilla seq2seq는 긴 문장에서 마지막 은닉상태 하나에 첫 단어 정보까지 담아야 함 → 정보 병목.
    
*   **Attention 직관**: 디코더가 매 출력 스텝마다 소스 문장의 **어느 부분에 집중할지** 결정.
    
    *   디코더 은닉상태 `sᵢ = f(s_{i-1}, y_{i-1}, cᵢ)`, **컨텍스트 벡터 cᵢ**는 인코더 주석 h₁…h\_T의 **가중합**.
        
    *   **정렬 점수(alignment score)** `eᵢⱼ = score(s_{i-1}, hⱼ)`로 위치 j 입력과 위치 i 출력의 부합도 계산 → **softmax 정규화**로 가중치 αᵢⱼ.
        

### 3.3 RNN의 한계 → Transformer 동기

*   장기 의존성 포착 어려움(vanishing gradient), 학습 비용 큼(긴 그래디언트 경로), **병렬 처리 불가**(한 번에 하나씩만 처리).
    

### 3.4 Self-Attention & Transformer

*   **Self-Attention**: 입력 문장 내 각 단어가 서로에게 미치는 영향을 계산·가중해 **문맥 반영 새 표현** 생성. 문장 내 요소들이 서로 attend → context-sensitive encoding (예: "it"의 표현이 "animal"을 집중 참조).
    
*   **Transformer**: Self-Attention 기반 다층 신경망.
    
*   **RNN vs Transformer**:
    
    |  | RNN | Transformer |
    | --- | --- | --- |
    | 방식 | 순환 모듈 | 고정 크기 행렬곱 self-attention |
    | 병렬화 | 어려움(순차적) | 쉬움 → 빠름 |
    | 장기 의존성 | 명시적 모델링 없음 | 인접 층 간 완전 연결 |
    | 최대 경로 길이 | O(n) | O(1) |
    

### 3.5 Transformer 구조 상세

*   **전체**: Encoder(6층) + Decoder(6층), 입력은 Positional Embedding부터.
    
*   **Positional Embedding**: 토큰의 상대/절대 위치 정보를 반영(순서 활용). 토큰 임베딩 + 위치 임베딩.
    
*   **Encoder**: N=6 동일 층, 각 층 2개 서브층 — ①Multi-Head Self-Attention ②Position-wise FFN. 출력 = `LayerNorm(x + Sublayer(x))` (**잔차 연결**). Q=K=V(이전 층 출력에서).
    
*   **Self-Attention (Scaled Dot-Product)**: Query·Key 내적 → **softmax** → Value 가중합.
    
*   **Multi-Head Attention**: 서로 다른 선형 투영으로 여러 번(예: 8-head) 적용 → 다양한 관계 포착.
    
*   **Point-wise FFN**: 각 위치에 개별·동일 적용, **ReLU 사이에 둔 2개 선형변환**.
    
*   **Residual Connection + LayerNorm**: skip connection으로 층 건너뛰기.
    
*   **Decoder**: 인코더와 거의 동일하나 **Encoder-Decoder Attention** 추가.
    

### 3.6 Transformer로 언어 생성

*   **학습**: 교차 엔트로피 손실.
    
*   **생성(자기회귀)**: 다음 단어를 반복 예측 → 예측 단어를 문장 끝에 삽입해 다시 입력(GPT 방식).
    
*   **탐색 알고리즘**:
    
    *   **Greedy Search**: 매 시점 최고 확률 단어 선택.
        
    *   **Beam Search**: 매 시점 상위 num\_beams 가설 유지 → 최종적으로 가장 확률 높은 시퀀스 선택.
        

* * *

## Lecture 04. 거대 언어 모델의 사전학습과 진화

### 4.1 LLM 역사와 마일스톤 논문

*   흐름(3 Phase): …→ GPT-4·Claude-3(2024) → Gemini·Deepseek-r1·GPT-o3(2025).
    
*   핵심 논문: Word2Vec(2013), Attention(Bahdanau 2015), Transformer(Vaswani 2017), **BERT**(2019), GPT-1/2, BART, **GPT-3**(2020), **InstructGPT**, Chain-of-Thought, RLHF(Anthropic), ChatGPT(논문 없음), LLaMA, GPT-4, DeepSeek-R1.
    

### 4.2 Pre-trained Word Embeddings → Whole Models

*   초기: 사전학습 워드임베딩(문맥 없음)에서 시작, LSTM/Transformer로 문맥 학습.
    
    *   문제: downstream 데이터가 언어의 모든 문맥을 가르칠 만큼 충분해야 하고, 대부분 파라미터가 무작위 초기화됨. (예: "movie"는 문장과 무관하게 같은 임베딩)
        
*   **현대 NLP**: 거의 모든 파라미터를 **사전학습으로 초기화**. 입력 일부를 가리고 복원하도록 학습 → 강한 언어 표현·초기화·언어 확률분포 확보.
    

### 4.3 아키텍처별 사전학습

*   **BERT(Encoder)**: **양방향 문맥**(미래 조건화 가능), 강한 표현 학습.
    
*   **BART, T5(Encoder-Decoder)**: 인코더·디코더 장점 결합.
    
*   **GPT(Decoder)**: 언어모델, 생성에 유리하나 미래 단어 조건화 불가.
    
*   입력 복원으로 학습되는 것: 상식/문법/공지시(coreference)/어휘의미/감성/일부 추론·기초 산술 등 언어의 통계적 성질.
    

### 4.4 사전학습 / 파인튜닝 패러다임

*   **Step 1 사전학습(자기지도)**: 대량 텍스트로 언어모델링(다음 단어/마스크 단어 예측). BERT 목표: (1) 마스크 단어 예측 (2) 다음 문장 예측. 데이터 예: BooksCorpus(800M) + Wikipedia(2,500M).
    
*   **Step 2 파인튜닝(지도)**: 특정 다운스트림 태스크에 소량 레이블로 적응 (예: BERT + 분류기 1개 층으로 스팸 분류).
    

### 4.5 GPT-3와 In-Context Learning

*   **GPT-3**(2020.6): 1,750억 파라미터 Transformer(96층, 12k hidden, 96 heads), dense+sparse attention, 3,000억 토큰(CommonCrawl 60% + WebText2 22% + Books 16% + Wikipedia 3%). 모델 비공개, 상업 API.
    
*   **In-Context Learning(ICL)** = 일종의 Few-shot: **Zero-shot / Few-shot**.
    
    *   장점: 하나의 모델로 다중 문제(요약·프로그래밍·번역·감성분석) / 대규모 레이블 불필요 / 데이터 없던 새 문제도 해결.
        

### 4.6 정렬(Alignment) 문제와 RLHF

*   **한계**: GPT-3는 다음 단어는 잘 생성하나 **주어진 지시를 잘 따르지 못함**.
    
*   **모델 지향점 "3H"**: **Helpful**(과제 해결 도움), **Honest**(정확한 정보), **Harmless**(해를 끼치지 않음).
    
*   **Misalignment**: 학습 목표(다음 토큰 예측)와 평가(지시 수행)의 불일치 → 해결책은 **인간 피드백으로 직접 학습**.
    
*   **지시 따르기 학습 2단계**:
    
    1.  **SFT(지도 파인튜닝)**: 인간 작성 시연으로 학습(프롬프트 샘플→라벨러 시연→GPT-3 파인튜닝).
        
    2.  **RLHF**: Agent=LM, Environment=인간, State=입력, Action=출력, Policy=생성, **Reward=인간 피드백**.
        
        *   ① 비교 데이터 수집 → 출력 순위 매김 → **보상 모델(RM)** 학습.
            
        *   ② PPO로 정책 최적화. RM 보상으로 갱신하되 SFT에서 너무 벗어나지 않게 제약 + 사전학습 데이터 보조 LM 목표.
            
*   **RLHF > SFT 이유**:
    
    1.  보상은 자기회귀 손실보다 **미묘한 신호**(유사 품질 시퀀스에 유사 보상; "amazing"과 "sandwiches"를 다르게 평가).
        
    2.  RM은 **모델 자신의 생성**을 비평(SFT는 오프라인) → 맞춤형 피드백.
        
    3.  RM이 \*\*선호(preference)\*\*를 직접 포착(순위→선호 추론).
        
    4.  **데이터 효율적**(SFT는 목표 생성에 인간 필요, RM은 한 번 학습 후 무한 채점: 13k vs 31k 프롬프트).
        

### 4.7 InstructGPT → ChatGPT

*   **InstructGPT** = GPT-3 + SFT + RLHF → 인간 선호 테스트 최고 성능. 지시를 더 정확히(helpful), 환각 감소(honest).
    
*   **ChatGPT**: InstructGPT와 같은 방법 + 데이터 수집만 약간 차이. AI 트레이너가 사용자·AI 양쪽 역할 대화 생성, InstructGPT 데이터를 대화 형식으로 혼합. RM 데이터는 챗봇 대화에서 대안 완성문 순위화.
    
*   **Naïve ChatGPT 한계**: 최신 정보 부족 → \*\*RAG(검색 증강 생성)\*\*로 검색엔진 활용해 정확한 응답.
    

### 4.8 Base vs Instruct 모델 & 학습 패러다임 변천

*   **Base Model**: 초기 사전학습 결과, **텍스트 완성**에 특화.
    
*   **Instruct Model**: Base를 사용자 의도에 맞게 파인튜닝, **질의응답·지시 수행**에 최적화.
    
*   NLP 학습 패러다임: 지도학습(~2019) → 사전학습+파인튜닝(2019~, BERT/GPT/BART) → **사전학습 + Few/Zero-shot 또는 PEFT**(모델·데이터 크기↑).
    

* * *

## Lecture 05. LLM 에이전트 (스스로 계획하고 실행하는 AI)

### 5.1 LLM Agent의 정의

*   LLM은 곱셈·나눗셈 같은 기본 연산 등 실패하는 과제가 많음 → **외부 시스템으로 능력 강화** = Anthropic의 **"The Augmented LLM"** (예: 수학 질문에 계산기 도구 사용).
    
*   **에이전트 프레임워크**: **Environment**(상호작용 세계) / **Sensors**(관찰) / **Actuators**(도구로 행동) / **Effectors**("두뇌", 관찰→행동 규칙).
    
*   동작: 상황 이해(LLM) → 다음 단계 계획(Planning) → 행동(Tools) → 행동 추적(Memory). 시스템에 따라 **자율성 정도**가 다양.
    

### 5.2 Memory of LLM

*   **단기 기억(Short-term)**: LLM은 본래 망각 시스템(대화 간 기억 없음). **컨텍스트 윈도우**에 대화·행동 이력을 담아 구현("기억"이 아니라 무슨 대화였는지 "말해줌"). 윈도우가 작거나 이력이 크면 **다른 LLM으로 요약**.
    
*   **장기 기억(Long-term)**: 수십~수백 단계를 추적해야 함. **외부 벡터 DB**에 과거 상호작용을 임베딩으로 저장 → 프롬프트 임베딩과 비교해 관련 정보 검색 = **RAG(검색 증강 생성)**.
    
*   **기억 유형**(Cognitive Architectures for Language Agents): **의미 기억**(세계 사실)과 **작업 기억**(현재·최근 상황)을 서로 다른 DB에 저장 등.
    

### 5.3 Tools & MCP

*   **도구(Tools)**: LLM이 외부 환경(DB)·앱(커스텀 코드)과 상호작용. 두 용도 — **데이터 조회**(최신 정보 검색), **행동 수행**(회의 예약·음식 주문).
    
*   **Function Calling**: LLM이 사용할 커스텀 함수 생성(예: 곱셈 함수). 대부분 최신 LLM이 도구 사용 가능. 고정 순서 사용 또는 **LLM이 자율적으로 도구 선택**(중간 단계 출력을 다시 LLM에 피드백).
    
*   **Toolformer**: 어떤 API를 언제 호출할지 학습한 모델. `[`, `]` 토큰으로 도구 호출 시작·종료, `→` 토큰에서 생성 멈추고 도구 호출→출력 삽입. few-shot 프롬프트로 도구 사용 데이터셋을 생성해 학습.
    
*   **MCP(Model Context Protocol)** — Anthropic 개발, API 접근 표준화(기존엔 도구를 수동 추적·JSON 스키마 기술·API 변경 시 수동 갱신 필요):
    
    *   **MCP Host**: 연결 관리 LLM 앱(예: Cursor).
        
    *   **MCP Client**: MCP 서버와 1:1 연결 유지.
        
    *   **MCP Server**: LLM에 컨텍스트·도구·기능 제공.
        
    *   흐름(예: 최근 커밋 5개 요약): Host→Server에 가용 도구 질의 → LLM이 도구 선택·요청 → 결과 수신 → 사용자에게 답변 파싱.
        

### 5.4 Planning & ReAct

*   **Planning**: 과제를 실행 가능한 단계로 분해. 과거 행동을 반복적으로 성찰해 현재 계획 갱신. 기반은 **추론(reasoning)**.
    
*   **Reasoning**: 답하기 전 "생각"하는 LLM. **Chain-of-Thought**는 순수 추론에 집중(단, 추론만으로 실행 계획이 되지는 않음).
    
*   **ReAct (Reason + Act)**: 추론과 행동을 결합한 초기 기법, 정교한 프롬프트 엔지니어링으로 구현. 3단계 사이클:
    
    *   **Thought**(현재 상황 추론) → **Action**(도구 등 실행) → **Observation**(결과에 대한 추론).
        
*   **Reflexion**: 실패로부터 학습(언어적 강화). 3역할 — **Actor**(CoT/ReAct로 행동 선택·실행), **Evaluator**(출력 점수화), **Self-reflection**(행동·점수 성찰). 메모리 모듈로 행동·성찰 추적.
    

### 5.5 Multi-Agent Collaboration

*   여러 에이전트(각자 도구·기억·계획 보유)가 상호작용하는 프레임워크.
    
*   보통 **전문화된 에이전트 + Supervisor**(에이전트 간 통신 관리, 특정 과제 배정) 구조. 에이전트마다 다른 도구·기억 시스템 가능.
    
*   핵심 2요소: **Agent Initialization**(전문 에이전트 생성 방식), **Agent Orchestration**(전체 조율 방식).
    

* * *

## Lecture 06. AI 하드웨어와 GPU

### 6.1 컴퓨터 내부와 운영체제(OS)

*   **OS**: 하드웨어와 소프트웨어 사이 계층. 책임 — 자원/프로세스 관리, 장치 I/O, 시스템 서비스, UI, 보안·권한.
    
*   **Kernel**: OS의 핵심(병렬 실행·하드웨어 공유). 사용자 상호작용은 **Shell**(CLI 또는 GUI)이 담당. 하드웨어 상호작용은 커널 + **디바이스 드라이버** 협업.
    
*   **프로세서 종류**: CPU, GPU, FPGA, ASIC.
    

### 6.2 CPU Internals

*   **CPU**: 컴퓨터의 "두뇌", 프로그램 명령을 개시·실행. **직렬 처리**: Fetch → Decode → Execute 순차 반복(RAM에서).
    
*   **코어**: 물리 코어(하드웨어) vs 논리 코어(하이퍼스레딩, 코어당 다중 스레드). 논리 코어는 물리 코어의 완전한 병렬성엔 못 미침.
    
*   **특성**: **지연시간(latency) 최소화** 설계, 소수의 강력한 코어, 순차 계산에 빠름.
    

### 6.3 GPU Computing

*   **GPU**: 원래 그래픽 렌더링 가속용. **CPU의 보조 프로세서**로 과학·공학 범용 연산 가속(다중 코어 병렬 실행).
    
*   **특성**: 각 코어는 CPU보다 단순·느리지만 **수백~수천 개**의 코어. 병렬·비동기 연산. 데이터 관리는 여전히 CPU 의존, 병렬화하려면 **프로그램 재작성** 필요.
    

### 6.4 CPU vs GPU

|  | CPU | GPU |
| --- | --- | --- |
| 코어 | 소수(강력) | 다수(단순) |
| 설계 목표 | **지연시간 최소화** | **처리량(throughput) 최대화** |
| 처리 | 직렬 | 병렬 |
| 데이터 | 다양한 타입 | 단일 타입 |
| 연산량 | 한 번에 소수 | 한 번에 수천 |

*   **CPU 강점**: 큰 메인 메모리, 빠른 클럭, 큰 캐시로 지연 최적화 / **약점**: 낮은 메모리 대역폭, 캐시 미스 비용 큼, 낮은 전력효율.
    
*   **GPU 강점**: 높은 대역폭 메모리, 풍부한 연산 자원, 병렬로 지연 감내, 높은 처리량·전력효율 / **약점**: 낮은 메모리 용량, 낮은 스레드당 성능.
    
*   **가속 노드**: CPU·GPU는 별도 메모리(CPU 크고 느림 / GPU 작고 빠름), **PCIe**로 통신(대역폭이 두 메모리보다 낮음, 데이터 복사 필요). 신기술: **NVLink**.
    
*   **이종 프로그래밍(Heterogeneous)**: 애플리케이션 코드에서 **연산 집약적 소수 함수(시간의 대부분)는 GPU**, 나머지 순차 코드는 CPU가 담당.
    

### 6.5 Floating-Point Number

*   **저비트폭 연산은 저렴**: 비트폭↓ → 에너지↓.
    
*   **정수 표현**: 부호없는 정수 `[0, 2ⁿ-1]`; 부호있는 정수(부호-크기 표현은 0이 두 개 / **2의 보수**는 0이 하나, 범위 `[-2ⁿ⁻¹, 2ⁿ⁻¹-1]`).
    
*   **부동소수점(IEEE 754)**: **지수 폭 → 범위(Range)**, **가수 폭 → 정밀도(Precision)**. 예: 32-bit FP, IEEE FP16(half).
    

### 6.6 LLM 모델 & GPU VRAM 사이징 가이드

*   LLM 실행(추론/학습) 시 필요한 모든 데이터가 **VRAM**에 로드되어야 함. 부족하면 실행 불가하거나 느린 시스템 RAM으로 offload → 속도 급감.
    
*   **주요 VRAM 소비 요소**: **모델 가중치**(최대), **옵티마이저 상태**(풀 파인튜닝 시 가중치의 2배+, 예: AdamW), **활성값·그래디언트**, **KV 캐시**(추론 핵심, 컨텍스트 길이·배치에 선형 증가).
    
*   **정밀도별 파라미터당 크기**:
    
    | 정밀도 | 파라미터당 | Llama 3 8B 예시 |
    | --- | --- | --- |
    | FP32 (Full) | 4 bytes | ≈ 32 GB |
    | FP16/BF16 (Half, 표준) | 2 bytes | ≈ 16 GB |
    | INT8 (양자화) | 1 byte | ≈ 8 GB |
    | INT4 (QLoRA/GPT-Q) | 0.5 bytes | ≈ 4 GB (+1~2GB 오버헤드) |
    
*   **16GB GPU 예시**(Colab T4/L4, RTX 4060Ti 16GB):
    
    *   추론(FP16): 가능(≈16GB 딱 맞음, KV 캐시 여유 적음).
        
    *   풀 파인튜닝(FP16): **불가**(16GB 가중치 + 32GB+ 옵티마이저 + 활성값 > 16GB).
        
    *   **PEFT(LoRA/QLoRA)**: 가능(4-bit 로드 ≈5~6GB로 여유 확보).
        
    *   긴 컨텍스트(예: 32k)는 KV 캐시 폭증으로 **OOM** 위험.
        
*   **풀 파인튜닝 VRAM 구성(8B 예)**: 가중치 16GB + 그래디언트 16GB + 옵티마이저 상태 32GB(AdamW 2배) + 활성값 α ≈ **64GB+**.
    

* * *

## 핵심 흐름 요약 (One-line Takeaways)

1.  **AI ⊃ ML ⊃ DL**. ML은 지도/비지도/준지도/강화로 나뉘고, DL은 다층 신경망 + 비선형 활성함수(XOR 문제가 그 필요성 입증) + 역전파로 학습한다.
    
2.  NLP 파이프라인은 **토큰화 → 임베딩(Word2Vec) → 모델링**이며, 순차 처리의 원조 **RNN**은 vanishing gradient로 장기 의존성에 약해 **LSTM**이 게이트로 보완했다.
    
3.  **Attention → Self-Attention → Transformer**가 병렬화(O(1) 경로)와 장기 의존성을 해결했고, 텍스트는 자기회귀 + Beam Search로 생성된다.
    
4.  현대 LLM은 **대규모 사전학습 → 파인튜닝/ICL → SFT + RLHF(3H 정렬)** 로 진화했다(GPT-3 → InstructGPT → ChatGPT).
    
5.  **LLM Agent** = Augmented LLM(두뇌) + Memory(컨텍스트/벡터DB·RAG) + Tools(Function Calling·MCP) + Planning(ReAct·Reflexion·Multi-agent).
    
6.  LLM은 **GPU의 병렬 처리**로 구동되며, 실제 배포의 병목은 **VRAM**이다(정밀도·양자화·PEFT로 관리).
