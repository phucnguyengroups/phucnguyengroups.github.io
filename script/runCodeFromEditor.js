function runCodeFromEditor(editorId, outputId) {
    const editor = document.getElementById(editorId);
    if (!editor) {
        alert('Không tìm thấy vùng nhập code với id: ' + editorId);
        return;
    }
    const code = editor.value || editor.innerText || '';
    const output = document.getElementById(outputId);
    if (!output) {
        alert('Không tìm thấy vùng xuất log với id: ' + outputId);
        return;
    }
    output.innerHTML = ''; // xóa hết log cũ

    // Xóa iframe cũ nếu có
    let oldIframe = document.getElementById('sandbox-iframe');
    if (oldIframe) oldIframe.remove();

    // Tạo iframe sandbox ẩn
    const iframe = document.createElement('iframe');
    iframe.id = 'sandbox-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument || iframeWindow.document;

    // Ghi log console từ iframe ra output với class style
    function overrideConsole() {
        ['log', 'error', 'warn', 'info'].forEach(method => {
            const original = console[method];
            console[method] = function (...args) {
                const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ');
                window.parent.postMessage({ method, msg }, '*');
                original.apply(console, args);
            };
        });
    }

    // Lắng nghe message từ iframe
    function messageHandler(e) {
        if (e.source !== iframeWindow) return;
        if (e.data && e.data.msg !== undefined) {
            const span = document.createElement('span');
            span.textContent = e.data.msg + '\n';
            if (e.data.method === 'error') span.className = 'error';
            else if (e.data.method === 'warn') span.className = 'warn';
            else if (e.data.method === 'log' || e.data.method === 'info') span.className = 'log';
            else span.className = 'log';
            output.appendChild(span);
            output.scrollTop = output.scrollHeight; // tự cuộn xuống dưới
        }
    }
    window.addEventListener('message', messageHandler);

    // Nội dung chạy trong iframe
    const iframeContent = `
        <script>
            (${overrideConsole.toString()})();
            (async () => {
                try {
                    ${code}
                } catch (e) {
                    console.error(e.stack || e.message);
                }
            })();
        <\/script>
    `;

    // Viết nội dung vào iframe
    iframeDoc.open();
    iframeDoc.write(iframeContent);
    iframeDoc.close();

    // Dọn dẹp sau 10s
    setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        iframe.remove();
        const endMsg = document.createElement('span');
        endMsg.textContent = '\n⏰ Phiên chạy code kết thúc.';
        endMsg.className = 'result';
        output.appendChild(endMsg);
        output.scrollTop = output.scrollHeight;
    }, 10000);
}
