import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const STATUS_MAP = {
    'planejamento': { label: 'Planejamento', badge: 'badge-info' },
    'em-andamento': { label: 'Em Andamento', badge: 'badge-warning' },
    'concluido': { label: 'Concluído', badge: 'badge-success' },
    'pausado': { label: 'Pausado', badge: 'badge-danger' },
};

export default function ProjectList() {
    const { projects } = useData();

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Projetos</h1>
                    <p className="page-subtitle">Gerencie seus projetos de tecnologia</p>
                </div>
                <Link to="/admin/projects/new" className="btn btn-primary">
                    ＋ Novo Projeto
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">🚀</div>
                    <p>Nenhum projeto criado ainda.</p>
                    <Link to="/admin/projects/new" className="btn btn-primary">Criar Primeiro Projeto</Link>
                </div>
            ) : (
                <div className="card-grid">
                    {projects.map(project => {
                        const status = STATUS_MAP[project.status] || STATUS_MAP['planejamento'];
                        return (
                            <Link to={`/admin/projects/${project.id}`} key={project.id} className="card" style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <h3 className="card-title" style={{ marginBottom: 0 }}>{project.title}</h3>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <span className={`badge ${project.visible ? 'badge-success' : 'badge-danger'}`}>
                                            {project.visible ? '👁 Público' : '🔒 Oculto'}
                                        </span>
                                        <span className={`badge ${status.badge}`}>{status.label}</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {project.description.length > 120
                                        ? project.description.slice(0, 120) + '…'
                                        : project.description}
                                </div>
                                {project.techs && project.techs.length > 0 && (
                                    <div className="card-tags">
                                        {project.techs.map(tech => (
                                            <span key={tech} className="badge badge-primary">{tech}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="card-meta">
                                    <span>{project.category || 'Web'}</span>
                                    <span>•</span>
                                    <span>{formatDate(project.created_at || project.createdAt)}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
