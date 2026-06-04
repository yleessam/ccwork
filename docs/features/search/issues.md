# 검색 기능 이슈 목록

> 기반: prd.md | 작성일: 2026-06-04

---

## 이슈 1 — filterNotes 순수 함수 + SearchBar UI + 기본 검색 동작

검색창에 입력하면 목록이 필터링되는 동작을 완성한다.

**변경 파일:**
- `src/utils/filterNotes.ts` 신규
- `src/components/SearchBar.tsx` 신규
- `src/components/NoteList.tsx` — `useNotes()` 직접 접근 → `notes` prop 수신
- `src/App.tsx` — `query` state 추가, sidebar에 SearchBar + NoteList

**의존성:** 없음 (첫 번째 이슈)

## Acceptance Criteria
- [ ] Given 노트가 3개 있고 검색창이 비어있을 때, When 아무것도 입력하지 않으면, Then 3개 노트가 모두 표시된다
- [ ] Given 노트가 "React 기초", "TypeScript 핸드북", "회의록"이 있을 때, When "react"를 입력하면, Then "React 기초"만 표시된다 (대소문자 무관)
- [ ] Given 검색어가 입력된 상태에서, When 검색어를 모두 지우면, Then 전체 노트 목록이 복귀된다
- [ ] Given 어떤 노트에도 매칭되지 않는 키워드를 입력했을 때, When 결과가 없으면, Then "검색 결과가 없습니다" 메시지가 표시된다
- [ ] Given 노트 내용에만 키워드가 있을 때, When 해당 키워드를 검색하면, Then 그 노트가 표시된다

---

## 이슈 2 — filterNotes 단위 테스트

`filterNotes` 순수 함수에 대한 단위 테스트를 작성한다.

**변경 파일:**
- `src/utils/filterNotes.test.ts` 신규

**의존성:** 이슈 1 완료 후 진행

## Acceptance Criteria
- [ ] Given query가 빈 문자열일 때, When filterNotes를 호출하면, Then 전체 notes를 반환한다
- [ ] Given query가 공백만 있을 때, When filterNotes를 호출하면, Then 전체 notes를 반환한다
- [ ] Given query "react"일 때, When 제목에 "React"가 있는 노트가 있으면, Then 그 노트를 반환한다 (대소문자 무관)
- [ ] Given query "메모"일 때, When 내용에 "메모"가 있는 노트가 있으면, Then 그 노트를 반환한다
- [ ] Given 매칭되는 노트가 없을 때, When filterNotes를 호출하면, Then 빈 배열을 반환한다
