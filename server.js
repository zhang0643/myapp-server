const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DB_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveUsers(users) {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ ok: false, msg: '用户名和密码不能为空' });
    }
    const users = loadUsers();
    if (users[username]) {
        return res.json({ ok: false, msg: '用户名已存在' });
    }
    users[username] = password;
    saveUsers(users);
    res.json({ ok: true, msg: '注册成功' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    if (users[username] && users[username] === password) {
        res.json({ ok: true, msg: '登录成功' });
    } else {
        res.json({ ok: false, msg: '账号或密码错误' });
    }
});

app.listen(3000, () => {
    console.log('服务器已启动: http://localhost:3000');
});