import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const POST_STATUSES = [
    { value: 'rascunho', label: '📝 Rascunho' },
    { value: 'publicado', label: '✅ Publicado' },
    { value: 'arquivado', label: '📦 Arquivado' },
];

export default function PostCreate() {
    const { createPost } = useData();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [category, setCategory] = useState('desenvolvimento');
    const [status, setStatus] = useState('rascunho');
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    const handleCover = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim() || !content.trim()) {
            setError('Título e conteúdo são obrigatórios.');
            return;
        }
        setLoading(true);
        try {
            const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            const post = await createPost({ title: title.trim(), content: content.trim(), tags, category, status }, coverFile);
            navigate(`/admin/posts/${post.id}`);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Novo Post</h1>
                    <p className="page-subtitle">Publique algo incrível</p>
                </div>
            </div>

            <div className="form-card">
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Cover image */}
                    <div className="form-group">
                        <label className="form-label">Imagem de Capa</label>
                        <div onClick={() => fileRef.current?.click()}
                            style={{
                                border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 8,
                                padding: coverPreview ? 0 : 30, textAlign: 'center', cursor: 'pointer',
                                overflow: 'hidden', background: 'rgba(255,255,255,0.02)',
                                aspectRatio: coverPreview ? '16/9' : 'auto',
                            }}>
                            {coverPreview ? (
                                <img src={coverPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            ) : (
                                <>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Clique para selecionar uma imagem de capa</div>
                                </>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCover} />
                        {coverPreview && (
                            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}
                                onClick={() => { setCoverFile(null); setCoverPreview(null); }}>
                                Remover imagem
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="post-title">Título</label>
                        <input id="post-title" type="text" className="form-input" placeholder="Título do post"
                            value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="post-content">Conteúdo</label>
                        <textarea id="post-content" className="form-textarea" placeholder="Escreva o conteúdo do seu post..."
                            value={content} onChange={e => setContent(e.target.value)} rows={8} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="post-category">Categoria</label>
                        <select id="post-category" className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="desenvolvimento">Desenvolvimento</option>
                            <option value="design">Design</option>
                            <option value="devops">DevOps</option>
                            <option value="ia">Inteligência Artificial</option>
                            <option value="mobile">Mobile</option>
                            <option value="geral">Geral</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="post-tags">Tags (separadas por vírgula)</label>
                        <input id="post-tags" type="text" className="form-input" placeholder="react, javascript, tutorial"
                            value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="post-status">Status</label>
                        <select id="post-status" className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                            {POST_STATUSES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <><span className="spinner"></span> Salvando...</> : status === 'publicado' ? 'Publicar Post' : 'Salvar Rascunho'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/posts')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
