import { Link, Outlet } from 'react-router-dom';
import '../public.css';

/* Exact original flame SVG */
const NavFlame = () => (
    <svg className="pub-nav-flame" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 95 C20 95 8 78 8 62 C8 48 16 38 24 30 C22 42 28 48 32 44 C28 36 30 22 40 8 C42 18 38 28 44 32 C46 24 50 16 54 10 C62 24 60 40 54 48 C58 46 64 40 66 30 C72 42 72 55 68 66 C64 78 54 88 44 92 Z" fill="url(#ng1)" />
        <path d="M40 80 C30 80 24 70 24 62 C24 55 28 50 32 46 C32 52 36 56 40 54 C44 56 48 52 48 46 C52 50 56 56 56 62 C56 70 50 80 40 80Z" fill="url(#nc1)" opacity="0.8" />
        <defs>
            <linearGradient id="ng1" x1="40" y1="8" x2="40" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFDD57" />
                <stop offset="35%" stopColor="#F47B20" />
                <stop offset="100%" stopColor="#E63A2E" />
            </linearGradient>
            <linearGradient id="nc1" x1="40" y1="46" x2="40" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F47B20" stopOpacity="0.2" />
            </linearGradient>
        </defs>
    </svg>
);

const FooterFlame = () => (
    <svg className="pub-footer-flame" viewBox="0 0 80 100" fill="none">
        <path d="M40 95 C20 95 8 78 8 62 C8 48 16 38 24 30 C22 42 28 48 32 44 C28 36 30 22 40 8 C42 18 38 28 44 32 C46 24 50 16 54 10 C62 24 60 40 54 48 C58 46 64 40 66 30 C72 42 72 55 68 66 C64 78 54 88 44 92 Z" fill="url(#fg1)" />
        <defs>
            <linearGradient id="fg1" x1="40" y1="8" x2="40" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFDD57" />
                <stop offset="40%" stopColor="#F47B20" />
                <stop offset="100%" stopColor="#E63A2E" />
            </linearGradient>
        </defs>
    </svg>
);

export default function PublicLayout() {
    const navLinks = [
        { label: 'Sobre', href: '/#sobre' },
        { label: 'Serviços', href: '/#servicos' },
        { label: 'Portfólio', href: '/#portfolio' },
        { label: 'Processo', href: '/#processo' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contato', href: '/#contato', cta: true },
    ];

    return (
        <div className="public-site">
            <nav className="pub-navbar">
                <Link to="/" className="pub-navbar-logo">
                    <NavFlame />
                    <span className="pub-navbar-wordmark">IGN<span>O</span>TEC</span>
                </Link>

                <ul className="pub-navbar-links">
                    {navLinks.map(link => (
                        <li key={link.label}>
                            {link.href.startsWith('/#') ? (
                                <a href={link.href} className={link.cta ? 'pub-navbar-cta' : ''}>
                                    {link.label}
                                </a>
                            ) : (
                                <Link to={link.href} className={link.cta ? 'pub-navbar-cta' : ''}>
                                    {link.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                <button className="pub-mobile-toggle">☰</button>
            </nav>

            <Outlet />

            <footer className="pub-footer">
                <Link to="/" className="pub-footer-logo">
                    <FooterFlame />
                    <span className="pub-footer-wordmark">IGN<span>O</span>TEC</span>
                </Link>
                <div className="pub-footer-slogan">Spark. Build. <em>Evolve.</em></div>
                <p className="pub-footer-copy">© {new Date().getFullYear()} IGNOTEC — Todos os direitos reservados</p>
            </footer>
        </div>
    );
}
