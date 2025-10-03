// Named Hugging Face token placeholders. Replace the values below with your real tokens.
// IMPORTANT: Do NOT commit real tokens to version control.
export const HF_TOKEN_1 = 'HF_TOKEN_1_REPLACE_ME';
export const HF_TOKEN_2 = 'HF_TOKEN_2_REPLACE_ME';
export const HF_TOKEN_3 = 'HF_TOKEN_3_REPLACE_ME';
export const HF_TOKEN_4 = 'HF_TOKEN_4_REPLACE_ME';

// HF_TOKENS_FROM_CODE is built from the above named tokens.
// Replace each HF_TOKEN_* value above with your actual hf_... token string.
export const HF_TOKENS_FROM_CODE: string[] = [HF_TOKEN_1, HF_TOKEN_2, HF_TOKEN_3, HF_TOKEN_4];

// Open-source text models (no audio/video). Add or remove models as needed.
export const HF_MODEL_LIST: { id: string; name: string }[] = [
  { id: 'gpt2', name: 'GPT-2' },
  { id: 'distilgpt2', name: 'DistilGPT-2' },
  { id: 'EleutherAI/gpt-neo-125M', name: 'GPT-Neo 125M' },
  { id: 'EleutherAI/gpt-neo-1.3B', name: 'GPT-Neo 1.3B' },
  { id: 'EleutherAI/gpt-neo-2.7B', name: 'GPT-Neo 2.7B' },
  { id: 'EleutherAI/gpt-j-6B', name: 'GPT-J 6B' },
  { id: 'facebook/opt-125m', name: 'OPT-125M' },
  { id: 'facebook/opt-350m', name: 'OPT-350M' },
  { id: 'facebook/opt-1.3b', name: 'OPT-1.3B' },
  { id: 'facebook/opt-2.7b', name: 'OPT-2.7B' },
  { id: 'bigscience/bloom-560m', name: 'BLOOM-560M' },
  { id: 'bigscience/bloom-1b1', name: 'BLOOM-1.1B' },
  { id: 'bigscience/bloom-3b', name: 'BLOOM-3B' },
  { id: 't5-small', name: 'T5 Small' },
  { id: 't5-base', name: 'T5 Base' },
  { id: 't5-large', name: 'T5 Large' },
  { id: 'google/flan-t5-small', name: 'FLAN-T5 Small' },
  { id: 'google/flan-t5-base', name: 'FLAN-T5 Base' },
  { id: 'google/flan-t5-large', name: 'FLAN-T5 Large' },
  { id: 'facebook/bart-large', name: 'BART Large' },
  { id: 'facebook/bart-large-cnn', name: 'BART Large CNN' },
  { id: 'sshleifer/distilbart-cnn-12-6', name: 'DistilBART CNN' },
  { id: 'google/pegasus-xsum', name: 'Pegasus XSum' },
  { id: 'mrm8488/t5-base-finetuned-summarize-news', name: 'T5 Summarize News' },
  { id: 'roberta-base', name: 'RoBERTa Base' },
  { id: 'distilbert-base-uncased', name: 'DistilBERT' },
  { id: 'bert-base-uncased', name: 'BERT Base' },
  { id: 'allenai/longformer-base-4096', name: 'Longformer' },
  { id: 'patrickvonplaten/longt5-small-ld', name: 'LongT5 Small' },
  { id: 'google/bigbird-roberta-base', name: 'BigBird RoBERTa' },
  { id: 'csebuetnlp/mT5_multilingual_XLSum', name: 'mT5 XLSum' },
  { id: 'facebook/mbart-large-50', name: 'mBART Large 50' },
  { id: 'microsoft/prophetnet-large-uncased', name: 'ProphetNet' },
  { id: 'Salesforce/codet5-small', name: 'CodeT5 Small' },
  { id: 'Salesforce/codet5-base', name: 'CodeT5 Base' },
  { id: 'Salesforce/codegen-350M-mono', name: 'CodeGen 350M' },
  { id: 'huggingface/CodeBERTa-small-v1', name: 'CodeBERTa Small' },
  { id: 'microsoft/DialoGPT-small', name: 'DialoGPT Small' },
  { id: 'microsoft/DialoGPT-medium', name: 'DialoGPT Medium' },
  { id: 'microsoft/DialoGPT-large', name: 'DialoGPT Large' },
  { id: 'facebook/mbart-large-en-ro', name: 'mBART en-ro' },
  { id: 'flax-community/t5-recipe-generation', name: 'T5 Recipe (example)' },
  { id: 'google/mt5-small', name: 'mT5 Small' },
  { id: 'google/mt5-base', name: 'mT5 Base' },
  { id: 'google/mt5-large', name: 'mT5 Large' },
  { id: 'allenai/unifiedqa-t5-small', name: 'UnifiedQA T5 Small' },
  { id: 'allenai/unifiedqa-t5-base', name: 'UnifiedQA T5 Base' },
  { id: 'influenza/biogpt', name: 'BioGPT (example)' },
  { id: 'stanford-crfm/t0-small', name: 'T0 Small' },
  { id: 'bigscience/bloom-560m-mt', name: 'BLOOM Multilingual' },
  { id: 'facebook/wmt19-en-de', name: 'WMT19 EN->DE' },
  { id: 'Helsinki-NLP/opus-mt-en-de', name: 'OPUS MT EN->DE' },
  { id: 'Helsinki-NLP/opus-mt-en-es', name: 'OPUS MT EN->ES' }
];
