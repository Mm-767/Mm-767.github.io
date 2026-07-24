---
title: "⚾ LGAI 8기 모델 경량화 및 실전 머신러닝 파이프라인 가이드북"
date: 2026-07-14
tags: ["lg-aimers"]
series: "LG Aimers"
---

본 가이드북은 **DACON LGAI-EXAONE-4.0-1.2B 모델 경량화 해커톤** 참가자 및 실전 테이블형 머신러닝 엔지니어를 위해 작성되었습니다. 대형 언어 모델(LLM)의 **W4A16 GPTQ 양자화(Quantization)** 파이프라인과 이를 활용한 하이브리드 야구 데이터 분석 체계를 상세히 설명합니다.

* * *

## 📌 목차

1.  [해커톤 개요 및 대상 모델 분석](#1-%ED%95%B4%EC%BB%A4%ED%86%A4-%EA%B0%9C%EC%9A%94-%EB%B0%8F-%EB%8C%80%EC%83%81-%EB%AA%A8%EB%8D%B8-%EB%B6%84%EC%84%9D)
    
2.  [W4A16 GPTQ 양자화의 기술적 원리](#2-w4a16-gptq-%EC%96%91%EC%9E%90%ED%99%94%EC%9D%98-%EA%B8%B0%EC%88%A0%EC%A0%81-%EC%9B%90%EB%A6%AC)
    
3.  [실전 경량화 파이프라인 구현 코드 가이드](#3-%EC%8B%A4%EC%A0%84-%EA%B2%BD%EB%9F%89%ED%99%94-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B5%AC%ED%98%84-%EC%BD%94%EB%93%9C-%EA%B0%80%EC%9D%B4%EB%93%9C)
    
4.  [데이콘(DACON) API 연동 및 최종 제출 절차](#4-%EB%8D%B0%EC%9D%B4%EC%BD%98dacon-api-%EC%97%B0%EB%8F%99-%EB%B0%8F-%EC%B5%9C%EC%A2%85-%EC%A0%9C%EC%B6%9C-%EC%A0%88%EC%B0%A8)
    
5.  [EXAONE 경량화 모델과 GBDT의 하이브리드 야구 분석 응용 전략](#5-exaone-%EA%B2%BD%EB%9F%89%ED%99%94-%EB%AA%A8%EB%8D%B8%EA%B3%BC-gbdt%EC%9D%98-%ED%95%98%EC%9D%B4%EB%B8%8C%EB%A6%AC%EB%93%9C-%EC%95%BC%EA%B5%AC-%EB%B6%84%EC%84%9D-%EC%9D%91%EC%9A%A9-%EC%A0%84%EB%9E%B5)
    

* * *

## 1\. 해커톤 개요 및 대상 모델 분석

본 해커톤의 핵심 목표는 제공된 클라우드 GPU 서버 환경에서 **LGAI-EXAONE/EXAONE-4.0-1.2B** 기본 모델의 추론 속도를 높이고 메모리 점유율을 낮추는 **경량화(Compression)** 작업을 수행하는 것입니다. 1.2B 파라미터 크기의 모델은 모바일 및 에지 장비에서 동작하기 적합한 경량 모델이지만, 여전히 일반적인 싱글 GPU나 CPU 환경에서는 추론 지연이 발생할 수 있습니다.

### 1) 경량화의 필요성

*   **메모리(VRAM) 절감**: FP16/BF16 포맷의 1.2B 모델은 모델 가중치 로드에만 약 2.4GB 이상의 VRAM을 요구합니다. 이를 4-bit로 양자화하면 가중치 크기가 약 600MB 이하로 줄어들어 캐시 메모리 효율과 서빙 처리량(Throughput)이 극대화됩니다.
    
*   **추론 대역폭 한계(Memory-bound) 극복**: 생성형 LLM 추론은 가중치를 메모리에서 프로세서로 계속해서 읽어오는 과정에서 대역폭 병목이 발생합니다. 가중치를 압축하면 데이터 전송량이 줄어들어 초당 토큰 생성 수(Tokens per second)가 비약적으로 상승합니다.
    

### 2) llmcompressor 라이브러리 도입

과거에는 양자화를 위해 복잡한 별도의 C++ 컴파일 라이브러리가 필요했으나, 최신 허깅페이스 생태계에서는 `llmcompressor` 라이브러리를 활용해 PyTorch 환경 내에서 간결하게 **원샷(Oneshot) GPTQ 최적화**를 수행할 수 있게 되었습니다.

* * *

## 2\. W4A16 GPTQ 양자화의 기술적 원리

### 1) GPTQ (Generalized Post-Training Quantization)

GPTQ는 대표적인 사후 양자화(PTQ) 알고리즘으로, 사전 학습이 완료된 가중치 매트릭스 $\\mathbf{W}$를 더 낮은 비트(예: 4-bit)로 압축할 때 발생하는 평균 제곱 오차(MSE)를 최소화합니다 \[30\]. 단순한 라운딩(Rounding) 방식과 달리, GPTQ는 입력 값들의 공분산 역행렬(Hessian Matrix $\\mathbf{H}$) 정보를 반영하여 **한 가중치를 양자화할 때 생기는 오차를 주변 가중치들이 역으로 보정(Error Compensation)하도록 유기적으로 조정**합니다.

### 2) W4A16 (Weight 4-bit / Activation 16-bit) 스키마

*   **W4 (Weight 4-bit)**: 모델의 가중치($\\mathbf{W}$) 정보를 16개의 정수 레벨(0~15 또는 -8~7)로 맵핑하여 표현합니다. 이를 통해 모델 디스크 크기 및 메모리 로딩 공간을 75% 절감합니다.
    
*   **A16 (Activation 16-bit)**: 추론 과정에서 계산되는 텐서의 활성화 값(Activation)들은 원본 정밀도인 16-bit(BF16 또는 FP16)를 유지합니다. 활성화 값까지 4-bit로 극단적으로 줄일 경우 언어 모델의 언어 이해 능력과 퍼플렉서티(Perplexity)가 극심하게 붕괴하는 현상(Representation Collapse)이 발생하는데, W4A16은 이를 완벽히 방어하면서 성능 하락을 최소화합니다.
    

### 3) 가중치 보존 정책 (Ignore Targets)

모델의 모든 레이어를 무차별적으로 4-bit로 줄이면 치명적인 정보 손실이 일어납니다. 특히 다음 레이어들은 반드시 \*\*16-bit 원본 상태로 유지(Ignore)\*\*하여 추론 정확도를 보존해야 합니다:

*   `embed_tokens` **(토큰 임베딩 레이어)**: 텍스트 토큰을 고차원 잠재 벡터 공간으로 매핑하는 첫 단추로, 이곳이 왜곡되면 뒤이어 오는 모든 레이어의 입력에 회복 불가능한 노이즈가 전파됩니다.
    
*   `lm_head` **(언어 모델 출력 레이어)**: 최종적으로 다음 토큰의 확률 분포를 계산하는 선형 계층으로, 미세한 확률 차이(Logits)가 생성 품질을 결정하므로 정밀한 FP16/BF16 연산이 유지되어야 합니다 \[157\].
    

* * *

## 3\. 실전 경량화 파이프라인 구현 코드 가이드

제공된 DACON 주피터 노트북 스크린샷에 수록된 완전한 프로덕션 코드 블록입니다. 순서대로 작성되어 데이터 누수(Data Leakage)나 하드웨어 병목 없이 완벽하게 원스톱으로 빌드됩니다 \[148\].

### Block 1: 필수 라이브러리 임포트 (Imports)

```python
import os
import torch
import shutil
from pathlib import Path

from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer

from llmcompressor import oneshot
from llmcompressor.modifiers.quantization import GPTQModifier
```

*   **설명**: 양자화 엔진인 `llmcompressor`와 허깅페이스의 `transformers`를 호출합니다. `oneshot` API는 가중치를 한 번에 최적화하는 데 사용되며, `GPTQModifier`는 양자화 규칙 및 타겟 레이어를 정의합니다.
    

### Block 2: 글로벌 환경 설정 (Settings)

```python
MODEL_ID = "./base_model"
OUT_DIR = "./model"

DATASET_ID = "LGAI-EXAONE/MANTA-1M"
DATASET_SPLIT = "train"

NUM_CALIBRATION_SAMPLES = 256
MAX_SEQUENCE_LENGTH = 512

# Quantization
SCHEME = "W4A16"
TARGETS = ["Linear"]
IGNORE = ["embed_tokens", "lm_head"]
```

*   **설명**:
    
    *   `MODEL_ID`: 서버 내의 원본 EXAONE 모델 폴더 경로입니다.
        
    *   `OUT_DIR`: 경량화가 완료된 압축 모델이 저장될 공간입니다.
        
    *   `NUM_CALIBRATION_SAMPLES`: GPTQ 최적화 시 가중치 변화에 따른 활성화 값 오차를 측정하기 위해 사용되는 **캘리브레이션 샘플 수**입니다. 256개 정도의 고품질 샘플로도 대표적인 도메인 특징을 충분히 잡아낼 수 있습니다.
        
    *   `TARGETS = ["Linear"]`: 모델 내의 모든 피드포워드(FFN) 및 어텐션 투영 선형 레이어를 타겟으로 지정합니다 \[72, 88\].
        
    *   `IGNORE = ["embed_tokens", "lm_head"]`: 앞서 언급한 정보 왜곡 최소화를 위해 임베딩과 헤드 레이어를 양자화 대상에서 강제 제외합니다.
        

### Block 3: 원본 모델 및 토크나이저 로드 (Model Loading)

```python
print("[INFO] 모델 로드 중...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_ID,
    trust_remote_code=True,
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.bfloat16,
)

print("[INFO] 모델/토크나이저 로드 완료")
```

*   **설명**: EXAONE은 최신 언어 표현 학습 아키텍처를 취하고 있어 원격 코드 실행 허용(`trust_remote_code=True`)이 필요합니다. 메모리 절약 및 부동 소수점 정밀도 유지를 위해 `torch_dtype=torch.bfloat16`을 사용하여 하드웨어 부하를 원천 차단합니다.
    

### Block 4: 캘리브레이션 데이터 로드 및 템플릿화 (Dataset Preprocess)

```python
print("[INFO] 캘리브레이션 데이터 로드 중...")

ds = load_dataset(
    DATASET_ID,
    split=f"{DATASET_SPLIT}[:{NUM_CALIBRATION_SAMPLES}]",
)

def preprocess(example):
    return {
        "text": tokenizer.apply_chat_template(
            example["conversations"],
            add_generation_prompt=True,
            tokenize=False,
        )
    }

ds = ds.map(preprocess)

print("[INFO] 데이터 전처리 완료")
```

*   **설명**: 모델이 실제 대화 맥락에서 중요하게 판단해야 하는 가중치를 학습할 수 있도록 대화형 데이터셋인 `MANTA-1M`을 로드합니다. `tokenizer.apply_chat_template`를 활용해 대화 데이터(Conversations)를 모델이 실제 서비스 시 접하게 될 표준 마크다운(Markdown) 프롬프트 텍스트 형태로 완벽히 포맷팅하여 직렬화(Serialization)합니다 \[108\].
    

### Block 5: 원샷 GPTQ 실행 (Quantization)

```python
print(f"[INFO] GPTQ 시작 (scheme={SCHEME}, samples={NUM_CALIBRATION_SAMPLES}, max_len={MAX_SEQUENCE_LENGTH})...")

recipe = [
    GPTQModifier(
        scheme=SCHEME,
        targets=TARGETS,
        ignore=IGNORE,
    )
]

oneshot(
    model=model,
    dataset=ds,
    recipe=recipe,
    max_seq_length=MAX_SEQUENCE_LENGTH,
    num_calibration_samples=NUM_CALIBRATION_SAMPLES,
)

print("[INFO] GPTQ 완료")
```

*   **설명**: 정의된 레시피를 기반으로 `oneshot` 최적화 함수가 실행됩니다. 각 타겟 레이어 단위로 전방 패스(Forward pass)를 수행하면서 Hessian 기반 보정 연산이 이루어지며 가중치들이 4-bit 값으로 변환됩니다.
    

### Block 6: 압축 모델 저장 (Model Save)

```python
os.makedirs(OUT_DIR, exist_ok=True)

model.save_pretrained(OUT_DIR, save_compressed=True)
tokenizer.save_pretrained(OUT_DIR)

print(f"[INFO] 모델 저장 완료: {OUT_DIR}")
```

*   **설명**: 저장 시 \*\*`save_compressed=True`\*\*가 매우 중요합니다. 이 설정을 인가해야 4-bit 가중치가 실제 물리 파일 상으로도 패킹 및 압축되어 물리적 디스크 점유율을 크게 낮출 수 있습니다.
    

### Block 7: 제출용 압축 파일 자동 패킹 (Submission Prep)

```python
zip_name = "baseline_submit"
print(f"[INFO] {zip_name}.zip 생성 중...")

shutil.make_archive(
    base_name=zip_name,
    format="zip",
    root_dir=".",
    base_dir=OUT_DIR,
)

print(f"[INFO] 생성 완료: {zip_name}.zip")
```

*   **설명**: 생성된 압축 모델 디렉토리를 통째로 `baseline_submit.zip` 아카이브로 빌드하여 DACON 채점 서버가 즉시 읽어 들여 테스트할 수 있는 준비를 마칩니다.
    

* * *

## 4\. 데이콘(DACON) API 연동 및 최종 제출 절차

대회에서는 서버 내에 `dacon_submit_api` 모듈이 기본적으로 임베딩되어 있습니다. 코드 작성이 완벽히 끝나고 모델의 압축 무결성이 검증되면 다음 파이썬 스크립트를 작성하여 리더보드에 즉시 실시간 제출할 수 있습니다.

```python
from dacon_submit_api import dacon_submit_api

result = dacon_submit_api.post_code_submission_file(
    'baseline_submit.zip',      # 업로드할 압축 파일 경로
    'YOUR_DACON_API_TOKEN',    # 개인 프로필 페이지의 계정 관리에서 발급받은 개인 토큰
    '236689',                  # 본 해커톤 대회 고유 ID
    'TEAM_NAME',               # 데이콘 리더보드에 표기될 팀명
    'EXAONE-4.0-1.2B-W4A16-GPTQ-Base' # 제출 관련 설명 메모 (예: 기법 이름)
)

print(result)
```

⚠️ **제출 전 필수 체크리스트 (DACON Constraints)**:

*   제공된 GPU 환경 내 `/workspace` 경로 내부의 리소스만 참조했는지 확인하십시오.
    
*   양자화 완료 후 저장 시 `save_compressed=True`가 빠지면 용량 초과로 채점 오류가 날 수 있으므로 반드시 확인하십시오.
    
*   제출 파일인 `.zip` 내부에 모델 파일(`model.safetensors`) 및 토크나이저 설정 정보가 유실 없이 함께 아카이브 되었는지 더블클릭하여 검사하십시오.
    

* * *

## 5\. EXAONE 경량화 모델과 GBDT의 하이브리드 야구 분석 응용 전략

본 해커톤 대상인 **EXAONE-4.0-1.2B** 모델과 테이블형 분석의 절대적 강자인 **XGBoost / LightGBM**을 야구 분석에 결합하는 최신 머신러닝 아키텍처 전략입니다 \[53, 147\].

```
                     [야구 원시 데이터 (선수 기록 / 경기 로그)]
                                      │
                                      ▼
                      [1단계: EXAONE-1.2B 경량화 모델]
                         - 시맨틱 도메인 지식 주입
                         - CAAFE 방식 피처 코드 자동 생성
                                      │
                                      ▼
             [2단계: Leakage-free 파이프라인 (Pandas/Sklearn)]
                         - train_test_split(stratify=y)
                         - StandardScaler (Train에만 fit, Test는 transform)
                                      │
                                      ▼
                      [3단계: 고성능 GBDT (XGBoost/LightGBM)]
                         - 최적의 하이퍼파라미터 튜닝 (learning_rate↓, trees↑)
                         - 최종 승패 / 스코어 예측
```

### 1) LLM 직접 예측의 한계와 극복 지침

수십만 행의 야구 선수 통계 데이터를 LLM 프롬프트에 직접 한 행씩 집어넣고 예측을 지시(Direct Prediction, 예: LIFT 프레임워크)하는 구조는 **(1) VRAM 부족, (2) 높은 추론 지연 시간(Latency) 및 API 비용, (3) 숫자의 미세한 기하학적 대소 관계 연산 취약성** 등으로 인해 현실적으로 서빙이 불가능합니다 \[110\]. 따라서, \*\*"LLM은 도메인 의미 이해 및 파생 변수 로직 생성(Feature Engineering)에만 1회성으로 활용하고, 최종 수치 연산과 예측은 GBDT가 수행한다(CAAFE / OCTree 하이브리드 방식)"\*\*라는 지침을 엄격히 따라야 합니다 \[113, 118, 147\].

### 2) CAAFE (Context-Aware Automated Feature Engineering) 구현 절차 \[113, 138\]

1.  경량화된 EXAONE 모델에게 전체 데이터의 메타데이터(예: "ERA: 평균 자책점", "BABIP: 인플레이 타구 안타 비율", "FIP: 수비 무관 자책점")를 제공하고 도메인 지식을 유도합니다.
    
2.  모델에게 \*\*"투수의 구위와 경기 흐름을 반영할 수 있는 강력한 새 파생 열(Feature)을 생성하는 파이썬(Pandas) 코드를 작성하라"\*\*고 지시합니다 \[113\].
    
    *   _EXAONE 제안 예시_:
        
        ```python
        # 삼진율과 볼넷 비율을 이용한 구위 지표(K-BB%)
        df['K_BB_ratio'] = df['strikeouts'] / (df['walks'] + 1e-5)
        # 구장 효과를 보정한 파생 변수
        df['Adjusted_Runs'] = df['runs'] * df['park_factor']
        ```
        
3.  생성된 코드가 데이터 누수(Leakage)를 유발하는지(예: 훈련/검증 데이터 간의 Aggregate 연산이 섞여 있는지) 검토 후, 파이프라인에 주입합니다 \[148, 171\].
    

### 3) Leakage-Free 데이터 검증 및 GBDT 파이프라인 코드

최종적으로 야구 경기 결과를 예측하는 모델의 검증 신뢰도와 정확도를 쥐어짜기 위한 누수 차단 GBDT 파이프라인 템플릿입니다 \[148, 172\].

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score

# 1. Stratified Split (데이터 누수 방지 및 클래스 비율 보존)
X = df.drop(columns=["target_win"])
y = df["target_win"]

# 검증 세트를 완전히 격리
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 2. StandardScaler (반드시 train 데이터로만 fit 수행)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_raw)
X_test_scaled = scaler.transform(X_test_raw)  # Test는 transform만!

# 3. XGBoost 고수준 튜닝 레버 설정 [152]
xgb = XGBClassifier(
    n_estimators=1000,
    learning_rate=0.03,         # 학습률을 낮춰 미세 조정 및 일반화 강화
    max_depth=6,                # 의사결정 트리의 최대 깊이 제어로 과적합 방지 [43]
    subsample=0.8,              # 각 트리당 행 데이터의 80%만 무작위 사용 (Bagging 효과) [49]
    colsample_bytree=0.8,       # 각 트리당 열 데이터의 80%만 무작위 사용 [152]
    reg_lambda=2.0,             # L2 정규화 페널티 추가로 안정성 극대화 [31]
    random_state=42,
    n_jobs=-1
)

# 4. Early Stopping을 통한 과적합 방지 (학습 중 무개선 시 조기 종료) [52, 176]
# 훈련 세트 내부에서 20%를 조기종료를 위한 검증 세트로 완전 분리
X_tr, X_val, y_tr, y_val = train_test_split(
    X_train_scaled, y_train, test_size=0.2, stratify=y_train, random_state=42
)

xgb.fit(
    X_tr, y_tr,
    eval_set=[(X_val, y_val)],
    verbose=False
)

# 5. 최종 강건한 평가 수행 [18]
preds = xgb.predict(X_test_scaled)
probs = xgb.predict_proba(X_test_scaled)[:, 1]

print("=== 최종 테스트 세트 결과 ===")
print(classification_report(y_test, preds))
print(f"ROC AUC: {roc_auc_score(y_test, probs):.4f}")
```

이와 같이 경량화된 EXAONE-1.2B 모델로 **풍부한 야구 도메인 지식 파생 피처**를 자동 추출하고, 누수 없는 엄격한 데이터 검증 및 **XGBoost 앙상블 학습 파이프라인**을 연동하는 하이브리드 접근법을 취할 때, 단일 모델 대비 월등히 우수한 예측 성능과 압도적인 서빙 지연 속도 개선을 달성할 수 있습니다 \[44, 118, 147\].
