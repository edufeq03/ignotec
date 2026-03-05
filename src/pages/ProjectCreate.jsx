import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function ProjectCreate() {
    const { createProject, importProjects } = useData();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('planejamento');
    const [techsInput, setTechsInput] = useState('');
    const [category, setCategory] = useState('');
    const [link, setLink] = useState('');
    const [visible, setVisible] = useState(false);

    // Image
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Internal fields
    const [publicoAlvo, setPublicoAlvo] = useState('');
    const [dinamica, setDinamica] = useState('');
    const [motivacoes, setMotivacoes] = useState('');
    const [notas, setNotas] = useState('');
    const [cliente, setCliente] = useState('');
    const [prazo, setPrazo] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showInternal, setShowInternal] = useState(false);
    const fileRef = useRef(null);
    const importRef = useRef(null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim() || !description.trim()) {
            setError('Nome e descrição são obrigatórios.');
            return;
        }
        setLoading(true);
        try {
            const techs = techsInput.split(',').map(t => t.trim()).filter(Boolean);
            const project = await createProject({
                title: title.trim(),
                description: description.trim(),
                status, techs, category: category.trim() || 'Web', link, visible,
                publico_alvo: publicoAlvo, dinamica, motivacoes, notas, cliente, prazo,
            }, imageFile);
            navigate(`/admin/projects/${project.id}`);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            const result = await importProjects(file);
            if (result.projects?.length === 1) {
                navigate(`/admin/projects/${result.projects[0].id}`);
            } else {
                navigate('/admin/projects');
            }
        } catch (err) {
            setError(`Erro ao importar: ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Novo Projeto</h1>
                    <p className="page-subtitle">Crie um novo projeto de tecnologia</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary" onClick={() => importRef.current?.click()}>
                        📥 Importar JSON
                    </button>
                    <input ref={importRef} type="file" accept=".json,.txt" style={{ display: 'none' }} onChange={handleImport} />
                </div>
            </div>

            <div className="form-card">
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Image upload */}
                    <div className="form-group">
                        <label className="form-label">Imagem do Projeto</label>
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{
                                border: '2px dashed rgba(255,255,255,0.15)',
                                borderRadius: 8,
                                padding: imagePreview ? 0 : 40,
                                textAlign: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                background: 'rgba(255,255,255,0.02)',
                                transition: 'border-color .2s',
                                aspectRatio: imagePreview ? '16/9' : 'auto',
                            }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            ) : (
                                <>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Clique para selecionar uma imagem</div>
                                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 4 }}>PNG, JPG, WebP — Máx 10MB</div>
                                </>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                        {imagePreview && (
                            <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}
                                onClick={() => { setImageFile(null); setImagePreview(null); }}>
                                Remover imagem
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="project-title">Nome do Projeto</label>
                        <input id="project-title" type="text" className="form-input" placeholder="Meu Projeto Incrível"
                            value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="project-desc">Descrição</label>
                        <textarea id="project-desc" className="form-textarea" placeholder="Descreva o objetivo e escopo..."
                            value={description} onChange={e => setDescription(e.target.value)} rows={6} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="project-category">Categoria</label>
                        <input id="project-category" type="text" className="form-input" placeholder="SaaS, Mobile, Web..."
                            value={category} onChange={e => setCategory(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="project-link">Link</label>
                        <input id="project-link" type="text" className="form-input" placeholder="https://..."
                            value={link} onChange={e => setLink(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="project-status">Status</label>
                        <select id="project-status" className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="planejamento">📋 Planejamento</option>
                            <option value="em-andamento">⚡ Em Andamento</option>
                            <option value="concluido">✅ Concluído</option>
                            <option value="pausado">⏸️ Pausado</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="project-techs">Tecnologias (separadas por vírgula)</label>
                        <input id="project-techs" type="text" className="form-input" placeholder="React, Node.js, PostgreSQL"
                            value={techsInput} onChange={e => setTechsInput(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                            <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)}
                                style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }} />
                            Mostrar no site público (Portfólio)
                        </label>
                    </div>

                    {/* Internal fields toggle */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '24px 0', paddingTop: 24 }}>
                        <button type="button" className="btn btn-secondary btn-sm"
                            onClick={() => setShowInternal(!showInternal)}
                            style={{ marginBottom: 16 }}>
                            {showInternal ? '🔽' : '▶️'} Campos Internos (admin only)
                        </button>

                        {showInternal && (
                            <div style={{ display: 'grid', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Público-alvo</label>
                                    <input className="form-input" placeholder="Quem vai usar?" value={publicoAlvo}
                                        onChange={e => setPublicoAlvo(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Dinâmica</label>
                                    <textarea className="form-textarea" placeholder="Como o app funciona? Comportamento esperado?"
                                        value={dinamica} onChange={e => setDinamica(e.target.value)} rows={4} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Motivações</label>
                                    <textarea className="form-textarea" placeholder="Por que esse projeto existe?"
                                        value={motivacoes} onChange={e => setMotivacoes(e.target.value)} rows={3} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Notas</label>
                                    <textarea className="form-textarea" placeholder="Anotações livres..."
                                        value={notas} onChange={e => setNotas(e.target.value)} rows={3} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div className="form-group">
                                        <label className="form-label">Cliente</label>
                                        <input className="form-input" placeholder="Nome do cliente" value={cliente}
                                            onChange={e => setCliente(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Prazo</label>
                                        <input className="form-input" type="date" value={prazo}
                                            onChange={e => setPrazo(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <><span className="spinner"></span> Salvando...</> : 'Criar Projeto'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/projects')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
