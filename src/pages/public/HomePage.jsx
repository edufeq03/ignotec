import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';

/* ====== Exact original SVG flame ====== */
const FLAME_NAV_SVG = `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M40 95 C20 95 8 78 8 62 C8 48 16 38 24 30 C22 42 28 48 32 44 C28 36 30 22 40 8 C42 18 38 28 44 32 C46 24 50 16 54 10 C62 24 60 40 54 48 C58 46 64 40 66 30 C72 42 72 55 68 66 C64 78 54 88 44 92 Z" fill="url(#ng1)"/>
  <path d="M40 80 C30 80 24 70 24 62 C24 55 28 50 32 46 C32 52 36 56 40 54 C44 56 48 52 48 46 C52 50 56 56 56 62 C56 70 50 80 40 80Z" fill="url(#nc1)" opacity="0.8"/>
  <defs>
    <linearGradient id="ng1" x1="40" y1="8" x2="40" y2="95" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFDD57"/>
      <stop offset="35%" stop-color="#F47B20"/>
      <stop offset="100%" stop-color="#E63A2E"/>
    </linearGradient>
    <linearGradient id="nc1" x1="40" y1="46" x2="40" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF5" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#F47B20" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
</svg>`;

const FLAME_HERO_SVG = `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M40 95 C20 95 8 78 8 62 C8 48 16 38 24 30 C22 42 28 48 32 44 C28 36 30 22 40 8 C42 18 38 28 44 32 C46 24 50 16 54 10 C62 24 60 40 54 48 C58 46 64 40 66 30 C72 42 72 55 68 66 C64 78 54 88 44 92 Z" fill="url(#hg1)"/>
  <path d="M40 80 C30 80 24 70 24 62 C24 55 28 50 32 46 C32 52 36 56 40 54 C44 56 48 52 48 46 C52 50 56 56 56 62 C56 70 50 80 40 80Z" fill="url(#hc1)" opacity="0.9"/>
  <circle cx="40" cy="90" r="3" fill="#F47B20" opacity="0.8"/>
  <line x1="40" y1="87" x2="40" y2="80" stroke="#F47B20" stroke-width="1" opacity="0.4"/>
  <line x1="24" y1="84" x2="56" y2="84" stroke="#F47B20" stroke-width="0.5" opacity="0.3"/>
  <circle cx="24" cy="84" r="1.5" fill="#E63A2E" opacity="0.5"/>
  <circle cx="56" cy="84" r="1.5" fill="#E63A2E" opacity="0.5"/>
  <defs>
    <linearGradient id="hg1" x1="40" y1="8" x2="40" y2="95" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFDD57"/>
      <stop offset="30%" stop-color="#F47B20"/>
      <stop offset="70%" stop-color="#E63A2E"/>
      <stop offset="100%" stop-color="#C0392B"/>
    </linearGradient>
    <linearGradient id="hc1" x1="40" y1="46" x2="40" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF5" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#F47B20" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
</svg>`;

const SERVICES = [
    { num: '01', icon: '🌐', title: 'Desenvolvimento Web', desc: 'Sites institucionais, landing pages e aplicações web complexas — responsivos, rápidos e otimizados para SEO e conversão.', techs: ['React', 'Next.js', 'HTML/CSS', 'TypeScript'] },
    { num: '02', icon: '📱', title: 'Aplicativos Mobile', desc: 'Apps Android e iOS nativos ou multiplataforma. Experiências fluidas, offline-first e preparadas para escala.', techs: ['React Native', 'Flutter', 'Expo'] },
    { num: '03', icon: '⚙️', title: 'APIs & Back-end', desc: 'Arquitetura de microsserviços, APIs RESTful e GraphQL. Banco de dados, autenticação e integrações robustas.', techs: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'] },
    { num: '04', icon: '☁️', title: 'Cloud & DevOps', desc: 'CI/CD, containerização com Docker, deploys em AWS/GCP e monitoramento de performance em produção.', techs: ['Docker', 'AWS', 'GitHub Actions'] },
    { num: '05', icon: '🔧', title: 'Infraestrutura & Servidores', desc: 'Configuração, manutenção e monitoramento de servidores. Escalabilidade, segurança, backup e otimização de performance em produção.', techs: ['Linux', 'Nginx/Apache', 'SSL/TLS', 'Backup'] },
    { num: '06', icon: '🤖', title: 'Integração com IA', desc: 'Chatbots, automações inteligentes e integrações com LLMs para turbinar produtos com inteligência artificial.', techs: ['OpenAI API', 'LangChain', 'Python'] },
];

const PROCESS = [
    { num: '01', title: 'Descoberta', desc: 'Entendo o negócio, os usuários e os objetivos. Alinhamos escopo, prazo e orçamento antes de escrever uma linha.', dotStyle: {} },
    { num: '02', title: 'Prototipagem', desc: 'Wireframes e protótipos validados com você antes do desenvolvimento. Sem surpresas no caminho.', dotStyle: { background: 'var(--orange)', boxShadow: '0 0 16px var(--orange)' } },
    { num: '03', title: 'Desenvolvimento', desc: 'Código limpo, testado e documentado. Entregas incrementais com visibilidade total do progresso.', dotStyle: { background: 'var(--yellow)', boxShadow: '0 0 16px var(--yellow)' } },
    { num: '04', title: 'Lançamento', desc: 'Deploy seguro, monitoramento ativo e suporte pós-lançamento. O projeto não termina na entrega.', dotStyle: { background: '#6cf', boxShadow: '0 0 16px #6cf3' } },
];

const ABOUT_VALUES = [
    { icon: '⚡', title: 'Energia', desc: 'Cada solução é entregue com intensidade e paixão pelo que faço.' },
    { icon: '🚀', title: 'Velocidade', desc: 'Agilidade na execução sem abrir mão da qualidade do código.' },
    { icon: '🏗️', title: 'Construção', desc: 'Tecnologia sólida, feita para durar, escalar e evoluir.' },
    { icon: '🔮', title: 'Evolução', desc: 'Inovação constante — sempre um passo à frente do mercado.' },
];

const TECH_TAGS = ['React', 'React Native', 'Node.js', 'Python', 'Flutter', 'Docker', 'PostgreSQL', 'AWS'];

export { FLAME_NAV_SVG };

export default function HomePage() {
    const { getVisibleProjects } = useData();
    const { hash } = useLocation();
    const visibleProjects = getVisibleProjects();

    useEffect(() => {
        if (hash) {
            const el = document.querySelector(hash);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [hash]);

    // Reveal on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.15 }
        );
        document.querySelectorAll('.pub-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [visibleProjects.length]);

    const categoryEmojis = { 'saas': '📊', 'mobile': '📱', 'web': '🌐', 'api': '⚙️', 'ia': '🤖' };

    return (
        <>
            {/* ====== HERO ====== */}
            <section className="pub-hero" id="hero">
                <div className="pub-hero-glow" />
                <div className="pub-hero-glow2" />
                <div className="pub-hero-inner">
                    <div>
                        <div className="pub-hero-tag">Disponível para novos projetos</div>
                        <h1 className="pub-hero-title">
                            <span className="outline">DESIGN.</span><br />
                            <span className="fire">CODE.</span><br />
                            IMPACT.
                        </h1>
                        <p className="pub-hero-desc">
                            Desenvolvimento web e mobile com foco em performance, experiência do usuário e resultados reais. Do conceito ao produto final — com tecnologia que escala.
                        </p>
                        <div className="pub-hero-btns">
                            <a href="#portfolio" className="pub-btn-primary">Ver Projetos</a>
                            <a href="https://wa.me/5519996737713?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20Ignotec." target="_blank" rel="noopener" className="pub-btn-outline">
                                Iniciar Conversa
                            </a>
                        </div>

                        <div className="pub-hero-stats">
                            <div className="pub-stat-item">
                                <div className="pub-stat-number">10<span>+</span></div>
                                <div className="pub-stat-label">Projetos entregues</div>
                            </div>
                            <div className="pub-stat-item">
                                <div className="pub-stat-number">3<span>+</span></div>
                                <div className="pub-stat-label">Anos de experiência</div>
                            </div>
                            <div className="pub-stat-item">
                                <div className="pub-stat-number">100<span>%</span></div>
                                <div className="pub-stat-label">Compromisso</div>
                            </div>
                        </div>
                    </div>
                    <div className="pub-hero-visual">
                        <div className="pub-hero-orbit" />
                        <div className="pub-hero-orbit2" />
                        <div className="pub-hero-flame-wrap">
                            <div className="pub-hero-flame-svg" dangerouslySetInnerHTML={{ __html: FLAME_HERO_SVG }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== ABOUT ====== */}
            <section className="pub-section pub-about" id="sobre">
                <div className="pub-about-grid pub-reveal">
                    <div>
                        <div className="pub-section-label">// sobre</div>
                        <h2 className="pub-about-heading">
                            TECNOLOGIA<br />QUE <em>ARDE</em><br />COM PROPÓSITO
                        </h2>
                        <p className="pub-about-body">
                            Sou desenvolvedor fullstack apaixonado por criar produtos digitais que fazem a diferença. Trabalho desde a arquitetura do back-end até a última pixel do front-end — sempre com performance e experiência do usuário como prioridade.
                        </p>
                        <p className="pub-about-body">
                            Fundei a <strong>IGNOTEC</strong> com a missão de levar soluções tecnológicas de alto nível para empresas e empreendedores que querem crescer de verdade — sem abrir mão da qualidade.
                        </p>
                        <div className="pub-about-tags">
                            {TECH_TAGS.map(t => <span key={t} className="pub-tag">{t}</span>)}
                        </div>
                    </div>
                    <div className="pub-about-values">
                        {ABOUT_VALUES.map(v => (
                            <div key={v.title} className="pub-value-item">
                                <div className="pub-value-icon">{v.icon}</div>
                                <div className="pub-value-title">{v.title}</div>
                                <div className="pub-value-desc">{v.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== SERVICES ====== */}
            <section className="pub-section pub-services" id="servicos">
                <div className="pub-services-heading pub-reveal">
                    <div>
                        <div className="pub-section-label">// serviços</div>
                        <h2>O QUE<br /><em>EU FAÇO</em></h2>
                    </div>
                    <p className="pub-services-heading-desc">
                        Do wireframe ao deploy — entrego soluções completas com foco em resultado.
                    </p>
                </div>
                <div className="pub-services-grid pub-reveal">
                    {SERVICES.map(s => (
                        <div key={s.num} className="pub-service-card">
                            <div className="pub-service-num">{s.num}</div>
                            <div className="pub-service-icon-wrap">{s.icon}</div>
                            <h3 className="pub-service-title">{s.title}</h3>
                            <p className="pub-service-desc">{s.desc}</p>
                            <div className="pub-service-techs">
                                {s.techs.map(t => <span key={t} className="pub-tech-pill">{t}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== PORTFOLIO ====== */}
            <section className="pub-section pub-portfolio" id="portfolio">
                <div className="pub-portfolio-header pub-reveal">
                    <div>
                        <div className="pub-section-label">// portfólio</div>
                        <h2>PROJETOS<br />EM <em>DESTAQUE</em></h2>
                    </div>
                    <p className="pub-portfolio-header-desc">
                        Trabalhos selecionados — cada projeto com desafio único e solução sob medida.
                    </p>
                </div>

                {visibleProjects.length === 0 ? (
                    <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '60px 0', fontSize: 15 }}>
                        Projetos em breve...
                    </p>
                ) : (
                    <div className="pub-projects-grid pub-reveal">
                        {visibleProjects.map(project => {
                            const CardWrapper = project.link ? 'a' : 'div';
                            const wrapperProps = project.link 
                                ? { href: project.link, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: 'none', color: 'inherit' } } 
                                : {};

                            return (
                                <CardWrapper key={project.id} className="pub-project-card" {...wrapperProps}>
                                    <div className="pub-project-thumb">
                                        {project.image ? (
                                            <img src={project.image} alt={project.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                                        ) : (
                                            <>
                                                <div className="pub-project-thumb-bg" />
                                                <span className="pub-project-thumb-icon">
                                                    {categoryEmojis[(project.category || '').toLowerCase()] || '💻'}
                                                </span>
                                            </>
                                        )}
                                        <span className="pub-project-type-badge">
                                            {project.category || 'Projeto'}
                                        </span>
                                    </div>
                                    <div className="pub-project-body">
                                        <div className="pub-project-title">{project.title}</div>
                                        <div className="pub-project-desc">
                                            {project.description.length > 150 ? project.description.slice(0, 150) + '…' : project.description}
                                        </div>
                                        {project.techs && project.techs.length > 0 && (
                                            <div className="pub-project-stack">
                                                {project.techs.map(t => (
                                                    <span key={t} className="pub-stack-item">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardWrapper>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ====== PROCESS ====== */}
            <section className="pub-section pub-process" id="processo">
                <div className="pub-process-inner pub-reveal">
                    <div className="pub-section-label">// como trabalho</div>
                    <h2 className="pub-process-heading">MEU <em>PROCESSO</em><br />DE TRABALHO</h2>
                    <div className="pub-process-steps">
                        {PROCESS.map(s => (
                            <div key={s.num} className="pub-process-step">
                                <div className="pub-step-number">{s.num}</div>
                                <div className="pub-step-dot" style={s.dotStyle} />
                                <h3 className="pub-step-title">{s.title}</h3>
                                <p className="pub-step-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== CONTACT ====== */}
            <section className="pub-section pub-contact" id="contato">
                <div className="pub-contact-inner pub-reveal">
                    <div>
                        <div className="pub-section-label">// contato</div>
                        <h2 className="pub-contact-heading">VAMOS<br /><em>CONSTRUIR</em><br />ALGO?</h2>
                        <p className="pub-contact-body">
                            Tem um projeto em mente ou quer conversar sobre uma oportunidade? Me manda uma mensagem — respondo rápido.
                        </p>
                        <ul className="pub-contact-info-list">
                            <li className="pub-contact-info-item">
                                <div className="pub-contact-info-icon">✉️</div>
                                <div>
                                    <div className="pub-contact-info-label">Email</div>
                                    <div className="pub-contact-info-value"><a href="mailto:contato@ignotec.dev">contato@ignotec.dev</a></div>
                                </div>
                            </li>
                            <li className="pub-contact-info-item">
                                <div className="pub-contact-info-icon">💬</div>
                                <div>
                                    <div className="pub-contact-info-label">WhatsApp</div>
                                    <div className="pub-contact-info-value"><a href="https://wa.me/5519996737713">+55 (19) 9 9673-7713</a></div>
                                </div>
                            </li>
                            <li className="pub-contact-info-item">
                                <div className="pub-contact-info-icon">🔗</div>
                                <div>
                                    <div className="pub-contact-info-label">LinkedIn</div>
                                    <div className="pub-contact-info-value"><a href="https://linkedin.com/in/edufeq03" target="_blank" rel="noopener">linkedin.com/in/edufeq03</a></div>
                                </div>
                            </li>
                            <li className="pub-contact-info-item">
                                <div className="pub-contact-info-icon">⌨️</div>
                                <div>
                                    <div className="pub-contact-info-label">GitHub</div>
                                    <div className="pub-contact-info-value"><a href="https://github.com/edufeq03" target="_blank" rel="noopener">github.com/edufeq03</a></div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <form className="pub-contact-form" onSubmit={e => e.preventDefault()}>
                        <div className="pub-form-row">
                            <div className="pub-form-group">
                                <label className="pub-form-label">Nome</label>
                                <input type="text" placeholder="Seu nome" required />
                            </div>
                            <div className="pub-form-group">
                                <label className="pub-form-label">Email</label>
                                <input type="email" placeholder="seu@email.com" required />
                            </div>
                        </div>
                        <div className="pub-form-group">
                            <label className="pub-form-label">Assunto</label>
                            <input type="text" placeholder="Sobre o que você quer conversar?" />
                        </div>
                        <div className="pub-form-group">
                            <label className="pub-form-label">Mensagem</label>
                            <textarea placeholder="Descreva seu projeto ou ideia..." required />
                        </div>
                        <button type="submit" className="pub-btn-form">Enviar Mensagem →</button>
                    </form>
                </div>
            </section>
        </>
    );
}
