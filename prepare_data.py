import pandas as pd
import numpy as np

np.random.seed(0)

def generate_email(is_phishing):
    words = ['urgent', 'account', 'verify', 'bank', 'security', 'update', 'password', 'confirm', 
             'suspicious', 'important', 'action', 'required', 'login', 'unusual', 'activity']
    num_words = np.random.randint(3, 10)
    subject = ' '.join(np.random.choice(words, num_words))
    
    sender_domain = 'legit.com' if not is_phishing else f'phish{np.random.randint(100)}.com'
    sender = f'user{np.random.randint(1000)}@{sender_domain}'
    
    has_urgent_language = np.random.random() < (0.8 if is_phishing else 0.3)
    has_suspicious_links = np.random.random() < (0.9 if is_phishing else 0.1)
    has_attachment = np.random.random() < (0.6 if is_phishing else 0.4)
    
    body_content = ' '.join(np.random.choice(words, np.random.randint(20, 100)))
    
    return {
        'subject': subject,
        'sender': sender,
        'has_urgent_language': has_urgent_language,
        'has_suspicious_links': has_suspicious_links,
        'has_attachment': has_attachment,
        'body_content': body_content,
        'is_phishing': is_phishing
    }

num_samples = 20000
data = [generate_email(i >= num_samples/2) for i in range(num_samples)]

df = pd.DataFrame(data)
df.to_csv('phishing_dataset.csv', index=False)

print("Enhanced dataset created and saved as 'phishing_dataset.csv'")