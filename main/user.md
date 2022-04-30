### 用户体系


| 名称 |  登录方式 | 存储 | Pay |  |
| :---  | :---  | :--  | :--: | :--: |
| Local | Email+Password | S3 | Credit (Visa/mastercard) | |
| google | Google Account | Google Driver | Google Pay | |
| microsoft | Microsoft Account | One Driver | | |
| apple | Apple Id |  | Apple Pay |  |


```mermaid
flowchart TB

L[登录] --> SSO[SSO登录]
L --已注册--> Lc[本地登录]
L --未注册--> Ls[本地注册]
Ls --> Reg[Email+Password]
Reg --> RSuc[注册成功]
Lc --> Form[Email+Password]
Form --> Suc[登录成功]
SSO --> Auth[Google/MicroSoft/Apple授权]
Auth --存在--> Suc
Auth --不存在--> Sreg[使用GoogleID自动创建账户]
Sreg --> Suc
```

```mermaid
erDiagram

users {
  string id PK "UID"
  string nickname "昵称"
  string password "密码"
  string google "google账号登录"
  string microsoft "microsoft账号登录"
  string apple "Apple ID登录"
  date last "最后登录时间"
}

```