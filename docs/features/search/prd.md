# 검색 기능 PRD

> 기반: spec-fixed.md | 작성일: 2026-06-04

---

## 개요

노트를 많이 쌓은 사용자가 원하는 노트를 빠르게 찾을 수 있도록, 사이드바에 검색창을 추가한다.
제목·내용을 클라이언트에서 즉시 필터링하며 서버 요청은 발생하지 않는다.

---

## 사용자 스토리

- 사용자가 검색창에 키워드를 입력하면, 제목·내용에 해당 키워드가 포함된 노트만 목록에 표시된다
- 사용자가 검색어를 모두 지우면, 전체 노트 목록으로 돌아온다
- 검색 결과가 없으면 "검색 결과가 없습니다" 메시지가 표시된다

---

## 기술 결정

### 검색어 상태 위치 및 필터링 방식

**Context** — 검색은 이미 메모리에 로드된 `notes[]`를 필터링하는 순수 UI 동작이다. 검색어(`query`)를 어디서 관리하고 어떻게 필터링할지 결정이 필요하다.

**Decision** — `query` 상태를 `App.tsx`에서 관리하고, `filterNotes(notes, query)` 순수 함수로 필터링한 결과를 `NoteList`에 prop으로 전달한다 (안 2 — App.tsx 조율 방식).

- `query`: `App.tsx` 로컬 `useState`
- `filterNotes`: `src/utils/filterNotes.ts` 순수 함수로 분리
- `NoteList`: `useNotes()` 직접 접근 대신 `notes` prop을 받도록 변경
- `App.tsx` sidebar slot: `<SearchBar> + <NoteList>`

**Alternatives**

- **안 1 (NoteList 자체 포함)** — 거부. NoteList가 "목록 표시"와 "검색 입력" 두 책임을 가지게 되어 단일 책임 원칙 위반. SearchBar를 독립적으로 테스트하기 어렵다.
- **안 3 (NotesContext 확장)** — 거부. 요구사항 인터뷰에서 "query는 순수 UI 상태이므로 Context에 넣지 않는다"고 명시적으로 확정했다. UI 상태와 서버 상태가 같은 Context에 혼재하면 관심사가 흐려진다.

**Consequences**

- 장점: `filterNotes`가 순수 함수로 분리되어 단위 테스트 작성이 용이하다. `App.tsx`의 기존 UI 조율 역할(selectedNoteId, isCreating)과 일관된다. 태그 검색 확장 시 `filterNotes` 내부만 수정하면 된다.
- 단점: `NoteList`의 props 인터페이스가 변경된다(`useNotes()` 직접 접근 → `notes` prop 수신). 기존 `NoteList` 테스트가 있다면 수정이 필요하다.

---

## Out of Scope

- 태그 기반 검색 — 태그 기능 완성 후 별도 스펙
- 검색어 하이라이팅 — 매칭 텍스트 강조 표시
- 검색 히스토리 — 최근 검색어 저장
- 노트 정렬 옵션 — 최신순·이름순 등
- 서버사이드 검색 — `json-server ?q=` 쿼리 활용
- 검색어 URL 파라미터 저장 — 새로고침 후 유지

---

## 용어 정의

| 용어 | 정의 |
|------|------|
| 검색어 (query) | 사용자가 SearchBar에 입력하는 텍스트 |
| 필터링 (filtering) | query로 `notes[]`를 줄이는 클라이언트 동작 |
| 검색 결과 (filteredNotes) | 필터링된 노트 배열. query가 비어있으면 전체 notes와 동일 |
| SearchBar | 검색 입력 UI 컴포넌트 |
| filterNotes | 필터 로직을 담은 순수 함수 (`src/utils/filterNotes.ts`) |
