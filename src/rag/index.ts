import { RAGDocument } from "@/models/RAGDocument";
import { embedText } from "@/rag/embeddings";

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (!normA || !normB) return 0;
  return dot / (normA * normB);
}

export async function indexRAGDocument(doc: {
  schoolId: string;
  studentId?: string | null;
  type: string;
  sourceId?: string | null;
  text: string;
}) {
  const embedding = await embedText(doc.text);
  return RAGDocument.create({ ...doc, embedding });
}

export async function searchRAG({
  query,
  schoolId,
  studentId,
  topK = 5,
}: {
  query: string;
  schoolId: string;
  studentId?: string;
  topK?: number;
}) {
  const queryEmbedding = await embedText(query);
  const docs = await RAGDocument.find({ schoolId, ...(studentId ? { studentId } : {}) });
  const scored = docs
    .map((doc) => ({
      doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding || []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return scored;
}
