# Component Patterns

> 새 컴포넌트 추가 시 이 파일에 append. 스타일 작업 전 `/design` 스킬로 로드.

---

## Buttons

### Primary

```tsx
<button className="bg-gradient-to-r from-tertiary to-tertiary-container text-on-tertiary px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer">
  저장
</button>
```

### Secondary

```tsx
<button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-md text-sm font-semibold hover:bg-surface-container-highest transition-colors cursor-pointer">
  취소
</button>
```

### Ghost (Tertiary)

```tsx
<button className="text-tertiary px-4 py-2 rounded-md text-sm font-semibold hover:bg-tertiary/5 transition-colors cursor-pointer">
  더보기
</button>
```

---

## Cards & Lists

```tsx
{/* 섹션(surface-container) 위에 카드(surface-container-lowest) — Tonal Layering */}
<div className="bg-surface-container rounded-xl p-4">
  <div className="space-y-4">
    {/* 아이템 간 간격만 사용 — 구분선 금지 */}
    <div className="bg-surface-container-lowest rounded-lg p-4 hover:bg-surface-container-low transition-colors cursor-pointer">
      {/* 카드 내용 */}
    </div>
  </div>
</div>
```

**Selected 상태:** `bg-surface-container-highest`

---

## Input Fields

```tsx
<div className="flex flex-col gap-1">
  <label className="text-xs font-semibold tracking-[0.05em] uppercase text-on-surface-variant">
    제목
  </label>
  <input
    className="bg-surface-container-lowest border border-outline-variant/15 rounded-md px-3 py-2 text-on-surface
               focus:outline-none focus:border focus:border-tertiary
               placeholder:text-on-surface-variant/50"
  />
</div>
```

**Textarea도 동일한 패턴 적용.**

---

## Knowledge Token (Tag Chip)

```tsx
{/* 기본 chip */}
<span className="inline-flex items-center bg-surface-container-highest text-on-surface-variant rounded-full px-3 py-0.5 text-xs font-semibold">
  react
</span>

{/* 삭제 가능한 chip (× 버튼 hover 시 노출) */}
<span className="group inline-flex items-center gap-1 bg-surface-container-highest text-on-surface-variant rounded-full px-3 py-0.5 text-xs font-semibold">
  react
  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant/70 hover:text-on-surface">
    ×
  </button>
</span>
```

---

## Section Labels (Metadata)

```tsx
<p className="text-xs font-semibold tracking-[0.05em] uppercase text-on-surface-variant">
  새 노트
</p>
```

---

## Floating Elements (Glassmorphism)

모달, 드롭다운, 팝오버에만 사용.

```tsx
<div className="bg-surface/80 backdrop-blur-[12px] rounded-xl shadow-[0_12px_40px_rgba(43,52,55,0.06),0_4px_16px_rgba(0,83,220,0.04)]">
  {/* 컨텐츠 */}
</div>
```

---

## Error / Validation

```tsx
<p className="text-xs text-destructive mt-1">
  제목을 입력해주세요
</p>
```
