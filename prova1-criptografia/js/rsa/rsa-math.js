function gcd(a, b){
  while(b !== 0n){
    let temp = b;

    b = a % b;
    a = temp;
  }
  return a;
}

function modInverse(e, phi) {
  let m0 = phi;
  let y = 0n;
  let x = 1n;

  if(phi === 1n) return 0n;

  while(e > 1n){
    let q = e / phi;
    let t = phi;

    phi = e % phi;
    e = t;
    t = y;

    y = x - q * y;
    x = t;
  }
  if(x < 0n) x += m0;

  return x;
}

function modExp(base, exp, mod){
  let res = 1n;
  base = base % mod;

  while(exp > 0n){
    if(exp % 2n === 1n){
      res = (res * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }

  return res;
}

function isPrime(num){
  if(num <= 1n) return false;
  if(num === 2n || num === 3n) return true;
  if(num % 2n === 0n || num % 3n === 0n) return false;

  for(let i = 5n; i * i <= num; i += 6n){
    if(num % i === 0n || num % (i + 2n) === 0n) return false;
  }

  return true;
}

function generateRandomPrime(min, max){
  min = BigInt(min);
  max = BigInt(max);
  
  while (true){
    let range = Number(max - min);
    let rand = BigInt(Math.floor(Math.random() * range));
    let candidate = min + rand;
    
    if(candidate % 2n === 0n) candidate++;
    
    if(isPrime(candidate)){
      return candidate;
    }
  }
}
