
function debugGetMaxGuestId(){
  const e = {
    parameter:{
      method: '最大ゲストID取得'
    }
  }
  const b = doGet(e);
}

function debugGetMaxGuestIdNm(){
  const e = {
    parameter:{
      method: '最大ゲストID番号取得'
    }
  }
  const b = doGet(e);
}

function debugGetMovieUrl(){
  const e = {
    parameter:{
      method: '動画URL取得',
      guestId: 'G014W'
    }
  }
  const b = doGet(e);
}

function debugInsertGuest(){
  const body = {
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

  const e = {
    postData: {
      contents: JSON.stringify(body)
    }
  }
  const b = doPost(e);
}

function debugGuestList(){
  const e = {
    parameter:{
      method: 'ゲスト情報取得'
      //guestId: 'G048V'
    }
  }
  const b = doGet(e);
}

function debugUpdateAttendanceFlag(){
  const body = {
    method: '出席フラグ更新',
      guestId: 'G048V'
    }
  const e = {
    postData: {
      contents: JSON.stringify(body)
    }
  }

  const b = doPost(e);
}