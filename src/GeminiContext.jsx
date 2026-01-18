import { createContext, useContext } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GeminiContext = createContext();

export const GeminiProvider = ({ children }) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
  
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const askAIAdvisor = async (question, context = '') => {
    try {
      const systemPrompt = `คุณเป็นผู้เชี่ยวชาญการเกษตรพิเศษด้านทุเรียน โดยเน้นที่:
1. การดูแลรักษาโรคพืช (โรคราน้ำหนึ่ง, แบคทีเรีย, ราคำ, หนอนและแมลงศัตรู)
2. การทำทุเรียนนอกฤดูในพื้นที่ ต.กรุงชิง จังหวัดนครสวรรค์

บริบท:
- สถานีปลูก: 6 สถานีในพื้นที่ (สถานีหมอนทอง, ถ้ำหลวง, สวนนบ, ไทรห้อย, หลังโรงเรียน, 13 ไร่)
- พื้นที่: ต.กรุงชิง อำเภอทำดวง จังหวัดนครสวรรค์
- ภูมิอากาศ: อบอุ่นชื้น (เหมาะสำหรับทุเรียน)
- ปัญหาพื้นที่: โรคราน้ำหนึ่ง, อากาศชื้น, ฝนตกตามฤดูกาล
${context}

คำตอบควร:
- เป็นภาษาไทย ชัดเจนและเข้าใจง่าย
- มีคำแนะนำจำเพาะเจาะจง
- อ้างอิงความรู้เกษตรที่ได้รับการตรวจสอบ
- ให้คำแนะนำการป้องกันและแก้ไข`;

      const prompt = `${systemPrompt}\n\nคำถาม: ${question}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('เกิดข้อผิดพลาดในการติดต่อ AI Advisor: ' + error.message);
    }
  };

  return (
    <GeminiContext.Provider value={{ askAIAdvisor }}>
      {children}
    </GeminiContext.Provider>
  );
};

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGemini must be used within GeminiProvider');
  }
  return context;
};
