# 태그 기능 정의서 (확정)

> 원본: spec-original.md | 확정일: 2026-05-29

---

## 기능 개요

노트에 태그를 추가, 관리할 수 있다.

---

## 데이터 구조

### Note 타입 변경

```ts
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];   // 추가. 기본값 []
}
```

- 태그는 문자열 배열로 저장
- 신규 노트 생성 시 `tags: []`로 초기화
- 기존 노트(tags 필드 없음)는 읽을 때 `tags ?? []`로 방어

---

## UI 패턴

### 입력 방식 — Chip + Enter

`NoteEditor` 내 content 영역 아래에 태그 입력 영역을 배치한다.

```
제목 입력
─────────────────────────────
본문 입력




─────────────────────────────
[ react ×] [ typescript ×] [ 태그 입력... ]

                          [ 저장 ]
```

- 입력창에 태그명 입력 → **Enter** 또는 **,** 로 chip 추가
- 추가된 태그는 chip으로 즉시 표시
- chip의 **×** 버튼은 **호버 시에만 노출**

### 태그 목록 확인

- 노트 상세(NoteEditor) 화면에서 chip으로 확인 (스펙 요건)
- NoteList/NoteItem의 태그 표시는 이번 스펙 범위 밖

---

## 동작 규칙

### 저장 시점

태그 변경(추가/삭제)은 로컬 상태로만 관리하다가, **저장 버튼 클릭 시 title/content와 함께 PATCH로 일괄 저장**한다.

### 중복 처리

- 대소문자 구분 없이 비교 (`"React"` = `"react"`)
- 중복 입력 시 **조용히 무시** (에러 메시지 없음, 입력창만 비움)

### 입력값 정제

- 앞뒤 공백 trim 후 추가
- 빈 문자열(trim 후 길이 0)은 무시

### 글자 수 / 개수 제한

- 태그 1개 최대 **15자** (초과 입력 시 무시)
- 태그 개수 제한 없음

---

## 엣지 케이스

| 상황 | 처리 |
|------|------|
| 기존 노트에 tags 필드 없음 | `tags ?? []` 방어 처리 |
| 빈 문자열 입력 후 Enter | 무시 |
| 공백만 입력 후 Enter | trim 후 빈 문자열이므로 무시 |
| 대소문자만 다른 중복 | 중복으로 판단, 무시 |
| 16자 이상 입력 | 입력 자체를 15자에서 차단 |
| 저장 전 노트 이동/취소 | 변경된 tags는 저장되지 않음 (title/content와 동일 정책) |

---

## 구현 범위 (이번 스펙)

- [x] `Note` 타입에 `tags: string[]` 추가
- [x] `createNote` / `updateNote` API에 tags 포함
- [x] `NoteEditor`에 태그 chip 입력 UI 추가
- [ ] NoteItem/NoteList 태그 표시 — 향후 스펙
- [ ] 태그 기반 필터/검색 — 향후 스펙
