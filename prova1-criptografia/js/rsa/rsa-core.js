
function generateRSAKeys(){
  const p = generateRandomPrime(100, 5000);
  let q = generateRandomPrime(100, 5000);

  while(p === q){
    q = generateRandomPrime(100, 5000);
  }

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);

  let e = 3n;

  while(gcd(e, phi) !== 1n){
    e += 2n;
  }

  const d = modInverse(e, phi);

  return{
    publicKey: { e: e, n: n },
    privateKey: { d: d, n: n },
    primes: { p: p, q: q, phi: phi }
  };
}

function encryptRSA(text, e, n){
  const encryptedNumbers = [];
  
  for(let i = 0; i < text.length; i++){
    const charCode = BigInt(text.charCodeAt(i)); 
    const encryptedChar = modExp(charCode, e, n); 
    
    encryptedNumbers.push(encryptedChar.toString());
  }
  
  return encryptedNumbers.join(" ");
}

function decryptRSA(cipherText, d, n){
  const cipherArray = cipherText.trim().split(" ");
  let decryptedText = "";

  for(let i = 0; i < cipherArray.length; i++){
    if(!cipherArray[i]) continue;
    
    const cipherNum = BigInt(cipherArray[i]);
    const decryptedCharCode = modExp(cipherNum, d, n);
    
    decryptedText += String.fromCharCode(Number(decryptedCharCode));
  }

  return decryptedText;
}
