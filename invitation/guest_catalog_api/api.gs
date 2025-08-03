function doGet(e) {
  console.log('[doGet] 開始 - パラメータ:', JSON.stringify(e.parameter));
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // 30秒間待機

    var method = e.parameter.method;
    var payload;

    switch(method){
      case "最大ゲストID取得":
        var maxGuestId = getMaxGuestId();
        payload = JSON.stringify({
            maxGuestId: maxGuestId  
          });
        break;

      case "最大ゲストID番号取得":
        var maxGuestIdNm = getMaxGuestIdNm();
        payload = JSON.stringify({
            maxGuestIdNm: maxGuestIdNm
          });
        break;

      case "動画URL取得":
        var guestId = e.parameter.guestId;
        var movieUrrl = getMovieUrl(guestId);
        payload = JSON.stringify({
            movieUrrl: movieUrrl
          });
        break;

      case "ゲスト情報取得":
        var guestId = e.parameter.guestId;
        console.log(e.parameter.guestId)
        var guestList = getGuestList(guestId);
        payload = JSON.stringify({
            guestList: guestList
          });
        break;

      default:
        break;
    }
    
  } catch (e) {
    Logger.log('処理中にエラーが発生しました: ' + e.toString());
    console.log('[doGet] エラー:', e.toString());
  } finally {
    lock.releaseLock();
    console.log('[doGet] 終了 - レスポンス:', payload);
    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  console.log('[doPost] 開始');
  console.log('[doPost] リクエストボディ:', e.postData.contents);

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // 30秒間待機
    var requestBody = e.postData.contents;
    var jsonData = JSON.parse(requestBody);
    var method = jsonData.method;
    var payload;
    console.log('[doPost] メソッド:', method);

    switch(method){
      case "ゲスト一覧登録":
        var guestList = jsonData.guestList;
        console.log('[doPost] ゲスト一覧:', guestList);

        var guestId = createGuestId();
        for(var index in guestList){
          var guest = guestList[index];
          guest.guestId = guestId;
          guest.companionId = index;
          insertGuest(guest);
        }

        payload = JSON.stringify({
            method: "POST",
            guestId: guestId,
          });
        break;

      case "出席フラグ更新":
        var guestId = jsonData.guestId;
        console.log('[doPost] ゲストID:', guestId);

        var message = updateAttendanceFlag(guestId)

        payload = JSON.stringify({
            method: "POST",
            guestId: guestId,
            message: message,
          });
        break;

      default:
        break;
    }
      
  } catch (e) {
    Logger.log('処理中にエラーが発生しました: ' + e.toString());
    console.log('[doPost] エラー:', e.toString());
  } finally {
    lock.releaseLock();
    console.log('[doPost] 終了 - レスポンス:', payload);
    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
  }
}