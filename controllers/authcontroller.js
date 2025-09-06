
import { users } from '../models/userModel.js';
import { tokens } from '../models/tokenModel.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';


// Registro
function register(req, res) {
    const { username, email, password } = req.body;
    if (users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ message: 'Usuario o email ya existe' });
    }
    users.push({ id: uuidv4(), username, email, password });
    res.json({ message: 'Usuario registrado correctamente' });
}

// Login
function login(req, res) {
    const { username, password } = req.body;
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    res.json({ message: 'Login exitoso' });
}

// Solicitud de recuperación
function forgotPassword(req, res) {
    const { usernameOrEmail } = req.body;
    const user = users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const token = crypto.randomBytes(32).toString('hex');
    const createdAt = Date.now();
    const expiresAt = createdAt + 1000 * 60 * 15; // 15 minutos

    tokens.push({
        token,
        userId: user.id,
        createdAt,
        expiresAt,
        status: 'active'
    });

    // Simula envío de correo mostrando el link en la respuesta
    res.json({
        message: 'Enlace de recuperación generado',
        resetLink: `http://localhost:3000/auth/reset-password?token=${token}`
    });
}

// Validación del token y cambio de contraseña
function resetPassword(req, res) {
    const { token } = req.query;
    const { password } = req.body;
    const tokenObj = tokens.find(t => t.token === token);

    if (!tokenObj) return res.status(400).json({ message: 'Token inválido' });
    if (tokenObj.status !== 'active') return res.status(400).json({ message: 'Token ya usado' });
    if (Date.now() > tokenObj.expiresAt) return res.status(400).json({ message: 'Token expirado' });

    const user = users.find(u => u.id === tokenObj.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.password = password;
    tokenObj.status = 'used';

    res.json({ message: 'Contraseña actualizada correctamente' });
}

export default {
    register,
    login,
    forgotPassword,
    resetPassword
};