# Design Tokens

> `src/index.css`와 항상 동기화. 토큰 추가/변경 시 두 파일을 같이 수정한다.

---

## Color — Surface 계층 (배경)

| Token | Hex | Tailwind 클래스 | 용도 |
|-------|-----|-----------------|------|
| surface | `#f8f9fa` | `bg-surface` | 기본 캔버스 (앱 배경) |
| surface-container-low | `#f1f4f6` | `bg-surface-container-low` | 사이드바, 내비게이션 배경 |
| surface-container | `#eaeff1` | `bg-surface-container` | 섹션 배경 |
| surface-container-high | `#e2e9ec` | `bg-surface-container-high` | Secondary 버튼 배경 |
| surface-container-highest | `#dbe4e7` | `bg-surface-container-highest` | chip/tag 배경, Selected 상태 |
| surface-container-lowest | `#ffffff` | `bg-surface-container-lowest` | 최상위 카드, 활성 작업 영역 |

계층 구조 (위→아래: 어두움→밝음):
```
surface (#f8f9fa)                      ← 앱 배경
  └─ surface-container-low (#f1f4f6)   ← 사이드바
       └─ surface-container (#eaeff1)  ← 섹션
surface-container-lowest (#ffffff)     ← 카드 "lifted paper"
```

---

## Color — 텍스트

| Token | Hex | Tailwind 클래스 | 용도 |
|-------|-----|-----------------|------|
| on-surface | `#2b3437` | `text-on-surface` | 제목, 강조 텍스트 |
| on-surface-variant | `#586064` | `text-on-surface-variant` | 본문 장문, 보조 텍스트 |

**규칙:** `text-black`, `text-[#000]` 사용 금지. 반드시 위 토큰 사용.

---

## Color — 액션 (Accent)

| Token | Hex | Tailwind 클래스 | 용도 |
|-------|-----|-----------------|------|
| tertiary | `#0053dc` | `text-tertiary` / `bg-tertiary` | Primary 액션, 포커스 보더 |
| tertiary-container | `#3e76fe` | `bg-tertiary-container` | Primary 버튼 그라디언트 끝점 |
| on-tertiary | `#faf8ff` | `text-on-tertiary` | Primary 버튼 위 텍스트 |

**규칙:** `tertiary`는 의도적 액션에만 사용. 장식 목적 금지.

---

## Color — 기타

| Token | Value | Tailwind 클래스 | 용도 |
|-------|-------|-----------------|------|
| outline-variant | `#abb3b7` | `border-outline-variant/15` | Ghost 보더 (반드시 15% opacity) |
| destructive | `hsl(0 84% 60%)` | `text-destructive` | 삭제, 오류 상태 |

---

## src/index.css @theme 블록 (복붙용)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

@theme {
  --color-surface:                   #f8f9fa;
  --color-surface-container-low:     #f1f4f6;
  --color-surface-container:         #eaeff1;
  --color-surface-container-high:    #e2e9ec;
  --color-surface-container-highest: #dbe4e7;
  --color-surface-container-lowest:  #ffffff;

  --color-on-surface:                #2b3437;
  --color-on-surface-variant:        #586064;

  --color-tertiary:                  #0053dc;
  --color-tertiary-container:        #3e76fe;
  --color-on-tertiary:               #faf8ff;

  --color-outline-variant:           #abb3b7;
  --color-destructive:               hsl(0 84% 60%);

  --font-sans: 'Inter', system-ui, sans-serif;
  --radius: 0.375rem;
}
```

---

## Typography

**폰트: Inter 단독**

| Name | Tailwind | Size | Weight | Letter Spacing | Line Height | 용도 |
|------|----------|------|--------|----------------|-------------|------|
| display-lg | `text-[3.5rem] font-bold tracking-[-0.02em]` | 3.5rem | 700 | -0.02em | — | 랜딩 헤드라인 |
| headline-md | `text-[1.75rem] font-semibold leading-[1.4]` | 1.75rem | 600 | — | 1.4 | 노트 제목 |
| body-lg | `text-base leading-relaxed` | 1rem | 400 | — | relaxed | 본문 |
| label-md | `text-xs font-semibold tracking-[0.05em] uppercase` | 0.75rem | 600 | +0.05em | — | 메타데이터 |

**label-md는 항상 `uppercase`**

---

## Spacing

기준 리듬: **1.4rem**

| Tailwind | Value | 용도 |
|----------|-------|------|
| `gap-1` / `mt-1` | 0.35rem | Label ↔ Input 간격 |
| `gap-2` / `mt-2` | 0.7rem | Headline → Body 간격 |
| `space-y-4` / `gap-4` | 1.4rem | 리스트 아이템 간 기본 간격 |
| `gap-10` / `mt-10` | 3.5rem | 섹션 간 대형 간격 |
