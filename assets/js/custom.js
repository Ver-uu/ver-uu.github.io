
document.addEventListener('DOMContentLoaded', function() {
  // 이메일 링크 선택
  const emailLink = document.querySelector('a[href="mailto:cityll.kr@gmail.com"]');

  if (emailLink) {
    // mailto: 기능 중단
    emailLink.addEventListener('click', function(event) {
      event.preventDefault();
      const emailAddress = 'cityll.kr@gmail.com';
      
      // 클립보드에 복사
      navigator.clipboard.writeText(emailAddress).then(() => {
        // "Copied!" 메시지 표시
        const originalIcon = emailLink.innerHTML;
        const copiedMsg = document.createElement('span');
        copiedMsg.textContent = 'Copied!';
        emailLink.parentNode.replaceChild(copiedMsg, emailLink);

        // 2초 후 원래 아이콘으로 복귀
        setTimeout(() => {
          copiedMsg.parentNode.replaceChild(emailLink, copiedMsg);
        }, 2000);

      }).catch(err => {
        console.error('Email copy failed: ', err);
      });
    });
  }
});
