 // Дані користувачів (в реальному додатку це має бути на сервері)
        let users = JSON.parse(localStorage.getItem('chatUsers') || '{}');
        let currentUser = null;
        let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        let onlineUsers = new Set();
        let typingUsers = new Set();

        // Симуляція онлайн користувачів
        const simulatedUsers = ['Олександр', 'Марія', 'Дмитро', 'Анна', 'Сергій'];

        function showRegister() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
            clearErrors();
        }

        function showLogin() {
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
            clearErrors();
        }

        function clearErrors() {
            document.getElementById('loginError').style.display = 'none';
            document.getElementById('registerError').style.display = 'none';
        }

        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        function register() {
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (!username || !email || !password || !confirmPassword) {
                showError('registerError', 'Заповніть всі поля');
                return;
            }

            if (password !== confirmPassword) {
                showError('registerError', 'Паролі не співпадають');
                return;
            }

            if (password.length < 6) {
                showError('registerError', 'Пароль має містити мінімум 6 символів');
                return;
            }

            if (users[username]) {
                showError('registerError', 'Користувач з таким іменем вже існує');
                return;
            }

            // Реєстрація користувача
            users[username] = {
                username: username,
                email: email,
                password: password,
                registeredAt: new Date().toISOString()
            };

            localStorage.setItem('chatUsers', JSON.stringify(users));
            
            // Автоматичний вхід після реєстрації
            currentUser = username;
            showChat();
            addSystemMessage(`${username} приєднався до чату`);
        }

        function login() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                showError('loginError', 'Заповніть всі поля');
                return;
            }

            if (!users[username] || users[username].password !== password) {
                showError('loginError', 'Невірне ім\'я користувача або пароль');
                return;
            }

            currentUser = username;
            showChat();
            addSystemMessage(`${username} приєднався до чату`);
        }

        function logout() {
            if (currentUser) {
                addSystemMessage(`${currentUser} покинув чат`);
                currentUser = null;
            }
            document.getElementById('chatContainer').style.display = 'none';
            document.getElementById('authContainer').style.display = 'flex';
            showLogin();
            
            // Очищення полів
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
        }

        function showChat() {
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'flex';
            document.getElementById('currentUser').textContent = currentUser;
            
            loadMessages();
            simulateOnlineUsers();
            
            // Фокус на поле введення
            document.getElementById('messageInput').focus();
        }

        function loadMessages() {
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.innerHTML = '';
            
            messages.forEach(message => {
                displayMessage(message, false);
            });
            
            scrollToBottom();
        }

        function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const messageText = messageInput.value.trim();
            
            if (!messageText) return;

            const message = {
                id: Date.now(),
                username: currentUser,
                text: messageText,
                timestamp: new Date().toISOString(),
                type: 'user'
            };

            messages.push(message);
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            
            displayMessage(message, true);
            messageInput.value = '';
            scrollToBottom();

            // Симуляція відповіді від іншого користувача
            setTimeout(() => {
                simulateResponse();
            }, Math.random() * 3000 + 1000);
        }

        function displayMessage(message, animate = true) {
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            
            if (message.type === 'system') {
                messageDiv.className = 'message system';
                messageDiv.innerHTML = `
                    <div style="text-align: center; color: #666; font-style: italic; font-size: 14px;">
                        ${message.text}
                    </div>
                `;
            } else {
                const isOwn = message.username === currentUser;
                messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
                
                const time = new Date(message.timestamp).toLocaleTimeString('uk-UA', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                messageDiv.innerHTML = `
                    ${!isOwn ? `<div class="message-header">${message.username}</div>` : ''}
                    <div>${message.text}</div>
                    <div class="message-time">${time}</div>
                `;
            }

            if (animate) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateY(10px)';
            }
            
            messagesContainer.appendChild(messageDiv);
            
            if (animate) {
                setTimeout(() => {
                    messageDiv.style.opacity = '1';
                    messageDiv.style.transform = 'translateY(0)';
                }, 10);
            }
        }

        function addSystemMessage(text) {
            const message = {
                id: Date.now(),
                text: text,
                timestamp: new Date().toISOString(),
                type: 'system'
            };

            messages.push(message);
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            displayMessage(message, true);
            scrollToBottom();
        }

        function simulateResponse() {
            const responses = [
                'Привіт! Як справи?',
                'Цікаво!',
                'Погоджуюся з вами',
                'А що ви думаєте про це?',
                'Дякую за інформацію',
                'Це дуже корисно',
                'Чудова ідея!',
                'Я теж так думаю',
                'Можливо, варто розглянути інші варіанти',
                'Цікавий підхід до вирішення проблеми'
            ];

            const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const message = {
                id: Date.now(),
                username: randomUser,
                text: randomResponse,
                timestamp: new Date().toISOString(),
                type: 'user'
            };

            messages.push(message);
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            displayMessage(message, true);
            scrollToBottom();
        }

        function simulateOnlineUsers() {
            onlineUsers.add(currentUser);
            
            // Додаємо кілька симульованих користувачів
            const randomCount = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < randomCount; i++) {
                const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
                if (randomUser !== currentUser) {
                    onlineUsers.add(randomUser);
                }
            }

            // Періодично змінюємо список онлайн користувачів
            setInterval(() => {
                if (Math.random() > 0.7) {
                    const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
                    if (randomUser !== currentUser) {
                        if (onlineUsers.has(randomUser)) {
                            onlineUsers.delete(randomUser);
                        } else {
                            onlineUsers.add(randomUser);
                        }
                    }
                }
            }, 10000);
        }

        function scrollToBottom() {
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        // Ініціалізація при завантаженні сторінки
        window.onload = function() {
            // Додаємо кілька початкових повідомлень, якщо їх немає
            if (messages.length === 0) {
                messages = [
                    {
                        id: 1,
                        text: 'Ласкаво просимо до онлайн чату!',
                        type: 'system',
                        timestamp: new Date().toISOString()
                    }
                ];
                localStorage.setItem('chatMessages', JSON.stringify(messages));
            }
        };

        // Автоматичне оновлення повідомлень кожні 2 секунди
        setInterval(() => {
            if (currentUser) {
                const newMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
                if (newMessages.length > messages.length) {
                    const latestMessages = newMessages.slice(messages.length);
                    messages = newMessages;
                    
                    latestMessages.forEach(message => {
                        if (message.username !== currentUser) {
                            displayMessage(message, true);
                        }
                    });
                    
                    scrollToBottom();
                }
            }
        }, 2000);