### 文件服务
> 媒体文件URL格式  
{CDNurl}/{sha1}.{ext}

> 媒体文件上传接口  
POST {API}/files?sha1={sha1}&ext={ext}  
form-data  file

> 媒体文件接口  
新增关联数据上报 {API}/files/{sha1}?add[]={db}{table}{id}&add[]=...  
删除关联数据上报 {API}/files/{sha1}?del[]={db}{table}{id}&del[]=...  
用户空间信息 {API}/files_user?uid={user_id}&sid={school_id}  

```mermaid
flowchart TB

B[浏览器选择文件] --FileReader+CryptoJS--> C(本地计算出sha1)
C --> I{查询是否存在}
  subgraph API
    I --不存在--> A[上传到S3]
  end
I --存在--> S[上传成功]
A --> S
S --> R[关联更新API]
R --> Rp[上报关联数据]

```

```mermaid
erDiagram

school }o--o{ user : "many to many"
school ||--o{ files_user : "one to many"
user ||--|| files_user : "one to one"
files }o--o{ files_rel : "many to many"
files_rel }o--|| files_user : "one to many"
material ||--o{ files : "one to many"
response ||--o{ files : "one to many"
remark ||--o{ files : "one to many"

files {
  string id PK "文件sha1，用于秒传，文件去重"
  string ext "文件格式，文件后缀"
  string size "文件大小"
  int public "是否公开访问"
  array refs "关联数据"
  method url "前端用的url地址, 代码生成，不存数据库"
  remark files "公共使用，"
}

files_rel {
  int id PK
  string uid FK "用户ID"
  int sid "学校ID"
  string hash "文件id+ext"
  string size "文件大小，用于统计用户空间占用"
}
files_user {
  int id PK ""
  string uid "用户ID"
  int sid "学校ID"
  int free "默认用户赠送空间"
  int plan_size "套餐购买后的空间"
  int lib_size "发布到Library后，优质课件奖励空间"
  int total "总可用空间 = free+plan_size+lib_size"
  int used "当前的使用空间合计，SUM(files_rel.size)"
}


```