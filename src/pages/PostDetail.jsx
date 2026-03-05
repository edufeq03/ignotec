import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const STATUS_BADGE = {
    'rascunho': { label: 'Rascunho', cls: 'badge-warning' },
    'publicado': { label: 'Publicado', cls: 'badge-success' },
    'arquivado': { label: 'Arquivado', cls: 'badge-danger' },
};

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getPost, updatePost, deletePost } = useData();

    const post = getPost(id);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [tagsInput, setTagsInput] = useState(post?.tags?.join(', ') || '');
    const [category, setCategory] = useState(post?.category || 'desenvolvimento');
    const [status, setStatus] = useState(post?.status || 'rascunho');

    if (!post) {
        return (
            <div className="empty-state fade-in">
                <div className="icon">🔍</div>
                <p>Post não encontrado.</p>
                <Link to="/admin/posts" className="btn btn-primary">Voltar para Posts</Link>
            </div>
        );
    }

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const st = STATUS_BADGE[post.status] || STATUS_BADGE['rascunho'];

    const handleSave = async (e) => {
        e.preventDefault();
        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
        await updatePost(id, { title: title.trim(), content: content.trim(), tags, category, status });
        setEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir este post?')) {
            await deletePost(id);
            navigate('/admin/posts');
        }
    };

    const handleStatusChange = async (newStatus) => {
        await updatePost(id, { status: newStatus });
    };

    if (editing) {
        return (
            <div className="fade-in detail-container">
                <div className="page-header">
                    <h1 className="page-title">Editar Post</h1>
                </div>
                <div className="form-card">
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label className="form-label">Título</label>
                            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Conteúdo</label>
                            <textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} rows={8} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoria</label>
                            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="desenvolvimento">Desenvolvimento</option>
                                <option value="design">Design</option>
                                <option value="devops">DevOps</option>
                                <option value="ia">Inteligência Artificial</option>
                                <option value="mobile">Mobile</option>
                                <option value="geral">Geral</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <input className="form-input" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="rascunho">📝 Rascunho</option>
                                <option value="publicado">✅ Publicado</option>
                                <option value="arquivado">📦 Arquivado</option>
                            </select>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Salvar</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in detail-container">
            <Link to="/admin/posts" className="btn btn-secondary btn-sm" style={{ marginBottom: 20 }}>
                ← Voltar
            </Link>

            <div className="detail-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <h1 className="detail-title" style={{ marginBottom: 0 }}>{post.title}</h1>
                    <span className={`badge ${st.cls}`}>{st.label}</span>
                </div>
                <div className="detail-meta" style={{ marginTop: 12 }}>
                    <span>{post.category || 'geral'}</span>
                    <span>•</span>
                    <span>{formatDate(post.created_at || post.createdAt)}</span>
                    {(post.updated_at || post.updatedAt) !== (post.created_at || post.createdAt) && (
                        <>
                            <span>•</span>
                            <span>Editado {formatDate(post.updated_at || post.updatedAt)}</span>
                        </>
                    )}
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div className="card-tags" style={{ marginTop: 16 }}>
                        {post.tags.map(tag => (
                            <span key={tag} className="badge badge-primary">{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="detail-content">{post.content}</div>

            <div className="detail-actions">
                <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                    ✏️ Editar
                </button>
                {post.status === 'rascunho' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange('publicado')}>
                        ✅ Publicar
                    </button>
                )}
                {post.status === 'publicado' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange('arquivado')}>
                        📦 Arquivar
                    </button>
                )}
                {post.status === 'arquivado' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange('publicado')}>
                        ✅ Republicar
                    </button>
                )}
                <button className="btn btn-danger" onClick={handleDelete}>
                    🗑️ Excluir
                </button>
            </div>
        </div>
    );
}
