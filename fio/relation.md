## 账户

Users
/  local: email + password
/  local: StudentId + password
√  google: google.sub
o  zoom: zoom.id

School
o  school + Users
-  school + StudentId + Users

Content slide api
√  slide auth -> google.auth drive + presetation -> google.sub + google.email -> google.refreshToken
√  Slide create welcome   -> drive.copy
o  Slide copy file        -> drive.copy, todo: slide.remove()
√  Slide save thumb       -> limit 60 pages/min
o  Slide download         -> limit 10Mb file size
o  Slide get json (new)   -> easy, todo: url need download
-  Slide copy json (new)  -> hard, todo: elements parse, batchUpdate

Content new
√   list, manage
o   task edit
o   pd edit
-   video edit

Workshop
√   list, manage
-   Create
o   calendar

Session
√   list, manage
-   Create
o   calendar

Unit new
-   list, manage
-   unit edit

google.refreshToken
√  google.sub, google.email, google.refreshToken

zoom.refreshToken
√  zoom.id, google.refreshToken

