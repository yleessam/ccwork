# Do / Don't

> PostToolUse 훅이 이 파일의 규칙을 기준으로 .tsx/.css 편집 결과를 검사한다.

---

## 1. 섹션 경계선 (No-Line Rule)

```tsx
// ❌ Don't — 1px 선으로 영역 구분
<div className="w-72 border-r border-border bg-muted">
  {sidebar}
</div>

// ✅ Do — 배경색 차이로 자연스러운 구분
<div className="w-72 bg-surface-container-low">
  {sidebar}
</div>
<div className="flex-1 bg-surface">
  {main}
</div>
```

**훅 감지 패턴:** `border-r`, `border-l`, `divide-y`, `divide-x`

---

## 2. 텍스트 색상

```tsx
// ❌ Don't — 순수 검정
<p className="text-black">내용</p>
<h2 className="text-[#000000]">제목</h2>

// ✅ Do — on-surface 토큰
<p className="text-on-surface-variant">내용</p>   {/* 본문 */}
<h2 className="text-on-surface">제목</h2>          {/* 강조 */}
```

**훅 감지 패턴:** `text-black`, `text-\[#000`

---

## 3. 그림자 (Tonal Layering)

```tsx
// ❌ Don't — 범용 그림자
<div className="shadow-md bg-card rounded-xl">...</div>

// ✅ Do — surface 계층 중첩 (일반 카드)
<div className="bg-surface-container-lowest rounded-xl">...</div>

// ✅ Do — ambient shadow (floating 요소에만)
<div className="shadow-[0_12px_40px_rgba(43,52,55,0.06)] bg-surface-container-lowest rounded-xl">
  {/* 모달, 팝오버 전용 */}
</div>
```

**훅 감지 패턴:** `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`

---

## 4. 리스트 구분

```tsx
// ❌ Don't — 구분선
<ul className="divide-y divide-border">
  <li>...</li>
</ul>
<hr className="border-border" />

// ✅ Do — 간격으로만 분리
<ul className="space-y-4">
  <li>...</li>
</ul>
```

**훅 감지 패턴:** `divide-y`, `divide-x`, `<hr`

---

## 5. Primary 버튼

```tsx
// ❌ Don't — 단색 배경
<button className="bg-foreground text-card px-4 py-2 rounded-xl">저장</button>

// ✅ Do — tertiary 그라디언트
<button className="bg-gradient-to-r from-tertiary to-tertiary-container text-on-tertiary px-4 py-2 rounded-md">
  저장
</button>
```

---

## 6. 아이콘 사용

```tsx
// ❌ Don't — 기능 불명확한 아이콘만 단독 사용
<button><EditIcon /></button>

// ✅ Do — 텍스트 레이블 우선, 아이콘은 즉각적 기능 명확성이 있을 때만
<button>편집</button>
<button className="flex items-center gap-1"><PlusIcon /> 새 노트</button>
```
