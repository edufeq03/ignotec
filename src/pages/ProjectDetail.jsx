import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const STATUS_MAP = {
    'planejamento': { label: 'Planejamento', badge: 'badge-info' },
    'em-andamento': { label: 'Em Andamento', badge: 'badge-warning' },
    'concluido': { label: 'Concluído', badge: 'badge-success' },
    'pausado': { label: 'Pausado', badge: 'badge-danger' },
};

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProject, updateProject, deleteProject } = useData();

    const project = getProject(id);
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(project?.title || '');
    const [description, setDescription] = useState(project?.description || '');
    const [status, setStatus] = useState(project?.status || 'planejamento');
    const [techsInput, setTechsInput] = useState(project?.techs?.join(', ') || '');
    const [category, setCategory] = useState(project?.category || '');
    const [link, setLink] = useState(project?.link || '');
    const [visible, setVisible] = useState(project?.visible ?? false);
    const [loading, setLoading] = useState(false);

    // Image
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(project?.image || null);
    const fileRef = useRef(null);

    // Internal fields
    const [publicoAlvo, setPublicoAlvo] = useState(project?.publico_alvo || '');
    const [dinamica, setDinamica] = useState(project?.dinamica || '');
    const [motivacoes, setMotivacoes] = useState(project?.motivacoes || '');
    const [notas, setNotas] = useState(project?.notas || '');
    const [cliente, setCliente] = useState(project?.cliente || '');
    const [prazo, setPrazo] = useState(project?.prazo || '');
    const [showInternal, setShowInternal] = useState(false);

    if (!project) {
        return (
            <div className="empty-state fade-in">
                <div className="icon">🔍</div>
                <p>Projeto não encontrado.</p>
                <Link to="/admin/projects" className="btn btn-primary">Voltar para Projetos</Link>
            </div>
        );
    }

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const statusInfo = STATUS_MAP[project.status] || STATUS_MAP['planejamento'];

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const techs = techsInput.split(',').map(t => t.trim()).filter(Boolean);
            await updateProject(id, {
                title: title.trim(), description: description.trim(),
                status, techs, category: category.trim(), link, visible,
                publico_alvo: publicoAlvo, dinamica, motivacoes, notas, cliente, prazo,
            }, imageFile);
            setEditing(false);
        } catch { /* silently handle */ }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
            await deleteProject(id);
            navigate('/admin/projects');
        }
    };

    const toggleVisibility = async () => {
        await updateProject(id, { visible: !project.visible });
    };

    if (editing) {
        return (
            <div className="fade-in detail-container">
                <div className="page-header"><h1 className="page-title">Editar Projeto</h1></div>
                <div className="form-card">
                    <form onSubmit={handleSave}>
                        {/* Image */}
                        <div className="form-group">
                            <label className="form-label">Imagem</label>
                            <div onClick={() => fileRef.current?.click()}
                                style={{
                                    border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 8,
                                    padding: imagePreview ? 0 : 30, textAlign: 'center', cursor: 'pointer',
                                    overflow: 'hidden', background: 'rgba(255,255,255,0.02)',
                                    aspectRatio: imagePreview ? '16/9' : 'auto',
                                }}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                ) : (
                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>📷 Clique para selecionar</div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nome do Projeto</label>
                            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Descrição</label>
                            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} rows={6} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoria</label>
                            <input className="form-input" value={category} onChange={e => setCategory(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Link</label>
                            <input className="form-input" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="planejamento">📋 Planejamento</option>
                                <option value="em-andamento">⚡ Em Andamento</option>
                                <option value="concluido">✅ Concluído</option>
                                <option value="pausado">⏸️ Pausado</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tecnologias</label>
                            <input className="form-input" value={techsInput} onChange={e => setTechsInput(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)}
                                    style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }} />
                                Mostrar no site público
                            </label>
                        </div>

                        {/* Internal fields */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '24px 0', paddingTop: 24 }}>
                            <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => setShowInternal(!showInternal)} style={{ marginBottom: 16 }}>
                                {showInternal ? '🔽' : '▶️'} Campos Internos
                            </button>
                            {showInternal && (
                                <div style={{ display: 'grid', gap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Público-alvo</label>
                                        <input className="form-input" value={publicoAlvo} onChange={e => setPublicoAlvo(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Dinâmica</label>
                                        <textarea className="form-textarea" value={dinamica} onChange={e => setDinamica(e.target.value)} rows={4} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Motivações</label>
                                        <textarea className="form-textarea" value={motivacoes} onChange={e => setMotivacoes(e.target.value)} rows={3} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Notas</label>
                                        <textarea className="form-textarea" value={notas} onChange={e => setNotas(e.target.value)} rows={3} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Cliente</label>
                                            <input className="form-input" value={cliente} onChange={e => setCliente(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Prazo</label>
                                            <input className="form-input" type="date" value={prazo} onChange={e => setPrazo(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <><span className="spinner"></span> Salvando...</> : 'Salvar'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in detail-container">
            <Link to="/admin/projects" className="btn btn-secondary btn-sm" style={{ marginBottom: 20 }}>← Voltar</Link>

            {/* Project image */}
            {project.image && (
                <div style={{
                    borderRadius: 8, overflow: 'hidden', marginBottom: 24,
                    border: '1px solid rgba(255,255,255,0.06)', aspectRatio: '16/9', maxHeight: 400,
                }}>
                    <img src={project.image} alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
            )}

            <div className="detail-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <h1 className="detail-title" style={{ marginBottom: 0 }}>{project.title}</h1>
                    <span className={`badge ${statusInfo.badge}`}>{statusInfo.label}</span>
                    <span className={`badge ${project.visible ? 'badge-success' : 'badge-danger'}`}>
                        {project.visible ? '👁 Público' : '🔒 Oculto'}
                    </span>
                </div>
                <div className="detail-meta" style={{ marginTop: 12 }}>
                    <span>{project.category || 'Web'}</span>
                    <span>•</span>
                    <span>{formatDate(project.created_at || project.createdAt)}</span>
                    {project.link && (
                        <>
                            <span>•</span>
                            <a href={project.link} target="_blank" rel="noopener" style={{ color: 'var(--accent-primary)' }}>{project.link}</a>
                        </>
                    )}
                </div>
                {project.techs && project.techs.length > 0 && (
                    <div className="card-tags" style={{ marginTop: 16 }}>
                        {project.techs.map(tech => (
                            <span key={tech} className="badge badge-primary">{tech}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="detail-content">{project.description}</div>

            {/* Internal fields display */}
            {(project.publico_alvo || project.dinamica || project.motivacoes || project.notas || project.cliente || project.prazo) && (
                <div style={{
                    marginTop: 32, padding: 24, borderRadius: 8,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <h3 style={{ fontSize: 14, color: 'var(--accent-primary)', marginBottom: 16, letterSpacing: 2, textTransform: 'uppercase' }}>
                        🔒 Informações Internas
                    </h3>
                    <div style={{ display: 'grid', gap: 16 }}>
                        {project.publico_alvo && <div><strong style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Público-alvo</strong><p style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)' }}>{project.publico_alvo}</p></div>}
                        {project.dinamica && <div><strong style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Dinâmica</strong><p style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)' }}>{project.dinamica}</p></div>}
                        {project.motivacoes && <div><strong style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Motivações</strong><p style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)' }}>{project.motivacoes}</p></div>}
                        {project.notas && <div><strong style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Notas</strong><p style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap' }}>{project.notas}</p></div>}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {project.cliente && <div><strong style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Cliente</strong><p style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)' }}>{project.cliente}</p></div>}
                            {project.prazo && <div><strong style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Prazo</strong><p style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)' }}>{project.prazo}</p></div>}
                        </div>
                    </div>
                </div>
            )}

            <div className="detail-actions">
                <button className="btn btn-secondary" onClick={() => setEditing(true)}>✏️ Editar</button>
                <button className={`btn ${project.visible ? 'btn-danger' : 'btn-primary'} btn-sm`} onClick={toggleVisibility}>
                    {project.visible ? '🔒 Ocultar do site' : '👁 Tornar público'}
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>🗑️ Excluir</button>
            </div>
        </div>
    );
}
