
/**
 * Sends a chat request to Deepseek API with structured data
 * 
 * @param messages - Array of message objects with role and content
 * @returns Promise resolving to the AI response text
 * @throws Error if API call fails or response parsing encounters issues
 */
export const generateDeepseekResponse = async (messages: {role: string, content: string}[]): Promise<string> => {
  try {
    const requestBody = {
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,    // Balanced temperature for chatbot responses
      max_tokens: 2000     // Reasonable limit for chat responses
    };

    // Initialize retry mechanism variables
    let maxRetries = 3;
    let attempt = 0;
    let data;

    // Keep trying until we get valid data or run out of retries
    while (attempt <= maxRetries) {
      // console.log("Fetching from Deepseek...");
      
      // Start timing the API call
      const startTime = Date.now();

      // fetch the data from the DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify(requestBody)
      });

      // handle the error if the response is not ok
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      // wait for the response to be fetched
      console.log("Awaiting Chat response...");
      data = await response.json();
      
      // Calculate and log the time taken
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // Convert to seconds
      // console.log(`DeepSeek API response time: ${timeTaken.toFixed(2)} seconds`);
      
      // CASE 1: Exit the loop if we have valid data
      if (data?.choices?.[0]?.message?.content) {
        break;
      }

      // CASE 2: Increment attempt counter and implement exponential backoff
      attempt++;
      if (attempt < maxRetries) {
        console.log(`Empty response received, retrying... (Attempt ${attempt + 1}/${maxRetries})`);
        // Wait longer between each retry (1s, 2s, 4s)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    // If we still don't have valid data after all retries, throw an error
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('Failed to get valid response after multiple attempts');
    }

    const rawContent = data.choices[0].message.content;
    // console.log(rawContent);  // Log raw response for debugging

    // Clean the raw content by removing any markdown code block formatting
    let cleanedContent = rawContent;
    
    // More comprehensive regex to handle various code block formats
    // This will match:
    // 1. ```json\n{...}```
    // 2. ```language=json\n{...}```
    // 3. ```{...}```
    // And extract just the JSON content
    const codeBlockRegex = /```(?:language=)?(?:json)?\s*([\s\S]*?)```/;
    const match = rawContent.match(codeBlockRegex);
    
    if (match && match[1]) {
      // Extract just the JSON content from inside the code block
      cleanedContent = match[1].trim();
    } else {
      // If no code block is detected, use the raw content as is
      cleanedContent = rawContent.trim();
    }

    // console.log("Cleaned content for parsing:", cleanedContent);

    // Type Checking to avoid parsing error: If analysis_feedback is already an object, no need to parse
    const analysis_feedback = typeof cleanedContent === 'string' 
      ? JSON.parse(cleanedContent.replace(/[\x00-\x1F\x7F-\x9F]/g, '')) // Remove control characters causing error
      : cleanedContent;

    return analysis_feedback;
    
  } catch (error) {
    console.error('Chatbot failed:', error);
    throw new Error('Failed to generate response. Please try again later.');
  }
};