import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const STATUS_BADGE = {
    'rascunho': { label: 'Rascunho', cls: 'badge-warning' },
    'publicado': { label: 'Publicado', cls: 'badge-success' },
    'arquivado': { label: 'Arquivado', cls: 'badge-danger' },
};

export default function PostList() {
    const { posts } = useData();

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Posts</h1>
                    <p className="page-subtitle">Gerencie suas publicações</p>
                </div>
                <Link to="/admin/posts/new" className="btn btn-primary">
                    ＋ Novo Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">📝</div>
                    <p>Nenhum post criado ainda.</p>
                    <Link to="/admin/posts/new" className="btn btn-primary">Criar Primeiro Post</Link>
                </div>
            ) : (
                <div className="card-grid">
                    {posts.map(post => {
                        const st = STATUS_BADGE[post.status] || STATUS_BADGE['rascunho'];
                        return (
                            <Link to={`/admin/posts/${post.id}`} key={post.id} className="card" style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <h3 className="card-title" style={{ marginBottom: 0 }}>{post.title}</h3>
                                    <span className={`badge ${st.cls}`}>{st.label}</span>
                                </div>
                                <div className="card-body">
                                    {post.content.length > 140 ? post.content.slice(0, 140) + '…' : post.content}
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                    <div className="card-tags">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="badge badge-primary">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="card-meta">
                                    <span>{post.category || 'geral'}</span>
                                    <span>•</span>
                                    <span>{formatDate(post.created_at || post.createdAt)}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
