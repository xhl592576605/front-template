import { AES } from 'crypto-js'

// todo: 更换自己的密钥
const SecretKey = 'SecretKey'

// 加密
const encrypt = (text: string, secretKey = SecretKey) => {
  return AES.encrypt(text, secretKey).toString()
}

// 解密
const decrypt = (text: string, secretKey = SecretKey) => {
  return AES.decrypt(text, secretKey)
}
export { encrypt, decrypt }
