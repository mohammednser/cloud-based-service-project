// استدعاء تصنيف المستند من خدمة NLP Cloud
// يتطلب وجود متغير بيئة REACT_APP_NLP_CLOUD_API_KEY

export async function classifyWithNlpCloud(text: string): Promise<string | null> {
  const apiKey = process.env.REACT_APP_NLP_CLOUD_API_KEY;
  if (!apiKey) return null;

  // مثال: استخدام نموذج التصنيف الجاهز من NLP Cloud (تأكد من اسم النموذج)
  const url = 'https://api.nlpcloud.io/v1/classification/distilbert-base-uncased-finetuned-sst-2-english/classification';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    // استخرج التصنيف من الاستجابة (تأكد من البنية حسب وثائق NLP Cloud)
    if (data && data.classification) {
      return data.classification[0]?.label || null;
    }
    return null;
  } catch (e) {
    return null;
  }
}
