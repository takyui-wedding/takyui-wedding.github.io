const guestCatalogApiUrl = 'https://example.com'

function onSubmit(e) {
  console.log("start：onSubmit")
  var responses = e.response.getItemResponses();

  var attendanceFlag = false;
  var companionCount = 0;
  var emailAddress = "";
  var guestList = [];
  //var companionList = {};
  var companionList = [];
  var representativeGuest = initializeGuest(); //代表ゲスト

  for(var index in responses){
    var title = responses[index].getItem().getTitle();
    var answer = responses[index].getResponse();
    console.log(title + "：" + answer);

    if(title == '出欠' && answer == '出席'){
      attendanceFlag = true;
    }

    if(title == 'メールアドレス'){
      emailAddress = answer;
    }

    if(title == '同伴者数' && answer != 'なし'){
      companionCount = Number(answer.substring(0,1));
    }

    if(title != '同伴者数' && title.substring(0,3) == '同伴者'){
      //companionList[title] = answer;
      companionList.push(answer);
    }

    switch(title){
      case "ゲスト区分":
        representativeGuest.guestCategory = answer;
        break;
      case "氏名：性（漢字）":
        representativeGuest.lastNameKanji = answer;
        break;
      case "氏名：名（漢字）":
        representativeGuest.firstNameKanji = answer;
        break;
      case "氏名：性（カナ）":
        representativeGuest.lastNameKana = answer;
        break;
      case "氏名：名（カナ）":
        representativeGuest.firstNameKana = answer;
        break;
      case "性別":
        representativeGuest.gender = answer;
        break;
      case "メールアドレス":
        representativeGuest.emailAddress = answer;
        break;
      case "郵便番号":
        representativeGuest.postalCode = answer;
        break;
      case "住所":
        representativeGuest.address = answer;
        break;
      case "コメント":
        representativeGuest.comment = answer;
        break;
      default:
        break;
    }

    //氏名（漢字）
    representativeGuest.nameKanji = representativeGuest.lastNameKanji + representativeGuest.firstNameKanji;
    //氏名（カナ）
    representativeGuest.nameKana = representativeGuest.lastNameKana + representativeGuest.firstNameKana;

  }

  guestList.push(representativeGuest);

  for(var i = 1; i <= companionCount; i++){
    var companionGuest = initializeGuest()
    companionGuest.nameKanji = companionList[i * 2 - 1];
    companionGuest.nameKana = companionList[i * 2];
    guestList.push(companionGuest);
  }
  
  if(attendanceFlag){
    var param = {};
    param.method = 'ゲスト一覧登録';
    param.guestList = guestList;

    const guestId = callGuestCatalogApi_Post(param).guestId;
    console.log(guestId);

    sendImportantEmail(emailAddress,guestId);
  }
}

function initializeGuest(){
  console.log("start：initializeGuest")
  const initGuest = {
          guestId: "",
          companionId: "",
          guestCategory: "",
          nameKanji: "",
          lastNameKanji: "",
          firstNameKanji: "",
          nameKana: "",
          lastNameKana: "",
          firstNameKana: "",
          gender: "",
          emailAddress: "",
          postalCode: "",
          address: "",
          comment: "",
          answerTimestamp: Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd: hh:mm:ss.SSS')
        }
  return initGuest;
}

function callGuestCatalogApi_Get(params) {
  console.log("start：callGuestCatalogApi_Get")
  // パラメータオブジェクトをクエリストリングに変換
  const queryString = Object.keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');
  
  const url = queryString ? `${guestCatalogApiUrl}?${queryString}` : guestCatalogApiUrl;

  // UrlFetchAppのオプション設定
  const options = {
    'method' : 'get',
    'muteHttpExceptions': true // trueにすると、HTTPエラー(4xx, 5xx)が発生しても例外をスローせず、レスポンスオブジェクトを返す
  };
  
  // APIにGETリクエストを送信
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

function callGuestCatalogApi_Post(payload) {
  console.log("start：callGuestCatalogApi_Post")
  console.log(payload);
  const options = {
    'method' : 'post',
    'contentType': 'application/json', // コンテントタイプをJSONに指定
    'payload' : JSON.stringify(payload) // ペイロードをJSON文字列に変換
  };

  const response = UrlFetchApp.fetch(guestCatalogApiUrl, options);
  console.log(response.getContentText());
  return JSON.parse(response.getContentText());
}

function sendImportantEmail(email,guestId) {
  console.log("start：sendImportantEmail")
  var subject = 'ご回答ありがとうございました。';

  //本文.htmlをgetContent
  var html = HtmlService.createHtmlOutputFromFile("mail_content").getContent(); 

  var qr_image = createQrCode(guestId);

  GmailApp.sendEmail(email, subject, html, { 
    to: email, 
    subject: subject,  
    htmlBody: html, 
    inlineImages:{qr_image:qr_image}
  });
}

function createQrCode(code_data) {
  console.log("start：createQrCode")
  var url = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + code_data;
  var option = {
      method: "get",
      muteHttpExceptions: true
    };
  var response = UrlFetchApp.fetch(url, option);
  var fileBlob = response.getBlob();
  var folder = DriveApp.getFolderById("1vVYpoP7PJlsq3VugTe6_O_UiJtHSb4da");
  var fileName = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMddhhmmss')+ '.png';
  var file = folder.createFile(fileBlob).setName(fileName);
  var fileUrl = file.getUrl();
  var fileId = fileUrl.replace("https://drive.google.com/file/d/","").replace("/view?usp=drivesdk","");
  return DriveApp.getFileById(fileId).getBlob();
}

