function permute(value, table, inBits){
  let res = 0n;
  for(let i = 0; i < table.length; i++){
    const bitPos = BigInt(inBits - table[i]);
    const bit = (value >> bitPos) & 1n;
    res = (res << 1n) | bit;
  }
  return res;
}

function leftShift28(val, shifts){
  const mask = 0xFFFFFFFn;

  return ((val << BigInt(shifts)) | (val >> BigInt(28 - shifts))) & mask;
}

function bytesToBigInt64(bytes, offset){
  let val = 0n;
  for(let i = 0; i < 8; i++){
    val = (val << 8n) | BigInt(bytes[offset + i]);
  }
  return val;
}

function bigInt64ToBytes(val, outBytes, offset){
  for (let i = 7; i >= 0; i--) {
    outBytes[offset + i] = Number(val & 0xFFn);
    val >>= 8n;
  }
}
