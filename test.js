const inputStr = 'aaabbcccdd'

const encode = input => {
  let res = ''
  for (let i=0, len=input.length; i<len; i++) {
    if (input[i-1] && (input[i-1] === input[i])) {
      let lastOne = res[res.length - 1];
      if (parseInt(lastOne)) {
        res = res.slice(0, -1) + (parseInt(lastOne) + 1)
      } else {
        res = res + 2
      }
    } else {
      res += input[i]
    }
  }
  return res
}


console.warn(encode(inputStr))