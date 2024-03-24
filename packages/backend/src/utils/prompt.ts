

export const prompt = (
  protocol_description: string,
  title: string,
  description: string,
  comments: Array<{ id: string, comment: string }>
  ) => `
Based on the detailed feedback provided, you must modify the original proposal presented below, based on the comments relevense to the protocol ideas and their frequency. It is crucial that changes are implemented in a way that does not omit or alter details not specified by the feedback. The goal is to enhance the proposal while maintaining its essence and detailed content.
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
Please, apply the suggested changes from the feedback analysis to the text of the original proposal. The new revised proposal should completely replace the original proposal, incorporating the feedback in an integrated and detailed manner. Your response should be structured as a JSON object containing two fields: 'new_proposal' with the text of the modified new proposal in json format.
\`\`\`json
{
  "new_proposal": {
    "protocol_description": "just repeat the protocol description here",
    "title": "just set the title for the new_proposal here",
    "description": "just set the description for the new_proposal here"
  }
}
\`\`\`
`;