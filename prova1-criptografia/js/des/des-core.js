function generateSubkeys(key64){
  const permutedKey = permute(key64, PC1, 64);
  
  let c = (permutedKey >> 28n) & 0xFFFFFFFn;
  let d = permutedKey & 0xFFFFFFFn;

  const subkeys = [];
  for (let i = 0; i < 16; i++){
    c = leftShift28(c, KEY_SHIFTS[i]);
    d = leftShift28(d, KEY_SHIFTS[i]);
    
    const cd = (c << 28n) | d;
    
    subkeys.push(permute(cd, PC2, 56)); 
  }
  return subkeys;
}

function feistelFunction(r, k){
  const er = permute(r, E, 32); 
  
  const xor = er ^ k;
  let sOutput = 0n;

  for(let i = 0; i < 8; i++){
    const shift = BigInt(42 - 6 * i);
    const block6 = Number((xor >> shift) & 0x3Fn);

    const row = ((block6 & 0x20) >> 4) | (block6 & 0x01);
    const col = (block6 >> 1) & 0x0F;
    
    const sVal = BigInt(S_BOXES[i][row * 16 + col]);
    
    sOutput = (sOutput << 4n) | sVal;
  }

  return permute(sOutput, P, 32);
}

function desProcessBlock(block64, subkeys){
  const permuted = permute(block64, IP, 64);
  
  let l = (permuted >> 32n) & 0xFFFFFFFFn;
  let r = permuted & 0xFFFFFFFFn;

  for(let i = 0; i < 16; i++){
    const fRes = feistelFunction(r, subkeys[i]); 
    const nextR = l ^ fRes;
    
    l = r;
    r = nextR;
  }

  const preOutput = (r << 32n) | l;
  
  return permute(preOutput, FP, 64);
}
