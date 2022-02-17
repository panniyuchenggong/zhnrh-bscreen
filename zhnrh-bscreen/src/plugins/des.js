import cryptoJs from 'crypto-js';

export const encryptDes = (message, key) => {
	let keyHex = cryptoJs.enc.Utf8.parse(key);
	let option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 };
	let encrypted = cryptoJs.DES.encrypt(message, keyHex, option);
	return encrypted.toString();
};
export const decryptDes = (message, key) => {
	let keyHex = cryptoJs.enc.Utf8.parse(key);
	let decrypted = cryptoJs.DES.decrypt(
		{
			ciphertext: cryptoJs.enc.Base64.parse(message),
		},
		keyHex,
		{
			mode: cryptoJs.mode.ECB,
			padding: cryptoJs.pad.Pkcs7,
		}
	);
	return decrypted.toString(cryptoJs.enc.Utf8);
};
