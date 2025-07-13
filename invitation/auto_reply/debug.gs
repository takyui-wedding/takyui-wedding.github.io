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
          nameKanji: "中田拓実",
          lastNameKanji: "中田",
          firstNameKanji: "拓実",
          nameKana: "ナカダタクミ",
          lastNameKana: "ナカダ",
          firstNameKana: "タクミ",
          gender: "男性",
          emailAddress: "codebreaker4423@gmail.com",
          postalCode: "187-0002",
          address: "東京都小平市花小金井6-3-7　みやび野ハイツ306",
          comment: "この度はおめでとうございます。",
          answerTimestamp: Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd: hh:mm:ss.SSS')
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
  var email = 'codebreaker4423@gmail.com'
  var guestId = 'TEST1'

  sendImportantEmail(email,guestId)

}