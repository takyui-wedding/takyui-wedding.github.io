# スプレッドシート バックアップスクリプト

Google Apps Scriptを使用してスプレッドシートを自動バックアップするスクリプトです。

## 機能

- スプレッドシートを指定のGoogleドライブフォルダにコピー
- コピー時にタイムスタンプ（`_yyyyMMddhhmmss`形式）を付与
- 環境変数による設定管理

## セットアップ

### 1. Google Apps Scriptプロジェクトの作成

1. [Google Apps Script](https://script.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. `backupSpreadsheet.gs`の内容をコピー＆ペースト

### 2. 環境変数の設定

初回のみ、以下の手順で環境変数を設定：

1. `setEnvironmentVariables()`関数内のIDを実際の値に変更
```javascript
scriptProperties.setProperty('SPREADSHEET_ID', 'your-spreadsheet-id-here');
scriptProperties.setProperty('FOLDER_ID', 'your-folder-id-here');
```

2. `setEnvironmentVariables()`関数を実行

### 3. 権限の承認

初回実行時にGoogleドライブへのアクセス権限を求められるので承認してください。

## 使用方法

### 手動実行

Apps Scriptエディタから`backupSpreadsheet()`関数を実行

### 定期実行の設定

1. Apps Scriptエディタで「トリガー」をクリック
2. 「トリガーを追加」をクリック
3. 以下を設定：
   - 実行する関数: `backupSpreadsheet`
   - イベントのソース: 時間主導型
   - 時間ベースのトリガーのタイプ: 任意（日次、週次など）

## 関数一覧

| 関数名 | 説明 |
|--------|------|
| `backupSpreadsheet()` | メインのバックアップ処理 |
| `setEnvironmentVariables()` | 環境変数の初期設定 |
| `checkEnvironmentVariables()` | 環境変数の確認（デバッグ用） |

## ID の取得方法

### スプレッドシートID
スプレッドシートのURLから取得：
```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
```

### フォルダID
GoogleドライブのフォルダURLから取得：
```
https://drive.google.com/drive/folders/{FOLDER_ID}
```

## エラー対処

環境変数が設定されていない場合、以下のエラーが表示されます：
```
Error: 環境変数 SPREADSHEET_ID または FOLDER_ID が設定されていません
```

この場合は`setEnvironmentVariables()`を実行して環境変数を設定してください。

## ログの確認

Apps Scriptエディタの「実行数」から実行ログを確認できます。
バックアップ成功時は以下の情報が記録されます：
- バックアップファイル名
- 保存先フォルダID
- コピーされたファイルID