interface NoteTagProps {
  label: string;
}

export function NoteTag({ label }: NoteTagProps) {
  return (
    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
      {label}
    </span>
  );
}
