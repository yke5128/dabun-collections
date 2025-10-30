function goBack() {
      if (history.length <= 1 || document.referrer === "") {
        window.location.href = 'index.html';
      } else {
        history.back();
      }
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    function scrollToBottom() {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }