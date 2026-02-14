const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => `
    You are an AI trained to generate technical interview question and answers.

    Task:
    - Role: ${role}
    - candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocus}
    - write ${numberOfQuestions} interview questions.
    - For each answer needs a code example, and a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
      {
         "question": "Question here?",
         "answer" : "Answer here."
      },
      ...
    ]
      Important: Do NOT add any extra text. Only return valid JSON.
      
    `;

const conceptExplainPrompt = (question) => `
        You are an AI trained to generate explanations for a given interview question.

        Task:

        - Explain the following interview question and its concept in depth as you're teaching a beginner developer.
        - Question: "${question}"
        - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
        - If the explanation includes a code example, provide a small code block.
        - Keep the formatting very clean and clear.
        - Return the result as a valid JSON object in the following format:

        {
           "title": "Short title here?",
           "explanation":"Explanation here."

        }
        
        Important: Do NOT add any extra text outside JSON format. Only return valid JSON.
        `;

    const generalQuestionExplainPrompt = (question)=>{
      `
You are an expert interviewer.

Your job is to generate a strong, interview-ready answer for the given question.

Question: "${question}"

Instructions:
- Write the answer as if you are speaking in an interview.
- Start with a short direct answer (2-3 lines).
- Then explain the concept in a simple beginner-friendly way.
- Include real-world example(s) if possible.
- If the question is technical, include a small clean code example.
- Add common mistakes or misconceptions (if applicable).
- Keep the formatting clean, readable, and structured.
- Do not include unnecessary filler text.

Return ONLY valid JSON in the format below:

{
  "question": "${question}",
  "shortAnswer": "",
  "detailedAnswer": "",
  "example": "",
  "code": "",
  "commonMistakes": [
    ""
  ]
}

Important:
- Do NOT add any extra text outside JSON format.
- Only return valid JSON.
`;

    }
module.exports = {questionAnswerPrompt, conceptExplainPrompt,generalQuestionExplainPrompt};