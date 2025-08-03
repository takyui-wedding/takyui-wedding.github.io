const spreadsheetId = getEnvironmentVariable('SPREADSHEET_ID');
const sheetName = getEnvironmentVariable('SPREADSHEET_SHEETNAME');
const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

function getMaxGuestId(){
  console.log('[getMaxGuestId] 開始');
  
  var lastRow = sheet.getLastRow();
  var maxGuestId = sheet.getRange(lastRow,1).getValue();
  if(maxGuestId == 'ゲストID'){
    maxGuestId = 'G001A';
  }

  console.log('[getMaxGuestId] 終了 - 戻り値:', maxGuestId);
  return maxGuestId;
}

function getMaxGuestIdNm(){
  console.log('[getMaxGuestIdNm] 開始');
  
  var lastRow = sheet.getLastRow();
  var maxGuestId = sheet.getRange(lastRow,1).getValue();
  var maxGuestIdNm = '';
  if(maxGuestId == 'ゲストID'){
    maxGuestIdNm = '00';
  }else{
    // 1. 文字列の2文字目と3文字目を切り出す
    // JavaScript/GASのインデックスは0から始まるため、2文字目はインデックス1, 3文字目はインデックス2
    // substring(開始インデックス, 終了インデックスの手前)
    maxGuestIdNm = maxGuestId.substring(1, 3);
  }

  console.log('[getMaxGuestIdNm] 終了 - 戻り値:', maxGuestIdNm);
  return maxGuestIdNm;
}

function createGuestId(){
  console.log('[createGuestId] 開始');
  
  const maxGuestIdNm = getMaxGuestIdNm();

  // 2. 切り出した文字列を10進数の数値に変換
  const numberValue = parseInt(maxGuestIdNm, 10);

  // 3. 数値に1を加算
  const incrementedValue = numberValue + 1;

  // 4. 結果を文字列に変換し、padStartで2桁にフォーマットする
  // padStart(目標の長さ, 埋める文字)
  // 結果が1桁の場合 (例: 6)、先頭に '0' が追加されて "06" になる
  // 結果が2桁以上の場合 (例: 10)、そのまま "10" になる
  const formattedResult = incrementedValue.toString().padStart(2, '0');

  const newGuestId = 'G'+formattedResult + getRandomDigitAndLetter();
  console.log('[createGuestId] 終了 - 戻り値:', newGuestId);
  return newGuestId;
}

function insertGuest(guest){
  console.log('[insertGuest] 開始 - 引数:', guest);
  
  var nowTimestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd: HH:mm:ss.SSS');

  var guestInfo = [];
  // ゲストID
  guestInfo[0] = guest.guestId;
  // 同伴者ID
  guestInfo[1] = guest.companionId;
  // ゲスト区分
  guestInfo[2] = guest.guestCategory;
  // 関係
  guestInfo[3] = '';
  // 氏名（漢字）
  guestInfo[4] = guest.nameKanji;
  // 氏名_性（漢字）
  guestInfo[5] = guest.lastNameKanji;
  // 氏名_名（漢字）
  guestInfo[6] = guest.firstNameKanji;
  // 氏名（カナ）
  guestInfo[7] = guest.nameKana;
  // 氏名_性（カナ）
  guestInfo[8] = guest.lastNameKana;
  // 氏名_名（カナ）
  guestInfo[9] = guest.firstNameKana;
  // 性別
  guestInfo[10] = '';
  // メールアドレス
  guestInfo[11] = guest.emailAddress;
  // 郵便番号
  guestInfo[12] = "'"+guest.postalCode;
  // 住所
  guestInfo[13] = guest.address;
  // コメント
  guestInfo[14] = guest.comment;
  // 回答日時
  guestInfo[15] = guest.answerTimestamp;
  // 登録日時
  guestInfo[16] = nowTimestamp;
  // 更新日時
  guestInfo[17] = nowTimestamp;
  // 動画URL
  guestInfo[18] = '';
  // 出席フラグ
  guestInfo[19] = '';

  sheet.appendRow(guestInfo);
  console.log('[insertGuest] 終了');
}

function getMovieUrl(guestId){
  console.log('[getMovieUrl] 開始 - 引数:', guestId);

  //Googleスプレッドシートのセル範囲を取得
  var range = sheet.getDataRange();
  //Googleスプレッドシートのセル範囲のデータを取得
  var values = range.getValues();

  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == guestId) {
      const movieUrl = values[i][18];
      console.log('[getMovieUrl] 終了 - 戻り値:', movieUrl);
      return movieUrl;
    }
  }

  console.log('[getMovieUrl] 終了 - 戻り値: undefined (該当なし)');
}

function getGuestList(guestId){
  console.log('[getGuestList] 開始 - 引数:', guestId);

  //Googleスプレッドシートのセル範囲を取得
  var range = sheet.getDataRange();
  //Googleスプレッドシートのセル範囲のデータを取得
  var values = range.getValues();

  var guestList = [];

  for (var i = 0; i < values.length; i++) {
    if (!guestId || values[i][0] == guestId) {
      var guestInfo = {};

      // ゲストID
      guestInfo.guestId = values[i][0];
      // 同伴者ID
      guestInfo.companionId = values[i][1];
      // ゲスト区分
      guestInfo.guestCategory = values[i][2];
      // 関係
      guestInfo.relationship = values[i][3];
      // 氏名（漢字）
      guestInfo.nameKanji = values[i][4];
      // 氏名_性（漢字）
      guestInfo.lastNameKanji = values[i][5];
      // 氏名_名（漢字）
      guestInfo.firstNameKanji = values[i][6];
      // 氏名（カナ）
      guestInfo.nameKana = values[i][7];
      // 氏名_性（カナ）
      guestInfo.lastNameKana = values[i][8];
      // 氏名_名（カナ）
      guestInfo.firstNameKana = values[i][9];
      // 性別
      guestInfo.gender = values[i][10];
      // メールアドレス
      guestInfo.emailAddress = values[i][11];
      // 郵便番号
      guestInfo.postalCode = values[i][12];
      // 住所
      guestInfo.address = values[i][13];
      // コメント
      guestInfo.comment = values[i][14];
      // 回答日時
      guestInfo.answerTimestamp = values[i][15];
      // 登録日時
      guestInfo.registerTimestamp = values[i][16];
      // 更新日時
      guestInfo.updateTimestamp = values[i][17];
      // 動画URL
      guestInfo.movieUrl = values[i][18];
      // 出席フラグ
      guestInfo.attendanceFlag = values[i][19];

      guestList.push(guestInfo);
    }
  }

  console.log('[getGuestList] 終了 - 戻り値:件数=', guestList.length);
  return guestList;
}

function updateAttendanceFlag(guestId){
  console.log('[updateAttendanceFlag] 開始 - 引数:', guestId);

  //Googleスプレッドシートのセル範囲を取得
  var range = sheet.getDataRange();
  //Googleスプレッドシートのセル範囲のデータを取得
  var values = range.getValues();

  var message = "";

  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == guestId) {
      var attendanceFlag = values[i][19];
      var range = sheet.getRange(getCellAddress(i+1, 20));
      
      if(attendanceFlag == "1"){
        range.setValue("");
        message = "未出席に更新しました。";
      }else{
        range.setValue("1");
        message = "出席済に更新しました。";
      }
    }
  }

  console.log('[updateAttendanceFlag] 終了 - 戻り値:', message);
  return message;

}
