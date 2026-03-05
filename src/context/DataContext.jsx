import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [projects, setProjects] = useState([]);

    // ─── Load data ──────────────────────────────
    const refreshPosts = useCallback(async () => {
        try {
            const data = await apiFetch('/api/posts');
            setPosts(data);
        } catch { /* silent — may be unauthed */ }
    }, []);

    const refreshProjects = useCallback(async () => {
        try {
            const data = await apiFetch('/api/projects');
            setProjects(data);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        refreshPosts();
        refreshProjects();
    }, [refreshPosts, refreshProjects]);

    // ─── POSTS ──────────────────────────────────
    const createPost = async (data, coverFile) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('category', data.category || 'desenvolvimento');
        formData.append('tags', JSON.stringify(data.tags || []));
        formData.append('status', data.status || 'rascunho');
        if (coverFile) formData.append('cover_image', coverFile);

        const post = await apiFetch('/api/posts', { method: 'POST', body: formData });
        setPosts(prev => [post, ...prev]);
        return post;
    };

    const updatePost = async (id, data, coverFile) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append('title', data.title);
        if (data.content !== undefined) formData.append('content', data.content);
        if (data.category !== undefined) formData.append('category', data.category);
        if (data.tags !== undefined) formData.append('tags', JSON.stringify(data.tags));
        if (data.status !== undefined) formData.append('status', data.status);
        if (data.cover_image !== undefined) formData.append('cover_image', data.cover_image);
        if (coverFile) formData.append('cover_image', coverFile);

        const post = await apiFetch(`/api/posts/${id}`, { method: 'PUT', body: formData });
        setPosts(prev => prev.map(p => p.id === id ? post : p));
        return post;
    };

    const deletePost = async (id) => {
        await apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const getPost = (id) => posts.find(p => p.id === id);
    const getPublishedPosts = () => posts.filter(p => p.status === 'publicado');

    // ─── PROJECTS ──────────────────────────────
    const createProject = async (data, imageFile) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category || 'Web');
        formData.append('status', data.status || 'planejamento');
        formData.append('techs', JSON.stringify(data.techs || []));
        formData.append('link', data.link || '');
        formData.append('visible', data.visible ? 'true' : 'false');
        // Internal fields
        if (data.publico_alvo) formData.append('publico_alvo', data.publico_alvo);
        if (data.dinamica) formData.append('dinamica', data.dinamica);
        if (data.motivacoes) formData.append('motivacoes', data.motivacoes);
        if (data.notas) formData.append('notas', data.notas);
        if (data.cliente) formData.append('cliente', data.cliente);
        if (data.prazo) formData.append('prazo', data.prazo);
        if (imageFile) formData.append('image', imageFile);

        const project = await apiFetch('/api/projects', { method: 'POST', body: formData });
        setProjects(prev => [project, ...prev]);
        return project;
    };

    const updateProject = async (id, data, imageFile) => {
        const formData = new FormData();
        if (data.title !== undefined) formData.append('title', data.title);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.category !== undefined) formData.append('category', data.category);
        if (data.status !== undefined) formData.append('status', data.status);
        if (data.techs !== undefined) formData.append('techs', JSON.stringify(data.techs));
        if (data.link !== undefined) formData.append('link', data.link);
        if (data.visible !== undefined) formData.append('visible', data.visible ? 'true' : 'false');
        if (data.publico_alvo !== undefined) formData.append('publico_alvo', data.publico_alvo);
        if (data.dinamica !== undefined) formData.append('dinamica', data.dinamica);
        if (data.motivacoes !== undefined) formData.append('motivacoes', data.motivacoes);
        if (data.notas !== undefined) formData.append('notas', data.notas);
        if (data.cliente !== undefined) formData.append('cliente', data.cliente);
        if (data.prazo !== undefined) formData.append('prazo', data.prazo);
        if (data.image !== undefined) formData.append('image', data.image);
        if (imageFile) formData.append('image', imageFile);

        const project = await apiFetch(`/api/projects/${id}`, { method: 'PUT', body: formData });
        setProjects(prev => prev.map(p => p.id === id ? project : p));
        return project;
    };

    const deleteProject = async (id) => {
        await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const importProjects = async (jsonFile) => {
        const formData = new FormData();
        formData.append('file', jsonFile);
        const result = await apiFetch('/api/projects/import', { method: 'POST', body: formData });
        await refreshProjects();
        return result;
    };

    const importProjectsFromJson = async (jsonString) => {
        const result = await apiFetch('/api/projects/import', {
            method: 'POST',
            body: JSON.stringify({ json: jsonString }),
        });
        await refreshProjects();
        return result;
    };

    const getProject = (id) => projects.find(p => p.id === id);
    const getVisibleProjects = () => projects.filter(p => p.visible);

    return (
        <DataContext.Provider value={{
            posts, createPost, updatePost, deletePost, getPost, getPublishedPosts, refreshPosts,
            projects, createProject, updateProject, deleteProject, getProject, getVisibleProjects, refreshProjects,
            importProjects, importProjectsFromJson,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
}
