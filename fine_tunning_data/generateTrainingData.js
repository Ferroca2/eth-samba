const fs = require('fs');
const path = require('path');

const examplesPath = './examples2FineTun';
const trainingDataPath = './trainingData';
const outputFile = path.join(trainingDataPath, 'trainingData.jsonl');

// Verificar e criar pasta de destino, se necessário
if (!fs.existsSync(trainingDataPath)) {
  fs.mkdirSync(trainingDataPath, { recursive: true });
}

// Função para transformar e salvar o arquivo
function transformAndSaveJsonFiles(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  // Extrair partes variáveis do prompt
  const protocolDescription = data['initial_propose']['protocol_description'];
  const originalTitle = data['initial_propose']['title'];
  const originalDescription = data['initial_propose']['description'];
  const comments = JSON.stringify(data.comments, null, 2);
  const counterProposeTitle = data['counter_propose']['title'];
  const counterProposeDescription = data['counter_propose']['description'];

  // Montando o novo prompt
  const newPrompt = {
    messages: [
      {
        role: "system",
        content: "You are really good to create a counter propose given a initial one and a list of comments about it. You are really good selecting the most relevant comments, the most frequency commented topics and compile those ideas in a new and robust proposal. All maintaining the initial proposal as a base, maintaining details and only changing what is needed."
      },
      {
        role: "user",
        content: `Based on the detailed feedback provided, you must modify the original proposal presented below, based on the comments relevance to the protocol ideas and their frequency. It is crucial that changes are implemented in a way that does not omit or alter details not specified by the feedback. The goal is to enhance the proposal while maintaining its essence and detailed content.\n\n\`\`\`json\n{\n  "initial_propose": {\n    "protocol_description": "${protocolDescription}",\n    "title": "${originalTitle}",\n    "description": "${originalDescription}"\n  },\n  "comments": ${comments}\n}\n\`\`\`\n\nPlease, apply the suggested changes from the feedback analysis to the text of the original proposal. The new revised proposal should completely replace the original proposal, incorporating the feedback in an integrated and detailed manner. Your response should be structured as a JSON object: \n\n\`\`\`json\n{\n  "counter_propose": {\n    "protocol_description": "${protocolDescription}",\n    "title": "${counterProposeTitle}",\n    "description": "${counterProposeDescription}"\n  }\n}\n\`\`\``
      },
      {
        role: "assistant",
        content: JSON.stringify({
          "counter_propose": {
            "protocol_description": protocolDescription,
            "title": counterProposeTitle,
            "description": counterProposeDescription
          }
        }, null, 2)
      }
    ]
  };

  // Definindo o nome do novo arquivo
  const fileName = path.basename(filePath);
  const newFileName = `trainingData${fileName.substring(2)}`; // Substituindo 'ex' por 'trainingData'
  const newFilePath = path.join(trainingDataPath, newFileName);

  // Salvando o novo formato de arquivo
  fs.writeFileSync(newFilePath, JSON.stringify(newPrompt, null, 2), 'utf8');
  console.log(`${newFileName} has been saved.`);
}

// Função para criar o arquivo .jsonl a partir dos arquivos transformados
function createJsonlFile() {
  const files = fs.readdirSync(trainingDataPath).filter(file => path.extname(file) === '.json');
  const writeStream = fs.createWriteStream(outputFile);

  files.forEach(file => {
    const filePath = path.join(trainingDataPath, file);
    const data = fs.readFileSync(filePath, 'utf8');

    // Transforma o objeto JSON em uma string compacta antes de escrever no arquivo .jsonl
    const compactJson = JSON.stringify(JSON.parse(data));
    writeStream.write(compactJson + '\n');
  });

  writeStream.end();

  writeStream.on('finish', () => {
    console.log(`Todos os arquivos .json foram combinados em ${outputFile}.`);
  });

  writeStream.on('error', (error) => {
    console.error('Erro ao escrever no arquivo .jsonl', error);
  });
}

// Lendo todos os arquivos na pasta de origem e processando cada um em um .json
fs.readdirSync(examplesPath).forEach(file => {
  if (path.extname(file) === '.json') {
    const filePath = path.join(examplesPath, file);
    transformAndSaveJsonFiles(filePath);
  }
});

// Após processar os arquivos .json, transformá-los em .jsonl
createJsonlFile();

console.log('All files have been processed.');
