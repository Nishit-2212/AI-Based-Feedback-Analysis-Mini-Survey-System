const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateQuestions = async (surveyName, surveyDescription, allQuestions) => {
  try {
    console.log('Generating AI bot detection questions...');

    // get all question and put it in one text
    const questionsText = allQuestions
      .map((question, i) => `${i + 1}. [${question.type}] ${question.text}`)
      .join('\n');

    // const questionsText1 = allQuestions.map((question,i) => {
    //   return `${i+1}. [${question.type}] ${question.text} \n`
    // })


    console.log('questionsText', questionsText);
    // console.log('questionText1',questionsText1)

    // const prompt = `You are an expert in survey design and bot detection.

    //   Survey Title: "${surveyName}"
    //   Survey Description: "${surveyDescription}"

    //   Original Survey Questions:
    //   ${questionsText}

    //   Your Task: Generate 1 open ended bot detection question that:
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


    const prompt = `You are an expert in creating question.

        Survey Title: ${surveyName}  
        Survey Description: ${surveyDescription}  
        Existing Questions: ${questionsText}

        Task:
        Generate ONE insightful open-ended question that helps identify genuine and thoughtful respondents based on the quality of their answer.
        

        Requirements:
        - The question must be relevant to the survey context.
        - It should encourage detailed, meaningful responses (not yes/no).
        - It should help differentiate serious users from low-effort responses.

        Output Format:
        Return ONLY a valid JSON array, with no extra text or explanation.

        [
          {
            "text": "Your question here?",
            "type": "TEXT"
          }
        ]`


    // const response = await client.responses.create({
    //   model: "gpt-4-o", use gpt-4-o
    //   input: [
    //     {
    //       role: "user",
    //       content: prompt
    //     }
    //   ],
    //   max_output_tokens: 800
    // });

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
