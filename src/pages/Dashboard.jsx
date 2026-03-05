import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Dashboard() {
    const { user } = useAuth();
    const { posts, projects } = useData();

    const drafts = posts.filter(p => p.status === 'rascunho').length;
    const published = posts.filter(p => p.status === 'publicado').length;
    const visibleProjects = projects.filter(p => p.visible).length;

    const recentItems = [...posts.map(p => ({ ...p, _type: 'post' })), ...projects.map(p => ({ ...p, _type: 'project' }))]
        .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
        .slice(0, 8);

    const formatDate = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Olá, {user?.username || 'Admin'} 👋</h1>
                    <p className="page-subtitle">Aqui está o resumo da sua plataforma</p>
                </div>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{published}</div>
                    <div className="stat-label">Posts Publicados</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-value">{drafts}</div>
                    <div className="stat-label">Rascunhos</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🚀</div>
                    <div className="stat-value">{projects.length}</div>
                    <div className="stat-label">Projetos Total</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👁</div>
                    <div className="stat-value">{visibleProjects}</div>
                    <div className="stat-label">Projetos Públicos</div>
                </div>
            </div>

            <h2 className="section-title">📌 Atividade Recente</h2>

            {recentItems.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">📭</div>
                    <p>Nenhuma atividade ainda. Comece criando um post ou projeto!</p>
                    <div className="btn-group" style={{ justifyContent: 'center' }}>
                        <Link to="/admin/posts/new" className="btn btn-primary">Criar Post</Link>
                        <Link to="/admin/projects/new" className="btn btn-secondary">Criar Projeto</Link>
                    </div>
                </div>
            ) : (
                <div className="activity-list">
                    {recentItems.map(item => (
                        <Link
                            key={item.id}
                            to={item._type === 'post' ? `/admin/posts/${item.id}` : `/admin/projects/${item.id}`}
                            className="activity-item"
                        >
                            <div className="activity-dot" />
                            <div className="activity-text">
                                <strong>{item.title}</strong>
                                {' — '}
                                {item._type === 'post' ? 'Post' : 'Projeto'}
                            </div>
                            <div className="activity-time">{formatDate(item.created_at || item.createdAt)}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
