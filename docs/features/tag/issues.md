# 태그 기능 이슈 분해

> 기준: docs/features/tag/prd.md | 원칙: 수직 슬라이싱 (레이어가 아닌 사용자 가치 단위)  
> 아키텍처: 안 B — `useTagEditor` 훅 + Controlled `TagChipList`

---

## Issue 1. 기존 노트의 태그 chip 표시

**설명**

노트에 저장된 `tags` 배열을 NoteEditor에서 chip으로 읽어 표시한다. 이 이슈는 태그 쓰기 기능 없이 읽기(표시)만 완성하는 첫 번째 수직 슬라이스다. db.json에 tags 필드를 직접 심어 검증한다.

변경 범위:
- `note.ts` — `tags: string[]` 필드 추가
- `NoteEditor.tsx` — `TagChipList` 배치 (read-only, onRemove 없음)
- `NoteTag.tsx` — chip UI 렌더링 (× 버튼 없음)
- `TagChipList.tsx` — 신규, controlled 컴포넌트

**완료 조건 (AC)**

- `tags: ["react", "typescript"]`가 저장된 노트를 열면 chip 2개가 표시된다
- `tags: []`인 노트를 열면 chip 영역이 비어 있다
- `tags` 필드가 없는 구(舊) 노트를 열어도 오류 없이 chip 영역이 비어 있다 (`tags ?? []`)
- chip은 클릭·호버해도 아무 동작 없다 (이번 이슈 범위 밖)

**Given-When-Then**

```
Given db.json에 tags: ["react", "typescript"]가 포함된 노트가 있다
When  해당 노트를 클릭해 NoteEditor를 연다
Then  "react" chip과 "typescript" chip이 content 아래에 표시된다

Given db.json에 tags: []인 노트가 있다
When  해당 노트를 클릭해 NoteEditor를 연다
Then  chip 영역이 비어 있다

Given db.json에 tags 필드가 없는 구 노트가 있다
When  해당 노트를 클릭해 NoteEditor를 연다
Then  오류 없이 chip 영역이 빈 상태로 표시된다
```

---

## Issue 2. 태그 추가 — Enter/쉼표 입력 + 저장

**설명**

`useTagEditor` 훅과 `TagInput` 컴포넌트를 도입해 태그 추가 흐름을 완성한다. 입력 규칙(중복·15자·빈값·trim)을 훅 내부에서 처리하고, 저장 버튼 클릭 시 `tags`를 `title`·`content`와 함께 PATCH로 전송한다.

변경 범위:
- `useTagEditor.ts` — 신규 훅 (`tags` state, `addTag`: 중복·15자·trim 처리)
- `TagInput.tsx` — 신규, Enter·쉼표 감지 후 `onAdd` 호출
- `TagChipList.tsx` — `TagInput` 포함, `onAdd` prop 추가
- `NoteEditor.tsx` — `useTagEditor` 훅 연결, `handleSave`에 `tags` 포함
- `NotesContext.tsx` — `addNote`·`editNote` 시그니처에 `tags` 포함 및 전달

**완료 조건 (AC)**

- 태그 입력창에 텍스트 입력 후 Enter 또는 `,` 입력 시 chip이 즉시 추가된다
- 앞뒤 공백은 trim된 후 추가된다
- 빈 문자열(공백만 포함)은 chip이 추가되지 않고 입력창만 비워진다
- 16자 이상은 입력 자체가 15자에서 차단된다 (`maxLength={15}`)
- 대소문자만 다른 중복 태그는 chip이 추가되지 않고 입력창만 비워진다 (에러 메시지 없음)
- 저장 버튼 클릭 시 서버 PATCH body에 `tags` 배열이 포함된다
- 취소 버튼 클릭 시 추가된 태그가 저장되지 않고 원래 태그 목록으로 돌아간다
- 신규 노트 생성(`isCreating`) 시에도 태그를 추가해 저장할 수 있다

**Given-When-Then**

```
Given NoteEditor가 열려 있다 (기존 노트 또는 신규)
When  태그 입력창에 "react" 입력 후 Enter를 누른다
Then  "react" chip이 즉시 표시되고 입력창이 비워진다

Given "react" chip이 이미 있다
When  태그 입력창에 "typescript" 입력 후 Enter를 누른다
Then  "react" chip은 유지되고 "typescript" chip이 추가된다

Given "react" chip이 이미 있다
When  태그 입력창에 "React" 입력 후 Enter를 누른다
Then  chip이 추가되지 않고 입력창만 비워진다

Given NoteEditor가 열려 있다
When  태그 입력창에 "react" 입력 후 `,`를 누른다
Then  "react" chip이 즉시 표시되고 입력창이 비워진다

Given 태그 입력창에 "   " (공백만) 입력한다
When  Enter를 누른다
Then  chip이 추가되지 않고 입력창만 비워진다

Given 태그 입력창에 16자 문자열을 붙여넣기하거나 입력한다
When  16번째 이후 문자를 입력한다
Then  입력이 15자에서 차단되어 입력창에 15자까지만 표시된다

Given 새 노트 만들기를 선택해 isCreating 상태의 NoteEditor가 열려 있다
When  태그 입력창에 "react" 입력 후 Enter를 누르고 저장 버튼을 클릭한다
Then  생성된 노트의 tags 배열에 "react"가 포함된다

Given 태그 "newTag"를 추가한 상태다
When  저장 버튼을 클릭한다
Then  PATCH 요청의 body에 tags 배열에 "newTag"가 포함된다

Given 태그 "newTag"를 추가한 상태다
When  취소 버튼을 클릭한다
Then  "newTag"는 서버에 저장되지 않고 태그 목록이 원래 상태로 돌아간다
```

---

## Issue 3. 태그 삭제 — chip × 버튼 + 저장

**설명**

chip 위에 마우스를 올릴 때만 × 버튼을 노출하고, 클릭 시 해당 태그를 로컬 상태에서 제거한다. 삭제도 저장 버튼 클릭 시에만 서버에 반영된다.

변경 범위:
- `useTagEditor.ts` — `removeTag` 추가
- `NoteTag.tsx` — `onRemove` prop 추가, 호버 시 × 버튼 토글 (`group` / `group-hover`)
- `TagChipList.tsx` — `onRemove` prop 추가, `NoteTag`에 전달

**완료 조건 (AC)**

- chip에 마우스를 올리면 × 버튼이 나타난다
- 마우스를 떼면 × 버튼이 사라진다
- × 버튼 클릭 시 해당 chip이 목록에서 즉시 제거된다
- 저장 버튼 클릭 시 삭제된 태그가 PATCH body에서 제외된다
- 취소 버튼 클릭 시 삭제한 태그가 복원되고 서버에는 반영되지 않는다

**Given-When-Then**

```
Given "react" chip이 표시된 NoteEditor가 열려 있다
When  "react" chip에 마우스를 올린다
Then  × 버튼이 나타난다

When  마우스를 chip 밖으로 이동한다
Then  × 버튼이 사라진다

Given "react" chip에 마우스를 올려 × 버튼이 보이는 상태다
When  × 버튼을 클릭한다
Then  "react" chip이 목록에서 즉시 제거된다

Given "react" chip을 × 버튼으로 제거한 상태다
When  저장 버튼을 클릭한다
Then  PATCH 요청 body의 tags 배열에 "react"가 포함되지 않는다

Given "react" chip을 × 버튼으로 제거한 상태다
When  취소 버튼을 클릭한다
Then  "react" chip이 복원되고 서버에는 변경이 반영되지 않는다

Given "react" chip 하나만 있는 NoteEditor가 열려 있다
When  "react" chip의 × 버튼을 클릭한다
Then  chip 영역이 비어 있는 상태로 전환된다
```

---

## 구현 순서

```
Issue 1 → Issue 2 → Issue 3
  (표시)    (추가)    (삭제)
```

Issue 1이 완료되면 TagChipList 컴포넌트와 타입 파이프라인이 갖춰져, Issue 2·3은 그 위에 useTagEditor 훅과 인터랙션만 추가하면 된다.
