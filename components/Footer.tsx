export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 py-6 text-xs text-white/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row md:px-8">
        <p>© {new Date().getFullYear()} MAGUILAFX. Todos os direitos reservados.</p>
        <p className="text-[11px]">
          Efeitos especiais e pirotécnicos para shows e eventos em Tocantins.
        </p>
      </div>
    </footer>
  );
}
