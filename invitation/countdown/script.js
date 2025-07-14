document.addEventListener('DOMContentLoaded', () => {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const countdownDisplayEl = document.querySelector('.countdown-display'); // 日数と時分秒の親コンテナ
    const mainTitleEl = document.querySelector('.main-title'); // メインタイトル
    const countdownFinishedEl = document.getElementById('countdown-finished');

    // ターゲット日時 (年/月/日 時:分:秒)
    const targetDate = new Date('2025/09/28 10:00:00').getTime(); // PIARYのサイトと同じ日付
    // 現在の日時 (2025/05/10 JST) でテストする場合、以下のように近い未来の日付で試すと動作確認しやすいです
    // const targetDate = new Date(new Date().getTime() + 10 * 1000).getTime(); // 10秒後など

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // カウントダウン終了
            if (mainTitleEl) mainTitleEl.style.display = 'none'; // タイトルを非表示
            if (countdownDisplayEl) countdownDisplayEl.style.display = 'none'; // 日数と時分秒を非表示
            if (countdownFinishedEl) countdownFinishedEl.style.display = 'block'; // 終了メッセージを表示
            clearInterval(interval); // タイマーを停止
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown(); // 初期表示
});