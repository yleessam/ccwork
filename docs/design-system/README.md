# Design System — The Digital Atelier

> **Soft Minimalism.** UI는 콘텐츠와 경쟁하지 않는다.

## 핵심 3원칙

| 원칙 | 규칙 |
|------|------|
| **No-Line Rule** | 섹션 경계에 1px 선 금지 → 배경색 전환으로만 구분 |
| **Tonal Layering** | `shadow-md` 금지 → surface 계층 중첩으로 깊이 표현 |
| **Typography-Driven** | 기능 불명확한 아이콘 금지 → 텍스트 레이블 우선 |

## 파일 인덱스

| 파일 | 내용 | 참조 시점 |
|------|------|-----------|
| [`tokens.md`](./tokens.md) | 색상·타이포·스페이싱 토큰 + `index.css` 코드 | 색상 클래스 선택, `index.css` 수정 시 |
| [`components.md`](./components.md) | 버튼·카드·인풋·chip 코드 예시 | 컴포넌트 작성·수정 시 |
| [`do-dont.md`](./do-dont.md) | 금지 규칙 6가지 (PostToolUse 훅 검사 기준) | 코드 리뷰, 규칙 확인 시 |

## 사용법

스타일 작업 시작 전 `/design` 스킬을 실행하면 위 3개 파일이 컨텍스트에 로드됩니다.
`.tsx` / `.css` 파일 편집 후 PostToolUse 훅이 자동으로 `do-dont.md` 규칙을 검사합니다.
