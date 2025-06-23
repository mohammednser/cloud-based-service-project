# حذف ملفات ومجلدات AWS Amplify (Hosting)

يمكنك الآن حذف الملفات التالية بأمان لأنها خاصة باستضافة Amplify فقط:

- amplify.yml
- buildspec.yml
- src/amplifyconfiguration.json
- src/aws-exports.js

إذا كان لديك مجلد باسم amplify/ أو أي ملفات backend أخرى متعلقة بـ Amplify يمكنك حذفها أيضًا.

**ملاحظة:**
- لا تحذف ملفات أو إعدادات AppSync أو التخزين (S3) إذا كنت ما زلت تستخدمها في الوظائف السحابية (رفع/بحث/تصنيف...)
- بعد الحذف، اختبر المشروع محليًا ثم ارفع التعديلات إلى GitHub وواصل النشر على Netlify.
