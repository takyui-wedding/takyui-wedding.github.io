function debugCallApi(){
  console.log("start：debugCallApi")
  var param = {};
  param.method = '最大ゲストID取得';
  const json = callGuestCatalogApi_Get(param);
  console.log(json.maxGuestId);

}

function debugInsertGuest(){
  console.log("start：debugInsertGuest")
  const e = {
    parameter:{
      method: 'ゲスト一覧登録',
      guestList: [
        {
          guestId: "",
          companionId: "",
          guestCategory: "新郎側",
          nameKanji: "山田太郎",
          lastNameKanji: "山田",
          firstNameKanji: "太郎",
          nameKana: "ヤマダタロウ",
          lastNameKana: "ヤマダ",
          firstNameKana: "タロウ",
          gender: "男性",
          emailAddress: "email@example.com",
          postalCode: "1008111",
          address: "東京都千代田区千代田１−１",
          comment: "この度はおめでとうございます。",
          answerTimestamp: Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd: HH:mm:ss.SSS')
        },
        {
          guestId: "",
          companionId: "",
          guestCategory: "",
          nameKanji: "山田花子",
          lastNameKanji: "山田",
          firstNameKanji: "花子",
          nameKana: "ヤマダハナコ",
          lastNameKana: "ヤマダ",
          firstNameKana: "ハナコ",
          gender: "",
          emailAddress: "",
          postalCode: "",
          address: "",
          comment: "",
          answerTimestamp: Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd: HH:mm:ss.SSS')
        }
      ]
    }
  };

    var param = {};
    param.method = 'ゲスト一覧登録';
    param.guestList = e.parameter.guestList;
    
    var payload = {};
    payload.parameter = param;

    callGuestCatalogApi_Post(param);
}

function debugSendEmail(){
  console.log("start：debugSendEmail")
  var email = 'email@example.com'
  var guestId = 'TEST2'
  var name = '山田太郎様'

  sendImportantEmail(email,guestId,name)

}