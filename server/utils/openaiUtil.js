const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateQuestions = async (surveyName, surveyDescription, allQuestions, keyword) => {
  try {
    console.log('Generating AI keyword text analyzer definition...', keyword ? `(Target Keyword: ${keyword})` : '');

    // get all question and put it in one text
    const questionsText = allQuestions
      .map((question, i) => `${i + 1}. [${question.type}] ${question.text}`)
      .join('\n');

    // const questionsText1 = allQuestions.map((question,i) => {
    //   return `${i+1}. [${question.type}] ${question.text} \n`
    // })


    console.log('questionsText', questionsText);
    


    const prompt = `You are an expert in creating question.

        Survey Title: ${surveyName}  
        Survey Description: ${surveyDescription}
        Target Keyword: "${keyword || 'General Bot Detection'}"

        Task:
        Generate ONE insightful open-ended question that heavily targets the exact Target Keyword provided.
        This question should still organically fit into the overarching theme of the Survey Title and Description.
        
        Requirements:
        - The question MUST dynamically incorporate or explicitly target the concept of the Target Keyword: "${keyword || 'General context'}".
        - It should encourage detailed, meaningful responses (not yes/no).
        - It should verify genuine human thought around the keyword context.

        Output Format:
        Return ONLY a valid JSON array, with no extra text or explanation.

        [
          {
            "text": "Your question here?",
            "type": "TEXT"
          }
        ]`


    const response = await client.responses.create({
      model: "gpt-4-o", 
      input: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_output_tokens: 800
    });

    console.log('responses', response);

    const jsonText = response.output_text.trim();
    console.log('AI Response:', jsonText);

    const questions = JSON.parse(jsonText);
    console.log('Parsed questions:', questions);

    return questions;
  }
  catch (error) {
    console.error("Error generating bot detection questions:", error);
    throw error;
  }
};



// const checkRespose = async 

module.exports = { generateQuestions };
