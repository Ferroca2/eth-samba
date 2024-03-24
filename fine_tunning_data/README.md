## Create a dataset for finetunning with openai models
1. Generate examples with powerfull Agents by openai;
2. Create the training dataset from those examples running generateTrainingData.js
3. Compile all the .json generated for each example in a single .jsonl for the training requirements
4. Verify if the data is in the correct format for finetunning with validateTrainingData.js