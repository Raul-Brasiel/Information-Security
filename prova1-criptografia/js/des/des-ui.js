function getParsedKey() {
  const rawKey = document.getElementById("keyInput").value;
  const enc = new TextEncoder().encode(rawKey);
  const keyBytes = new Uint8Array(8);

  keyBytes.set(enc.slice(0, 8)); 
  return bytesToBigInt64(keyBytes, 0);
}

function triggerDownload(data, filename) {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url); 
}

document.getElementById("btnEncrypt").addEventListener("click", () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Selecione um arquivo.");
  
  const keyStr = document.getElementById("keyInput").value;
  if(keyStr.length < 8) return alert("A chave precisa ter exatamente 8 caracteres para maior segurança!");

  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const plainBytes = new Uint8Array(e.target.result);
      const key = getParsedKey();
      const encrypted = encryptData(plainBytes, key);
      
      triggerDownload(encrypted, file.name + ".des");
      alert("Sucesso! O arquivo foi cifrado.");
    } catch (err) {
      alert("Erro ao criptografar: " + err.message);
    }
  };
  
  reader.readAsArrayBuffer(file);
});

document.getElementById("btnDecrypt").addEventListener("click", () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Selecione um arquivo (.des).");

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const cipherBytes = new Uint8Array(e.target.result);
      const key = getParsedKey();
      
      const decrypted = decryptData(cipherBytes, key);
      
      const originalName = file.name.endsWith(".des") ? file.name.slice(0, -4) : "restaurado_" + file.name;
      triggerDownload(decrypted, originalName);
      alert("Sucesso! Arquivo decifrado.");
    } catch (err) {
      alert("Erro ao descriptografar: " + err.message);
    }
  };
  
  reader.readAsArrayBuffer(file);
});
