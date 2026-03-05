import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register, hasUsers } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        hasUsers().then(exists => {
            if (exists) navigate('/login', { replace: true });
            setChecking(false);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password || !confirm) {
            setError('Preencha todos os campos.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (password !== confirm) {
            setError('As senhas não coincidem.');
            return;
        }
        setLoading(true);
        const result = await register(username, password);
        setLoading(false);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.error);
        }
    };

    if (checking) return null;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">Ignotec</div>
                <h1 className="auth-title">Setup Inicial</h1>
                <p className="auth-subtitle">Crie sua conta de administrador</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="register-user">Usuário</label>
                        <input
                            id="register-user"
                            type="text"
                            className="form-input"
                            placeholder="admin"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="register-password">Senha</label>
                        <input
                            id="register-password"
                            type="password"
                            className="form-input"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="register-confirm">Confirmar senha</label>
                        <input
                            id="register-confirm"
                            type="password"
                            className="form-input"
                            placeholder="Repita a senha"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><span className="spinner"></span> Criando...</> : 'Criar conta'}
                    </button>
                </form>
            </div>
        </div>
    );
}
