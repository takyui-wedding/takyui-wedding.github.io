# ゲストカタログAPI仕様書

## 概要
結婚式招待状のゲスト管理を行うGoogle Apps Script (GAS) APIです。  
スプレッドシートをデータベースとして使用し、ゲスト情報の登録・取得・更新を行います。

## 基本情報
- **エンドポイント**: Google Apps ScriptのWeb App URL
- **認証**: なし（Google Apps Scriptの公開設定に依存）
- **データ形式**: JSON

## 環境変数
以下の環境変数をGoogle Apps ScriptのScript Propertiesに設定する必要があります：
- `SPREADSHEET_ID`: 対象のGoogleスプレッドシートのID
- `SPREADSHEET_SHEETNAME`: 対象のシート名

## API一覧

### 1. GET メソッド

#### 1.1 最大ゲストID取得
現在登録されている最大のゲストIDを取得します。

**リクエスト**
```
GET ?method=最大ゲストID取得
```

**レスポンス**
```json
{
  "maxGuestId": "G048V"
}
```

#### 1.2 最大ゲストID番号取得
現在登録されている最大のゲストID番号（2桁の数値部分）を取得します。

**リクエスト**
```
GET ?method=最大ゲストID番号取得
```

**レスポンス**
```json
{
  "maxGuestIdNm": "48"
}
```

#### 1.3 動画URL取得
指定したゲストIDの動画URLを取得します。

**リクエスト**
```
GET ?method=動画URL取得&guestId={ゲストID}
```

**パラメータ**
- `guestId` (必須): 取得対象のゲストID

**レスポンス**
```json
{
  "movieUrl": "https://example.com/movie/12345"
}
```

#### 1.4 ゲスト情報取得
ゲスト情報を取得します。ゲストIDまたは氏名カナを指定して検索できます。

**リクエスト**
```
GET ?method=ゲスト情報取得&guestId={ゲストID}
GET ?method=ゲスト情報取得&nameKana={氏名カナ}
GET ?method=ゲスト情報取得
```

**パラメータ**
- `guestId` (任意): 取得対象のゲストID
- `nameKana` (任意): 検索対象の氏名カナ

**検索ロジック**
- `guestId`が指定されている場合：該当するゲストIDの情報を取得
- `nameKana`が指定されている場合：該当する氏名カナの情報を取得
- 両方とも指定されていない場合：全ゲスト情報を取得

**レスポンス**
```json
{
  "guestList": [
    {
      "guestId": "G048V",
      "companionId": "0",
      "guestCategory": "新郎側",
      "relationship": "友人",
      "nameKanji": "山田太郎",
      "lastNameKanji": "山田",
      "firstNameKanji": "太郎",
      "nameKana": "ヤマダタロウ",
      "lastNameKana": "ヤマダ",
      "firstNameKana": "タロウ",
      "gender": "男性",
      "emailAddress": "email@example.com",
      "postalCode": "'1008111",
      "address": "東京都千代田区千代田１−１",
      "comment": "この度はおめでとうございます。",
      "answerTimestamp": "2025-01-25: 10:30:45.123",
      "registerTimestamp": "2025-01-25: 10:30:45.123",
      "updateTimestamp": "2025-01-25: 10:30:45.123",
      "movieUrl": "https://example.com/movie/12345",
      "attendanceFlag": "1"
    }
  ]
}
```

### 2. POST メソッド

#### 2.1 ゲスト一覧登録
新規ゲストを登録します。複数のゲスト（同伴者含む）を一括で登録可能です。

**リクエスト**
```
POST
Content-Type: application/json

{
  "method": "ゲスト一覧登録",
  "guestList": [
    {
      "guestId": "",
      "companionId": "",
      "guestCategory": "新郎側",
      "nameKanji": "山田太郎",
      "lastNameKanji": "山田",
      "firstNameKanji": "太郎",
      "nameKana": "ヤマダタロウ",
      "lastNameKana": "ヤマダ",
      "firstNameKana": "タロウ",
      "gender": "男性",
      "emailAddress": "email@example.com",
      "postalCode": "1008111",
      "address": "東京都千代田区千代田１−１",
      "comment": "この度はおめでとうございます。",
      "answerTimestamp": "2025-01-25: 10:30:45.123"
    }
  ]
}
```

**フィールド説明**
- `guestId`: 空文字（自動採番）
- `companionId`: 空文字（自動採番：0から連番）
- `guestCategory`: ゲスト区分（"新郎側" / "新婦側"）
- `nameKanji`: 氏名（漢字）
- `lastNameKanji`: 姓（漢字）
- `firstNameKanji`: 名（漢字）
- `nameKana`: 氏名（カナ）
- `lastNameKana`: 姓（カナ）
- `firstNameKana`: 名（カナ）
- `gender`: 性別（任意）
- `emailAddress`: メールアドレス
- `postalCode`: 郵便番号（ハイフンなし）
- `address`: 住所
- `comment`: コメント
- `answerTimestamp`: 回答日時（形式: yyyy-MM-dd: HH:mm:ss.SSS）

**レスポンス**
```json
{
  "method": "POST",
  "guestId": "G049A"
}
```

#### 2.2 出席フラグ更新
指定したゲストの出席フラグを更新します（トグル動作）。

**リクエスト**
```
POST
Content-Type: application/json

{
  "method": "出席フラグ更新",
  "guestId": "G048V"
}
```

**パラメータ**
- `guestId` (必須): 更新対象のゲストID

**レスポンス**
```json
{
  "method": "POST",
  "guestId": "G048V",
  "message": "出席済に更新しました。"
}
```

**メッセージ**
- 未出席→出席: "出席済に更新しました。"
- 出席→未出席: "未出席に更新しました。"

## ゲストIDの形式
ゲストIDは以下の形式で自動生成されます：
- 形式: `G[連番2桁][数字1桁][アルファベット1文字]`
- 例: `G014W`, `G048V`

## エラーハンドリング
- 環境変数が設定されていない場合: `Error: 環境変数 {key} が設定されていません`
- 排他制御: 30秒のロックタイムアウト設定あり
- エラー発生時はGoogle Apps Scriptのログに記録されます

## スプレッドシートのカラム構成
以下の順番でデータが格納されます：

| 列 | 項目名 | 説明 |
|----|--------|------|
| A | ゲストID | 一意のID |
| B | 同伴者ID | 同伴者の識別番号 |
| C | ゲスト区分 | 新郎側/新婦側 |
| D | 関係 | ゲストとの関係 |
| E | 氏名（漢字） | フルネーム |
| F | 氏名_性（漢字） | 姓 |
| G | 氏名_名（漢字） | 名 |
| H | 氏名（カナ） | フルネーム（カナ） |
| I | 氏名_性（カナ） | 姓（カナ） |
| J | 氏名_名（カナ） | 名（カナ） |
| K | 性別 | 性別 |
| L | メールアドレス | 連絡先メール |
| M | 郵便番号 | 先頭に'を付けて文字列として保存 |
| N | 住所 | 住所 |
| O | コメント | 自由記入欄 |
| P | 回答日時 | フォーム回答日時 |
| Q | 登録日時 | システム登録日時 |
| R | 更新日時 | システム更新日時 |
| S | 動画URL | 関連動画のURL |
| T | 出席フラグ | 1:出席済、空:未出席 |