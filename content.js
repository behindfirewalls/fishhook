chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "scanEmail") {
        // This is where we'll implement email scanning logic later
        sendResponse({result: "Email scanned (placeholder result)"});
      }
    }
  );
  function extractEmailContent() {
    const emailBody = document.querySelector('.a3s.aiL');
    if (!emailBody) return null;
  
    const subject = document.querySelector('h2.hP').textContent;
    const sender = document.querySelector('.gD').getAttribute('email');
    const content = emailBody.innerText;
  
    return { subject, sender, content };
  }
  
  function analyzeEmail(emailData) {
    let score = 0;
    let reasons = [];
  
    // Check for suspicious words in subject
    const suspiciousSubjectWords = ['urgent', 'account', 'suspended', 'verify', 'login'];
    if (suspiciousSubjectWords.some(word => emailData.subject.toLowerCase().includes(word))) {
      score += 20;
      reasons.push("Suspicious words in subject");
    }
  
    // Check for mismatched sender domain
    const senderDomain = emailData.sender.split('@')[1];
    if (emailData.content.includes('@') && !emailData.content.includes(senderDomain)) {
      score += 30;
      reasons.push("Mismatched sender domain");
    }
  
    // Check for suspicious links
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = emailData.content.match(urlRegex) || [];
    if (urls.some(url => !url.includes(senderDomain))) {
      score += 25;
      reasons.push("Suspicious links detected");
    }
  
    // Check for urgent language
    const urgentPhrases = ['act now', 'immediate action', 'account closure', 'security alert'];
    if (urgentPhrases.some(phrase => emailData.content.toLowerCase().includes(phrase))) {
      score += 15;
      reasons.push("Urgent language detected");
    }
    // ML-based prediction
const features = [
    suspiciousSubjectWords.some(word => emailData.subject.toLowerCase().includes(word)) ? 1 : 0,
    emailData.content.includes('@') && !emailData.content.includes(senderDomain) ? 1 : 0,
    urls.some(url => !url.includes(senderDomain)) ? 1 : 0,
    urgentPhrases.some(phrase => emailData.content.toLowerCase().includes(phrase)) ? 1 : 0
  ];
  
  const mlScore = predictPhishing(features) * 100;
  score = (score + mlScore) / 2;  // Combine rule-based and ML scores
  
    return { score, reasons };
  }
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "scanEmail") {
        const emailData = extractEmailContent();
        if (!emailData) {
          sendResponse({error: "No email content found"});
          return;
        }
        const analysis = analyzeEmail(emailData);
        sendResponse({result: analysis});
      }
    }
  );