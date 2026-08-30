document.getElementById("btnGenerateRSAKeys").addEventListener("click", () => {
  const keys = generateRSAKeys();
  
  document.getElementById("rsaPubKey").value = `${keys.publicKey.e}, ${keys.publicKey.n}`;
  document.getElementById("rsaPrivKey").value = `${keys.privateKey.d}, ${keys.privateKey.n}`;
  
  console.log("RSA Chaves Geradas!", keys);
  alert("Chaves RSA geradas com sucesso!");
});

document.getElementById("btnEncryptRSA").addEventListener("click", () => {
  const message = document.getElementById("rsaMessageInput").value;
  const pubKeyStr = document.getElementById("rsaPubKey").value;
  
  if (!message) return alert("Digite uma mensagem para cifrar.");
  if (!pubKeyStr) return alert("Por favor, gere ou cole uma chave pública primeiro.");
  
  try {
    const parts = pubKeyStr.split(",");
    const e = BigInt(parts[0].trim());
    const n = BigInt(parts[1].trim());
    
    const encrypted = encryptRSA(message, e, n);
    
    document.getElementById("rsaOutput").value = encrypted;
    document.getElementById("rsaMessageInput").value = "";
    alert("Mensagem cifrada com a chave pública!");
  } catch (err){
    alert("Erro ao cifrar: " + err.message);
  }
});

document.getElementById("btnDecryptRSA").addEventListener("click", () => {
  const cipherMessage = document.getElementById("rsaMessageInput").value;
  const privKeyStr = document.getElementById("rsaPrivKey").value;
  
  if (!cipherMessage) return alert("Cole os números cifrados na caixa de mensagem.");
  if (!privKeyStr) return alert("Por favor, gere ou cole uma chave privada primeiro.");
  
  try {
    const parts = privKeyStr.split(",");
    const d = BigInt(parts[0].trim());
    const n = BigInt(parts[1].trim());
    
    const decrypted = decryptRSA(cipherMessage, d, n);
    
    document.getElementById("rsaOutput").value = decrypted;
    document.getElementById("rsaMessageInput").value = "";
    alert("Mensagem decifrada com a chave privada!");
  } catch (err) {
    alert("Erro ao decifrar: " + err.message);
  }
});
