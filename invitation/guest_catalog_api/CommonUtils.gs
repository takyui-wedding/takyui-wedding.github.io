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

/**
 * 0～9の数字とA～Zの大文字アルファベットを組み合わせた文字列 (例: 0A, 9Z) の中から
 * ランダムに1つを返却します。
 *
 * @return {string} ランダムに生成された数字とアルファベットの組み合わせ文字列。
 */
function getRandomDigitAndLetter() {
  // 0から9までのランダムな整数を生成
  const randomNumber = Math.floor(Math.random() * 10);

  // AからZまでのランダムな大文字アルファベットを生成
  // 'A' の文字コード (Unicode) は 65
  // 0から25までのランダムな整数を生成し、65に加算することで
  // 65 ('A') から 90 ('Z') までの文字コードをランダムに取得
  const randomCharCode = 65 + Math.floor(Math.random() * 26);
  const randomAlphabet = String.fromCharCode(randomCharCode);

  // 生成した数字とアルファベットを文字列として結合して返す
  return randomNumber.toString() + randomAlphabet;
}

/**
 * 行番号と列番号を受け取り、スプレッドシートのセル番地を返します。
 * 例: (1, 1) -> "A1", (5, 2) -> "B5"
 *
 * @param {number} row 行番号 (1以上の整数)
 * @param {number} column 列番号 (1以上の整数)
 * @return {string} セルの番地 (例: "A1", "C2")
 * @throws {Error} rowまたはcolumnが1未満の場合にエラーをスローします。
 */
function getCellAddress(row, column) {
  if (row < 1 || column < 1) {
    throw new Error("行番号と列番号は1以上の整数である必要があります。");
  }

  let columnAddress = '';
  let colNum = column;

  // 列番号をアルファベットに変換
  while (colNum > 0) {
    let remainder = (colNum - 1) % 26;
    columnAddress = String.fromCharCode(65 + remainder) + columnAddress;
    colNum = Math.floor((colNum - 1) / 26);
  }

  return columnAddress + row;
}