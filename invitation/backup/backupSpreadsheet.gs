function backupSpreadsheet() {
  // 環境変数から値を取得
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const folderId = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
  
  // 環境変数の存在チェック
  if (!spreadsheetId || !folderId) {
    throw new Error('環境変数 SPREADSHEET_ID または FOLDER_ID が設定されていません');
  }
  
  try {
    // スプレッドシートを取得
    const originalFile = DriveApp.getFileById(spreadsheetId);
    const originalName = originalFile.getName();
    
    // タイムスタンプを生成（yyyyMMddhhmmss形式）
    const now = new Date();
    const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
    
    // 新しいファイル名を作成
    const newFileName = `${originalName}_${timestamp}`;
    
    // 指定フォルダを取得
    const targetFolder = DriveApp.getFolderById(folderId);
    
    // スプレッドシートをコピー
    const copiedFile = originalFile.makeCopy(newFileName, targetFolder);
    
    console.log(`バックアップ完了: ${newFileName}`);
    console.log(`保存先フォルダID: ${folderId}`);
    console.log(`コピーされたファイルID: ${copiedFile.getId()}`);
    
    return {
      success: true,
      fileName: newFileName,
      fileId: copiedFile.getId()
    };
    
  } catch (error) {
    console.error('バックアップ処理でエラーが発生しました:', error);
    throw error;
  }
}

// 環境変数を設定する関数（初回設定用）
function setEnvironmentVariables() {
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // ここに実際のIDを設定してください
  scriptProperties.setProperty('SPREADSHEET_ID', 'your-spreadsheet-id-here');
  scriptProperties.setProperty('FOLDER_ID', 'your-folder-id-here');
  
  console.log('環境変数を設定しました');
}

// 環境変数を確認する関数（デバッグ用）
function checkEnvironmentVariables() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID');
  const folderId = scriptProperties.getProperty('FOLDER_ID');
  
  console.log('SPREADSHEET_ID:', spreadsheetId);
  console.log('FOLDER_ID:', folderId);
}