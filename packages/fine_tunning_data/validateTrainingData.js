const fs = require('fs');
const path = require('path');

// Função para validar um único arquivo JSON
function validateJsonFile(filePath) {
    let formatErrors = {
        data_type: 0,
        missing_messages_list: 0,
        message_missing_key: 0,
        message_unrecognized_key: 0,
        unrecognized_role: 0,
        missing_content: 0,
        example_missing_assistant_message: 0
    };

    try {
        const data = fs.readFileSync(filePath);
        const dataset = JSON.parse(data);

        if (!dataset || typeof dataset !== 'object' || !dataset.messages) {
            formatErrors['missing_messages_list']++;
            return formatErrors;
        }

        const messages = dataset.messages;
        messages.forEach(message => {
            if (!message.role || !message.content) {
                formatErrors['message_missing_key']++;
            }

            if (Object.keys(message).some(k => !['role', 'content', 'name', 'function_call', 'weight'].includes(k))) {
                formatErrors['message_unrecognized_key']++;
            }

            if (!['system', 'user', 'assistant', 'function'].includes(message.role)) {
                formatErrors['unrecognized_role']++;
            }

            if (!message.content && !message.function_call) {
                formatErrors['missing_content']++;
            }
        });

        if (!messages.some(message => message.role === 'assistant')) {
            formatErrors['example_missing_assistant_message']++;
        }

    } catch (error) {
        console.error(`Error reading or parsing ${filePath}: ${error}`);
        return null;
    }

    return formatErrors;
}

// Função para validar todos os arquivos JSON em um diretório
function validateAllJsonFiles(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(`Failed to list contents of directory: ${err}`);
            return;
        }

        let allErrors = {};
        files.forEach(file => {
            if (path.extname(file) === '.json') {
                const filePath = path.join(directoryPath, file);
                const fileErrors = validateJsonFile(filePath);
                if (fileErrors && Object.values(fileErrors).some(value => value > 0)) {
                    allErrors[file] = fileErrors;
                }
            }
        });

        if (Object.keys(allErrors).length > 0) {
            console.log("Found errors in the following files:");
            console.log(allErrors);
        } else {
            console.log("No errors found in any file.");
        }
    });
}

// module.exports = {
//     validateAllJsonFiles
// };

// Substitua 'caminho_para_seu_diretório' pelo caminho real do seu diretório de dados de treinamento
trainingData_dir_path = "./trainingData";
validateAllJsonFiles(trainingData_dir_path);
