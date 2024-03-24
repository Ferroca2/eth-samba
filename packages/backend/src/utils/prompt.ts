

export const prompt = (
  protocol_description: string,
  title: string,
  description: string,
  comments: Array<{ id: string, comment: string }>
  ) => `
Based on the detailed feedback provided, you must modify the original proposal presented below, based on the comments relevance to the protocol ideas and their frequency. It is crucial that changes are implemented in a way that does not omit or alter details not specified by the feedback. The goal is to enhance the proposal while maintaining its essence and detailed content.
\`\`\`json
{
  "initial_propose": {
      "protocol_description": "${protocol_description}",
      "title": "${title}",
      "description": "${description}",
  },
  "comments": ${JSON.stringify(comments, null, 2)}
}
\`\`\`
Please, apply the suggested changes from the feedback analysis to the text of the original proposal. The new revised proposal should completely replace the original proposal, incorporating the feedback in an integrated and detailed manner. Your response should be structured as a JSON object: 
\`\`\`json
{
  "counter_propose": {
    "protocol_description": "\${REPEAT PROTOCOL DESCRIPTION FROM INPUT HERE}",
    "title": "\${COUTER PROPOSE TITLE HERE}",
    "description": "\${COUNTER PROPOSE DESCRIPTION HERE}"
  }
}
\`\`\`
`;

export const filterPrompt = (
  protocol_description: string,
  title: string,
  description: string,
  comments: Array<{ id: number, content: string, first_transaction: Date }>
  ) => `
  Given the series of comments listed below, which were made in response to a generic proposal, your task is to identify which comments do not offer constructive or relevant contributions to the enhancement of the proposal. Each comment is identified by a unique ID for easy reference.

  \`\`\`json
  "initial_propose": {
          "protocol_description": "${protocol_description}",
          "title": "${title}",
          "description": "${description}"
      },
      "comments": ${JSON.stringify(comments, null, 2)}
  }
  \`\`\`
  
  Your analysis should focus on distinguishing comments that do not effectively add value to the discussion on proposal improvements. After reviewing, organize your response in JSON format, pointing out the IDs of the comments you consider should be rejected, as they do not directly contribute to the enhancement of the proposal.
  
  Structure your response following the JSON format example below:
  
  \`\`\`json
  {
    'rejected_ids': [
      {'id': \${ID OF REJECTED COMMENT 1}},
      {'id': \${ID OF REJECTED COMMENT 2}},
      ...
    ]
  }
  \`\`\`
  `;
