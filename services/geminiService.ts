import { GoogleGenAI, Type } from "@google/genai";
import { Expense, AnalysisResult } from '../types';

export const analyzeExpenses = async (expenses: Expense[], currencyCode: string): Promise<AnalysisResult> => {
  if (expenses.length === 0) {
    return {
      summary: "尚未有消費紀錄。請新增您的第一筆旅遊支出！",
      advice: ["使用下方的 + 按鈕來記帳。"],
      budgetStatus: "good"
    };
  }

  // Prepare data for the prompt
  const expenseSummary = expenses.map(e => 
    `- ${e.date}: ${e.category} (${e.description}) - ${e.amount} ${e.currency}`
  ).join('\n');

  const prompt = `
    你是個專業的旅遊記帳助手。請分析以下的消費紀錄。
    使用者的主要情境是旅遊，請將幣值視為相對的旅遊支出。
    
    消費紀錄:
    ${expenseSummary}

    請提供：
    1. 簡短的消費習慣總結 (最多兩句，語氣親切)。
    2. 3 個具體的省錢建議或消費觀察 (例如："你在交通上花費較多")。
    3. 預算狀態: "good" (良好), "warning" (注意), "critical" (危險)。

    請務必以繁體中文 (Traditional Chinese) 回傳符合此 JSON Schema 的格式。
  `;

  try {
    // Initialize client here to avoid top-level crash if API key is missing
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                advice: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                budgetStatus: { type: Type.STRING, enum: ["good", "warning", "critical"] }
            },
            required: ["summary", "advice", "budgetStatus"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
        summary: "暫時無法分析數據。",
        advice: ["請確認 API Key 設定。", "稍後再試。"],
        budgetStatus: "warning"
    };
  }
};