import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export function Navbar({ onOpenAdmin }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#servicos', label: 'Serviços' },
    { href: '#portfolio', label: 'Portfólio' },
    { href: '#agendamento', label: 'Agendamento' },
    { href: '#blog', label: 'Blog' },
    { href: '#contato', label: 'Contato' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#inicio"
          className="font-display text-xl font-bold tracking-tight text-[#0B3D91] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D91]"
        >
          lh7 agência
        </a>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#0B3D91] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#agendamento"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
          >
            Agendar Diagnóstico
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0B3D91]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#agendamento"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963]"
          >
            Agendar Diagnóstico
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenAdmin();
            }}
            className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-slate-500 hover:text-[#0B3D91]"
          >
            Painel Administrativo
          </button>
        </div>
      )}
    </header>
  );
}
