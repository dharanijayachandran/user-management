import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncrDecrService {

  // Secret key
  tokenFromUI: string = "0123456789123456";

  _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
  _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

  constructor() { }

  /* 
    Encrypt the message
  */
  encryptUsingAES(encrypt) {
/*     let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI); */
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(encrypt), this._key, {
      keySize: 16,
      iv: this._iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString().replace(/\+/g,'xMl3Jk');
  }

  /* 
    Decrypt the message
  */

  decryptUsingAES(encrypted) {
  /*   let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI); */

    let decrypted = CryptoJS.AES.decrypt(
      encrypted, this._key, {
      keySize: 16,
      iv: this._iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return decrypted;
  }

}
