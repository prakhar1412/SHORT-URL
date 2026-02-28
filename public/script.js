document.addEventListener('DOMContentLoaded', () => {
    const shortenBtn = document.getElementById('shortenBtn');
    const urlInput = document.getElementById('urlInput');
    const customAlias = document.getElementById('customAlias');
    const resultArea = document.getElementById('result');
    const shortLink = document.getElementById('shortLink');
    const analyticsLink = document.getElementById('analyticsLink');
    const errorDiv = document.getElementById('error');
    const copyBtn = document.getElementById('copyBtn');

    // Clear inputs on every page load/refresh
    urlInput.value = '';
    customAlias.value = '';
    resultArea.classList.add('hidden');

    shortenBtn.addEventListener('click', handleShorten);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleShorten();
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = shortLink.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);
        });
    });

    // History Elements
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Load history on start
    loadHistory();

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('shortUrlHistory');
        renderHistory();
    });

    async function handleShorten() {
        const url = urlInput.value.trim();
        const alias = customAlias.value.trim();

        if (!url) {
            showError("Please enter a valid URL");
            return;
        }

        // Basic client-side validation
        try {
            new URL(url);
        } catch (_) {
            showError("Invalid URL format (include http:// or https://)");
            return;
        }

        shortenBtn.disabled = true;
        shortenBtn.innerHTML = '<span class="btn-text">Shortening...</span>';

        try {
            const response = await fetch('/url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    customAlias: alias
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            displayResult(result.Id);
            saveToHistory(result.Id, url); // Save to history
            errorDiv.classList.add('hidden');

        } catch (error) {
            showError(error.message);
            resultArea.classList.add('hidden');
        } finally {
            shortenBtn.disabled = false;
            shortenBtn.innerHTML = '<span class="btn-text">Shorten Now</span><div class="btn-glow"></div>';
        }
    }

    function displayResult(id) {
        const fullUrl = `${window.location.origin}/url/${id}`;
        const analyticsUrl = `${window.location.origin}/url/analytics/${id}`;

        shortLink.href = fullUrl;
        shortLink.textContent = fullUrl;
        analyticsLink.href = analyticsUrl;

        // Generate QR Code
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = ''; // Clear previous
        new QRCode(qrContainer, {
            text: fullUrl,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Update Share Buttons
        const twitterBtn = document.getElementById('shareTwitter');
        const whatsappBtn = document.getElementById('shareWhatsapp');
        const linkedinBtn = document.getElementById('shareLinkedin');

        twitterBtn.onclick = () => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20link!&url=${encodeURIComponent(fullUrl)}`, '_blank');
        whatsappBtn.onclick = () => window.open(`https://wa.me/?text=Check%20out%20this%20link!%20${encodeURIComponent(fullUrl)}`, '_blank');
        linkedinBtn.onclick = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, '_blank');

        resultArea.classList.remove('hidden');
    }

    // --- History Functions ---

    function saveToHistory(id, originalUrl) {
        const history = JSON.parse(localStorage.getItem('shortUrlHistory') || '[]');
        // Add new item to beginning
        history.unshift({
            id: id,
            originalUrl: originalUrl,
            timestamp: Date.now()
        });
        // Keep only last 10 items
        if (history.length > 10) history.pop();

        localStorage.setItem('shortUrlHistory', JSON.stringify(history));
        renderHistory();
    }

    function loadHistory() {
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('shortUrlHistory') || '[]');

        if (history.length === 0) {
            historySection.classList.add('hidden');
            return;
        }

        historySection.classList.remove('hidden');
        historyList.innerHTML = '';

        history.forEach(item => {
            const fullUrl = `${window.location.origin}/url/${item.id}`;
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="history-original" title="${item.originalUrl}">${item.originalUrl}</div>
                <div class="history-short">
                    <a href="${fullUrl}" target="_blank" class="history-link">${fullUrl}</a>
                    <button class="copy-btn mini-copy" data-url="${fullUrl}" title="Copy">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            `;
            historyList.appendChild(div);
        });

        // Add listeners to new copy buttons
        document.querySelectorAll('.mini-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.currentTarget.dataset.url;
                navigator.clipboard.writeText(url);
                const originalHtml = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                setTimeout(() => {
                    if (document.body.contains(e.currentTarget)) {
                        e.currentTarget.innerHTML = originalHtml;
                    }
                }, 2000);
            });
        });
    }

    // Analytics Elements
    const analyticsModal = document.getElementById('analyticsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const totalClicksEl = document.getElementById('totalClicks');
    const clicksChartCanvas = document.getElementById('clicksChart');
    let clicksChart = null;

    analyticsLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const shortId = shortLink.href.split('/').pop();
        await fetchAnalytics(shortId);
        analyticsModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        analyticsModal.classList.add('hidden');
    });

    analyticsModal.addEventListener('click', (e) => {
        if (e.target === analyticsModal) {
            analyticsModal.classList.add('hidden');
        }
    });

    async function fetchAnalytics(shortId) {
        try {
            const response = await fetch(`/url/analytics/${shortId}`);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const data = await response.json();

            totalClicksEl.textContent = data.totalClicks;
            renderChart(data.analytics);
        } catch (error) {
            console.error(error);
            showError("Could not load analytics");
        }
    }

    function renderChart(history) {
        const ctx = clicksChartCanvas.getContext('2d');

        // Destroy existing chart if any
        if (clicksChart) {
            clicksChart.destroy();
        }

        // Process data for chart
        // Group clicks by hour
        const clicksByTime = {};
        history.forEach(entry => {
            const date = new Date(entry.timestamp);
            const hour = date.getHours() + ':00';
            clicksByTime[hour] = (clicksByTime[hour] || 0) + 1;
        });

        const labels = Object.keys(clicksByTime);
        const data = Object.values(clicksByTime);

        clicksChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Clicks per Hour',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: 'white' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
});
