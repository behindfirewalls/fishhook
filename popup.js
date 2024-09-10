document.addEventListener('DOMContentLoaded', function() {
    var scanButton = document.getElementById('scanButton');
    var resultDiv = document.getElementById('result');
  
    scanButton.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "scanEmail"}, function(response) {
          if (response.error) {
            resultDiv.innerHTML = `<p>Error: ${response.error}</p>`;
          } else if (response.result) {
            const { score, reasons } = response.result;
            let color = score > 70 ? 'red' : (score > 40 ? 'orange' : 'green');
            let html = `<p style="color: ${color}">Phishing probability: ${score}%</p>`;
            if (reasons.length > 0) {
              html += '<ul>' + reasons.map(reason => `<li>${reason}</li>`).join('') + '</ul>';
            }
            resultDiv.innerHTML = html;
          } else {
            resultDiv.innerHTML = "<p>Unable to scan email. Make sure you're on Gmail.</p>";
          }
        });
      });
    });
  });