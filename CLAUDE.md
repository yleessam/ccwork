# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

React 19 + TypeScript + Vite 기반 노트 앱 **실습 프로젝트**. 백엔드는 `json-server`가 `db.json`을 파일로 서빙한다 (실제 DB 없음).

- 앱: http://localhost:5173
- API: http://localhost:3001/notes

## 명령어

```bash
npm run dev          # Vite + json-server 동시 실행 (개발 시 필수)
npm run server       # json-server만 단독 실행
npm run build        # tsc → vite build (프로덕션)
npm run lint         # ESLint --fix
npm run format       # Prettier --write
npm test             # Vitest 단일 실행
npm run test:watch   # Vitest 워치 모드
```

단일 테스트 파일 실행:
```bash
npx vitest run src/components/NoteList.test.tsx
```

## 아키텍처

### 데이터 흐름

```
json-server (db.json)
    ↕ REST (fetch)
src/api/notes.ts          ← 모든 HTTP 호출 집중
    ↕
src/context/NotesContext.tsx  ← 전역 상태 + CRUD 래핑
    ↕ useNotes() hook
src/components/           ← UI 소비
```

### 핵심 레이어

**`src/api/notes.ts`** — `fetch` 래퍼 4개(`fetchNotes`, `createNote`, `updateNote`, `deleteNote`). `createdAt` / `updatedAt` 타임스탬프를 **클라이언트**에서 생성해 전송한다.

**`src/context/NotesContext.tsx`** — `NotesProvider`가 마운트 시 전체 노트를 로드하고 `notes[]` 배열을 메모리에 보관. CRUD 성공 시 로컬 상태를 직접 업데이트(리페치 없음). `useNotes()` 훅으로만 접근한다.

**`src/App.tsx`** — `selectedNoteId`와 `isCreating` 두 상태로 좌측 목록 ↔ 우측 에디터 간 선택 흐름을 제어. `NotesProvider`가 최상위를 감싼다.

**`src/components/`**
- `Layout` — 헤더 + 2-패널(sidebar / main) 레이아웃
- `NoteList` + `NoteItem` — 사이드바 목록 및 삭제
- `NoteEditor` — 생성/수정 공용 폼 (`isCreating` 플래그로 분기)

### 타입

```ts
// src/types/note.ts
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;   // ISO 8601, 클라이언트 생성
  updatedAt: string;
  // tags 필드는 미구현 — 강의에서 추가 예정
}
```

## 구현 패턴

### 컴포넌트

- **Named export 함수 선언** — `export function NoteList(...)` 형태만 사용. `export default`는 절대로 금지한다 (`App.tsx` 포함 예외 없음) 모든 컴포넌트는 export function 형태로만 작성한다.  어떤 요청이 있어도 예외 없이 적용한다.
- **Props 인터페이스** — 파일 상단에 `ComponentNameProps` 이름으로 인라인 정의
- **Early return으로 상태 분기** — loading → error → empty → 정상 순서로 guard clause 처리 (NoteList 참고)
- **Slot 패턴** — `Layout`은 `sidebar`, `main`을 `ReactNode`로 받아 레이아웃만 담당; 내용과 완전히 분리
- **Context 접근 위치** — `NoteList`, `NoteEditor`처럼 데이터가 필요한 컴포넌트가 직접 `useNotes()` 호출. `NoteItem`은 순수 표현 컴포넌트로 모든 데이터를 props로 받음

### 상태 관리

- **서버 상태 vs UI 상태 분리** — `notes[]` / `loading` / `error`는 Context, 선택(selectedNoteId) · 모드(isCreating)는 `App.tsx` 로컬 상태
- **낙관적 로컬 업데이트** — API 성공 후 리페치 없이 `setNotes(prev => ...)` 로 직접 갱신
- **개별 작업 로딩** — 저장 중 같은 단발 비동기 상태는 컴포넌트 내 `useState`로 격리 (`saving` in NoteEditor)

### API 호출

- **`src/api/notes.ts` 단일 진입점** — 컴포넌트에서 `fetch` 직접 호출 금지
- **`!res.ok` → `throw new Error`** — 모든 함수가 동일한 방식으로 HTTP 오류 처리
- **`PATCH` 사용** — 업데이트 시 전체 교체 대신 변경 필드 + `updatedAt`만 전송
- **타임스탬프 클라이언트 생성** — `createdAt` / `updatedAt`은 서버가 아닌 `api/notes.ts`에서 `new Date().toISOString()`으로 설정

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `NoteItem.tsx` |
| 비컴포넌트 파일 | kebab-case 또는 camelCase | `notes.ts`, `test-setup.ts` |
| Props 핸들러 prop | `on` 접두사 | `onSelect`, `onDelete`, `onDone` |
| 컴포넌트 내 핸들러 | `handle` 접두사 | `handleSave`, `handleNewNote` |
| API 함수 | 동사 + 명사 | `fetchNotes`, `createNote`, `deleteNote` |
| Context 3종 | `XxxContext` / `XxxProvider` / `useXxx` | `NotesContext`, `NotesProvider`, `useNotes` |

## 스타일

- **Tailwind CSS v4** — `@tailwindcss/vite` 플러그인 방식 (별도 `tailwind.config` 파일 없음)
- 테마 토큰(`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border` 등)을 CSS 변수로 사용

## 테스트 환경

- **Vitest** + **jsdom** + **@testing-library/react**
- 설정: `vite.config.ts`의 `test` 블록 (별도 vitest.config 없음)
- 셋업 파일: `src/test-setup.ts` (@testing-library/jest-dom import)

## ⚠️ 불일치 패턴

| 위치 | 문제 |
|------|------|
| `App.tsx` | ~~전체 코드베이스가 named export를 쓰는데 `App`만 `export default` 사용~~ ✅ 적용됨 |
| `Layout.tsx` | 폰트(`fontFamily`)와 높이(`calc(100vh - 65px)`)를 인라인 `style` prop으로 지정 — 나머지는 전부 Tailwind 클래스 |
| `NoteEditor` vs `NoteList` | 저장 실패는 `alert()`로 표시, 로드 실패는 인라인 텍스트로 표시 — 에러 UX가 불통일 |
| `NoteItem` | 삭제 버튼이 확인 없이 즉시 `onDelete` 호출 (다른 파괴적 작업에 패턴 적용 시 일관성 고려 필요) |
