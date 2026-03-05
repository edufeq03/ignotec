import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function BlogPage() {
    const { getPublishedPosts } = useData();
    const posts = getPublishedPosts();
    const [filter, setFilter] = useState('todos');

    const categories = useMemo(() => {
        const cats = new Set(posts.map(p => p.category || 'geral'));
        return ['todos', ...cats];
    }, [posts]);

    const filtered = filter === 'todos'
        ? posts
        : posts.filter(p => (p.category || 'geral') === filter);

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const readTime = (content) => {
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    };

    return (
        <>
            <div className="pub-blog-hero">
                <h1>Blog</h1>
                <p>Insights sobre desenvolvimento web, mobile, cloud e inovação tecnológica.</p>
            </div>

            <div className="pub-blog-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`pub-blog-filter ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--pub-text-muted)', padding: '60px 40px' }}>
                    Nenhum post publicado ainda. Volte em breve!
                </p>
            ) : (
                <div className="pub-blog-grid">
                    {filtered.map(post => (
                        <Link to={`/blog/${post.id}`} key={post.id} className="pub-blog-card">
                            <div className="pub-blog-card-meta">
                                <span className="pub-blog-card-category">{post.category || 'geral'}</span>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <h3>{post.title}</h3>
                            <p>{post.content.length > 160 ? post.content.slice(0, 160) + '…' : post.content}</p>
                            <div className="pub-blog-card-footer">
                                <span>Eduardo Capella</span>
                                <span>{readTime(post.content)} min de leitura</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
