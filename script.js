document.addEventListener('DOMContentLoaded', () => {
    const creditsButton = document.getElementById('creditsButton');
    const creditsContainer = document.getElementById('creditsContainer');
    const themeToggle = document.getElementById('themeToggle');
    const discordTopBarButton = document.getElementById('discordTopBarButton');
    const body = document.body;
    const dataSourceText = document.getElementById('dataSourceText');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const sendFeedbackButton = document.getElementById('sendFeedbackButton');
    const feedbackStatus = document.getElementById('feedbackStatus');
    const honorableMentionImage = document.getElementById('honorableMentionImage');
    const footerMessage = document.getElementById('footerMessage');
    const scriptUnavailableText = document.querySelector('.content-window.script-theme p');
    const kindMessageText = document.getElementById('kindMessageText');
    const contentWindows = document.querySelectorAll('.content-window'); // Select all content windows

    // Discord Webhook URL
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1375697594789138533/s4foPQoNi7MEOuThfvEPuKPbmKBAW-yDd7vMgJzE9c0kgS30Q59wiY9F4mUpGtIbQhar';

    // Array of 100+ kind messages (already lowercase)
    const kindMessages = [
        "you are capable of amazing things.",
        "your strength is inspiring.",
        "don't forget to smile today.",
        "you are loved more than you know.",
        "take a moment to breathe and relax.",
        "your potential is limitless.",
        "believe in yourself, you've got this.",
        "every day is a new beginning.",
        "your kindness makes a difference.",
        "you are stronger than you think.",
        "embrace the journey, not just the destination.",
        "your unique perspective is valuable.",
        "find joy in the little things.",
        "you are a bright light in the world.",
        "keep shining, you're doing great.",
        "challenges make you stronger.",
        "you are worthy of all good things.",
        "spread positivity wherever you go.",
        "your presence is a gift.",
        "never stop learning and growing.",
        "you bring so much joy to others.",
        "be proud of how far you've come.",
        "your resilience is admirable.",
        "take care of yourself, you deserve it.",
        "you are a true inspiration.",
        "your efforts are appreciated.",
        "today is a good day to be happy.",
        "you are a star, shine brightly.",
        "your spirit is beautiful.",
        "find beauty in every day.",
        "you make the world a better place.",
        "keep pushing forward, you're almost there.",
        "your dreams are within reach.",
        "you are a beacon of hope.",
        "let your heart guide you.",
        "you are a masterpiece.",
        "your laughter is contagious.",
        "embrace your inner peace.",
        "you are truly special.",
        "your courage is remarkable.",
        "find strength in vulnerability.",
        "you are a force of nature.",
        "your wisdom shines through.",
        "cherish every moment.",
        "you are a gift to humanity.",
        "your compassion is a blessing.",
        "let your creativity flow.",
        "you are a true visionary.",
        "your positive energy is infectious.",
        "find adventure in the everyday.",
        "you are a joy to be around.",
        "your passion is inspiring.",
        "embrace change and grow.",
        "you are a true survivor.",
        "your determination is admirable.",
        "find peace in stillness.",
        "you are a source of comfort.",
        "your empathy is a superpower.",
        "let your imagination soar.",
        "you are a true innovator.",
        "your optimism is a gift.",
        "find happiness in simplicity.",
        "you are a true friend.",
        "your loyalty is unwavering.",
        "embrace your inner strength.",
        "you are a true leader.",
        "your integrity is impeccable.",
        "find wonder in the world.",
        "you are a true artist.",
        "your creativity knows no bounds.",
        "let your light guide the way.",
        "you are a true hero.",
        "your bravery is inspiring.",
        "find solace in nature.",
        "you are a true healer.",
        "your wisdom is profound.",
        "cherish your loved ones.",
        "you are a true blessing.",
        "your generosity is heartwarming.",
        "let your spirit be free.",
        "you are a true explorer.",
        "your curiosity is endless.",
        "find beauty in imperfection.",
        "you are a true mentor.",
        "your guidance is invaluable.",
        "embrace your true self.",
        "you are a true champion.",
        "your perseverance is incredible.",
        "find joy in self-discovery.",
        "you are a true visionary.",
        "your ideas are brilliant.",
        "let your dreams take flight.",
        "you are a true inspiration.",
        "your journey is unique.",
        "find strength in every step.",
        "you are a true marvel.",
        "your spirit is indomitable.",
        "embrace the unknown.",
        "you are a true gem.",
        "your presence brightens lives.",
        "find peace in your heart.",
        "you are a true miracle.",
        "your existence is precious.",
        "let your heart be full.",
        "you are a true gift.",
        "your light illuminates others.",
        "find joy in every breath.",
        "you are a true wonder.",
        "your soul is beautiful.",
        "embrace the present moment."
    ];

    // Function to toggle visibility for the credits container
    function toggleCreditsContainer() {
        if (creditsContainer.classList.contains('is-visible')) {
            creditsContainer.classList.remove('is-visible');
            creditsButton.textContent = 'credits';
        } else {
            creditsContainer.classList.add('is-visible');
            creditsButton.textContent = 'hide credits';
        }
    }

    creditsButton.addEventListener('click', toggleCreditsContainer);

    // Theme toggle logic
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Function to send feedback to Discord webhook
    sendFeedbackButton.addEventListener('click', async () => {
        const message = feedbackMessage.value.trim();
        if (!message) {
            feedbackStatus.textContent = 'please enter a message.';
            feedbackStatus.style.color = '#ef4444'; /* red-500 */
            return;
        }

        sendFeedbackButton.disabled = true;
        sendFeedbackButton.textContent = 'sending...';
        feedbackStatus.textContent = ''; // Clear previous status

        // Constructing the embed payload
        const embed = {
            title: 'new feedback received (anonymous)', // Updated title for clarity
            description: message,
            color: parseInt('2ECC71', 16), // A nice green color (decimal value of #2ECC71)
            timestamp: new Date().toISOString(), // ISO 8601 timestamp for Discord
            fields: [
                {
                    name: 'timestamp (client-side)',
                    value: new Date().toLocaleString(), // More human-readable local time
                    inline: true
                }
            ],
            footer: {
                text: 'project zoob zoob feedback'
            }
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ embeds: [embed] }), // Sending as an embed
            });

            if (response.ok) {
                feedbackStatus.textContent = 'feedback sent successfully!';
                feedbackStatus.style.color = '#22c55e'; /* green-500 */
                feedbackMessage.value = ''; // Clear textarea
            } else {
                const errorText = await response.text();
                feedbackStatus.textContent = `failed to send feedback: ${response.status} ${errorText.substring(0, 50)}...`;
                feedbackStatus.style.color = '#ef4444'; /* red-500 */
            }
        } catch (error) {
            feedbackStatus.textContent = `an error occurred: ${error.message}`;
            feedbackStatus.style.color = '#ef4444'; /* red-500 */
        } finally {
            sendFeedbackButton.disabled = false;
            sendFeedbackButton.textContent = 'send feedback';
        }
    });

    // Animation for honorable mention image
    if (honorableMentionImage) {
        honorableMentionImage.addEventListener('click', () => {
            // Add the animation class
            honorableMentionImage.classList.add('animate-click');

            // Remove the class after the animation completes
            honorableMentionImage.addEventListener('animationend', () => {
                honorableMentionImage.classList.remove('animate-click');
            }, { once: true }); // Use { once: true } to ensure the listener is removed after one execution
        });
    }

    // Function to display a random kind message
    function displayRandomKindMessage() {
        const randomIndex = Math.floor(Math.random() * kindMessages.length);
        kindMessageText.textContent = kindMessages[randomIndex];
    }

    // Display a random kind message on load
    displayRandomKindMessage();

    // Staggered entrance animation for content windows
    contentWindows.forEach((window, index) => {
        setTimeout(() => {
            window.classList.add('animate-in');
        }, 100 * index); // Stagger by 100ms for each window
    });

    // Function to convert all relevant text content to lowercase
    function convertTextToLowercase() {
        const textElements = document.querySelectorAll(
            'h1, p:not(#kindMessageText), button, a, img[alt], h2, textarea::placeholder' /* Exclude kindMessageText from lowercasing */
        );

        textElements.forEach(element => {
            if (element.textContent && element.id !== 'creditsName' && element.id !== 'adminName') {
                element.textContent = element.textContent.toLowerCase();
            }
            if (element.tagName === 'IMG' && element.alt) {
                element.alt = element.alt.toLowerCase();
            }
            if (element.tagName === 'TEXTAREA' && element.placeholder) {
                element.placeholder = element.placeholder.toLowerCase();
            }
        });

        // Manually set specific elements that are dynamically changed by JS
        if (creditsButton) {
            // Ensure the 'credits' text remains lowercase, while 'hide credits' isn't hardcoded
            creditsButton.textContent = creditsButton.textContent.toLowerCase();
        }
        if (themeToggle) {
            themeToggle.textContent = 'toggle theme';
        }
        if (discordTopBarButton) {
            discordTopBarButton.textContent = 'discord';
        }
        if (dataSourceText) {
            dataSourceText.textContent = dataSourceText.textContent.toLowerCase();
        }
        if (sendFeedbackButton) {
            sendFeedbackButton.textContent = 'send feedback';
        }
        if (footerMessage) {
            footerMessage.textContent = footerMessage.textContent.toLowerCase();
        }
        if (scriptUnavailableText) {
            scriptUnavailableText.textContent = scriptUnavailableText.textContent.toLowerCase();
        }
    }

    convertTextToLowercase();
});
