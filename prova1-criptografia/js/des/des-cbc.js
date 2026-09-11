function encryptData(plainBytes, key64) {
  const subkeys = generateSubkeys(key64);

  const padLen = 8 - (plainBytes.length % 8);
  const padded = new Uint8Array(plainBytes.length + padLen);
  padded.set(plainBytes);
  padded.fill(padLen, plainBytes.length);

  const iv = new Uint8Array(8);
  crypto.getRandomValues(iv);

  const totalBlocks = padded.length / 8;
  const cipherBytes = new Uint8Array(8 + padded.length); 
  cipherBytes.set(iv, 0);

  let prevBlock = bytesToBigInt64(iv, 0);

  for (let i = 0; i < totalBlocks; i++) {
    const plainBlock = bytesToBigInt64(padded, i * 8);
    const xorBlock = plainBlock ^ prevBlock; 
    const encBlock = desProcessBlock(xorBlock, subkeys);
    
    bigInt64ToBytes(encBlock, cipherBytes, 8 + (i * 8));
    prevBlock = encBlock;
  }

  return cipherBytes;
}

function decryptData(cipherBytes, key64) {
  if (cipherBytes.length < 16 || cipherBytes.length % 8 !== 0) {
    throw new Error("Arquivo corrompido ou tamanho inválido.");
  }

  const subkeys = generateSubkeys(key64).reverse();
  let prevBlock = bytesToBigInt64(cipherBytes, 0);
  const totalBlocks = (cipherBytes.length - 8) / 8;
  const decrypted = new Uint8Array(totalBlocks * 8);

  for (let i = 0; i < totalBlocks; i++) {
    const currentCipher = bytesToBigInt64(cipherBytes, 8 + (i * 8));
    const decBlock = desProcessBlock(currentCipher, subkeys);
    const plainBlock = decBlock ^ prevBlock;
    
    bigInt64ToBytes(plainBlock, decrypted, i * 8);
    prevBlock = currentCipher;
  }

  const padLen = decrypted[decrypted.length - 1];
  
  if (padLen < 1 || padLen > 8) throw new Error("Falha de autenticação ou chave incorreta.");
  
  for (let i = decrypted.length - padLen; i < decrypted.length; i++) {
    if (decrypted[i] !== padLen) throw new Error("Padding inválido. Verifique a chave.");
  }

  return decrypted.slice(0, decrypted.length - padLen);
}
