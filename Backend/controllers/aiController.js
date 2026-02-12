// const { GoogleGenAI } = require("@google/genai");
const OpenAi = require("openai");

const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");

const ai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.chatanywhere.tech/v1",
});

//@desc   Generate interview Questions ans answers using gemini
//@route  POST /api/ai/generate-questions
//@access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    );

    const response = await ai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    let rawText = response.choices[0].message.content;

    //clean it: Remove ```json and ```from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") //remove string ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); //remove extra space

    //Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate Questions",
      error: error.message,
    });
  }
};

//@desc   Generate Explains a interview Questions
//@route  POST /api/ai/generate-explanation
//@access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        message: "Missing Required Fields",
      });
    }
    const prompt = conceptExplainPrompt(question);

    const response = await ai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    let rawText = response.choices[0].message.content;

    //clean it: Remove ```json and ```from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "") //remove string ```json
      .replace(/```$/, "") // remove ending ```
      .trim(); //remove extra space

    //Now safe to parse
    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate Explanation",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
