export default function JsonCode({ code }: { code: string }) {
  if (!code) return null;

  return (
    <pre>
      <code>{code}</code>
    </pre>
  );
}
