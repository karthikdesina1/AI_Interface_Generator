// ---- helpers: cross-browser copy & download ----
function safeCopy(text) {
  if (!text) return Promise.reject(new Error('No text to copy'));
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); return Promise.resolve(); }
  catch (e) { return Promise.reject(e); }
  finally { document.body.removeChild(ta); }
}

function safeDownload(filename, text) {
  const blob = new Blob([text || ''], { type: 'text/plain;charset=utf-8' });
  if (navigator.msSaveOrOpenBlob) { navigator.msSaveOrOpenBlob(blob, filename || 'generated-code.txt'); return; }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename || 'generated-code.txt';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

// ---- main wiring (call this AFTER form + output components are injected) ----
function initGeneratorFormListeners() {
  const generatorForm = document.getElementById('generatorForm');
  const generateBtn   = document.getElementById('generateBtn');
  const promptInput   = document.getElementById('promptInput');
  const errorText     = document.getElementById('errorText');
  const codeOutput    = document.getElementById('codeOutput');
  const btnText       = document.getElementById('btnText');
  const spinner       = document.getElementById('spinner');
  const copyContainer = document.getElementById('copyContainer');
  const copyBtn       = document.getElementById('copyBtn');
  const downloadBtn   = document.getElementById('downloadBtn');
  const copyStatus    = document.getElementById('copyStatus');

  // Ensure a11y attributes exist even if HTML missed them
  if (errorText) {
    if (!errorText.getAttribute('role')) errorText.setAttribute('role', 'alert');
    if (!errorText.getAttribute('aria-live')) errorText.setAttribute('aria-live', 'polite');
  }

  const hasCode = () => (codeOutput?.textContent || '').trim().length > 0;
  const setCopyEnabled = (on) => {
    if (!copyBtn) return;
    if (on) {
      copyBtn.removeAttribute('disabled');
      copyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      copyBtn.setAttribute('disabled', 'true');
      copyBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  };

  function showPromptError(msg) {
    if (errorText) {
      errorText.textContent = msg || 'Please enter a valid prompt (min 10 characters).';
      errorText.classList.remove('hidden');
    }
    if (promptInput) {
      promptInput.setAttribute('aria-invalid', 'true');
      promptInput.classList.add('border-red-500', 'focus:ring-red-200', 'focus:border-red-400');
    }
    codeOutput?.classList.add('hidden');
    copyContainer?.classList.add('hidden');
    setCopyEnabled(false);
    generateBtn && (generateBtn.disabled = false);
    if (btnText) btnText.textContent = 'Generate Code';
    spinner?.classList.add('hidden');
  }

  function clearPromptError() {
    errorText?.classList.add('hidden');
    promptInput?.removeAttribute('aria-invalid');
    promptInput?.classList.remove('border-red-500', 'focus:ring-red-200', 'focus:border-red-400');
  }

  // Clear error as user types
  promptInput?.addEventListener('input', clearPromptError);

  // Prevent form navigation
  generatorForm?.addEventListener('submit', (e) => e.preventDefault());

  // Reset prompt-card listeners, then wire them
  document.querySelectorAll('.prompt-card').forEach((card) => { card.replaceWith(card.cloneNode(true)); });
  document.querySelectorAll('.prompt-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (promptInput) promptInput.value = card.textContent.trim();
      promptInput?.focus();
      clearPromptError();
    });
  });

  // Simulated async generator — replace with real fetch later
  async function generateCodeAsync(prompt) {
    // keep spinner visible for a beat so state feels responsive
    await new Promise(r => setTimeout(r, 800));
    const p = prompt.toLowerCase();

    // Testable failure path (type "error", "fail", or "network" in the prompt)
    if (p.includes('error') || p.includes('fail') || p.includes('network')) {
      // Example of how a real fetch error might bubble up:
      // const res = await fetch('/api/generate', { ... });
      // if (!res.ok) throw new Error('Service unavailable');
      throw new Error('Generation service is unavailable. Please try again.');
    }

    if (p.includes('navbar')) {
      return `<nav class="bg-blue-600 text-white p-4">
  <ul class="flex space-x-4">
    <li>Home</li>
    <li>Features</li>
    <li>Contact</li>
  </ul>
</nav>`;
    }
    if (p.includes('pricing')) {
      return `<section class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="bg-white shadow rounded p-4 text-center">
    <h3 class="text-lg font-bold">Basic</h3>
    <p class="text-xl font-semibold">$10/month</p>
  </div>
  <div class="bg-white shadow rounded p-4 text-center">
    <h3 class="text-lg font-bold">Pro</h3>
    <p class="text-xl font-semibold">$30/month</p>
  </div>
  <div class="bg-white shadow rounded p-4 text-center">
    <h3 class="text-lg font-bold">Enterprise</h3>
    <p class="text-xl font-semibold">Contact Us</p>
  </div>
</section>`;
    }
    if (p.includes('login')) {
      return `<form class="max-w-sm mx-auto p-4 bg-white shadow-md rounded">
  <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
  <input type="email" class="w-full p-2 mb-4 border border-gray-300 rounded" placeholder="you@example.com" />
  <label class="block mb-2 text-sm font-medium text-gray-700">Password</label>
  <input type="password" class="w-full p-2 mb-4 border border-gray-300 rounded" placeholder="••••••••" />
  <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Login</button>
</form>`;
    }
    return '// Feature coming soon: real-time AI-powered generation';
  }

  // Generate handler (validation + robust loading/error handling)
  generateBtn?.addEventListener('click', async () => {
    const prompt = (promptInput?.value || '').trim();

    if (!prompt || prompt.length < 10) {
      showPromptError('Please enter a valid prompt (min 10 characters).');
      return;
    }

    clearPromptError();
    generateBtn.disabled = true;
    if (btnText) btnText.textContent = 'Generating...';
    spinner?.classList.remove('hidden');

    try {
      const code = await generateCodeAsync(prompt);
      if (codeOutput) {
        codeOutput.innerHTML = highlightCode(code);
        codeOutput.classList.remove('hidden');
      }
      copyContainer?.classList.remove('hidden');
      setCopyEnabled(true);
    } catch (err) {
      showPromptError(err?.message || 'Something went wrong generating code.');
    } finally {
      generateBtn.disabled = false;
      if (btnText) btnText.textContent = 'Generate Code';
      spinner?.classList.add('hidden');
    }
  });

  // Keyboard shortcut: Ctrl/Cmd + Enter to generate
  promptInput?.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generateBtn?.click();
    }
  });

  // Copy button
  copyBtn?.addEventListener('click', async () => {
    if (!hasCode()) return;
    try {
      await safeCopy(codeOutput.textContent);
      copyStatus?.classList.remove('hidden');
      setTimeout(() => copyStatus?.classList.add('hidden'), 1200);
    } catch (e) { console.error('Copy failed', e); }
  });

  // Download button
  downloadBtn?.addEventListener('click', () => {
    if (!hasCode()) return;
    safeDownload('generated-code.txt', codeOutput.textContent);
  });

  // Initial state
  setCopyEnabled(hasCode());
}

// Keep this helper unchanged
function highlightCode(code) {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\b(const|function|return|let|var|if|else)\b/g, '<span class="text-blue-400">$1</span>')
    .replace(/("[^"]*"|'[^']*')/g, '<span class="text-yellow-300">$1</span>')
    .replace(/(\d+)/g, '<span class="text-pink-400">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="text-gray-500 italic">$1</span>');
}
