---
name: mermaid-diagram
description: 프로젝트 구조를 분석하여 Mermaid 다이어그램 HTML을 생성하고 브라우저를 실행하여 시각화합니다.
---

## 단계 1: 의존성 분석

`src/` 디렉토리를 스캔하여 컴포넌트 간 import 관계를 파악하고 Mermaid `graph TD` 구문을 생성한다.

```bash
grep -r "^import" src/ --include="*.tsx" --include="*.ts" -l
grep -r "from '\.\." src/ --include="*.tsx" --include="*.ts"
```

분석 결과를 바탕으로 다음 관계를 다이어그램에 포함한다:
- 컴포넌트 → 컴포넌트 (import 관계)
- 컴포넌트 → Context (useXxx hook 사용)
- Context → API 레이어
- API 레이어 → 외부 서버

## 단계 2: HTML 파일 생성

`docs/architecture/index.html`을 생성한다. 디렉토리가 없으면 먼저 생성한다.

요구사항:
- Mermaid.js CDN 포함: `https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`
- 배경색 `#1a1a1a` 어두운 테마 적용
- Mermaid `theme: 'dark'` 설정
- 다이어그램은 `graph TD` 방향으로 작성
- 노드 스타일: 컴포넌트(파란 계열), Context(보라 계열), API(초록 계열), 외부 서버(회색)

HTML 구조 예시:
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Architecture Diagram</title>
  <style>
    body { margin: 0; background: #1a1a1a; display: flex; flex-direction: column; align-items: center; padding: 40px; }
    h1 { color: #e0e0e0; font-family: sans-serif; margin-bottom: 32px; }
    .mermaid { background: #2a2a2a; border-radius: 12px; padding: 32px; }
  </style>
</head>
<body>
  <h1>프로젝트 아키텍처</h1>
  <div class="mermaid">
    graph TD
      %% 실제 분석 결과로 채운다
  </div>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>mermaid.initialize({ startOnLoad: true, theme: 'dark' });</script>
</body>
</html>
```

## 단계 3: 브라우저 실행

OS를 감지하여 브라우저를 실행한다.

```bash
if [[ "$OSTYPE" == "darwin"* ]]; then
  open docs/architecture/index.html
else
  xdg-open docs/architecture/index.html
fi
```

## 완료 보고

작업이 끝나면 반드시 다음 문장으로 보고한다:

"아키텍처 다이어그램이 브라우저에서 열렸습니다."
