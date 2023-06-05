let capsLockOn = false; // Tracks the state of the Caps Lock key

document.addEventListener('keydown', function(event) {
  if (event.getModifierState && event.getModifierState('CapsLock')) {
    capsLockOn = true;
    updateCapsLockMessage();
  }
});

document.addEventListener('keyup', function(event) {
  if (event.getModifierState && !event.getModifierState('CapsLock')) {
    capsLockOn = false;
    updateCapsLockMessage();
  }
});

function updateCapsLockMessage() {
  var message = document.getElementById('caps-lock-message');
  if (capsLockOn) {
    message.style.display = 'block';
  } else {
    message.style.display = 'none';
  }
}

var throttledUpdateCapsLockMessage = throttle(updateCapsLockMessage, 200);

var passwordInputs = document.querySelectorAll('input[type="password"]');
passwordInputs.forEach(function(input) {
  input.addEventListener('input', throttledUpdateCapsLockMessage);
});

function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function(...args) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    if (!timeoutId && timeSinceLastExec >= delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - timeSinceLastExec);
    }
  };
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function bulkDownload(tableElement) {
  let txtContent = "";
  const rows = Array.from(tableElement.getElementsByTagName("tr"));

  rows.forEach((row) => {
    const codeCell = row.querySelector("p");
    if (codeCell) {
      const code = codeCell.innerText.trim();
      txtContent += code + "\n";
    }
  });

  const blob = new Blob([txtContent], { type: "text/plain" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "codes.txt";
  anchor.click();
}