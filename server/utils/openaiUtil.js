const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateQuestions = async (surveyName, surveyDescription, allQuestions, keyword) => {
  try {


    console.log(`Generating question based on this keyword: + ${keyword})`);

    // get all question and put it in one text
    // const questionsText = allQuestions
    //   .map((question, i) => `${i + 1}. [${question.type}] ${question.text}`)
    //   .join('\n');

    // const questionsText1 = allQuestions.map((question,i) => {
    //   return `${i+1}. [${question.type}] ${question.text} \n`
    // })


    // console.log('questionsText', questionsText);





    const prompt = `Create one human-verification question for the topic "${keyword || 'General Bot Detection'}". 
      The question should be open-ended, personal, and designed to reveal genuine human thought.
      Return ONLY the question text, nothing else.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 200
    });

    // Extract the question text directly
    const question = response.choices[0].message.content.trim();

    console.log('response',response);
    console.log('fetched question',question);
    return question;
  }
  catch (error) {
    console.error("error in generating questions:", error);
    throw error;
  }
};



// const checkRespose = async 

module.exports = { generateQuestions };
