import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function BlogPostPage() {
    const { id } = useParams();
    const { getPost } = useData();
    const post = getPost(id);

    if (!post || post.status !== 'publicado') {
        return (
            <div className="pub-post" style={{ textAlign: 'center', paddingTop: 200 }}>
                <p style={{ color: 'var(--pub-text-muted)', fontSize: '1.1rem', marginBottom: 24 }}>
                    Post não encontrado.
                </p>
                <Link to="/blog" className="pub-btn-primary">Voltar ao Blog</Link>
            </div>
        );
    }

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const readTime = (content) => {
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    };

    return (
        <article className="pub-post">
            <Link to="/blog" className="pub-post-back">← Voltar ao Blog</Link>

            <div className="pub-post-category">{post.category || 'geral'}</div>
            <h1>{post.title}</h1>

            <div className="pub-post-meta">
                <span>Eduardo Capella</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>{readTime(post.content)} min de leitura</span>
            </div>

            <div className="pub-post-body">{post.content}</div>

            {post.tags && post.tags.length > 0 && (
                <div className="pub-post-tags">
                    {post.tags.map(t => (
                        <span key={t} className="pub-tech-tag">{t}</span>
                    ))}
                </div>
            )}
        </article>
    );
}
