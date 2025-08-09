// デバッグ用のAPI呼び出し関数群

// APIのベースURL（デプロイ後に実際のURLに置き換えてください）
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxlXXRkMNBqmNQLmMCVOfyKlDY0h9VijZcG3j9CNQGoE5bnNv9k0601QozsFOr_Duz-/exec';

// 1. 最大ゲストID取得のテスト
function testGetMaxGuestId() {
  console.log('=== 最大ゲストID取得テスト ===');
  const url = API_BASE_URL + '?method=最大ゲストID取得';
  
  try {
    const response = UrlFetchApp.fetch(url);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('最大ゲストID:', result.maxGuestId);
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// 2. 最大ゲストID番号取得のテスト
function testGetMaxGuestIdNm() {
  console.log('=== 最大ゲストID番号取得テスト ===');
  const url = API_BASE_URL + '?method=最大ゲストID番号取得';
  
  try {
    const response = UrlFetchApp.fetch(url);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('最大ゲストID番号:', result.maxGuestIdNm);
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// 3. 動画URL取得のテスト
function testGetMovieUrl() {
  console.log('=== 動画URL取得テスト ===');
  const guestId = 'G048V'; // テスト用のゲストID
  const url = API_BASE_URL + '?method=動画URL取得&guestId=' + guestId;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('動画URL:', result.movieUrl);
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// 4. ゲスト情報取得のテスト（全件）
function testGetGuestListAll() {
  console.log('=== ゲスト情報取得テスト（全件） ===');
  const url = API_BASE_URL + '?method=ゲスト情報取得';
  
  try {
    const response = UrlFetchApp.fetch(url);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('取得件数:', result.guestList.length);
    if (result.guestList.length > 0) {
      console.log('1件目のデータ:', result.guestList[0]);
    }
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// 5. ゲスト情報取得のテスト（ID指定）
function testGetGuestListById() {
  console.log('=== ゲスト情報取得テスト（ID指定） ===');
  const guestId = 'G048V'; // テスト用のゲストID
  const url = API_BASE_URL + '?method=ゲスト情報取得&guestId=' + guestId;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('取得件数:', result.guestList.length);
    if (result.guestList.length > 0) {
      console.log('取得データ:', result.guestList[0]);
    }
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// 6. ゲスト情報取得のテスト（カナ指定）
function testGetGuestListByKana() {
  console.log('=== ゲスト情報取得テスト（カナ指定） ===');
  const nameKana = 'ヤマダタロウ'; // テスト用の氏名カナ
  const url = API_BASE_URL + '?method=ゲスト情報取得&nameKana=' + encodeURIComponent(nameKana);
  
  try {
    const response = UrlFetchApp.fetch(url);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('取得件数:', result.guestList.length);
    if (result.guestList.length > 0) {
      console.log('取得データ:', result.guestList[0]);
    }
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// 7. ゲスト一覧登録のテスト
function testCreateGuestList() {
  console.log('=== ゲスト一覧登録テスト ===');
  
  const payload = {
    method: 'ゲスト一覧登録',
    guestList: [
      {
        guestId: '',
        companionId: '',
        guestCategory: '新郎側',
        nameKanji: 'テスト太郎',
        lastNameKanji: 'テスト',
        firstNameKanji: '太郎',
        nameKana: 'テストタロウ',
        lastNameKana: 'テスト',
        firstNameKana: 'タロウ',
        gender: '男性',
        emailAddress: 'test@example.com',
        postalCode: '1000001',
        address: '東京都千代田区千代田1-1',
        comment: 'テスト登録です',
        answerTimestamp: new Date().toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          fractionalSecondDigits: 3
        }).replace(/\//g, '-')
      },
      {
        guestId: '',
        companionId: '',
        guestCategory: '新郎側',
        nameKanji: 'テスト花子',
        lastNameKanji: 'テスト',
        firstNameKanji: '花子',
        nameKana: 'テストハナコ',
        lastNameKana: 'テスト',
        firstNameKana: 'ハナコ',
        gender: '女性',
        emailAddress: 'test2@example.com',
        postalCode: '1000001',
        address: '東京都千代田区千代田1-1',
        comment: 'テスト登録です（同伴者）',
        answerTimestamp: new Date().toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          fractionalSecondDigits: 3
        }).replace(/\//g, '-')
      }
    ]
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(API_BASE_URL, options);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('登録されたゲストID:', result.guestId);
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// 8. 出席フラグ更新のテスト
function testUpdateAttendanceFlag() {
  console.log('=== 出席フラグ更新テスト ===');
  
  const payload = {
    method: '出席フラグ更新',
    guestId: 'G048V' // テスト用のゲストID
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(API_BASE_URL, options);
    const result = JSON.parse(response.getContentText());
    console.log('レスポンス:', result);
    console.log('メッセージ:', result.message);
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}

// すべてのGETメソッドをテスト
function testAllGetMethods() {
  testGetMaxGuestId();
  Utilities.sleep(1000);
  
  testGetMaxGuestIdNm();
  Utilities.sleep(1000);
  
  testGetMovieUrl();
  Utilities.sleep(1000);
  
  testGetGuestListAll();
  Utilities.sleep(1000);
  
  testGetGuestListById();
  Utilities.sleep(1000);
  
  testGetGuestListByKana();
}

// すべてのPOSTメソッドをテスト
function testAllPostMethods() {
  testCreateGuestList();
  Utilities.sleep(1000);
  
  testUpdateAttendanceFlag();
}

// すべてのメソッドをテスト
function testAllMethods() {
  console.log('========== APIテスト開始 ==========');
  testAllGetMethods();
  Utilities.sleep(2000);
  testAllPostMethods();
  console.log('========== APIテスト完了 ==========');
}

// 特定のゲストIDでデータの整合性をチェック
function checkGuestDataIntegrity(guestId) {
  console.log('=== データ整合性チェック ===');
  console.log('対象ゲストID:', guestId);
  
  // ゲスト情報取得
  const url = API_BASE_URL + '?method=ゲスト情報取得&guestId=' + guestId;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const result = JSON.parse(response.getContentText());
    
    if (result.guestList.length === 0) {
      console.log('指定されたゲストIDのデータが見つかりません');
      return;
    }
    
    const guest = result.guestList[0];
    console.log('取得データ:', guest);
    
    // データチェック
    const errors = [];
    
    // 必須項目のチェック
    if (!guest.guestId) errors.push('ゲストIDが空です');
    if (!guest.guestCategory) errors.push('ゲスト区分が空です');
    if (!guest.nameKanji) errors.push('氏名（漢字）が空です');
    if (!guest.nameKana) errors.push('氏名（カナ）が空です');
    
    // フォーマットチェック
    if (guest.guestId && !guest.guestId.match(/^G\d{2}\d[A-Z]$/)) {
      errors.push('ゲストIDのフォーマットが不正です');
    }
    
    if (guest.postalCode && !guest.postalCode.match(/^'?\d{7}$/)) {
      errors.push('郵便番号のフォーマットが不正です');
    }
    
    // 結果出力
    if (errors.length > 0) {
      console.log('エラー:');
      errors.forEach(error => console.log('  - ' + error));
    } else {
      console.log('データ整合性: OK');
    }
    
  } catch (e) {
    console.error('エラー:', e.toString());
  }
}