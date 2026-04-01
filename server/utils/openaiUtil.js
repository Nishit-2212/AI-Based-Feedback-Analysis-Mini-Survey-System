const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateQuestions = async (surveyName, surveyDescription, allQuestions) => {
  try {
    console.log('Generating AI bot detection questions...');

    // Format survey context
    // const questionsText = allQuestions
    //   .map((q, i) => `${i + 1}. [${q.type}] ${q.text}`)
    //   .join('\n');

    // console.log('questionsText',questionsText);

    // const prompt = `You are an expert in survey design and bot detection.
    
    //   Survey Title: "${surveyName}"
    //   Survey Description: "${surveyDescription}"

    //   Original Survey Questions:
    //   ${questionsText}

    //   Your Task: Generate 1 bot detection questions that:
    //   1. Are related to the survey topic but different from original questions
    //   2. Help verify if the respondent is a genuine human (not a bot/AI)
    //   3. Should be natural and not obvious as bot detection questions
    //   4. must be TEXT (open-ended) type

    //   Return ONLY a valid JSON array, nothing else:
    //   [
    //     {
    //       "text": "Question text here?",
    //       "type": "TEXT"
    //     }
    //   ]`;

    // const response = await client.responses.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: prompt }],
    //   max_tokens: 500
    // });

    // const jsonText = response.choices[0].message.content.trim();
    // console.log('AI Response:', jsonText);

    // const questions = JSON.parse(jsonText);
    // console.log('Parsed questions:', questions);

    // return questions;
  } catch (error) {
    console.error("Error generating bot detection questions:", error);
    throw error;
  }
};



// const checkRespose = async 

module.exports = { generateQuestions };
