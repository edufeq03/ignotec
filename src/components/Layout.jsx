import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Home, FileText, Rocket, Globe, LogOut, Menu } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <div className="mobile-header">
                <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu size={24} />
                </button>
                <span className="sidebar-logo">Ignotec</span>
                <div style={{ width: 28 }} />
            </div>

            <div className="app-layout">
                <div
                    className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                    onClick={closeSidebar}
                />

                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="sidebar-logo">
                            Igno<span>tec</span>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                            <span className="icon"><Home size={18} /></span> Dashboard
                        </NavLink>
                        <NavLink to="/admin/posts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                            <span className="icon"><FileText size={18} /></span> Posts
                        </NavLink>
                        <NavLink to="/admin/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                            <span className="icon"><Rocket size={18} /></span> Projetos
                        </NavLink>

                        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                            <a href="/" className="sidebar-link" style={{ opacity: 0.6 }}>
                                <span className="icon"><Globe size={18} /></span> Ver Site
                            </a>
                        </div>
                    </nav>

                    <div className="sidebar-footer">
                        <div className="sidebar-user">
                            <div className="sidebar-avatar">{initials}</div>
                            <div className="sidebar-user-info">
                                <div className="sidebar-user-name">{user?.name}</div>
                                <div className="sidebar-user-email">{user?.email}</div>
                            </div>
                            <button className="btn-logout" onClick={handleLogout} title="Sair">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="main-content fade-in">
                    <Outlet />
                </main>
            </div>
        </>
    );
}
