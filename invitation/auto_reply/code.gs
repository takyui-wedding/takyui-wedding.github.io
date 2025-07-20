const guestCatalogApiUrl = getEnvironmentVariable('API_URL');

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
  var answerTimestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd: HH:mm:ss.SSS'); //回答日時

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
    //回答日時セット
    representativeGuest.answerTimestamp = answerTimestamp;

  }

  guestList.push(representativeGuest);

  for(var i = 1; i <= companionCount; i++){
    var companionGuest = initializeGuest()
    companionGuest.lastNameKanji = companionList[i * 4 - 4];
    companionGuest.firstNameKanji = companionList[i * 4 - 3];
    companionGuest.lastNameKana = companionList[i * 4 - 2];
    companionGuest.firstNameKana = companionList[i * 4 - 1];
    companionGuest.nameKanji = companionGuest.lastNameKanji + companionGuest.firstNameKanji
    companionGuest.nameKana = companionGuest.lastNameKana + companionGuest.lastNameKana
    //回答日時セット
    companionGuest.answerTimestamp = answerTimestamp;
    guestList.push(companionGuest);
  }
  
  if(attendanceFlag){
    var param = {};
    param.method = 'ゲスト一覧登録';
    param.guestList = guestList;

    const guestId = callGuestCatalogApi_Post(param).guestId;
    console.log(guestId);

    sendImportantEmail(emailAddress,guestId,createToName(guestList));
  }
}

// 環境変数管理
function getEnvironmentVariable(key) {
  // Google Apps Scriptでは環境変数にScript Propertiesを使用
  const scriptProperties = PropertiesService.getScriptProperties();
  const value = scriptProperties.getProperty(key);
  
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }
  
  return value;
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
          answerTimestamp: Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd: HH:mm:ss.SSS')
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

function sendImportantEmail(email,guestId,name) {
  console.log("start：sendImportantEmail")
  var subject = 'ご回答ありがとうございました。';

  //本文.htmlをgetContent
  var html = HtmlService.createHtmlOutputFromFile("mail_content").getContent().replace(/{{ゲストID}}/g, guestId).replace(/{{NAME}}/g, name); 

  var qr_image = createQrCode(guestId);

  GmailApp.sendEmail(email, subject, html, { 
    to: email, 
    subject: subject,  
    htmlBody: html, 
    inlineImages:{qr_image:qr_image}
  });
}

function createQrCode(code_data) {
  console.log("start：createQrCode："+code_data)
  var url = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + code_data;
  var option = {
      method: "get",
      muteHttpExceptions: true
    };
  var response = UrlFetchApp.fetch(url, option);
  var fileBlob = response.getBlob();
  var folderId = getEnvironmentVariable('FOLDER_ID');
  var folder = DriveApp.getFolderById(folderId);
  var fileName = code_data + '_' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMddhhmmss')+ '.png';
  var file = folder.createFile(fileBlob).setName(fileName);
  var fileUrl = file.getUrl();
  var fileId = fileUrl.replace("https://drive.google.com/file/d/","").replace("/view?usp=drivesdk","");
  return DriveApp.getFileById(fileId).getBlob();
}

function createToName(guestList) {
  console.log("start：createToName");
  var name = '';
  for (var i = 0; i < guestList.length; i++) {
    if(i == 0){
      name = name + guestList[i].nameKanji+' 様';
    }else{
      name = name + '<br>' + guestList[i].nameKanji+' 様';
    }
  }

  return name;
}

